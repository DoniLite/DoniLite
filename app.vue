<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
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
