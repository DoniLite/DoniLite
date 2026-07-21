<script setup lang="ts">
import { ArrowUp } from 'lucide-vue-next'

const showButton = ref(false)

const handleScroll = () => {
  showButton.value = window.scrollY > 300 // Affiche le bouton après 300px de scroll
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <button
    v-show="showButton"
    class="bg-primary fixed right-6 bottom-6 rounded-full p-3 transition-all hover:cursor-pointer"
    @click="scrollToTop"
  >
    <ArrowUp />
  </button>
</template>
