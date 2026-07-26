<script setup lang="ts">
import ProjectCard from '~/components/shared/ProjectCard.vue'
import { useRepositoriesStore } from '~/store/repositories.store'

const { t } = useI18n()
const repoStore = useRepositoriesStore()
const repositories = computed(() => repoStore.repositories)
const isLoading = ref(true)

onMounted(async () => {
  await repoStore.loadRepositories({
    per_page: 30,
    sort: 'updated',
    direction: 'desc'
  })
  isLoading.value = false
})

const pageSize = 9
const currentPage = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(repositories.value.length / pageSize)))
const pagedRepositories = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return repositories.value.slice(start, start + pageSize)
})

const goToPage = (page: number) => {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
}

useSeoMeta({
  title: 'Doni Lite | Projects',
  ogTitle: 'Doni Lite | Projects',
  description: 'A look at my recent open-source projects and libraries.',
  ogDescription: 'A look at my recent open-source projects and libraries.'
})

defineOgImage('Projects', {
  headline: t('page.portfolio.id'),
  title: t('page.portfolio.my_projects'),
  description: t('page.portfolio.description')
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [{ name: t('name'), item: '/' }, { name: t('page.portfolio.my_projects') }]
  })
])
</script>

<template>
  <div class="min-h-screen">
    <section class="bg-background py-16 md:py-24">
      <div class="container mx-auto px-4 md:px-6">
        <div class="flex flex-col items-center justify-center space-y-4 text-center">
          <div class="space-y-2">
            <div class="bg-primary/10 text-primary inline-block rounded-lg px-3 py-1 text-sm">
              {{ $t('page.portfolio.id') }}
            </div>
            <h1 class="text-foreground text-3xl font-bold tracking-tighter md:text-4xl/tight">
              {{ $t('page.portfolio.my_projects') }}
            </h1>
            <p
              class="text-muted-foreground mx-auto max-w-175 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
            >
              {{ $t('page.portfolio.description') }}
            </p>
          </div>
        </div>

        <div
          v-if="!isLoading && repositories.length === 0"
          class="text-muted-foreground py-16 text-center"
        >
          {{ $t('page.portfolio.no_projects') }}
        </div>
        <template v-else>
          <div class="mx-auto grid max-w-6xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <ProjectCard
              v-for="repo in pagedRepositories"
              :key="repo.name"
              :repo
            />
          </div>

          <div
            v-if="totalPages > 1"
            class="mt-4 flex items-center justify-center space-x-2"
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
        </template>
      </div>
    </section>
  </div>
</template>
