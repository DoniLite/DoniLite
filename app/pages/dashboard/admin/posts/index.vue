<script setup lang="ts">
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Plus } from 'lucide-vue-next'
import ArticleActionsMenu from '~/components/admin/ArticleActionsMenu.vue'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table'
import { seriesService } from '~/lib/service/series.service'
import type {
  Article,
  ArticleLocale,
  ArticleStatus,
  ArticleTranslationStatus
} from '~~/shared/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const { locale, d } = useI18n()
const localePath = useLocalePath()
const { data: articles, refresh } = await useFetch<Article[]>('/api/articles', {
  default: () => []
})
const { data: seriesList } = await seriesService.list()

const saveError = ref('')
const busyArticleId = ref<string | null>(null)
const supportedLocales: ArticleLocale[] = ['en', 'fr']

const getTranslation = (article: Article) => {
  return (
    article.translations.find((translation) => translation.locale === locale.value) ??
    article[article.sourceLocale as ArticleLocale] ??
    article.translations[0]
  )
}

const getTranslationStatus = (article: Article, targetLocale: ArticleLocale) => {
  return (
    article.translations.find((translation) => translation.locale === targetLocale)
      ?.translationStatus ?? 'missing'
  )
}

const missingLocales = (article: Article) => {
  return supportedLocales.filter((target) => getTranslationStatus(article, target) === 'missing')
}

const getStatusVariant = (status: ArticleStatus) => {
  if (status === 'published') {
    return 'default'
  }
  if (status === 'archived') {
    return 'secondary'
  }
  return 'outline'
}

const getTranslationVariant = (status: ArticleTranslationStatus | 'missing') => {
  if (status === 'published' || status === 'reviewed') {
    return 'default'
  }
  if (status === 'queued' || status === 'generated') {
    return 'secondary'
  }
  return 'outline'
}

const updateArticleStatus = async (article: Article, status: ArticleStatus) => {
  busyArticleId.value = article.id
  saveError.value = ''
  try {
    await $fetch(`/api/articles/${article.id}`, {
      method: 'PATCH',
      body: {
        status,
        publishedAt: status === 'published' ? new Date().toISOString() : article.publishedAt
      }
    })
    await refresh()
  } catch (error) {
    saveError.value = error instanceof Error ? error.message : 'Unable to update article'
  } finally {
    busyArticleId.value = null
  }
}

const queueTranslation = async (article: Article, targetLocale: ArticleLocale) => {
  busyArticleId.value = article.id
  saveError.value = ''
  try {
    await $fetch(`/api/articles/${article.id}/translations/queue`, {
      method: 'POST',
      body: {
        targetLocale,
        sourceLocale: article.sourceLocale
      }
    })
    await refresh()
  } catch (error) {
    saveError.value = error instanceof Error ? error.message : 'Unable to prepare translation'
  } finally {
    busyArticleId.value = null
  }
}

const deleteArticle = async (article: Article) => {
  busyArticleId.value = article.id
  saveError.value = ''
  try {
    await $fetch(`/api/articles/${article.id}`, { method: 'DELETE' })
    await refresh()
  } catch (error) {
    saveError.value = error instanceof Error ? error.message : 'Unable to delete article'
  } finally {
    busyArticleId.value = null
  }
}

// Series & season groups — lets you see at a glance which episodes exist for
// a season and pick the next one, instead of hunting through a flat list.
const seriesGroups = computed(() => {
  return seriesList.value
    .map((series) => {
      const seasons = series.seasons
        .map((season) => ({
          season,
          episodes: articles.value
            .filter((article) => article.seasonId === season.id)
            .sort((a, b) => (a.episode ?? 0) - (b.episode ?? 0))
        }))
        .filter((group) => group.episodes.length > 0)
        .sort((a, b) => a.season.position - b.season.position)
      return { series, seasons }
    })
    .filter((group) => group.seasons.length > 0)
})

// Everything not tied to a season — the "classic" one-off articles.
const classicArticles = computed(() => articles.value.filter((article) => !article.seasonId))

type SortKey = 'title' | 'status' | 'updatedAt'
const sortKey = ref<SortKey>('updatedAt')
const sortDir = ref<'asc' | 'desc'>('desc')

const toggleSort = (key: SortKey) => {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

const sortIcon = (key: SortKey) => {
  if (sortKey.value !== key) {
    return ArrowUpDown
  }
  return sortDir.value === 'asc' ? ArrowUp : ArrowDown
}

const sortedClassicArticles = computed(() => {
  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...classicArticles.value].sort((a, b) => {
    if (sortKey.value === 'title') {
      const aTitle = getTranslation(a)?.title ?? ''
      const bTitle = getTranslation(b)?.title ?? ''
      return aTitle.localeCompare(bTitle) * dir
    }
    if (sortKey.value === 'status') {
      return a.status.localeCompare(b.status) * dir
    }
    const aTime = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime()
    const bTime = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime()
    return (aTime - bTime) * dir
  })
})

const pageSize = 10
const currentPage = ref(1)
const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedClassicArticles.value.length / pageSize))
)
const pagedClassicArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return sortedClassicArticles.value.slice(start, start + pageSize)
})

watch([sortKey, sortDir], () => {
  currentPage.value = 1
})

watch(totalPages, (total) => {
  if (currentPage.value > total) {
    currentPage.value = total
  }
})

const goToPage = (page: number) => {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
}
</script>

<template>
  <div class="flex flex-col gap-8 p-4">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h1 class="text-foreground text-2xl font-bold">
          {{ $t('admin.posts.title') }}
        </h1>
        <p class="text-muted-foreground text-sm">
          {{ $t('admin.posts.description') }}
        </p>
      </div>
      <Button as-child>
        <NuxtLink :to="localePath('/dashboard/admin/posts/create')">
          <Plus class="h-4 w-4" />
          {{ $t('admin.posts.actions.create') }}
        </NuxtLink>
      </Button>
    </div>

    <p
      v-if="saveError"
      class="border-destructive bg-destructive/10 text-destructive rounded-md border p-3 text-sm"
    >
      {{ saveError }}
    </p>

    <section
      v-if="seriesGroups.length > 0"
      class="flex flex-col gap-6"
    >
      <h2 class="text-foreground text-lg font-semibold">
        {{ $t('admin.posts.series.title') }}
      </h2>

      <div
        v-for="group in seriesGroups"
        :key="group.series.id"
        class="border-border bg-card rounded-lg border p-4 lg:p-6"
      >
        <h3 class="text-foreground mb-4 text-base font-semibold">
          {{ group.series.title }}
        </h3>

        <div class="flex flex-col gap-5">
          <div
            v-for="seasonGroup in group.seasons"
            :key="seasonGroup.season.id"
          >
            <h4 class="text-muted-foreground mb-2 text-sm font-medium">
              {{ seasonGroup.season.title }}
            </h4>
            <div class="border-border divide-border divide-y rounded-md border">
              <div
                v-for="article in seasonGroup.episodes"
                :key="article.id"
                class="flex items-center gap-3 p-3"
              >
                <Badge
                  variant="outline"
                  class="shrink-0"
                >
                  {{ $t('page.blog.episode', { n: article.episode ?? '?' }) }}
                </Badge>
                <div class="min-w-0 flex-1">
                  <p class="truncate font-medium">{{ getTranslation(article)?.title }}</p>
                </div>
                <Badge :variant="getStatusVariant(article.status)">
                  {{ $t(`admin.posts.status.${article.status}`) }}
                </Badge>
                <div class="hidden gap-1 sm:flex">
                  <Badge
                    v-for="articleLocale in supportedLocales"
                    :key="articleLocale"
                    :variant="getTranslationVariant(getTranslationStatus(article, articleLocale))"
                    class="text-xs"
                  >
                    {{ articleLocale.toUpperCase() }}
                  </Badge>
                </div>
                <ArticleActionsMenu
                  :article="article"
                  :busy="busyArticleId === article.id"
                  :missing-locales="missingLocales(article)"
                  @publish="updateArticleStatus(article, 'published')"
                  @draft="updateArticleStatus(article, 'draft')"
                  @archive="updateArticleStatus(article, 'archived')"
                  @delete="deleteArticle(article)"
                  @translate="(targetLocale) => queueTranslation(article, targetLocale)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="mb-1 flex items-center justify-between">
        <h2 class="text-foreground text-lg font-semibold">
          {{ $t('admin.posts.library') }}
        </h2>
        <Badge variant="outline">{{ classicArticles.length }}</Badge>
      </div>
      <p class="text-muted-foreground mb-4 text-xs">
        {{ $t('admin.posts.libraryHint') }}
      </p>

      <div
        v-if="classicArticles.length === 0"
        class="text-muted-foreground flex flex-col items-center gap-2 rounded-md border border-dashed p-6 text-sm"
      >
        <Plus class="h-5 w-5" />
        {{ $t('admin.posts.empty') }}
      </div>

      <template v-else>
        <div class="border-border overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    class="flex items-center gap-1 font-medium"
                    @click="toggleSort('title')"
                  >
                    {{ $t('admin.posts.table.title') }}
                    <component
                      :is="sortIcon('title')"
                      class="h-3.5 w-3.5"
                    />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    class="flex items-center gap-1 font-medium"
                    @click="toggleSort('status')"
                  >
                    {{ $t('admin.posts.table.status') }}
                    <component
                      :is="sortIcon('status')"
                      class="h-3.5 w-3.5"
                    />
                  </button>
                </TableHead>
                <TableHead>{{ $t('admin.posts.table.languages') }}</TableHead>
                <TableHead>
                  <button
                    class="flex items-center gap-1 font-medium"
                    @click="toggleSort('updatedAt')"
                  >
                    {{ $t('admin.posts.table.updated') }}
                    <component
                      :is="sortIcon('updatedAt')"
                      class="h-3.5 w-3.5"
                    />
                  </button>
                </TableHead>
                <TableHead class="text-right">{{ $t('common.actions') }}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="article in pagedClassicArticles"
                :key="article.id"
              >
                <TableCell class="max-w-xs">
                  <p class="truncate font-medium">{{ getTranslation(article)?.title }}</p>
                  <p class="text-muted-foreground truncate text-xs">
                    {{ getTranslation(article)?.description }}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge :variant="getStatusVariant(article.status)">
                    {{ $t(`admin.posts.status.${article.status}`) }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div class="flex flex-wrap gap-1">
                    <Badge
                      v-for="articleLocale in supportedLocales"
                      :key="articleLocale"
                      :variant="getTranslationVariant(getTranslationStatus(article, articleLocale))"
                      class="text-xs"
                    >
                      {{ articleLocale.toUpperCase() }}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell class="text-muted-foreground text-sm whitespace-nowrap">
                  {{ d(new Date(article.updatedAt ?? article.createdAt ?? Date.now())) }}
                </TableCell>
                <TableCell class="text-right">
                  <ArticleActionsMenu
                    :article="article"
                    :busy="busyArticleId === article.id"
                    :missing-locales="missingLocales(article)"
                    @publish="updateArticleStatus(article, 'published')"
                    @draft="updateArticleStatus(article, 'draft')"
                    @archive="updateArticleStatus(article, 'archived')"
                    @delete="deleteArticle(article)"
                    @translate="(targetLocale) => queueTranslation(article, targetLocale)"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div
          v-if="totalPages > 1"
          class="mt-4 flex items-center justify-center gap-2"
        >
          <button
            :class="Pagination_class.nextPage"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            <ChevronLeft class="h-4 w-4" />
            <span class="sr-only">{{ $t('pagination.previous_page') }}</span>
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            :class="page === currentPage ? Pagination_class.currentPage : Pagination_class.nextPage"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button
            :class="Pagination_class.nextPage"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            <ChevronRight class="h-4 w-4" />
            <span class="sr-only">{{ $t('pagination.next_page') }}</span>
          </button>
        </div>
      </template>
    </section>
  </div>
</template>
