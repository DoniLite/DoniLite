import type { ArticleLocale } from '~~/shared/types'

export interface TranslationInput {
  sourceLocale: ArticleLocale
  targetLocale: ArticleLocale
  title: string
  description: string
  seoTitle?: string | null
  seoDescription?: string | null
  content: string
  contentFormat: string
}

interface MyMemoryResponse {
  responseStatus: number | string
  responseDetails?: string
  quotaFinished?: boolean
  responseData: {
    translatedText: string
  }
}

// MyMemory's free tier caps requests around 500 bytes of text — chunk long
// content by paragraph (and split any oversized paragraph by sentence) to
// stay under that.
const MAX_CHUNK_LENGTH = 450

// Attaching an email roughly doubles MyMemory's free daily word quota (from
// ~5,000 to ~10,000) — optional, set MYMEMORY_EMAIL in .env to use it.
const contactEmail = process.env.MYMEMORY_EMAIL

const translateChunk = async (
  text: string,
  sourceLocale: ArticleLocale,
  targetLocale: ArticleLocale
): Promise<string> => {
  if (!text.trim()) {
    return text
  }
  const response = await $fetch<MyMemoryResponse>('https://api.mymemory.translated.net/get', {
    query: {
      q: text,
      langpair: `${sourceLocale}|${targetLocale}`,
      ...(contactEmail ? { de: contactEmail } : {})
    }
  })
  if (response.quotaFinished) {
    throw createError({
      statusCode: 429,
      message:
        'Free translation quota reached for today. Try again later, or set MYMEMORY_EMAIL in .env to raise the daily limit.'
    })
  }
  if (Number(response.responseStatus) !== 200 || !response.responseData?.translatedText) {
    throw createError({
      statusCode: 502,
      message: response.responseDetails || 'Translation service returned an unexpected response'
    })
  }
  return response.responseData.translatedText
}

// Swaps a match for a single opaque token so the bulk translation pass can't
// touch or reorder it. Padded with a single space, but only where the match
// is flush against a non-space character (e.g. "<h1>Hello</h1>") — otherwise
// we'd double up whitespace that was already correct in the source prose.
const protectMatch = (
  replacementContent: string,
  match: string,
  offset: number,
  fullString: string,
  segments: string[]
): string => {
  const before = fullString[offset - 1]
  const after = fullString[offset + match.length]
  const leadingSpace = before && !/\s/.test(before) ? ' ' : ''
  const trailingSpace = after && !/\s/.test(after) ? ' ' : ''
  const token = `zzTOKEN${segments.length}zz`
  segments.push(replacementContent)
  return `${leadingSpace}${token}${trailingSpace}`
}

// Opaque blocks: their content must never be translated, so they're protected
// as-is (fenced code, inline code, and any HTML tag left over after the
// wrapped-span pass below has already handled matched tag pairs).
const OPAQUE_PATTERNS = [/```[\s\S]*?```/g, /`[^`\n]+`/g, /<\/?[a-zA-Z][^>]*>/g]

const protectOpaqueBlocks = (text: string, segments: string[]): string => {
  let result = text
  for (const pattern of OPAQUE_PATTERNS) {
    result = result.replace(pattern, (match: string, ...rest: unknown[]) => {
      const offset = rest[rest.length - 2] as number
      const fullString = rest[rest.length - 1] as string
      return protectMatch(match, match, offset, fullString, segments)
    })
  }
  return result
}

interface WrappedSpanPattern {
  regex: RegExp
  // 0-based index into the regex's own capture groups (i.e. match[index + 1])
  innerGroupIndex: number
  rebuild: (groups: string[], translatedInner: string) => string
}

// Markdown/HTML spans with translatable text inside a structural wrapper.
// Translating the inner text on its own — instead of leaving the wrapper
// characters inline for the bulk translator to see — avoids two failure
// modes: the wrapper syntax getting mangled (`**bold**` -> `* * bold * *`),
// and the inner text getting reordered away from its tag/asterisks entirely
// (a plain-text translator has no idea "website" must stay between
// `<a href="...">` and `</a>`).
const WRAPPED_SPAN_PATTERNS: WrappedSpanPattern[] = [
  {
    regex: /^(#{1,6})\s+(.+)$/gm,
    innerGroupIndex: 1,
    rebuild: (groups, translated) => `${groups[0]} ${translated}`
  },
  {
    regex: /\*\*([^*\n]+)\*\*/g,
    innerGroupIndex: 0,
    rebuild: (_groups, translated) => `**${translated}**`
  },
  {
    regex: /(?<!\*)\*([^*\n]+)\*(?!\*)/g,
    innerGroupIndex: 0,
    rebuild: (_groups, translated) => `*${translated}*`
  },
  {
    regex: /~~([^~\n]+)~~/g,
    innerGroupIndex: 0,
    rebuild: (_groups, translated) => `~~${translated}~~`
  },
  {
    regex: /\[([^\]]+)\]\(([^)]+)\)/g,
    innerGroupIndex: 0,
    rebuild: (groups, translated) => `[${translated}](${groups[1]})`
  },
  {
    // Simple (non-nested) tag pairs: <tag attrs>inner text</tag>
    regex: /<([a-zA-Z][\w-]*)((?:\s[^>]*)?)>([^<]*)<\/\1>/g,
    innerGroupIndex: 2,
    rebuild: (groups, translated) => `<${groups[0]}${groups[1]}>${translated}</${groups[0]}>`
  }
]

const translateWrappedSpans = async (
  text: string,
  sourceLocale: ArticleLocale,
  targetLocale: ArticleLocale,
  segments: string[]
): Promise<string> => {
  let result = text
  for (const pattern of WRAPPED_SPAN_PATTERNS) {
    const matches = [...result.matchAll(pattern.regex)]
    if (matches.length === 0) {
      continue
    }
    const translatedInners: string[] = []
    for (const match of matches) {
      const innerText = match[pattern.innerGroupIndex + 1] ?? ''
      translatedInners.push(await translateChunk(innerText, sourceLocale, targetLocale))
    }
    let matchIndex = 0
    result = result.replace(pattern.regex, (match: string, ...rest: unknown[]) => {
      const offset = rest[rest.length - 2] as number
      const fullString = rest[rest.length - 1] as string
      const groups = rest.slice(0, rest.length - 2) as string[]
      const rebuilt = pattern.rebuild(groups, translatedInners[matchIndex] ?? '')
      matchIndex += 1
      return protectMatch(rebuilt, match, offset, fullString, segments)
    })
  }
  return result
}

const restoreProtected = (text: string, segments: string[]): string => {
  let restored = text
  segments.forEach((original, index) => {
    restored = restored.replaceAll(`zzTOKEN${index}zz`, original)
  })
  return restored
}

const splitIntoChunks = (text: string): string[] => {
  const paragraphs = text.split(/\n{2,}/)
  const chunks: string[] = []

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim()
    if (trimmed.length <= MAX_CHUNK_LENGTH) {
      chunks.push(trimmed)
      continue
    }
    const sentences = paragraph.split(/(?<=[.!?])\s+/)
    let current = ''
    for (const sentence of sentences) {
      if ((current + ' ' + sentence).trim().length > MAX_CHUNK_LENGTH && current) {
        chunks.push(current.trim())
        current = sentence
      } else {
        current = current ? `${current} ${sentence}` : sentence
      }
    }
    if (current) {
      chunks.push(current.trim())
    }
  }

  return chunks
}

const translateLongText = async (
  text: string,
  sourceLocale: ArticleLocale,
  targetLocale: ArticleLocale
): Promise<string> => {
  if (!text.trim()) {
    return text
  }
  const segments: string[] = []
  // Order matters: wrapped spans (which need their own translation calls)
  // run before the opaque pass, so `**bold**`/`<a>text</a>` are captured as
  // whole units before the plain HTML-tag pass would otherwise strip out
  // just the tag and leave the inner text exposed for the bulk translator.
  const withWrappedSpans = await translateWrappedSpans(text, sourceLocale, targetLocale, segments)
  const fullyProtected = protectOpaqueBlocks(withWrappedSpans, segments)
  const chunks = splitIntoChunks(fullyProtected)
  const translatedChunks: string[] = []
  for (const chunk of chunks) {
    translatedChunks.push(await translateChunk(chunk, sourceLocale, targetLocale))
  }
  const rejoined = translatedChunks.join('\n\n')
  return restoreProtected(rejoined, segments)
}

const translateShortText = async (
  text: string | null | undefined,
  sourceLocale: ArticleLocale,
  targetLocale: ArticleLocale
): Promise<string | null> => {
  if (!text) {
    return null
  }
  return translateChunk(text, sourceLocale, targetLocale)
}

export const translationService = {
  async translateArticle(input: TranslationInput) {
    const [title, description, seoTitle, seoDescription, content] = await Promise.all([
      translateChunk(input.title, input.sourceLocale, input.targetLocale),
      translateChunk(input.description, input.sourceLocale, input.targetLocale),
      translateShortText(input.seoTitle, input.sourceLocale, input.targetLocale),
      translateShortText(input.seoDescription, input.sourceLocale, input.targetLocale),
      translateLongText(input.content, input.sourceLocale, input.targetLocale)
    ])

    return { title, description, seoTitle, seoDescription, content }
  }
}
