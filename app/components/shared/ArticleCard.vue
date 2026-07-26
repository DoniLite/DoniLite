<script setup lang="ts">
import type { Article, ArticleLocale, ArticleTranslation } from '~~/shared/types'

const { locale } = useI18n()

const props = defineProps<{
  article: Article
}>()
const localePath = useLocalePath()

const localizedArticle = computed<ArticleTranslation | undefined>(() => {
  return (
    props.article.translations.find((translation) => translation.locale === locale.value) ??
    props.article[props.article.sourceLocale as ArticleLocale] ??
    props.article.translations[0]
  )
})

const articleDate = new Date(props.article.updatedAt ?? props.article.createdAt ?? Date.now())
</script>

<template>
  <div class="bg-card overflow-hidden rounded-lg border shadow-sm">
    <div class="p-6">
      <div class="flex items-center gap-4">
        <span class="text-muted-foreground text-sm">{{ $d(articleDate) }}</span>
        <span
          class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
        >
          {{ props.article.tags?.[0]?.label ?? $t('common.news') }}
        </span>
      </div>
      <h3 class="text-foreground mt-4 text-xl font-bold">{{ localizedArticle?.title }}</h3>
      <NuxtLink
        v-if="article.season"
        :to="{ path: localePath('blog'), query: { season: article.season.id } }"
        class="text-muted-foreground hover:text-primary mt-1 inline-flex items-center gap-1 text-xs hover:underline"
      >
        {{
          article.episode
            ? $t('page.blog.season_label_with_episode', {
                series: article.series?.title,
                season: article.season.title,
                n: article.episode
              })
            : $t('page.blog.season_label', {
                series: article.series?.title,
                season: article.season.title
              })
        }}
      </NuxtLink>
      <p class="text-muted-foreground mt-2 line-clamp-3">
        {{ localizedArticle?.description }}
      </p>
      <div class="mt-6 flex items-center gap-4">
        <img
          src="/avatar.jpeg"
          alt="Avatar"
          class="h-8 w-8 rounded-full object-cover"
        />
        <div>
          <p class="text-foreground text-sm font-medium">{{ $t('name') }}</p>
        </div>
      </div>
      <div class="mt-6">
        <NuxtLink
          :to="{
            path: `${localePath('blog')}/${article.id}${localizedArticle?.slug ? `/${localizedArticle.slug}` : ''}`
          }"
          class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          {{ $t('page.blog.read_article') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
