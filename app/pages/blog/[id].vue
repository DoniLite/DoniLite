<script setup lang="ts">
import { ArrowUpRight, Code2, FileText, ImageIcon, LinkIcon, Youtube } from 'lucide-vue-next'
import { marked } from 'marked'
import HighlightJs from '~/components/shared/HighlightJs.vue'
import type { Article, ArticleLocale, ArticleResource, ArticleTranslation } from '~~/shared/types'

const route = useRoute()
const slug = route.params.id as string
const { locale } = useI18n()
const localePath = useLocalePath()
const { data: article } = await useFetch<Article | null>(
  () => `/api/articles/slug/${locale.value}/${slug}`,
  {
    default: () => null
  }
)

if (!article.value) {
  throw createError({ statusCode: 404, message: 'Article not found' })
}

const ownTranslation = computed(() =>
  article.value?.translations.find((translation) => translation.locale === locale.value)
)

// Each translation can have its own slug. The language switcher just swaps
// the locale prefix and keeps whatever slug segment was already in the URL,
// so switching locale commonly lands on (newLocale, oldSlug) — which doesn't
// exist under that locale and used to 404/crash. Redirect to this locale's
// real slug instead, whenever it has one.
const redirectToCanonicalSlug = () => {
  const ownSlug = ownTranslation.value?.slug
  if (ownSlug && ownSlug !== slug) {
    return navigateTo(localePath(`/blog/${ownSlug}`), { replace: true })
  }
}
await redirectToCanonicalSlug()
watch(locale, redirectToCanonicalSlug)

// If this locale genuinely has no translation, fall back to the source
// version rather than redirecting anywhere (there's no correct URL for a
// locale that doesn't exist) or crashing.
const isTranslated = computed(() => Boolean(ownTranslation.value))

const localArticle = computed<ArticleTranslation | undefined>(() => {
  return (
    ownTranslation.value ??
    article.value?.[article.value.sourceLocale as ArticleLocale] ??
    article.value?.translations[0]
  )
})

const resources = computed(() => localArticle.value?.resources ?? [])

const renderedContent = computed(() => {
  const translation = localArticle.value
  if (!translation) {
    return ''
  }
  return translation.contentFormat === 'html'
    ? translation.content
    : (marked(translation.content) as string)
})

const getYoutubeEmbedUrl = (url?: string) => {
  if (!url) {
    return ''
  }

  try {
    const parsedUrl = new URL(url)
    if (parsedUrl.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${parsedUrl.pathname.slice(1)}`
    }
    if (parsedUrl.hostname.includes('youtube.com')) {
      const videoId = parsedUrl.searchParams.get('v')
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
  } catch {
    return url
  }

  return url
}

const getResourceIcon = (type: ArticleResource['type']) => {
  const icons = {
    image: ImageIcon,
    youtube: Youtube,
    link: LinkIcon,
    code: Code2,
    file: FileText
  }

  return icons[type]
}

// Fire once per real page load — onMounted doesn't run during SSR (avoids a
// double-count from server render + hydration) and doesn't re-run when the
// canonical-slug/locale redirect above reuses this same component instance.
onMounted(() => {
  if (article.value?.id) {
    $fetch(`/api/articles/${article.value.id}/views`, { method: 'POST' }).catch(() => {})
  }
})

defineOgImageComponent('Article', {
  date: article.value?.updatedAt ?? article.value?.createdAt,
  views: article.value?.views
})

useSeoMeta({
  title: () => localArticle.value?.seoTitle ?? localArticle.value?.title,
  ogTitle: () => localArticle.value?.seoTitle ?? localArticle.value?.title,
  description: () => localArticle.value?.seoDescription ?? localArticle.value?.description,
  ogDescription: () => localArticle.value?.seoDescription ?? localArticle.value?.description
})
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-if="article && localArticle"
    class="bg-background min-h-screen"
  >
    <HighlightJs />
    <ArticleHero
      :article="{
        title: localArticle.title,
        description: localArticle.description,
        topic: article.tags?.[0]?.label ?? $t('common.news'),
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        views: article.views,
        seriesTitle: article.series?.title,
        seasonTitle: article.season?.title,
        seasonId: article.season?.id,
        episode: article.episode
      }"
    />

    <p
      v-if="!isTranslated"
      class="text-muted-foreground bg-muted mx-auto mt-6 max-w-3xl rounded-md p-3 text-center text-sm"
    >
      {{ $t('page.blog.notTranslatedNotice', { locale: article.sourceLocale.toUpperCase() }) }}
    </p>

    <article class="prose lg:prose-lg dark:prose-invert mx-auto my-8 max-w-3xl px-3">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="renderedContent" />
    </article>

    <section
      v-if="resources.length > 0"
      class="mx-auto mb-12 grid max-w-3xl gap-4 px-3"
    >
      <h2 class="text-foreground text-xl font-semibold">
        {{ $t('page.blog.resources') }}
      </h2>

      <article
        v-for="resource in resources"
        :key="`${resource.type}-${resource.url}-${resource.label}`"
        class="border-border bg-card overflow-hidden rounded-md border"
      >
        <img
          v-if="resource.type === 'image' && resource.url"
          :src="resource.url"
          :alt="resource.label || ''"
          class="max-h-[420px] w-full object-cover"
        />

        <iframe
          v-else-if="resource.type === 'youtube' && resource.url"
          :src="getYoutubeEmbedUrl(resource.url)"
          :title="resource.label || 'YouTube'"
          class="aspect-video w-full"
          allowfullscreen
        />

        <div
          v-else
          class="flex items-center justify-between gap-3 p-4"
        >
          <div class="flex min-w-0 items-center gap-3">
            <component
              :is="getResourceIcon(resource.type)"
              class="text-muted-foreground h-5 w-5 shrink-0"
            />
            <div class="min-w-0">
              <h3 class="truncate font-medium">
                {{ resource.label || resource.url }}
              </h3>
              <p class="text-muted-foreground text-sm">
                {{ resource.language || resource.type }}
              </p>
            </div>
          </div>

          <NuxtLink
            v-if="resource.url"
            :to="resource.url"
            target="_blank"
            class="text-primary inline-flex items-center gap-1 text-sm font-medium"
          >
            {{ $t('common.open') }}
            <ArrowUpRight class="h-4 w-4" />
          </NuxtLink>
        </div>

        <div
          v-if="(resource.type === 'image' || resource.type === 'youtube') && resource.label"
          class="p-4"
        >
          <h3 class="font-medium">
            {{ resource.label }}
          </h3>
        </div>
      </article>
    </section>
  </div>
</template>
