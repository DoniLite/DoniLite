<script setup lang="ts">
import { Calendar1, Eye } from 'lucide-vue-next'
import type { Article } from '~/shared/types'

const props = defineProps<{
  article: Pick<Article['en'], 'topic' | 'description' | 'title'> &
    Pick<Article, 'createdAt' | 'updatedAt' | 'views'>
}>()

const articleDate = new Date(props.article.updatedAt ?? props.article.createdAt)
</script>

<template>
  <section class="bg-card py-12 md:py-20">
    <div class="container mx-auto px-4 md:px-6">
      <div class="mx-auto flex max-w-5xl flex-col items-center text-center">
        <div class="flex flex-col items-center space-y-4">
          <div class="bg-primary/10 text-primary inline-block rounded-lg px-3 py-1 text-sm">
            {{ article.topic }}
          </div>
          <h1 class="text-foreground text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            {{ article.title }}
          </h1>
          <p class="text-muted-foreground max-w-[700px] text-lg md:text-xl">
            {{ article.description }}
          </p>
        </div>
        <div class="mt-8 flex w-full max-w-md items-center justify-between">
          <div class="flex items-center gap-x-2">
            <Calendar1 class="text-primary h-8 w-8" />
            {{ $d(articleDate) }}
          </div>

          <div class="flex items-center gap-x-2">
            <Eye class="text-primary h-8 w-8" />
            {{ normalizeNumber(article.views) }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
