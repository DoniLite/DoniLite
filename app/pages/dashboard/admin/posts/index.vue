<script setup lang="ts">
import { ArrowUpRight, FilePenLine, Languages, Plus, RefreshCw } from 'lucide-vue-next'
import type { ArticleConfig } from '~/components/shared/types'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
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

const { locale } = useI18n()
const localePath = useLocalePath()
const {
  data: articles,
  refresh,
  pending
} = await useFetch<Article[]>('/api/articles', {
  default: () => []
})
const saving = ref(false)
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

const getArticleSlug = (article: Article) => {
  return getTranslation(article)?.slug ?? article.id
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

const createDraftArticle = async (payload: {
  title: string
  content: string
  config?: ArticleConfig
}) => {
  saving.value = true
  saveError.value = ''
  try {
    const title = payload.config?.title || payload.title || 'Untitled draft'
    const draftLocale = payload.config?.sourceLocale ?? locale.value
    await $fetch('/api/articles', {
      method: 'POST',
      body: {
        status: 'draft',
        sourceLocale: draftLocale,
        tagIds: payload.config?.tagIds,
        translation: {
          locale: draftLocale,
          translationStatus: 'reviewed',
          title,
          slug: payload.config?.slugs?.[0],
          description: payload.config?.description || title,
          content: payload.content,
          contentFormat: 'html'
        }
      }
    })
    await refresh()
  } catch (error) {
    saveError.value = error instanceof Error ? error.message : 'Unable to save article'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="grid gap-6 p-4 xl:grid-cols-[minmax(0,1fr)_360px]">
    <section class="min-w-0">
      <div class="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 class="text-foreground text-2xl font-bold">
            {{ $t('admin.posts.title') }}
          </h1>
          <p class="text-muted-foreground text-sm">
            {{ $t('admin.posts.description') }}
          </p>
        </div>
        <Button
          variant="outline"
          :disabled="pending"
          @click="refresh"
        >
          <RefreshCw />
          {{ $t('common.refresh') }}
        </Button>
      </div>

      <p
        v-if="saveError"
        class="border-destructive bg-destructive/10 text-destructive mb-4 rounded-md border p-3 text-sm"
      >
        {{ saveError }}
      </p>

      <BlogEditor @save:article="createDraftArticle" />
    </section>

    <aside class="border-border bg-card h-fit rounded-md border p-4">
      <div class="mb-1 flex items-center justify-between">
        <h2 class="text-lg font-semibold">
          {{ $t('admin.posts.library') }}
        </h2>
        <Badge variant="outline">{{ articles.length }}</Badge>
      </div>
      <p class="text-muted-foreground mb-4 text-xs">
        {{ $t('admin.posts.libraryHint') }}
      </p>

      <div class="flex flex-col gap-3">
        <article
          v-for="article in articles"
          :key="article.id"
          class="border-border rounded-md border p-3"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <h3 class="truncate font-medium">
                {{ getTranslation(article)?.title }}
              </h3>
              <p class="text-muted-foreground mt-1 line-clamp-2 text-xs">
                {{ getTranslation(article)?.description }}
              </p>
            </div>
            <Badge :variant="getStatusVariant(article.status)">
              {{ $t(`admin.posts.status.${article.status}`) }}
            </Badge>
          </div>

          <div class="text-muted-foreground mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span class="inline-flex items-center gap-1">
              <Languages class="h-3.5 w-3.5" />
              {{ article.translations.length }}/2
            </span>
            <span
              v-if="article.episode"
              class="inline-flex items-center gap-1"
            >
              <FilePenLine class="h-3.5 w-3.5" />
              {{ article.episode }}
            </span>
          </div>

          <div class="mt-3 flex flex-wrap gap-2">
            <Badge
              v-for="articleLocale in supportedLocales"
              :key="articleLocale"
              :variant="getTranslationVariant(getTranslationStatus(article, articleLocale))"
            >
              {{ articleLocale.toUpperCase() }}
              {{
                $t(`admin.posts.translationStatus.${getTranslationStatus(article, articleLocale)}`)
              }}
            </Badge>
          </div>

          <div class="mt-3 grid gap-2">
            <div class="flex flex-wrap gap-2">
              <Button
                v-if="article.status !== 'published'"
                size="sm"
                :disabled="busyArticleId === article.id"
                @click="updateArticleStatus(article, 'published')"
              >
                {{ $t('admin.posts.actions.publish') }}
              </Button>
              <Button
                v-if="article.status !== 'draft'"
                size="sm"
                variant="outline"
                :disabled="busyArticleId === article.id"
                @click="updateArticleStatus(article, 'draft')"
              >
                {{ $t('admin.posts.actions.draft') }}
              </Button>
              <Button
                v-if="article.status !== 'archived'"
                size="sm"
                variant="outline"
                :disabled="busyArticleId === article.id"
                @click="updateArticleStatus(article, 'archived')"
              >
                {{ $t('admin.posts.actions.archive') }}
              </Button>
            </div>

            <div class="flex flex-wrap gap-2">
              <Button
                v-for="articleLocale in supportedLocales"
                :key="`translation-${article.id}-${articleLocale}`"
                size="sm"
                variant="secondary"
                :disabled="
                  busyArticleId === article.id ||
                  getTranslationStatus(article, articleLocale) !== 'missing'
                "
                @click="queueTranslation(article, articleLocale)"
              >
                {{
                  $t('admin.posts.actions.prepareTranslation', {
                    locale: articleLocale.toUpperCase()
                  })
                }}
              </Button>
            </div>

            <div class="flex flex-wrap gap-3">
              <NuxtLink
                :to="localePath(`/dashboard/admin/posts/${article.id}`)"
                class="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
              >
                <FilePenLine class="h-3.5 w-3.5" />
                {{ $t('admin.posts.actions.edit') }}
              </NuxtLink>

              <NuxtLink
                :to="localePath(`/blog/${getArticleSlug(article)}`)"
                class="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
              >
                {{ $t('admin.posts.actions.open') }}
                <ArrowUpRight class="h-3.5 w-3.5" />
              </NuxtLink>
            </div>
          </div>
        </article>

        <div
          v-if="articles.length === 0"
          class="text-muted-foreground flex flex-col items-center gap-2 rounded-md border border-dashed p-6 text-sm"
        >
          <Plus class="h-5 w-5" />
          {{ $t('admin.posts.empty') }}
        </div>
      </div>

      <p
        v-if="saving"
        class="text-muted-foreground mt-4 text-sm"
      >
        {{ $t('common.saving') }}
      </p>
    </aside>
  </div>
</template>
