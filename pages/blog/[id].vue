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

    <!-- <article class="prose mx-auto lg:prose-xl">
      <h1>Garlic bread with cheese: What the science tells us</h1>
      <p>
        For years parents have espoused the health benefits of eating garlic bread with cheese to
        their children, with the food earning such an iconic status in our culture that kids will
        often dress up as warm, cheesy loaf for Halloween.
      </p>
      <p>
        But a recent study shows that the celebrated appetizer may be linked to a series of rabies
        cases springing up around the country.
      </p>
    </article> -->
  </div>
</template>
