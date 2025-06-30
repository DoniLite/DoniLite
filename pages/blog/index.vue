<script setup>
import Filters from '~/components/blog/Filters.vue'
import ArticleCard from '~/components/shared/ArticleCard.vue'
import CardXD from '~/components/shared/CardXD.vue'
import NewsLetter from '~/components/shared/NewsLetter.vue'
import HeroSection from '../components/blog/Hero.vue'
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
            <button :class="Pagination_class.nextPage">
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
              <span class="sr-only">{{ $t('pagination.previous_page') }}</span>
            </button>
            <button :class="Pagination_class.currentPage">1</button>
            <button :class="Pagination_class.nextPage">2</button>
            <button :class="Pagination_class.nextPage">3</button>
            <button :class="Pagination_class.nextPage">
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
              <span class="sr-only">{{ $t('pagination.next_page') }}</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <NewsLetter />
  </div>
</template>
