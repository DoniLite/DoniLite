<script setup lang="ts">
import About from '~/components/home/About.vue'
import Hero from '~/components/home/Hero.vue'
import BlogCard from '~/components/shared/BlogCard.vue'
import Contact from '~/components/shared/Contact.vue'
import ProjectCard from '~/components/shared/ProjectCard.vue'
import { useRepositoriesStore } from '~/store/repositories.store'

const { hash } = useRoute()

const scrollToHash = async () => {
  if (hash) {
    await nextTick()
    const el = document.querySelector(hash)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

const repoStore = useRepositoriesStore()
const repositories = computed(() => repoStore.repositories)
onMounted(async () => {
  await scrollToHash()
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
        <div class="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
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
