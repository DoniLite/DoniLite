<script setup lang="ts" generic="T extends Article">
import type { Article } from '~/shared/types'

const { locale } = useI18n()

const props = defineProps<{
  article: T
}>()
const localePath = useLocalePath()

const localizedArticle = computed(() => {
  return { en: props.article.en, fr: props.article.fr }[locale.value]
})

const articleDate = new Date(props.article.updatedAt ?? props.article.createdAt)
</script>

<template>
  <div class="bg-card overflow-hidden rounded-lg border shadow-sm">
    <div class="p-6">
      <div class="flex items-center gap-4">
        <span class="text-muted-foreground text-sm">{{ $d(articleDate) }}</span>
        <span
          class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
        >
          {{ localizedArticle.topic }}
        </span>
      </div>
      <h3 class="text-foreground mt-4 text-xl font-bold">{{ localizedArticle.title }}</h3>
      <p class="text-muted-foreground mt-2 line-clamp-3">
        {{ localizedArticle.description }}
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
          :to="{ path: `${localePath('blog')}/${article.id}` }"
          class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          {{ $t('page.blog.read_article') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
