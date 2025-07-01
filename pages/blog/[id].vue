<script setup lang="ts">
const route = useRoute()
const { id } = route.params
const { locale } = useI18n()
// eslint-disable-next-line eqeqeq, @typescript-eslint/no-non-null-assertion
const article = mockArticles.find((article) => article.id == id)!
const localArticle = {
  en: article.en,
  fr: article.fr
}[locale.value]
</script>

<template>
  <div class="bg-background min-h-screen">
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

    <div class="container mx-auto">
      {{ localArticle.content }}
    </div>
  </div>
</template>
