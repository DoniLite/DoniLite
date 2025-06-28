<script setup lang="ts">
import About from '~/components/home/About.vue'
import Hero from '~/components/home/Hero.vue'
import BlogCard from '~/components/shared/BlogCard.vue'
import Contact from '~/components/shared/Contact.vue'
import ProjectCard from '~/components/shared/ProjectCard.vue'
import type { Article } from '~/shared/types'
import { useRepositoriesStore } from '~/store/repositories.store'

const repoStore = useRepositoriesStore()
const { repositories } = storeToRefs(repoStore)
onMounted(async () => {
  await repoStore.loadRepositories({
    per_page: 6,
    sort: 'updated',
    direction: 'desc'
  })
})

defineOgImageComponent('Frame')

useSeoMeta({
  title: 'Doni Lite | Developer',
  ogTitle: 'Doni Lite | Developer',
  description: 'Open Source Developer & Passionate about new technologies',
  ogDescription: 'Open Source Developer & Passionate about new technologies'
})

const mockArticles: Article[] = [
  {
    id: 1,
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-06-02T12:00:00Z',
    status: 'posted',
    en: {
      title: 'Understanding TypeScript Generics',
      description: 'A deep dive into generics in TypeScript and how to use them effectively.',
      slug: ['typescript', 'generics'],
      topic: 'TypeScript',
      content: 'Generics provide a way to make components work with any data type...'
    },
    fr: {
      title: 'Comprendre les Génériques en TypeScript',
      description:
        'Une exploration approfondie des génériques en TypeScript et de leur utilisation.',
      slug: ['typescript', 'generiques'],
      topic: 'TypeScript',
      content:
        'Les génériques permettent de rendre les composants compatibles avec tout type de données...'
    }
  },
  {
    id: 2,
    createdAt: '2024-05-15T09:30:00Z',
    status: 'draft',
    en: {
      title: 'Vue 3 Composition API Patterns',
      description: 'Best practices and patterns for using the Composition API in Vue 3.',
      slug: ['vue', 'composition-api'],
      topic: 'Vue.js',
      content: 'The Composition API in Vue 3 enables better code organization...'
    },
    fr: {
      title: 'Patterns de l’API de Composition Vue 3',
      description: 'Bonnes pratiques et patterns pour utiliser l’API de composition dans Vue 3.',
      slug: ['vue', 'api-composition'],
      topic: 'Vue.js',
      content: 'L’API de composition dans Vue 3 permet une meilleure organisation du code...'
    }
  },
  {
    id: 3,
    createdAt: '2024-04-20T14:45:00Z',
    updatedAt: '2024-04-21T08:00:00Z',
    status: 'archived',
    en: {
      title: 'Getting Started with Rust',
      description: 'An introduction to the Rust programming language for beginners.',
      slug: ['rust', 'getting-started'],
      topic: 'Rust',
      content: 'Rust is a systems programming language focused on safety and performance...'
    },
    fr: {
      title: 'Bien démarrer avec Rust',
      description: 'Une introduction au langage de programmation Rust pour les débutants.',
      slug: ['rust', 'demarrage'],
      topic: 'Rust',
      content:
        'Rust est un langage de programmation système axé sur la sécurité et la performance...'
    }
  }
]
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <Hero />

    <!-- About Me Section -->
    <About />

    <!-- Recent Projects Section -->
    <section class="bg-background py-16 md:py-24">
      <div class="container mx-auto px-4 md:px-6">
        <div class="flex flex-col items-center justify-center space-y-4 text-center">
          <div class="space-y-2">
            <div class="bg-primary/10 text-primary inline-block rounded-lg px-3 py-1 text-sm">
              {{ $t('page.portfolio.id') }}
            </div>
            <h2 class="text-foreground text-3xl font-bold tracking-tighter md:text-4xl/tight">
              {{ $t('page.portfolio.recent_projects') }}
            </h2>
            <p
              class="text-muted-foreground mx-auto max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
            >
              {{ $t('page.portfolio.description') }}
            </p>
          </div>
        </div>
        <div class="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <!-- Project Card 1 -->
          <ProjectCard
            v-for="repo in repositories"
            :key="repo.name"
            :repo
          />
        </div>
        <div class="flex justify-center">
          <NuxtLink
            to="/projects"
            class="border-border bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md border px-8 text-sm font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            {{ $t('page.portfolio.view_all') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Blog Preview Section -->
    <section class="bg-card py-16 md:py-24">
      <div class="container mx-auto px-4 md:px-6">
        <div class="flex flex-col items-center justify-center space-y-4 text-center">
          <div class="space-y-2">
            <div class="bg-primary/10 text-primary inline-block rounded-lg px-3 py-1 text-sm">
              {{ $t('common.blog') }}
            </div>
            <h2 class="text-foreground text-3xl font-bold tracking-tighter md:text-4xl/tight">
              {{ $t('page.blog.recent_posts') }}
            </h2>
            <p
              class="text-muted-foreground mx-auto max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
            >
              {{ $t('page.blog.description') }}
            </p>
          </div>
        </div>
        <div class="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
          <BlogCard
            v-for="article in mockArticles"
            :key="article.id"
            :article
          />
        </div>
        <div class="flex justify-center">
          <NuxtLink
            to="/blog"
            class="border-border bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md border px-8 text-sm font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            {{ $t('page.blog.view_all') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <Contact />
  </div>
</template>
