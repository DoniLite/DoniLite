<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="bg-card flex h-full flex-col rounded-lg shadow-lg">
    <!-- Toolbar -->
    <div
      class="border-border bg-primary/10 flex flex-wrap items-center gap-2 rounded-md border-b p-4"
    >
      <!-- Format buttons -->
      <div class="flex items-center gap-1">
        <button
          :class="[editor?.isActive('bold') ? activeClass : '', baseClass]"
          @click="editor?.chain().focus().toggleBold().run()"
        >
          <Bold :class="iconClass" />
        </button>
        <button
          :class="[editor?.isActive('italic') ? activeClass : '', baseClass]"
          @click="editor?.chain().focus().toggleItalic().run()"
        >
          <Italic :class="iconClass" />
        </button>
        <button
          :class="[editor?.isActive('strike') ? activeClass : '', baseClass]"
          @click="editor?.chain().focus().toggleStrike().run()"
        >
          <Strikethrough :class="iconClass" />
        </button>
      </div>

      <div class="bg-foreground h-6 w-px"></div>

      <!-- Heading buttons -->
      <div class="flex items-center gap-1">
        <button
          :class="[editor?.isActive('heading', { level: 1 }) ? activeClass : '', baseClass]"
          @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
        >
          {{ 'H1' }}
        </button>
        <button
          :class="[editor?.isActive('heading', { level: 2 }) ? activeClass : '', baseClass]"
          @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
        >
          {{ 'H2' }}
        </button>
        <button
          :class="[editor?.isActive('heading', { level: 3 }) ? activeClass : '', baseClass]"
          @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
        >
          {{ 'H3' }}
        </button>
      </div>

      <div class="h-6 w-px bg-gray-300"></div>

      <!-- List buttons -->
      <div class="flex items-center gap-1">
        <button
          :class="[editor?.isActive('bulletList') ? activeClass : '', baseClass]"
          @click="editor?.chain().focus().toggleBulletList().run()"
        >
          <ListIcon :class="iconClass" />
        </button>
        <button
          :class="[editor?.isActive('orderedList') ? activeClass : '', baseClass]"
          @click="editor?.chain().focus().toggleOrderedList().run()"
        >
          <ListOrdered :class="iconClass" />
        </button>
        <button
          :class="[editor?.isActive('blockquote') ? activeClass : '', baseClass]"
          @click="editor?.chain().focus().toggleBlockquote().run()"
        >
          <Quote :class="iconClass" />
        </button>
      </div>

      <div class="h-6 w-px bg-gray-300"></div>

      <!-- Media buttons -->
      <div class="flex items-center gap-1">
        <button
          :class="baseClass"
          @click="addImage"
        >
          <ImageIcon :class="iconClass" />
        </button>
        <button
          :class="baseClass"
          @click="addVideo"
        >
          <VideoIcon :class="iconClass" />
        </button>
        <button
          :class="baseClass"
          @click="addLink"
        >
          <LinkIcon :class="iconClass" />
        </button>
      </div>

      <div class="h-6 w-px bg-gray-300"></div>

      <!-- Mode toggle -->
      <div class="flex items-center gap-1">
        <button
          :class="[mode === 'editor' ? activeClass : '', baseClass]"
          @click="mode = 'editor'"
        >
          {{ $t('editor.actions.editor') }}
        </button>
        <button
          :class="[mode === 'markdown' ? activeClass : '', baseClass]"
          @click="mode = 'markdown'"
        >
          {{ $t('editor.actions.markdown') }}
        </button>
        <button
          :class="[mode === 'preview' ? activeClass : '', baseClass]"
          @click="mode = 'preview'"
        >
          {{ $t('editor.actions.preview') }}
        </button>
      </div>
    </div>

    <!-- Content area -->
    <div class="flex h-[700px] overflow-y-auto">
      <!-- Editor mode -->
      <EditorContent
        v-if="mode === 'editor'"
        :editor="editor"
      />

      <!-- Markdown mode -->
      <div
        v-if="mode === 'markdown'"
        class="flex-1 p-4"
      >
        <textarea
          v-model="markdownContent"
          class="h-full w-full resize-none border-0 font-mono text-sm focus:outline-none"
          :placeholder="$t('editor.placeholder')"
          @input="onMarkdownChange"
        />
      </div>

      <!-- Preview mode -->
      <div
        v-if="mode === 'preview'"
        class="prose prose-sm max-w-none flex-1 overflow-auto p-4"
        v-html="htmlContent"
      ></div>
    </div>

    <!-- File input (hidden) -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*,video/*"
      class="hidden"
      @change="handleFileUpload"
    />

    <!-- Status bar -->
    <div
      class="border-border bg-muted text-muted-foreground flex items-center justify-between rounded-md border-t p-2 text-xs"
    >
      <span>
        {{ $t('editor.word', { count: characterCount }) }}
      </span>
      <span v-if="fileSizeTotal > 0">
        {{ $t('editor.total_file_size', { size: formatFileSize(fileSizeTotal) }) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import {
  Bold,
  ImageIcon,
  Italic,
  LinkIcon,
  ListIcon,
  ListOrdered,
  Quote,
  Strikethrough,
  VideoIcon
} from 'lucide-vue-next'
import { marked } from 'marked'
import TurndownService from 'turndown'
import { toast } from 'vue-sonner'

const activeClass = 'bg-primary text-primary-foreground'
const baseClass =
  'hover:bg-primary/90 hover:text-primary-foreground text-sm rounded px-3 py-1 transition-colors cursor-pointer'
const iconClass = 'h-6 w-4'

interface Props {
  modelValue?: string
  maxFileSize?: number // en MB
  maxTotalSize?: number // en MB
}

interface Emits {
  (e: 'update:modelValue' | 'change', value: string): void
}

const { t } = useI18n()

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  maxFileSize: 5,
  maxTotalSize: 20
})

const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement>()
const mode = ref<'editor' | 'markdown' | 'preview'>('editor')
const markdownContent = ref('')
const htmlContent = ref('')
const fileSizeTotal = ref(0)
const pendingFileType = ref<'image' | 'video' | null>(null)

// Initialize Turndown for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
})

// Configure marked for Markdown to HTML conversion
marked.setOptions({
  breaks: true,
  gfm: true
})

// Initialize TipTap editor
const editor = useEditor({
  extensions: [
    StarterKit,
    Image.configure({
      allowBase64: true,
      inline: true,
      HTMLAttributes: {
        class: 'max-w-full h-auto rounded-lg'
      }
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-blue-600 hover:text-blue-800 underline'
      }
    })
  ],
  content: props.modelValue,
  editorProps: {
    attributes: {
      class: 'prose p-4 prose-sm max-w-none focus:outline-none'
    }
  },
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()
    emit('update:modelValue', html)
    emit('change', html)
    updateMarkdownFromHtml(html)
    calculateFileSize(html)
  }
})

// Character count
const characterCount = computed(() => {
  return editor.value?.getCharacterCount() || 0
})

// Convert HTML to Markdown
const updateMarkdownFromHtml = (html: string) => {
  if (mode.value !== 'markdown') {
    markdownContent.value = turndownService.turndown(html)
  }
}

// Convert Markdown to HTML and update editor
const onMarkdownChange = () => {
  const html = marked(markdownContent.value) as string
  htmlContent.value = html
  if (editor.value && mode.value === 'markdown') {
    editor.value.commands.setContent(html)
  }
}

// Calculate total file size from base64 images/videos
const calculateFileSize = (html: string) => {
  const base64Regex = /data:(?:image|video)\/[^;]+;base64,([A-Za-z0-9+/=]+)/g
  let totalSize = 0
  let match

  while ((match = base64Regex.exec(html)) !== null) {
    // Approximate size calculation for base64
    const base64Length = match[1].length
    const sizeInBytes = (base64Length * 3) / 4
    totalSize += sizeInBytes
  }

  fileSizeTotal.value = totalSize
}

// Format file size for display
const formatFileSize = (bytes: number): string => {
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(2)} MB`
}

// File upload handler
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) {
    return
  }

  // Check file size
  const fileSizeMB = file.size / (1024 * 1024)
  if (fileSizeMB > props.maxFileSize) {
    toast.error(t('editor.toast.warning.file_size', { size: props.maxFileSize }))
    return
  }

  // Check total size
  const newTotalSize = fileSizeTotal.value + file.size
  const newTotalSizeMB = newTotalSize / (1024 * 1024)
  if (newTotalSizeMB > props.maxTotalSize) {
    toast.error(t('editor.toast.warning.max_file_size', { size: props.maxTotalSize }))
    return
  }

  // Convert to base64
  const reader = new FileReader()
  reader.onload = (e) => {
    const base64 = e.target?.result as string

    if (pendingFileType.value === 'image') {
      editor.value?.chain().focus().setImage({ src: base64 }).run()
    } else if (pendingFileType.value === 'video') {
      const videoHtml = `<video controls class="h-auto rounded-lg"><source src="${base64}" type="${file.type}"></video>`
      editor.value?.chain().focus().insertContent(videoHtml).run()
    }
  }

  reader.readAsDataURL(file)
  target.value = '' // Reset input
}

// Media insertion functions
const addImage = () => {
  pendingFileType.value = 'image'
  fileInput.value?.click()
}

const addVideo = () => {
  pendingFileType.value = 'video'
  fileInput.value?.click()
}

const addLink = () => {
  const url = prompt('URL du lien:')
  if (url) {
    editor.value?.chain().focus().setLink({ href: url }).run()
  }
}

// Watch for external content changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (editor.value && newValue !== editor.value.getHTML()) {
      editor.value.commands.setContent(newValue)
      updateMarkdownFromHtml(newValue)
      calculateFileSize(newValue)
    }
  }
)

// Watch mode changes
watch(mode, (newMode) => {
  if (newMode === 'preview') {
    htmlContent.value = editor.value?.getHTML() || ''
  } else if (newMode === 'markdown') {
    markdownContent.value = turndownService.turndown(editor.value?.getHTML() || '')
  }
})

// Initialize content on mount
onMounted(() => {
  if (props.modelValue) {
    updateMarkdownFromHtml(props.modelValue)
    calculateFileSize(props.modelValue)
  }
})

// Cleanup
onBeforeUnmount(() => {
  editor.value?.destroy()
})

// Expose methods for parent component
defineExpose({
  getHTML: () => editor.value?.getHTML() || '',
  getMarkdown: () => markdownContent.value,
  setContent: (content: string) => {
    editor.value?.commands.setContent(content)
    updateMarkdownFromHtml(content)
    calculateFileSize(content)
  },
  focus: () => editor.value?.commands.focus(),
  clear: () => {
    editor.value?.commands.clearContent()
    markdownContent.value = ''
    htmlContent.value = ''
    fileSizeTotal.value = 0
  }
})
</script>
