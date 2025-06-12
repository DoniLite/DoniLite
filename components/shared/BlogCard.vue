<script setup lang="ts">
import type { Article } from '~/shared/types'

const { d, locale } = useI18n()

defineProps<{
  article: Article
}>()
</script>
<template>
  <div
    class="group bg-background relative overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
  >
    <div class="p-6">
      <div class="flex items-center gap-4">
        <span class="text-muted-foreground text-sm">
          {{ d(article.updatedAt || article.createdAt) }}
        </span>
        <span
          class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
        >
          {{ article[locale].topic }}
        </span>
      </div>
      <h3 class="text-foreground mt-4 text-xl font-bold">{{ article[locale].title }}</h3>
      <p class="text-muted-foreground mt-2 line-clamp-3">
        {{ article[locale].description }}
      </p>
      <div class="mt-4">
        <a
          href="#"
          class="text-primary text-sm font-medium hover:underline"
        >
          {{ $t('page.blog.read_more') }}
        </a>
      </div>
    </div>
  </div>
</template>
