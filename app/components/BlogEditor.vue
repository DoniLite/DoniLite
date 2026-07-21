<template>
  <div class="container mx-auto min-h-screen p-6">
    <Sheet v-model:open="openSettings">
      <SheetContent class="w-full overflow-auto p-2 lg:min-w-[30%] lg:p-4">
        <SheetHeader>
          <SheetTitle>
            {{ $t('admin.posts.config.title') }}
          </SheetTitle>
        </SheetHeader>

        <Card>
          <ArticleConfig v-model="articleConfig" />
        </Card>
      </SheetContent>
    </Sheet>
    <div class="mb-6 flex w-full items-center justify-between">
      <div class="flex items-center gap-2">
        <h1 class="text-xl font-bold lg:text-3xl">
          {{ $t('editor.welcome') }}
        </h1>
        <Settings2
          class="text-primary h-8 w-8 cursor-pointer"
          @click="toggleSettings"
        />
      </div>
      <div>
        <Save
          v-if="user && user.loggedIn"
          class="text-primary h-8 w-8"
          @click="saveContent"
        />
        <CloudDownload
          v-else
          class="text-primary h-8 w-8"
        />
      </div>
    </div>

    <div class="mb-8">
      <h2
        ref="articleTitleHTML"
        class="mb-4 w-[70%] p-1 text-xl font-semibold"
        contenteditable="true"
        @blur="articleConfig.title = articleTitleHTML?.innerText ?? ''"
      >
        {{ articleConfig.title }}
      </h2>
      <div>
        <ClientOnly fallback="...Loading">
          <Editor
            ref="editorRef"
            v-model="articleContent"
            :max-file-size="5"
            :max-total-size="20"
            @change="onArticleChange"
            @update:model-value="$emit('content:update', $event)"
          />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CloudDownload, Save, Settings2 } from 'lucide-vue-next'
import Editor from '~/components/shared/Editor.vue'
import { Card } from '~/components/ui/card'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet'
import ArticleConfig from './admin/ArticleConfig.vue'
import type { ArticleConfig as Config } from './shared/types'

const { user, refreshSession } = useSession()

interface Props {
  content?: string
  config?: Partial<Config>
}

type ArticleSavePayload = {
  title: string
  content: string
  config?: Config
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  config: () => ({})
})

const emits = defineEmits<{
  'content:change': [content: string]
  'content:update': [content: string]
  save: [content: string]
  'save:article': [article: ArticleSavePayload]
  'save:html': [content: string]
  'save:markdown': [content: string]
}>()

const defaultArticleConfig = (): Config => ({
  title: props.config.title ?? '',
  description: props.config.description ?? '',
  slugs: props.config.slugs ?? [],
  tagIds: props.config.tagIds ?? [],
  sourceLocale: props.config.sourceLocale ?? 'en'
})

// Owned here (not inside ArticleConfig) so it survives the settings Sheet
// unmounting/remounting when closed and reopened.
const articleConfig = ref<Config>(defaultArticleConfig())
const openSettings = ref(false)
const articleContent = ref(props.content)
const savedContent = ref('')
const editorRef = useTemplateRef('editorRef')
const articleTitleHTML = useTemplateRef('articleTitleHTML')

const onArticleChange = (content: string) => {
  emits('content:change', content)
}

const toggleSettings = () => {
  openSettings.value = !openSettings.value
}

const saveContent = () => {
  savedContent.value = articleContent.value
  emits('save', savedContent.value)
  emits('save:article', {
    title: articleConfig.value.title,
    content: savedContent.value,
    config: articleConfig.value
  })
  if (editorRef.value) {
    emits('save:html', editorRef.value.getHTML())
    emits('save:markdown', editorRef.value.getMarkdown())
  }
}

const clearContent = () => {
  articleContent.value = ''
  savedContent.value = ''
  articleConfig.value = defaultArticleConfig()
  if (editorRef.value) {
    editorRef.value.clear()
  }
}

onMounted(async () => {
  await refreshSession()
})

onUnmounted(() => {
  clearContent()
})
</script>
