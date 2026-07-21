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
  <div class="bg-card overflow-hidden rounded-lg border shadow">
    <div class="md:flex">
      <div class="bg-primary/10 flex items-center justify-center p-8 md:w-1/3">
        <div class="text-primary bg-primary/20 rounded-full p-4">
          <svg
            class="h-12 w-12"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m7 11 2-2-2-2" />
            <path d="M11 13h4" />
            <rect
              width="18"
              height="18"
              x="3"
              y="3"
              rx="2"
              ry="2"
            />
          </svg>
        </div>
      </div>
      <div class="p-6 md:w-2/3">
        <div class="flex items-center gap-4">
          <span class="text-muted-foreground text-sm">
            {{ $d(articleDate) }}
          </span>
          <span
            class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
          >
            {{ $t('common.news') }}
          </span>
        </div>
        <h2 class="text-foreground mt-4 text-2xl font-bold">
          {{ localizedArticle?.title }}
        </h2>
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
        <p class="text-muted-foreground mt-2">
          {{ localizedArticle?.description }}
        </p>
        <div class="mt-6 flex items-center gap-4">
          <img
            src="/avatar.jpeg"
            alt="Avatar"
            class="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p class="text-foreground text-sm font-medium">{{ $t('name') }}</p>
            <p class="text-muted-foreground text-sm">{{ $t('profession') }}</p>
          </div>
        </div>
        <div class="mt-6">
          <NuxtLink
            :to="{ path: `${localePath('blog')}/${localizedArticle?.slug ?? article.id}` }"
            class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            {{ $t('page.blog.read_article') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
