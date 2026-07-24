<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import Filters from '~/components/blog/Filters.vue'
import HeroSection from '~/components/blog/Hero.vue'
import ArticleCard from '~/components/shared/ArticleCard.vue'
import CardXD from '~/components/shared/CardXD.vue'
import NewsLetter from '~/components/shared/NewsLetter.vue'
import { seriesService } from '~/lib/service/series.service'
import { tagService } from '~/lib/service/tag.service'
import type { Article, PaginatedResult } from '~~/shared/types'

const { t } = useI18n()
const route = useRoute()

const { data: seriesList } = await seriesService.list()
const { data: tags } = await tagService.list()

const search = ref('')
const debouncedSearch = refDebounced(search, 300)
const activeFilter = ref(t('common.all'))
const seasonFilter = ref(typeof route.query.season === 'string' ? route.query.season : '')

const filters = computed(() => [t('common.all'), ...tags.value.map((tag) => tag.label)])
const activeTagId = computed(() => {
  if (activeFilter.value === t('common.all')) {
    return undefined
  }
  return tags.value.find((tag) => tag.label === activeFilter.value)?.id
})

const seasonOptions = computed(() =>
  seriesList.value.flatMap((series) =>
    series.seasons.map((season) => ({
      id: season.id,
      label: `${series.title} · ${season.title}`
    }))
  )
)

const pageSize = 6
const currentPage = ref(1)

const { data: result } = await useFetch<PaginatedResult<Article>>('/api/articles', {
  query: computed(() => ({
    status: 'published',
    page: currentPage.value,
    pageSize,
    search: debouncedSearch.value || undefined,
    tagId: activeTagId.value,
    seasonId: seasonFilter.value || undefined
  })),
  default: () => ({ items: [], total: 0, page: 1, pageSize })
})

const pagedArticles = computed(() => result.value.items)
const totalPages = computed(() =>
  Math.max(1, Math.ceil(result.value.total / result.value.pageSize))
)

// A small, purpose-built fetch (bounded to 1 row) rather than deriving the
// featured article from the browse list — that list is now paginated, so it
// no longer has the full dataset to pick a "featured" article out of.
const { data: featuredResult } = await useFetch<PaginatedResult<Article>>('/api/articles', {
  query: { status: 'published', featured: true, pageSize: 1 },
  default: () => ({ items: [], total: 0, page: 1, pageSize: 1 })
})
const { data: fallbackFeaturedResult } = await useFetch<PaginatedResult<Article>>('/api/articles', {
  query: { status: 'published', pageSize: 1 },
  default: () => ({ items: [], total: 0, page: 1, pageSize: 1 })
})
const featuredArticle = computed(
  () => featuredResult.value.items[0] ?? fallbackFeaturedResult.value.items[0]
)

watch([debouncedSearch, activeFilter, seasonFilter], () => {
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
            v-if="pagedArticles.length === 0"
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
