import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import type { ArticleLocale } from '~~/shared/types'

const localeNames: Record<ArticleLocale, string> = {
  en: 'English',
  fr: 'French'
}

const translatedTranslationSchema = z.object({
  title: z.string(),
  description: z.string(),
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  content: z.string()
})

const translationJsonSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    seoTitle: { type: ['string', 'null'] },
    seoDescription: { type: ['string', 'null'] },
    content: { type: 'string' }
  },
  required: ['title', 'description', 'seoTitle', 'seoDescription', 'content'],
  additionalProperties: false
}

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

export const translationService = {
  async translateArticle(input: TranslationInput) {
    const client = new Anthropic()

    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      output_config: {
        effort: 'high',
        format: { type: 'json_schema', schema: translationJsonSchema }
      },
      system: `You are a professional technical translator working on a software developer's personal blog. Translate the given blog post fields from ${localeNames[input.sourceLocale]} to ${localeNames[input.targetLocale]}.

Rules:
- Preserve all HTML tags, attributes, and structure exactly (this content is ${input.contentFormat}).
- Do not translate code inside <code>, <pre>, or code blocks.
- Do not translate proper nouns, product names, or technical identifiers.
- Keep links and image sources unchanged.
- Match the tone: direct, technical, written by a developer for developers.
- If a seoTitle/seoDescription field is null, return null for it (do not invent one).`,
      messages: [
        {
          role: 'user',
          content: JSON.stringify({
            title: input.title,
            description: input.description,
            seoTitle: input.seoTitle ?? null,
            seoDescription: input.seoDescription ?? null,
            content: input.content
          })
        }
      ]
    })

    const textBlock = response.content.find((block) => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      throw createError({ statusCode: 502, message: 'Translation did not return valid output' })
    }

    const parsed = translatedTranslationSchema.safeParse(JSON.parse(textBlock.text))
    if (!parsed.success) {
      throw createError({ statusCode: 502, message: 'Translation returned an unexpected shape' })
    }

    return parsed.data
  }
}
