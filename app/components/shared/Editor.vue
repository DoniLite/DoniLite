<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="bg-card flex h-full flex-col rounded-lg shadow-lg">
    <!-- Toolbar -->
    <div
      class="border-border bg-primary/10 flex flex-wrap items-center gap-2 rounded-md border-b p-4"
    >
      <template v-if="mode === 'editor'">
        <!-- Undo/Redo -->
        <div class="flex items-center gap-1">
          <button
            :class="baseClass"
            :disabled="!editor?.can().undo()"
            @click="editor?.chain().focus().undo().run()"
          >
            <Undo2 :class="iconClass" />
          </button>
          <button
            :class="baseClass"
            :disabled="!editor?.can().redo()"
            @click="editor?.chain().focus().redo().run()"
          >
            <Redo2 :class="iconClass" />
          </button>
        </div>

        <div class="bg-foreground h-6 w-px"></div>

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
            :class="[editor?.isActive('underline') ? activeClass : '', baseClass]"
            @click="editor?.chain().focus().toggleUnderline().run()"
          >
            <UnderlineIcon :class="iconClass" />
          </button>
          <button
            :class="[editor?.isActive('strike') ? activeClass : '', baseClass]"
            @click="editor?.chain().focus().toggleStrike().run()"
          >
            <Strikethrough :class="iconClass" />
          </button>
          <button
            :class="[editor?.isActive('highlight') ? activeClass : '', baseClass]"
            @click="editor?.chain().focus().toggleHighlight().run()"
          >
            <Highlighter :class="iconClass" />
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

        <!-- Alignment buttons -->
        <div class="flex items-center gap-1">
          <button
            :class="[editor?.isActive({ textAlign: 'left' }) ? activeClass : '', baseClass]"
            @click="editor?.chain().focus().setTextAlign('left').run()"
          >
            <AlignLeft :class="iconClass" />
          </button>
          <button
            :class="[editor?.isActive({ textAlign: 'center' }) ? activeClass : '', baseClass]"
            @click="editor?.chain().focus().setTextAlign('center').run()"
          >
            <AlignCenter :class="iconClass" />
          </button>
          <button
            :class="[editor?.isActive({ textAlign: 'right' }) ? activeClass : '', baseClass]"
            @click="editor?.chain().focus().setTextAlign('right').run()"
          >
            <AlignRight :class="iconClass" />
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
            :class="[editor?.isActive('taskList') ? activeClass : '', baseClass]"
            @click="editor?.chain().focus().toggleTaskList().run()"
          >
            <ListTodo :class="iconClass" />
          </button>
          <button
            :class="[editor?.isActive('blockquote') ? activeClass : '', baseClass]"
            @click="editor?.chain().focus().toggleBlockquote().run()"
          >
            <Quote :class="iconClass" />
          </button>
          <button
            :class="[editor?.isActive('codeBlock') ? activeClass : '', baseClass]"
            @click="editor?.chain().focus().toggleCodeBlock().run()"
          >
            <Code2 :class="iconClass" />
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
          <button
            :class="baseClass"
            @click="insertTable"
          >
            <TableIcon :class="iconClass" />
          </button>
        </div>

        <div class="h-6 w-px bg-gray-300"></div>
      </template>

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
    <div class="flex h-175 overflow-y-auto">
      <!-- Editor mode -->
      <EditorContent
        v-if="mode === 'editor'"
        :editor="editor"
        class="w-full"
      />

      <!-- Markdown mode -->
      <div
        v-if="mode === 'markdown'"
        class="h-full flex-1 overflow-auto"
      >
        <Codemirror
          v-model="markdownContent"
          :extensions="codemirrorExtensions"
          :style="{ height: '100%' }"
          :placeholder="$t('editor.placeholder')"
          @change="onMarkdownChange"
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
import { markdown } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import type { Extension } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { mergeAttributes, Node } from '@tiptap/core'
import CodeBlock from '@tiptap/extension-code-block'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Highlighter,
  ImageIcon,
  Italic,
  LinkIcon,
  ListIcon,
  ListOrdered,
  ListTodo,
  Quote,
  Redo2,
  Strikethrough,
  TableIcon,
  Underline as UnderlineIcon,
  Undo2,
  VideoIcon
} from 'lucide-vue-next'
import { marked } from 'marked'
import TurndownService from 'turndown'
import { Codemirror } from 'vue-codemirror'
import { toast } from 'vue-sonner'

// Custom node so <video> tags round-trip correctly through save/reload
// (Tiptap's default schema has no video node, so re-parsed HTML would
// otherwise show the raw <video> tag as literal text).
const Video = Node.create({
  name: 'video',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      src: { default: null }
    }
  },
  parseHTML() {
    return [
      {
        tag: 'video',
        getAttrs: (element) => ({
          src:
            (element as HTMLElement).querySelector('source')?.getAttribute('src') ??
            (element as HTMLElement).getAttribute('src')
        })
      }
    ]
  },
  renderHTML({ HTMLAttributes }) {
    const { src } = HTMLAttributes as { src?: string }
    return [
      'video',
      mergeAttributes({ controls: 'controls', class: 'h-auto rounded-lg max-w-full' }),
      ['source', { src, type: 'video/mp4' }]
    ]
  }
})

const activeClass = 'bg-primary text-primary-foreground'
const baseClass =
  'hover:bg-primary/90 hover:text-primary-foreground text-sm rounded px-3 py-1 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent'
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

// Real syntax highlighting for markdown + embedded HTML + fenced code blocks
const colorMode = useColorMode()
const codemirrorExtensions = computed(() => {
  const extensions: Extension[] = [markdown({ codeLanguages: languages })]
  if (colorMode.value === 'dark') {
    extensions.push(oneDark)
  }
  return extensions
})

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
    StarterKit.configure({
      codeBlock: false
    }),
    CodeBlock.configure({
      defaultLanguage: 'bash'
    }),
    Underline,
    Highlight,
    TextAlign.configure({
      types: ['heading', 'paragraph']
    }),
    TaskList,
    TaskItem.configure({
      nested: true
    }),
    Table.configure({
      resizable: true
    }),
    TableRow,
    TableHeader,
    TableCell,
    Placeholder.configure({
      placeholder: t('editor.placeholder')
    }),
    Video,
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

// Character count (markdown mode counts the raw text being edited, not the stale Tiptap doc)
const characterCount = computed(() => {
  if (mode.value === 'markdown') {
    return markdownContent.value.length
  }
  return editor.value?.getCharacterCount() || 0
})

// Convert HTML to Markdown (used when loading/receiving HTML from outside the markdown editor)
const updateMarkdownFromHtml = (html: string) => {
  markdownContent.value = turndownService.turndown(html)
}

// Markdown mode is its own source of truth while active: every keystroke converts
// to HTML and propagates to the parent v-model directly, instead of waiting for a
// mode switch or routing through the Tiptap doc (which previously meant content
// typed in markdown mode was silently never saved).
const onMarkdownChange = () => {
  const html = marked(markdownContent.value) as string
  htmlContent.value = html
  emit('update:modelValue', html)
  emit('change', html)
  calculateFileSize(html)
}

// Calculate total file size from base64 images/videos
const calculateFileSize = (html: string) => {
  const base64Regex = /data:(?:image|video)\/[^;]+;base64,([A-Za-z0-9+/=]+)/g
  let totalSize = 0
  let match

  while ((match = base64Regex.exec(html)) !== null) {
    // Approximate size calculation for base64
    const base64Length = match[1]?.length ?? 0
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
      editor.value
        ?.chain()
        .focus()
        .insertContent({ type: 'video', attrs: { src: base64 } })
        .run()
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
  const previousUrl = editor.value?.getAttributes('link').href as string | undefined
  const url = prompt('URL du lien:', previousUrl ?? '')
  if (url === null) {
    return
  }
  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

const insertTable = () => {
  editor.value?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
}

// Watch for external content changes (e.g. parent loads a different article).
// Skipped while markdown mode is active: that mode is its own source of truth and
// already emitted this same value itself, so re-parsing it back in would fight
// the user's cursor on every keystroke.
watch(
  () => props.modelValue,
  (newValue) => {
    if (mode.value === 'markdown') {
      return
    }
    if (editor.value && newValue !== editor.value.getHTML()) {
      editor.value.commands.setContent(newValue)
      updateMarkdownFromHtml(newValue)
      calculateFileSize(newValue)
    }
  }
)

// Watch mode changes
// Each transition derives the target view from whichever mode was actually being
// edited (oldMode), never from the Tiptap doc unconditionally — otherwise content
// typed in markdown mode is invisible in preview, or gets discarded switching back
// to the rich editor.
watch(mode, (newMode, oldMode) => {
  if (oldMode === 'markdown') {
    const html = marked(markdownContent.value) as string
    if (newMode === 'editor') {
      editor.value?.commands.setContent(html)
    } else if (newMode === 'preview') {
      htmlContent.value = html
    }
  } else if (oldMode === 'editor') {
    const html = editor.value?.getHTML() || ''
    if (newMode === 'markdown') {
      markdownContent.value = turndownService.turndown(html)
    } else if (newMode === 'preview') {
      htmlContent.value = html
    }
  }
  // oldMode === 'preview': preview is read-only, nothing to re-derive — whichever
  // of markdownContent/editor was last edited is still the valid source.
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
