<script setup lang="ts">
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
  </div>
</template>
