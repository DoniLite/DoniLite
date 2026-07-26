<script setup lang="ts">
import {
  Archive,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  FilePenLine,
  Languages,
  Plus,
  Save,
  Star,
  Trash2,
  Upload
} from 'lucide-vue-next'
import { marked } from 'marked'
import Editor from '~/components/shared/Editor.vue'
import EntityCombobox from '~/components/shared/EntityCombobox.vue'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { seriesService } from '~/lib/service/series.service'
import { tagService } from '~/lib/service/tag.service'
import type {
  Article,
  ArticleLocale,
  ArticleResource,
  ArticleStatus,
  ArticleTranslationStatus
} from '~~/shared/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const route = useRoute()
const localePath = useLocalePath()
const router = useRouter()
const { t } = useI18n()
const articleId = computed(() => String(route.params.id))
const supportedLocales: ArticleLocale[] = ['en', 'fr']

const {
  data: article,
  refresh,
  pending
} = await useFetch<Article | null>(() => `/api/articles/${articleId.value}`, {
  default: () => null
})

if (!article.value) {
  throw createError({ statusCode: 404, message: 'Article not found' })
}

// Defaults to the article's own source locale, not the admin's own UI
// language — otherwise a French-language admin session lands on a "missing"
// FR tab for an English-sourced article (and vice versa) every time, showing
// the source-reference panel when there's nothing to reference against.
const activeLocale = ref<ArticleLocale>(article.value.sourceLocale)
const busy = ref(false)
const saveError = ref('')
const saveSuccess = ref(false)

const form = reactive<{
  title: string
  slug: string
  description: string
  seoTitle: string
  seoDescription: string
  content: string
  translationStatus: ArticleTranslationStatus
  resources: ArticleResource[]
}>({
  title: '',
  slug: '',
  description: '',
  seoTitle: '',
  seoDescription: '',
  content: '',
  translationStatus: 'reviewed',
  resources: []
})

const sourceTranslation = computed(() => {
  return (
    article.value?.translations.find(
      (translation) => translation.locale === article.value?.sourceLocale
    ) ?? article.value?.translations[0]
  )
})

const renderedSourceContent = computed(() => {
  const translation = sourceTranslation.value
  if (!translation) {
    return ''
  }
  return translation.contentFormat === 'html'
    ? translation.content
    : (marked(translation.content) as string)
})

const currentTranslation = computed(() => {
  return article.value?.translations.find(
    (translation) => translation.locale === activeLocale.value
  )
})

const workingTranslation = computed(() => currentTranslation.value ?? sourceTranslation.value)

const fillForm = () => {
  const translation = workingTranslation.value
  form.title = translation?.title ?? ''
  form.slug = translation?.slug ?? ''
  form.description = translation?.description ?? ''
  form.seoTitle = translation?.seoTitle ?? ''
  form.seoDescription = translation?.seoDescription ?? ''
  form.content = translation?.content ?? ''
  form.translationStatus = currentTranslation.value?.translationStatus ?? 'reviewed'
  form.resources = [...(translation?.resources ?? [])]
  saveSuccess.value = false
}

watch([article, activeLocale], fillForm, { immediate: true })

const getStatusVariant = (status: ArticleStatus) => {
  if (status === 'published') {
    return 'default'
  }
  if (status === 'archived') {
    return 'secondary'
  }
  return 'outline'
}

const getTranslationStatus = (targetLocale: ArticleLocale) => {
  return (
    article.value?.translations.find((translation) => translation.locale === targetLocale)
      ?.translationStatus ?? 'missing'
  )
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

const requestJson = async <T,>(url: string, options: RequestInit) => {
  const response = await fetch(url, {
    ...options,
    credentials: 'same-origin',
    headers: {
      'content-type': 'application/json',
      ...options.headers
    }
  })

  if (!response.ok) {
    throw new Error(await response.text())
  }

  return (await response.json()) as T
}

const runMutation = async (callback: () => Promise<unknown>, success = false) => {
  busy.value = true
  saveError.value = ''
  saveSuccess.value = false
  try {
    await callback()
    await refresh()
    saveSuccess.value = success
  } catch (error) {
    saveError.value = error instanceof Error ? error.message : 'Unable to update article'
  } finally {
    busy.value = false
  }
}

// Series & season assignment
const { data: seriesList, refresh: refreshSeries } = await seriesService.list()
const selectedSeriesId = ref(article.value.series?.id ?? '')
const selectedSeasonId = ref(article.value.season?.id ?? '')
const episodeNumber = ref<number | undefined>(article.value.episode ?? undefined)
const newSeriesTitle = ref('')
const newSeasonTitle = ref('')
const seriesBusy = ref(false)

const seasonsForSelectedSeries = computed(() => {
  return seriesList.value.find((series) => series.id === selectedSeriesId.value)?.seasons ?? []
})

watch(selectedSeriesId, () => {
  if (!seasonsForSelectedSeries.value.some((season) => season.id === selectedSeasonId.value)) {
    selectedSeasonId.value = ''
  }
})

const createSeries = async () => {
  if (!newSeriesTitle.value.trim()) {
    return
  }
  seriesBusy.value = true
  try {
    const created = await seriesService.createSeries({ title: newSeriesTitle.value.trim() })
    await refreshSeries()
    selectedSeriesId.value = created.id
    newSeriesTitle.value = ''
  } catch (error) {
    saveError.value = error instanceof Error ? error.message : 'Unable to create series'
  } finally {
    seriesBusy.value = false
  }
}

const createSeason = async () => {
  if (!newSeasonTitle.value.trim() || !selectedSeriesId.value) {
    return
  }
  seriesBusy.value = true
  try {
    const created = await seriesService.createSeason(selectedSeriesId.value, {
      title: newSeasonTitle.value.trim()
    })
    await refreshSeries()
    selectedSeasonId.value = created.id
    newSeasonTitle.value = ''
  } catch (error) {
    saveError.value = error instanceof Error ? error.message : 'Unable to create season'
  } finally {
    seriesBusy.value = false
  }
}

// Tags assignment
const { data: tags, refresh: refreshTags } = await tagService.list()
const tagEntries = computed(() => tags.value.map((tag) => ({ id: tag.id, label: tag.label })))
const selectedTagIds = ref<string[]>(article.value.tags?.map((tag) => tag.id) ?? [])
const newTagLabel = ref('')
const tagBusy = ref(false)

const createTag = async () => {
  if (!newTagLabel.value.trim()) {
    return
  }
  tagBusy.value = true
  try {
    const created = await tagService.createTag({ label: newTagLabel.value.trim() })
    await refreshTags()
    selectedTagIds.value = [...selectedTagIds.value, created.id]
    newTagLabel.value = ''
  } catch (error) {
    saveError.value = error instanceof Error ? error.message : 'Unable to create tag'
  } finally {
    tagBusy.value = false
  }
}

const saveTags = async () => {
  if (!article.value) {
    return
  }
  const id = article.value.id
  await runMutation(() =>
    requestJson<Article>('/api/articles/' + id, {
      method: 'PATCH',
      body: JSON.stringify({ tagIds: selectedTagIds.value })
    })
  )
}

const saveSeriesAssignment = async () => {
  if (!article.value) {
    return
  }
  const id = article.value.id
  await runMutation(() =>
    requestJson<Article>('/api/articles/' + id, {
      method: 'PATCH',
      body: JSON.stringify({
        seriesId: selectedSeriesId.value || null,
        seasonId: selectedSeasonId.value || null,
        episode: episodeNumber.value || null
      })
    })
  )
}

const createResource = (): ArticleResource => ({
  type: 'link',
  label: '',
  url: '',
  language: '',
  metadata: {}
})

const addResource = () => {
  form.resources.push(createResource())
}

const removeResource = (index: number) => {
  form.resources.splice(index, 1)
}

// Pasting a raw external URL was the only way to attach an image/file, and
// URLs that look valid but don't serve raw bytes (e.g. a GitHub "blob" file
// page instead of raw.githubusercontent.com) silently render nothing. A file
// picker sidesteps that whole class of mistake by embedding the file as a
// base64 data URI directly, the same approach the main content editor uses.
const resourceFileInput = useTemplateRef<HTMLInputElement>('resourceFileInput')
const pendingResourceIndex = ref<number | null>(null)

const triggerResourceUpload = (index: number) => {
  pendingResourceIndex.value = index
  resourceFileInput.value?.click()
}

const handleResourceFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  const index = pendingResourceIndex.value
  pendingResourceIndex.value = null
  if (!file || index === null) {
    return
  }

  const resource = form.resources[index]
  if (!resource) {
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    resource.url = e.target?.result as string
    if (!resource.label) {
      resource.label = file.name
    }
  }
  reader.readAsDataURL(file)
  target.value = ''
}

const insertResourceMarkup = (resource: ArticleResource) => {
  if (!resource.url && resource.type !== 'code') {
    return
  }

  const label = resource.label || resource.url || 'resource'
  const snippets: Record<ArticleResource['type'], string> = {
    image: `<figure><img src="${resource.url}" alt="${label}"><figcaption>${label}</figcaption></figure>`,
    youtube: `<iframe src="${resource.url}" title="${label}" allowfullscreen></iframe>`,
    link: `<a href="${resource.url}" target="_blank" rel="noopener noreferrer">${label}</a>`,
    file: `<a href="${resource.url}" target="_blank" rel="noopener noreferrer">${label}</a>`,
    code: `\n\`\`\`${resource.language ?? ''}\n${resource.label ?? ''}\n\`\`\`\n`
  }

  form.content = `${form.content}\n\n${snippets[resource.type]}`
}

const updateArticleStatus = async (status: ArticleStatus) => {
  if (!article.value) {
    return
  }

  const id = article.value.id
  const publishedAt = article.value.publishedAt
  await runMutation(() =>
    requestJson<Article>('/api/articles/' + id, {
      method: 'PATCH',
      body: JSON.stringify({
        status,
        publishedAt: status === 'published' ? new Date().toISOString() : publishedAt
      })
    })
  )
}

const setAsSourceLocale = async () => {
  if (!article.value || activeLocale.value === article.value.sourceLocale) {
    return
  }
  if (
    !confirm(
      t('admin.posts.actions.setAsSourceConfirm', { locale: activeLocale.value.toUpperCase() })
    )
  ) {
    return
  }

  const id = article.value.id
  await runMutation(() =>
    requestJson<Article>('/api/articles/' + id, {
      method: 'PATCH',
      body: JSON.stringify({ sourceLocale: activeLocale.value })
    })
  )
}

const deleteArticle = async () => {
  if (!article.value || article.value.status !== 'archived') {
    return
  }
  if (!confirm(t('admin.posts.actions.deleteConfirm'))) {
    return
  }

  const id = article.value.id
  busy.value = true
  saveError.value = ''
  try {
    await requestJson('/api/articles/' + id, { method: 'DELETE' })
    router.push(localePath('/dashboard/admin/posts'))
  } catch (error) {
    saveError.value = error instanceof Error ? error.message : 'Unable to delete article'
    busy.value = false
  }
}

const saveTranslation = async () => {
  if (!article.value) {
    return
  }

  const id = article.value.id
  await runMutation(
    () =>
      requestJson<Article>('/api/articles/' + id + '/translations', {
        method: 'PUT',
        body: JSON.stringify({
          locale: activeLocale.value,
          translationStatus: form.translationStatus,
          title: form.title,
          slug: form.slug,
          description: form.description,
          seoTitle: form.seoTitle || null,
          seoDescription: form.seoDescription || null,
          content: form.content,
          contentFormat: 'markdown',
          resources: form.resources.filter((resource) => resource.label || resource.url)
        })
      }),
    true
  )
}

const queueTranslation = async () => {
  if (!article.value) {
    return
  }

  const id = article.value.id
  const sourceLocale = article.value.sourceLocale
  await runMutation(() =>
    requestJson<Article>('/api/articles/' + id + '/translations/queue', {
      method: 'POST',
      body: JSON.stringify({
        targetLocale: activeLocale.value,
        sourceLocale
      })
    })
  )
}
</script>

<template>
  <div
    v-if="article"
    class="grid gap-6 p-4 xl:grid-cols-[minmax(0,1fr)_320px]"
  >
    <section class="min-w-0">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div class="min-w-0">
          <NuxtLink
            :to="localePath('/dashboard/admin/posts')"
            class="text-muted-foreground hover:text-foreground mb-2 inline-flex items-center gap-2 text-sm"
          >
            <ArrowLeft class="h-4 w-4" />
            {{ $t('admin.posts.editor.back') }}
          </NuxtLink>
          <h1 class="text-foreground truncate text-2xl font-bold">
            {{ workingTranslation?.title || $t('admin.posts.editor.untitled') }}
          </h1>
          <p class="text-muted-foreground text-sm">
            {{ $t('admin.posts.editor.description') }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <Badge :variant="getStatusVariant(article.status)">
            {{ $t(`admin.posts.status.${article.status}`) }}
          </Badge>
          <Badge variant="outline">
            {{ article.sourceLocale.toUpperCase() }}
            {{ $t('admin.posts.editor.sourceLocale') }}
          </Badge>
        </div>
      </div>

      <p
        v-if="saveError"
        class="border-destructive bg-destructive/10 text-destructive mb-4 rounded-md border p-3 text-sm"
      >
        {{ saveError }}
      </p>

      <p
        v-if="saveSuccess"
        class="border-primary bg-primary/10 text-primary mb-4 rounded-md border p-3 text-sm"
      >
        {{ $t('admin.posts.editor.saved') }}
      </p>

      <div class="mb-4 flex flex-wrap gap-2">
        <Button
          v-for="articleLocale in supportedLocales"
          :key="articleLocale"
          type="button"
          :variant="activeLocale === articleLocale ? 'default' : 'outline'"
          @click="activeLocale = articleLocale"
        >
          <Languages />
          {{ articleLocale.toUpperCase() }}
          <Badge
            class="ml-1"
            :variant="getTranslationVariant(getTranslationStatus(articleLocale))"
          >
            {{ $t(`admin.posts.translationStatus.${getTranslationStatus(articleLocale)}`) }}
          </Badge>
        </Button>
      </div>

      <form
        class="grid gap-4"
        @submit.prevent="saveTranslation"
      >
        <div class="grid gap-4 lg:grid-cols-2">
          <label class="grid gap-2 text-sm font-medium">
            {{ $t('admin.posts.editor.fields.title') }}
            <Input
              v-model="form.title"
              required
              :placeholder="$t('admin.posts.config.form.title.placeholder')"
            />
          </label>

          <label class="grid gap-2 text-sm font-medium">
            {{ $t('admin.posts.editor.fields.slug') }}
            <Input
              v-model="form.slug"
              required
              placeholder="article-slug"
            />
          </label>
        </div>

        <label class="grid gap-2 text-sm font-medium">
          {{ $t('admin.posts.editor.fields.description') }}
          <Textarea
            v-model="form.description"
            required
            class="min-h-24"
            :placeholder="$t('admin.posts.config.form.description.placeholder')"
          />
        </label>

        <div class="grid gap-4 lg:grid-cols-2">
          <label class="grid gap-2 text-sm font-medium">
            {{ $t('admin.posts.editor.fields.seoTitle') }}
            <Input v-model="form.seoTitle" />
          </label>

          <label class="grid gap-2 text-sm font-medium">
            {{ $t('admin.posts.editor.fields.seoDescription') }}
            <Input v-model="form.seoDescription" />
          </label>
        </div>

        <label class="grid gap-2 text-sm font-medium lg:max-w-xs">
          {{ $t('admin.posts.editor.fields.translationStatus') }}
          <select
            v-model="form.translationStatus"
            class="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
          >
            <option value="queued">
              {{ $t('admin.posts.translationStatus.queued') }}
            </option>
            <option value="generated">
              {{ $t('admin.posts.translationStatus.generated') }}
            </option>
            <option value="reviewed">
              {{ $t('admin.posts.translationStatus.reviewed') }}
            </option>
            <option value="published">
              {{ $t('admin.posts.translationStatus.published') }}
            </option>
          </select>
        </label>

        <section
          v-if="sourceTranslation && activeLocale !== article.sourceLocale"
          class="border-border bg-muted/40 grid gap-2 rounded-md border p-4"
        >
          <h2 class="text-muted-foreground text-sm font-semibold">
            {{ $t('admin.posts.editor.sourceReference') }} ({{
              article.sourceLocale.toUpperCase()
            }})
          </h2>
          <p class="text-foreground text-sm font-medium">{{ sourceTranslation.title }}</p>
          <p class="text-muted-foreground text-sm">{{ sourceTranslation.description }}</p>
          <details class="text-muted-foreground text-sm">
            <summary class="cursor-pointer select-none">
              {{ $t('admin.posts.editor.fields.content') }}
            </summary>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div
              class="prose prose-sm dark:prose-invert mt-2 max-w-none"
              v-html="renderedSourceContent"
            />
          </details>
        </section>

        <label class="grid gap-2 text-sm font-medium">
          {{ $t('admin.posts.editor.fields.content') }}
          <ClientOnly>
            <Editor
              :key="activeLocale"
              v-model="form.content"
              class="min-h-105"
            />
            <template #fallback>
              <div class="border-border text-muted-foreground rounded-md border p-4 text-sm">
                {{ $t('common.loading') }}
              </div>
            </template>
          </ClientOnly>
        </label>

        <section class="border-border bg-card rounded-md border p-4">
          <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 class="text-lg font-semibold">
                {{ $t('admin.posts.editor.resources.title') }}
              </h2>
              <p class="text-muted-foreground text-sm">
                {{ $t('admin.posts.editor.resources.description') }}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              @click="addResource"
            >
              <Plus />
              {{ $t('admin.posts.editor.resources.add') }}
            </Button>
          </div>

          <div class="grid gap-3">
            <article
              v-for="(resource, index) in form.resources"
              :key="index"
              class="border-border grid gap-3 rounded-md border p-3"
            >
              <div class="grid gap-3 lg:grid-cols-[140px_minmax(0,1fr)]">
                <label class="grid gap-2 text-sm font-medium">
                  {{ $t('admin.posts.editor.resources.type') }}
                  <select
                    v-model="resource.type"
                    class="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
                  >
                    <option value="image">
                      {{ $t('admin.posts.editor.resources.types.image') }}
                    </option>
                    <option value="youtube">
                      {{ $t('admin.posts.editor.resources.types.youtube') }}
                    </option>
                    <option value="link">
                      {{ $t('admin.posts.editor.resources.types.link') }}
                    </option>
                    <option value="code">
                      {{ $t('admin.posts.editor.resources.types.code') }}
                    </option>
                    <option value="file">
                      {{ $t('admin.posts.editor.resources.types.file') }}
                    </option>
                  </select>
                </label>

                <label class="grid gap-2 text-sm font-medium">
                  {{ $t('admin.posts.editor.resources.label') }}
                  <Input v-model="resource.label" />
                </label>
              </div>

              <div class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_160px]">
                <label class="grid gap-2 text-sm font-medium">
                  {{ $t('admin.posts.editor.resources.url') }}
                  <div class="flex gap-2">
                    <Input
                      v-model="resource.url"
                      class="min-w-0"
                    />
                    <Button
                      v-if="resource.type === 'image' || resource.type === 'file'"
                      type="button"
                      size="sm"
                      variant="outline"
                      class="shrink-0"
                      @click="triggerResourceUpload(index)"
                    >
                      <Upload class="h-4 w-4" />
                      {{ $t('common.upload') }}
                    </Button>
                  </div>
                </label>

                <label class="grid gap-2 text-sm font-medium">
                  {{ $t('admin.posts.editor.resources.language') }}
                  <Input
                    v-model="resource.language"
                    placeholder="ts"
                  />
                </label>
              </div>

              <div class="flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  @click="insertResourceMarkup(resource)"
                >
                  {{ $t('admin.posts.editor.resources.insert') }}
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  @click="removeResource(index)"
                >
                  <Trash2 />
                  {{ $t('common.remove') }}
                </Button>
              </div>
            </article>

            <p
              v-if="form.resources.length === 0"
              class="border-border text-muted-foreground rounded-md border border-dashed p-4 text-center text-sm"
            >
              {{ $t('admin.posts.editor.resources.empty') }}
            </p>
          </div>

          <input
            ref="resourceFileInput"
            type="file"
            accept="image/*,video/*"
            class="hidden"
            @change="handleResourceFileUpload"
          />
        </section>

        <div class="flex flex-wrap gap-2">
          <Button
            type="submit"
            :disabled="busy || pending"
          >
            <Save />
            {{ $t('admin.posts.editor.actions.saveTranslation') }}
          </Button>

          <Button
            type="button"
            variant="outline"
            :disabled="busy || pending"
            @click="queueTranslation"
          >
            <Languages />
            {{
              $t('admin.posts.actions.prepareTranslation', {
                locale: activeLocale.toUpperCase()
              })
            }}
          </Button>
        </div>
      </form>
    </section>

    <aside class="grid h-fit gap-4">
      <section class="border-border bg-card rounded-md border p-4">
        <h2 class="mb-3 text-lg font-semibold">
          {{ $t('admin.posts.editor.actions.title') }}
        </h2>

        <div class="grid gap-2">
          <Button
            v-if="article.status !== 'published'"
            :disabled="busy"
            @click="updateArticleStatus('published')"
          >
            <CheckCircle2 />
            {{ $t('admin.posts.actions.publish') }}
          </Button>

          <Button
            v-if="article.status !== 'draft'"
            variant="outline"
            :disabled="busy"
            @click="updateArticleStatus('draft')"
          >
            <FilePenLine />
            {{ $t('admin.posts.actions.draft') }}
          </Button>

          <Button
            v-if="article.status !== 'archived'"
            variant="outline"
            :disabled="busy"
            @click="updateArticleStatus('archived')"
          >
            <Archive />
            {{ $t('admin.posts.actions.archive') }}
          </Button>

          <Button
            v-else
            variant="destructive"
            :disabled="busy"
            @click="deleteArticle"
          >
            <Trash2 />
            {{ $t('admin.posts.actions.delete') }}
          </Button>

          <Button
            v-if="activeLocale !== article.sourceLocale"
            variant="outline"
            :disabled="busy"
            @click="setAsSourceLocale"
          >
            <Star />
            {{ $t('admin.posts.actions.setAsSource', { locale: activeLocale.toUpperCase() }) }}
          </Button>

          <NuxtLink
            :to="
              localePath(
                `/blog/${articleId}${workingTranslation?.slug ? `/${workingTranslation.slug}` : ''}`
              )
            "
            class="border-border hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors"
          >
            <ArrowUpRight class="h-4 w-4" />
            {{ $t('admin.posts.editor.actions.publicPreview') }}
          </NuxtLink>
        </div>
      </section>

      <section class="border-border bg-card rounded-md border p-4">
        <h2 class="mb-3 text-lg font-semibold">
          {{ $t('admin.posts.editor.translations') }}
        </h2>

        <div class="grid gap-2">
          <button
            v-for="articleLocale in supportedLocales"
            :key="`aside-${articleLocale}`"
            type="button"
            class="border-border hover:bg-accent flex items-center justify-between gap-2 rounded-md border p-3 text-left text-sm"
            @click="activeLocale = articleLocale"
          >
            <span class="font-medium">{{ articleLocale.toUpperCase() }}</span>
            <Badge :variant="getTranslationVariant(getTranslationStatus(articleLocale))">
              {{ $t(`admin.posts.translationStatus.${getTranslationStatus(articleLocale)}`) }}
            </Badge>
          </button>
        </div>
      </section>

      <section class="border-border bg-card rounded-md border p-4">
        <h2 class="mb-3 text-lg font-semibold">
          {{ $t('admin.posts.config.form.topic.label') }}
        </h2>

        <div class="grid gap-3">
          <EntityCombobox
            v-model="selectedTagIds"
            :multiple="true"
            :placeholder="$t('admin.posts.config.form.topic.placeholder')"
            :entries="tagEntries"
            class="w-full"
          />
          <div class="flex gap-2">
            <Input
              v-model="newTagLabel"
              :placeholder="$t('admin.posts.config.form.topic.newTagPlaceholder')"
              class="h-9"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              :disabled="tagBusy || !newTagLabel.trim()"
              @click="createTag"
            >
              <Plus class="h-4 w-4" />
            </Button>
          </div>
          <Button
            type="button"
            size="sm"
            :disabled="busy"
            @click="saveTags"
          >
            <Save class="h-4 w-4" />
            {{ $t('common.save') }}
          </Button>
        </div>
      </section>

      <section class="border-border bg-card rounded-md border p-4">
        <h2 class="mb-3 text-lg font-semibold">
          {{ $t('admin.posts.series.title') }}
        </h2>

        <div class="grid gap-3">
          <label class="grid gap-2 text-sm font-medium">
            {{ $t('admin.posts.series.series') }}
            <select
              v-model="selectedSeriesId"
              class="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
            >
              <option value="">{{ $t('admin.posts.series.none') }}</option>
              <option
                v-for="series in seriesList"
                :key="series.id"
                :value="series.id"
              >
                {{ series.title }}
              </option>
            </select>
          </label>

          <div class="flex gap-2">
            <Input
              v-model="newSeriesTitle"
              :placeholder="$t('admin.posts.series.newSeriesPlaceholder')"
              class="h-9"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              :disabled="seriesBusy || !newSeriesTitle.trim()"
              @click="createSeries"
            >
              <Plus class="h-4 w-4" />
            </Button>
          </div>

          <label
            v-if="selectedSeriesId"
            class="grid gap-2 text-sm font-medium"
          >
            {{ $t('admin.posts.series.season') }}
            <select
              v-model="selectedSeasonId"
              class="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
            >
              <option value="">{{ $t('admin.posts.series.none') }}</option>
              <option
                v-for="season in seasonsForSelectedSeries"
                :key="season.id"
                :value="season.id"
              >
                {{ season.title }}
              </option>
            </select>
          </label>

          <div
            v-if="selectedSeriesId"
            class="flex gap-2"
          >
            <Input
              v-model="newSeasonTitle"
              :placeholder="$t('admin.posts.series.newSeasonPlaceholder')"
              class="h-9"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              :disabled="seriesBusy || !newSeasonTitle.trim()"
              @click="createSeason"
            >
              <Plus class="h-4 w-4" />
            </Button>
          </div>

          <label
            v-if="selectedSeasonId"
            class="grid gap-2 text-sm font-medium"
          >
            {{ $t('admin.posts.series.episode') }}
            <Input
              v-model.number="episodeNumber"
              type="number"
              min="1"
              class="h-9"
            />
          </label>

          <Button
            type="button"
            size="sm"
            :disabled="busy"
            @click="saveSeriesAssignment"
          >
            <Save class="h-4 w-4" />
            {{ $t('common.save') }}
          </Button>
        </div>
      </section>
    </aside>
  </div>
</template>
