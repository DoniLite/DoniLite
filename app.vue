<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
// useSeoMeta({
//   title: 'OBASS Consulting',
//   ogTitle: 'OBASS Consulting',
//   description: '-Enquête Statistique – Analyse de données –-Génie logiciel – Site web – Suivi-Evaluation-Business Consulting – -Formation',
//   ogDescription: '-Enquête Statistique – Analyse de données –-Génie logiciel – Site web – Suivi-Evaluation-Business Consulting – -Formation',
//   ogImage: 'https://example.com/image.png',
//   twitterCard: 'summary_large_image',
//   ogUrl: 'https://www.obaasconsult.com/',
// })
</script>

<template>
  <Head>
    <Link
      rel="icon"
      href="/icon.png"
    ></Link>
  </Head>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Analytics />
</template>
