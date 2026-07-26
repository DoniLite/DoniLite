<script setup lang="ts">
import { Calendar1, Eye } from 'lucide-vue-next'
import { computed } from 'vue'

/**
 * @credits UnJS <https://unjs.io/>
 */

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    date?: string
    logo?: string
    views?: number
  }>(),
  {
    title: 'Doni Lite',
    description: 'Open Source Developer and Passionate about new technologies',
    date: undefined,
    logo: '/avatar.jpeg',
    views: undefined
  }
)

function normalizeNumber(num: number) {
  if (num > 1000) {
    return '+' + num.toString().slice(0, -3) + 'k'
  }
  if (num > 1000_000) {
    return '+' + num.toString().slice(0, -6) + 'M'
  }
  return num
}

const articleDate = computed(() => (props.date ? new Date(props.date) : undefined))

// Named distinctly from the `description` prop — reusing that name here
// shadowed the prop in the template, so passed-in descriptions never
// actually rendered (see the same bug already fixed in Blog.satori.vue).
const displayDescription = computed(() => (props.description || '').slice(0, 200))
</script>

<template>
  <div class="flex h-full w-full flex-col bg-[#0d0b07]">
    <div class="flex h-full w-full flex-col justify-center gap-16 px-[6.75rem]">
      <div class="flex flex-row items-center justify-between">
        <div class="max-w-[700px]">
          <h1
            class="flex max-w-[700px] flex-row text-[60px] font-bold text-[#ff8300]"
            style="display: block; overflow: hidden; line-clamp: 3; text-overflow: clip"
          >
            {{ title }}
          </h1>
          <p
            class="max-w-[700px] text-[35px] leading-[60px] text-white"
            style="display: block; line-clamp: 3; text-overflow: ellipsis"
          >
            {{ displayDescription }}
          </p>
        </div>
        <div class="">
          <img
            v-if="logo"
            :src="logo"
            :alt="`${title} logo`"
            class="h-[200px] w-[200px] rounded-full"
          />
        </div>
      </div>
      <div class="flex w-full flex-row items-center justify-between">
        <div
          v-if="articleDate"
          class="flex items-center gap-x-2 text-2xl text-white"
        >
          <Calendar1 class="h-12 w-12 text-[#ff8300]" />
          {{ $d(articleDate) }}
        </div>

        <div
          v-if="views"
          class="flex items-center gap-x-2 text-2xl text-white"
        >
          <Eye class="h-12 w-12 text-[#ff8300]" />
          {{ normalizeNumber(views) }}
        </div>
      </div>
    </div>
    <div class="absolute bottom-0 h-8 w-full bg-[#ff8300]" />
  </div>
</template>
