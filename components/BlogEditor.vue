<template>
  <div class="container mx-auto min-h-screen p-6">
    <div class="mb-6 flex w-full items-center justify-between">
      <div class="flex gap-2">
        <h1 class="text-3xl font-bold">
          {{ $t('editor.welcome') }}
        </h1>
        <Settings2 class="text-primary h-8 w-8" />
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
import Editor from '~/components/admin/Editor.vue'

const { t } = useI18n()
const { user, refreshSession } = useSession()

interface Props {
  content?: string
  title?: string
}

interface Emits {
  'content:change': [content: string]
  'content:update': [content: string]
  save: [content: string]
  'save:html': [content: string]
  'save:markdown': [content: string]
}

const props = withDefaults(defineProps<Props>(), {
  content: t('editor.first_content'),
  title: t('editor.first_title')
})

const emits = defineEmits<Emits>()

const articleContent = ref(props.content)
const savedContent = ref('')
const articleTitle = ref(props.title)
const editorRef = useTemplateRef('editorRef')
const articleTitleHTML = useTemplateRef('articleTitleHTML')

const onArticleChange = (content: string) => {
  emits('content:change', content)
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
