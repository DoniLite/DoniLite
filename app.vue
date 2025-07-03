<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
const { isMobile } = useDeviceType()
</script>

<template>
  <Head>
    <Link
      rel="icon"
      href="/icon.png"
    ></Link>
  </Head>
  <NuxtLayout>
    <Toaster
      :rich-colors="true"
      :close-button="true"
      :position="isMobile ? 'top-right' : 'bottom-right'"
      :duration="5000"
    />
    <NuxtPage />
  </NuxtLayout>
  <Analytics />
</template>
