<script setup lang="ts">
import HighlightJs from '~/components/shared/HighlightJs.vue'

const route = useRoute()
const { id } = route.params
const { locale } = useI18n()
// eslint-disable-next-line eqeqeq, @typescript-eslint/no-non-null-assertion
const article = mockArticles.find((article) => article.id == id)!
const localArticle = {
  en: article.en,
  fr: article.fr
}[locale.value]

defineOgImageComponent('Article', {
  date: article.updatedAt ?? article.createdAt,
  views: article.views
})

useSeoMeta({
  title: localArticle.title,
  ogTitle: localArticle.title,
  description: localArticle.description,
  ogDescription: localArticle.description
})
</script>

<template>
  <div class="bg-background min-h-screen">
    <HighlightJs />
    <ArticleHero
      :article="{
        title: localArticle.title,
        description: localArticle.description,
        topic: localArticle.topic,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        views: article.views
      }"
    />

    <article class="prose lg:prose-lg dark:prose-invert mx-auto my-8 max-w-3xl px-3">
      {{ localArticle.content }}
    </article>
  </div>
</template>
