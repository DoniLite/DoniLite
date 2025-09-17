<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
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
  <SpeedInsights />
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.5);
  border-radius: 8px;
}
</style>
