<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Scale, Star, Tag } from 'lucide-vue-next'
import type { Repos } from '~/shared/types'
import Language from './Language.vue'

defineProps<{
  repo: Repos
}>()
</script>

<template>
  <a
    :href="repo.html_url"
    target="_blank"
    rel="noopener"
    class="block"
  >
    <Card
      class="border-primary/10 hover:ring-primary/40 hover:border-primary/30 min-h-[240px] w-80 overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:ring-2"
    >
      <CardHeader>
        <CardTitle>{{ repo.name }}</CardTitle>
        <CardDescription>{{ repo.description }}</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex w-full justify-between">
          <Language
            v-if="repo.language"
            :language="repo.language"
          />
          <div class="flex gap-3">
            <div
              v-if="repo.stargazers_count"
              class="flex gap-1"
            >
              <Star class="fill-primary text-primary" />
              {{ repo.stargazers_count }}
            </div>
            <div
              v-if="repo.license"
              class="flex gap-1"
            >
              <Scale class="fill-primary text-primary" />
              {{ repo.license.name }}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <a
          v-for="tag in repo.tags"
          :key="tag.name"
          :href="`${repo.html_url}/releases/tag/${tag.name}`"
          target="_blank"
          rel="noopener"
          class="bg-primary/10 text-primary flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium"
        >
          <Tag class="fill-primary text-primary" />
          {{ tag.name }}
        </a>
      </CardFooter>
    </Card>
  </a>
</template>
