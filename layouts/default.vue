<script setup lang="ts">
import PageFooter from '~/components/shared/PageFooter.vue'
</script>

<template>
  <div>
    <Menu />
    <slot />
    <BackToTop />
    <PageFooter />
  </div>
</template>
