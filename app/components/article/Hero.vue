<script setup lang="ts">
import { Calendar1, Eye } from 'lucide-vue-next'
const props = defineProps<{
  article: {
    title: string
    description: string
    topic: string
    createdAt?: string | Date | null
    updatedAt?: string | Date | null
    views: number
    seriesTitle?: string | null
    seasonTitle?: string | null
    seasonId?: string | null
    episode?: number | null
  }
}>()

const localePath = useLocalePath()
const articleDate = new Date(props.article.updatedAt ?? props.article.createdAt ?? Date.now())
</script>

<template>
  <section class="bg-card py-12 md:py-20">
    <div class="container mx-auto px-4 md:px-6">
      <div class="mx-auto flex max-w-5xl flex-col items-center text-center">
        <div class="flex flex-col items-center space-y-4">
          <div class="bg-primary/10 text-primary inline-block rounded-lg px-3 py-1 text-sm">
            {{ article.topic }}
          </div>
          <NuxtLink
            v-if="article.seasonId"
            :to="{ path: localePath('blog'), query: { season: article.seasonId } }"
            class="text-muted-foreground hover:text-primary inline-flex items-center gap-1 text-sm underline-offset-2 hover:underline"
          >
            {{
              article.episode
                ? $t('page.blog.season_label_with_episode', {
                    series: article.seriesTitle,
                    season: article.seasonTitle,
                    n: article.episode
                  })
                : $t('page.blog.season_label', {
                    series: article.seriesTitle,
                    season: article.seasonTitle
                  })
            }}
          </NuxtLink>
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
