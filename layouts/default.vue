<script setup lang="ts">
import PageFooter from '~/components/shared/PageFooter.vue'
const route = useRoute()

watch(
  () => route.hash,
  async (newHash) => {
    if (newHash) {
      await nextTick()
      const el = document.querySelector(newHash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <Menu />
    <slot />
    <BackToTop />
    <PageFooter />
  </div>
</template>
