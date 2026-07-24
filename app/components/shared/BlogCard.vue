<script setup lang="ts">
import type { Article } from '~~/shared/types'

const { d, locale } = useI18n()

const props = defineProps<{
  article: Article
}>()

const localePath = useLocalePath()
const localizedArticle = computed(() => {
  return (
    props.article.translations.find((translation) => translation.locale === locale.value) ??
    props.article[props.article.sourceLocale] ??
    props.article.translations[0]
  )
})
const articleDate = computed(() => props.article.updatedAt ?? props.article.createdAt ?? Date.now())
</script>
<template>
  <div
    class="group bg-background relative overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
  >
    <div class="p-6">
      <div class="flex items-center gap-4">
        <span class="text-muted-foreground text-sm">
          {{ d(articleDate) }}
        </span>
        <span
          class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
        >
          {{ article.tags?.[0]?.label ?? $t('common.news') }}
        </span>
      </div>
      <h3 class="text-foreground mt-4 text-xl font-bold">{{ localizedArticle?.title }}</h3>
      <p class="text-muted-foreground mt-2 line-clamp-3">
        {{ localizedArticle?.description }}
      </p>
      <div class="mt-4">
        <NuxtLink
          :to="{ path: `${localePath('blog')}/${article.id}` }"
          class="text-primary text-sm font-medium hover:underline"
        >
          {{ $t('page.blog.read_more') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
