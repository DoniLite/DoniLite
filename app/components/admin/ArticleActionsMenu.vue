<script setup lang="ts">
import { ArrowUpRight, Ellipsis, FilePenLine } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import type { Article, ArticleLocale } from '~~/shared/types'

defineProps<{
  article: Article
  busy: boolean
  missingLocales: ArticleLocale[]
}>()

const emit = defineEmits<{
  publish: []
  draft: []
  archive: []
  delete: []
  translate: [locale: ArticleLocale]
}>()

const { t } = useI18n()
const localePath = useLocalePath()

const confirmDelete = () => {
  if (confirm(t('admin.posts.actions.deleteConfirm'))) {
    emit('delete')
  }
}

// Decorative only — the actual lookup is always by article.id (see
// app/pages/blog/[id]/[[slug]].vue). Just makes the preview link's URL
// readable instead of a bare id.
const previewSlug = (article: Article) => {
  const translation =
    article.translations.find((t) => t.locale === article.sourceLocale) ?? article.translations[0]
  return translation?.slug
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger
      :disabled="busy"
      class="hover:bg-muted rounded-md p-1.5"
    >
      <Ellipsis class="h-4 w-4" />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem as-child>
        <NuxtLink :to="localePath(`/dashboard/admin/posts/${article.id}`)">
          <FilePenLine class="mr-2 h-3.5 w-3.5" />
          {{ $t('admin.posts.actions.edit') }}
        </NuxtLink>
      </DropdownMenuItem>
      <DropdownMenuItem as-child>
        <NuxtLink
          :to="
            localePath(
              `/blog/${article.id}${previewSlug(article) ? `/${previewSlug(article)}` : ''}`
            )
          "
        >
          <ArrowUpRight class="mr-2 h-3.5 w-3.5" />
          {{ $t('admin.posts.actions.open') }}
        </NuxtLink>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        v-if="article.status !== 'published'"
        @click="emit('publish')"
      >
        {{ $t('admin.posts.actions.publish') }}
      </DropdownMenuItem>
      <DropdownMenuItem
        v-if="article.status !== 'draft'"
        @click="emit('draft')"
      >
        {{ $t('admin.posts.actions.draft') }}
      </DropdownMenuItem>
      <DropdownMenuItem
        v-if="article.status !== 'archived'"
        @click="emit('archive')"
      >
        {{ $t('admin.posts.actions.archive') }}
      </DropdownMenuItem>
      <DropdownMenuItem
        v-else
        variant="destructive"
        @click="confirmDelete"
      >
        {{ $t('admin.posts.actions.delete') }}
      </DropdownMenuItem>
      <template
        v-for="targetLocale in missingLocales"
        :key="targetLocale"
      >
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="emit('translate', targetLocale)">
          {{ $t('admin.posts.actions.prepareTranslation', { locale: targetLocale.toUpperCase() }) }}
        </DropdownMenuItem>
      </template>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
