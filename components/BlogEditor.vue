<template>
  <div class="container mx-auto min-h-screen p-6">
    <Sheet v-model:open="openSettings">
      <SheetContent class="w-full overflow-auto p-2 lg:min-w-[30%] lg:p-4">
        <SheetHeader>
          <SheetTitle>
            {{ $t('admin.posts.config.title') }}
          </SheetTitle>
        </SheetHeader>

        <Tabs default-value="form-tabs">
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger
              v-for="tab in availableTabs"
              :key="tab"
              :value="tab"
            >
              {{ $t(`admin.posts.config.tabs.${tab}`) }}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form-tabs">
            <Card>
              <ArticleConfig ref="articleConfigRef" />
            </Card>
          </TabsContent>
        </Tabs>
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
        @blur="articleTitle = articleTitleHTML?.innerText ?? ''"
      >
        {{ articleTitle }}
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
import ArticleConfig from './admin/ArticleConfig.vue'
import type { ArticleConfig as Config } from './shared/types'

const { user, refreshSession } = useSession()

interface Props {
  content?: string
  config?: Partial<Config>
}

interface Emits {
  'content:change': [content: string]
  'content:update': [content: string]
  save: [content: string]
  'save:html': [content: string]
  'save:markdown': [content: string]
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  config: () => ({})
})

const emits = defineEmits<Emits>()
const articleConfigRef = useTemplateRef('articleConfigRef')
const availableTabs = ref<string[]>(['form-tabs', 'extra-tabs'])
const openSettings = ref(false)
const articleContent = ref(props.content)
const savedContent = ref('')
const articleTitle = ref(props.config.title)
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
  if (editorRef.value) {
    emits('save:html', editorRef.value.getHTML())
    emits('save:markdown', editorRef.value.getMarkdown())
  }
}

const clearContent = () => {
  articleContent.value = ''
  savedContent.value = ''
  if (editorRef.value) {
    editorRef.value.clear()
  }
}

const exportMarkdown = () => {
  if (editorRef.value) {
    const markdown = editorRef.value.getMarkdown()
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'content.md'
    a.click()
    URL.revokeObjectURL(url)
  }
}

const exportHTML = () => {
  if (editorRef.value) {
    const markdown = editorRef.value.getHTML()
    const blob = new Blob([markdown], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'content.html'
    a.click()
    URL.revokeObjectURL(url)
  }
}

onMounted(async () => {
  await refreshSession()
})

onUnmounted(() => {
  clearContent()
})
</script>
