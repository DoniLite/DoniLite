<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
    bg?: string
    logo?: string
    image?: string
    username?: string
  }>(),
  {
    bg: 'linear-gradient(to bottom right, #0d0b07, #322e22)',
    image: undefined,
    description: 'Open Source Developer and Passionate about new technologies',
    title: 'Doni Lite',
    logo: '/avatar.jpeg',
    username: 'Doni Lite'
  }
)
</script>

<template>
  <div
    class="relative flex h-full w-full items-center justify-center overflow-hidden text-[#ff8300]"
    :style="{ background: bg }"
  >
    <div
      v-if="image"
      class="absolute inset-0 h-full w-full bg-cover bg-center opacity-10"
      :style="{ backgroundImage: `url(${image})` }"
    />

    <div class="z-10 flex flex-col items-center p-8 text-center">
      <p class="max-w-5xl text-3xl md:max-w-md md:text-2xl">
        {{ description }}
      </p>
    </div>

    <img
      v-if="logo"
      :src="logo"
      :alt="`${username || title} logo`"
      class="absolute bottom-5 left-5 z-10 h-24 w-24 rounded-full object-cover ring-2 ring-white md:h-32 md:w-32"
    />
    <div class="absolute right-5 bottom-5 z-10 flex flex-col items-end gap-2">
      <div
        v-if="username"
        class="text-3xl font-bold"
      >
        {{ username }}
      </div>
    </div>
  </div>
</template>
