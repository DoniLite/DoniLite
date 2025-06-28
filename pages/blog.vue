<script setup>
import Filters from '~/components/blog/Filters.vue'
import ArticleCard from '~/components/shared/ArticleCard.vue'
import CardXD from '~/components/shared/CardXD.vue'
import HeroSection from '../components/blog/Hero.vue'

const mockFilters = ['Tous', 'Vue.js', 'TypeScript', 'Nuxt', 'Open Source', 'Tutoriels']
</script>
<template>
  <div class="bg-background min-h-screen">
    <!-- Header/Navigation serait ici -->

    <!-- Blog Hero Section -->
    <HeroSection />

    <!-- Blog Category Filter -->
    <Filters :filters="mockFilters" />

    <!-- Featured Article -->
    <section class="py-8 md:py-12">
      <div class="container mx-auto px-4 md:px-6">
        <div class="mx-auto max-w-5xl">
          <CardXD :article="mockArticles[0]" />
        </div>
      </div>
    </section>

    <!-- All Blog Posts -->
    <section class="py-8 md:py-12">
      <div class="container mx-auto px-4 md:px-6">
        <div class="mx-auto max-w-5xl">
          <h2 class="text-foreground text-2xl font-bold tracking-tighter md:text-3xl">
            {{ $t('page.blog.all_articles') }}
          </h2>
          <div class="mt-8 grid gap-8 md:grid-cols-2">
            <ArticleCard
              v-for="article in mockArticles"
              :key="article.id"
              :article="article"
            />
          </div>

          <!-- Pagination -->
          <div class="mt-12 flex items-center justify-center space-x-2">
            <button
              class="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <svg
                class="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span class="sr-only">Page précédente</span>
            </button>
            <button
              class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              1
            </button>
            <button
              class="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              2
            </button>
            <button
              class="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              3
            </button>
            <button
              class="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <svg
                class="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
              <span class="sr-only">Page suivante</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="bg-card py-12 md:py-16">
      <div class="container px-4 md:px-6">
        <div class="mx-auto max-w-5xl">
          <div class="bg-background rounded-lg p-8 shadow-sm">
            <div class="flex flex-col items-center space-y-4 text-center">
              <div class="bg-primary/10 rounded-full p-3">
                <svg
                  class="text-primary h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M21 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"
                  />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </div>
              <h2 class="text-foreground text-2xl font-bold tracking-tighter md:text-3xl">
                Restez informé
              </h2>
              <p class="text-muted-foreground max-w-[600px] md:text-lg">
                Abonnez-vous à ma newsletter pour recevoir mes derniers articles et actualités
                directement dans votre boîte mail.
              </p>
              <div class="w-full max-w-md">
                <form class="flex space-x-2">
                  <input
                    type="email"
                    placeholder="votre-email@exemple.com"
                    class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    S'abonner
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer serait ici -->
  </div>
</template>
