<script setup lang="ts">
import Filters from '~/components/blog/Filters.vue'
import HeroSection from '~/components/blog/Hero.vue'
import ArticleCard from '~/components/shared/ArticleCard.vue'
import CardXD from '~/components/shared/CardXD.vue'
import NewsLetter from '~/components/shared/NewsLetter.vue'
import { seriesService } from '~/lib/service/series.service'
import type { Article } from '~~/shared/types'

const { t, locale } = useI18n()
const route = useRoute()

const { data: articles } = await useFetch<Article[]>('/api/articles', {
  query: {
    status: 'published'
  },
  default: () => []
})

const { data: seriesList } = await seriesService.list()

const featuredArticle = computed(() => {
  return articles.value.find((article) => article.featured) ?? articles.value[0]
})

const search = ref('')
const activeFilter = ref(t('common.all'))
const seasonFilter = ref(typeof route.query.season === 'string' ? route.query.season : '')
const filters = computed(() => [
  t('common.all'),
  ...Array.from(
    new Set(articles.value.flatMap((article) => article.tags?.map((tag) => tag.label) ?? []))
  )
])

const seasonOptions = computed(() =>
  seriesList.value.flatMap((series) =>
    series.seasons.map((season) => ({
      id: season.id,
      label: `${series.title} · ${season.title}`
    }))
  )
)

const filteredArticles = computed(() => {
  const query = search.value.trim().toLowerCase()
  return articles.value.filter((article) => {
    const matchesFilter =
      activeFilter.value === t('common.all') ||
      article.tags?.some((tag) => tag.label === activeFilter.value)
    if (!matchesFilter) {
      return false
    }
    if (seasonFilter.value && article.season?.id !== seasonFilter.value) {
      return false
    }
    if (!query) {
      return true
    }
    // Match the same locale-resolution order used for display (ArticleCard),
    // otherwise typing text that's visible on screen in the current UI locale
    // can fail to match when it was only ever compared against the article's
    // source-locale text.
    const translation =
      article.translations.find((tr) => tr.locale === locale.value) ??
      article.translations.find((tr) => tr.locale === article.sourceLocale) ??
      article.translations[0]
    const haystack = `${translation?.title ?? ''} ${translation?.description ?? ''}`.toLowerCase()
    return haystack.includes(query)
  })
})

const pageSize = 6
const currentPage = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(filteredArticles.value.length / pageSize)))
const pagedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredArticles.value.slice(start, start + pageSize)
})

watch([search, activeFilter, seasonFilter], () => {
  currentPage.value = 1
})

const goToPage = (page: number) => {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
}

defineOgImageComponent('Blog')

useSeoMeta({
  title: 'Doni Lite | Blog',
  ogTitle: 'Doni Lite | Blog',
  description:
    'Discover my latest articles on web development, open source and technologies that I use.',
  ogDescription:
    'Discover my latest articles on web development, open source and technologies that I use.'
})
</script>
<template>
  <div class="bg-background min-h-screen">
    <!-- Header/Navigation serait ici -->

    <!-- Blog Hero Section -->
    <HeroSection v-model:search="search" />

    <!-- Blog Category Filter -->
    <Filters
      v-model="activeFilter"
      :filters="filters"
    />

    <!-- Season Filter -->
    <section
      v-if="seasonOptions.length > 0"
      class="border-b py-4"
    >
      <div class="container mx-auto px-4 md:px-6">
        <div class="mx-auto max-w-5xl">
          <select
            v-model="seasonFilter"
            class="border-input bg-background h-9 rounded-md border px-3 text-sm outline-none"
          >
            <option value="">{{ $t('page.blog.all_seasons') }}</option>
            <option
              v-for="option in seasonOptions"
              :key="option.id"
              :value="option.id"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </section>

    <!-- Featured Article -->
    <section class="py-8 md:py-12">
      <div class="container mx-auto px-4 md:px-6">
        <div class="mx-auto max-w-5xl">
          <CardXD
            v-if="featuredArticle"
            :article="featuredArticle"
          />
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

          <div
            v-if="filteredArticles.length === 0"
            class="text-muted-foreground py-12 text-center"
          >
            {{ $t('page.blog.no_articles') }}
          </div>
          <div
            v-else
            class="mt-8 grid gap-8 md:grid-cols-2"
          >
            <ArticleCard
              v-for="article in pagedArticles"
              :key="article.id"
              :article="article"
            />
          </div>

          <!-- Pagination -->
          <div
            v-if="totalPages > 1"
            class="mt-12 flex items-center justify-center space-x-2"
          >
            <button
              :class="Pagination_class.nextPage"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
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
              <span class="sr-only">{{ $t('pagination.previous_page') }}</span>
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              :class="
                page === currentPage ? Pagination_class.currentPage : Pagination_class.nextPage
              "
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
            <button
              :class="Pagination_class.nextPage"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
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
