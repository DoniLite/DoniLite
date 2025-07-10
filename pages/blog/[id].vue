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

    <article class="prose lg:prose-lg dark:prose-invert mx-auto my-8 max-w-3xl px-3">
      {{ localArticle.content }}
      <h1>Bienvenue dans l'éditeur TipTap</h1><pre><code class="language-ts">const l = 'me'
</code></pre><p>Ceci est un <strong>exemple</strong> de contenu avec du <em>markdown</em> et des <code>éléments</code> formatés.</p><p></p><p></p><h2>Fonctionnalités</h2><ul><li><p>Support du <strong>markdown</strong></p></li><li><p>Images et vidéos en base64</p></li><li><p>Prévisualisation en temps réel</p></li><li><p>Toolbar personnalisable</p></li></ul><blockquote><p>Un éditeur flexible et réutilisable pour votre dashboard Nuxt !</p></blockquote>

    </article>
  </div>
</template>
