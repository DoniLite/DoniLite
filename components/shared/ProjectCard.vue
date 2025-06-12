<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Scale, Star } from 'lucide-vue-next'
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
    class="ring-primary/20 transition-all duration-300 ease-in-out hover:ring-1"
  >
    <Card class="max-w-sm">
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
              <Star class="border-primary fill-muted text-muted border" />
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
        <span
          v-for="tag in repo.tags"
          :key="tag"
          class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
        >
          {{ tag }}
        </span>
      </CardFooter>
    </Card>
  </a>
</template>
