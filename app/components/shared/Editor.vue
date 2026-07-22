<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="bg-card flex h-full flex-col rounded-lg shadow-lg">
    <!-- Toolbar: inserts markdown syntax / raw HTML at the cursor, nothing more -->
    <div
      class="border-border bg-primary/10 flex flex-wrap items-center gap-2 rounded-md border-b p-4"
    >
      <!-- Undo/Redo -->
      <div class="flex items-center gap-1">
        <button
          :class="baseClass"
          :disabled="!canUndo"
          @click="runCommand(undo)"
        >
          <Undo2 :class="iconClass" />
        </button>
        <button
          :class="baseClass"
          :disabled="!canRedo"
          @click="runCommand(redo)"
        >
          <Redo2 :class="iconClass" />
        </button>
      </div>

      <div class="bg-foreground h-6 w-px"></div>

      <!-- Format buttons -->
      <div class="flex items-center gap-1">
        <button
          :class="baseClass"
          @click="wrapSelection('**')"
        >
          <Bold :class="iconClass" />
        </button>
        <button
          :class="baseClass"
          @click="wrapSelection('*')"
        >
          <Italic :class="iconClass" />
        </button>
        <button
          :class="baseClass"
          @click="wrapSelection('<u>', '</u>')"
        >
          <UnderlineIcon :class="iconClass" />
        </button>
        <button
          :class="baseClass"
          @click="wrapSelection('~~')"
        >
          <Strikethrough :class="iconClass" />
        </button>
        <button
          :class="baseClass"
          @click="wrapSelection('<mark>', '</mark>')"
        >
          <Highlighter :class="iconClass" />
        </button>
      </div>

      <div class="bg-foreground h-6 w-px"></div>

      <!-- Heading buttons -->
      <div class="flex items-center gap-1">
        <button
          :class="baseClass"
          @click="prefixLines('# ')"
        >
          {{ 'H1' }}
        </button>
        <button
          :class="baseClass"
          @click="prefixLines('## ')"
        >
          {{ 'H2' }}
        </button>
        <button
          :class="baseClass"
          @click="prefixLines('### ')"
        >
          {{ 'H3' }}
        </button>
      </div>

      <div class="h-6 w-px bg-gray-300"></div>

      <!-- List buttons -->
      <div class="flex items-center gap-1">
        <button
          :class="baseClass"
          @click="prefixLines('- ')"
        >
          <ListIcon :class="iconClass" />
        </button>
        <button
          :class="baseClass"
          @click="prefixLines('1. ')"
        >
          <ListOrdered :class="iconClass" />
        </button>
        <button
          :class="baseClass"
          @click="prefixLines('- [ ] ')"
        >
          <ListTodo :class="iconClass" />
        </button>
        <button
          :class="baseClass"
          @click="prefixLines('> ')"
        >
          <Quote :class="iconClass" />
        </button>
        <button
          :class="baseClass"
          @click="insertCodeBlock"
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
    </div>

    <!-- Split pane: markdown source (left) + live rendered preview (right), always both visible -->
    <div class="divide-border flex h-175 min-w-0 divide-x overflow-hidden">
      <div class="h-full w-1/2 min-w-0 overflow-auto">
        <Codemirror
          v-model="content"
          :extensions="codemirrorExtensions"
          :style="{ height: '100%' }"
          :placeholder="$t('editor.placeholder')"
          @ready="onCodemirrorReady"
          @update="onCodemirrorUpdate"
        />
      </div>
      <div
        ref="previewRef"
        class="prose prose-sm dark:prose-invert h-full w-1/2 max-w-none min-w-0 overflow-auto p-4"
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
import { redo, redoDepth, undo, undoDepth } from '@codemirror/commands'
import { html } from '@codemirror/lang-html'
import { markdown } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { EditorSelection, type Extension } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import type { ViewUpdate } from '@codemirror/view'
import { EditorView } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import {
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
import { Codemirror } from 'vue-codemirror'
import { toast } from 'vue-sonner'

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
const content = ref(props.modelValue)
const fileSizeTotal = ref(0)
const pendingFileType = ref<'image' | 'video' | null>(null)
const cmView = shallowRef<EditorView>()
const canUndo = ref(false)
const canRedo = ref(false)

// Real syntax highlighting for markdown + embedded HTML + fenced code blocks
const colorMode = useColorMode()
const codemirrorExtensions = computed(() => {
  const extensions: Extension[] = [
    basicSetup,
    // Without this, a long unwrapped prose paragraph renders as one
    // continuous line, forcing the pane (and the surrounding page grid) wider
    // than its column instead of just scrolling internally.
    EditorView.lineWrapping,
    // autoCloseTags off: it silently duplicates closing tags when writing raw
    // HTML by hand (e.g. typing "</h2>" after the auto-inserted one), which is
    // exactly the raw-HTML-in-markdown workflow this editor exists for.
    markdown({ codeLanguages: languages, htmlTagLanguage: html({ autoCloseTags: false }) })
  ]
  if (colorMode.value === 'dark') {
    extensions.push(oneDark)
  }
  return extensions
})

marked.setOptions({ breaks: true, gfm: true })

const htmlContent = computed(() => marked(content.value) as string)
const characterCount = computed(() => content.value.length)

// marked() only tags fenced code blocks with a `language-x` class from the
// ```x info string — it doesn't colorize anything itself. v-html replaces
// the preview's DOM on every keystroke, so re-run highlight.js on the fresh
// <pre><code> nodes each time instead of the one-shot highlightAll() pattern
// used on the (static) public article page.
const previewRef = useTemplateRef<HTMLElement>('previewRef')
const highlightPreview = async () => {
  await nextTick()
  previewRef.value?.querySelectorAll<HTMLElement>('pre code').forEach((block) => {
    hljs.highlightElement(block)
  })
}
watch(htmlContent, highlightPreview, { immediate: true })

const calculateFileSize = (markdownSource: string) => {
  const base64Regex = /data:(?:image|video)\/[^;]+;base64,([A-Za-z0-9+/=]+)/g
  let totalSize = 0
  let match

  while ((match = base64Regex.exec(markdownSource)) !== null) {
    const base64Length = match[1]?.length ?? 0
    const sizeInBytes = (base64Length * 3) / 4
    totalSize += sizeInBytes
  }

  fileSizeTotal.value = totalSize
}

const formatFileSize = (bytes: number): string => {
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(2)} MB`
}

const onCodemirrorReady = (payload: { view: EditorView }) => {
  cmView.value = payload.view
}

const onCodemirrorUpdate = (update: ViewUpdate) => {
  canUndo.value = undoDepthOf(update.view)
  canRedo.value = redoDepthOf(update.view)
}

const undoDepthOf = (view: EditorView) => undoDepth(view.state) > 0
const redoDepthOf = (view: EditorView) => redoDepth(view.state) > 0

watch(content, (value) => {
  emit('update:modelValue', value)
  emit('change', value)
  calculateFileSize(value)
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== content.value) {
      content.value = newValue
    }
  }
)

const runCommand = (command: (view: EditorView) => boolean) => {
  const view = cmView.value
  if (!view) {
    return
  }
  command(view)
  view.focus()
}

// Wraps the current selection in `before`/`after` (e.g. **bold**). With no
// selection, inserts an empty pair and places the cursor between them.
const wrapSelection = (before: string, after: string = before) => {
  const view = cmView.value
  if (!view) {
    return
  }
  const { state } = view
  const changes = state.changeByRange((range) => {
    const selectedText = state.sliceDoc(range.from, range.to)
    const insertion = `${before}${selectedText}${after}`
    const anchor = range.from + before.length
    return {
      changes: { from: range.from, to: range.to, insert: insertion },
      range: EditorSelection.range(anchor, anchor + selectedText.length)
    }
  })
  view.dispatch(state.update(changes))
  view.focus()
}

// Prefixes every line touched by the selection with `prefix` (e.g. "- " for a list).
const prefixLines = (prefix: string) => {
  const view = cmView.value
  if (!view) {
    return
  }
  const { state } = view
  const changes = state.changeByRange((range) => {
    const startLine = state.doc.lineAt(range.from)
    const endLine = state.doc.lineAt(range.to)
    const lineChanges = []
    for (let lineNumber = startLine.number; lineNumber <= endLine.number; lineNumber++) {
      const line = state.doc.line(lineNumber)
      lineChanges.push({ from: line.from, to: line.from, insert: prefix })
    }
    const totalPrefixLength = prefix.length * lineChanges.length
    return {
      changes: lineChanges,
      range: EditorSelection.range(range.from + prefix.length, range.to + totalPrefixLength)
    }
  })
  view.dispatch(state.update(changes))
  view.focus()
}

const insertAtCursor = (text: string, cursorOffset = text.length) => {
  const view = cmView.value
  if (!view) {
    return
  }
  const { from, to } = view.state.selection.main
  view.dispatch({
    changes: { from, to, insert: text },
    selection: EditorSelection.cursor(from + cursorOffset)
  })
  view.focus()
}

const insertCodeBlock = () => {
  insertAtCursor('\n```\n\n```\n', 5)
}

const insertTable = () => {
  insertAtCursor('\n| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n|  |  |  |\n')
}

const addLink = () => {
  const url = prompt('URL du lien:', 'https://')
  if (!url) {
    return
  }
  const view = cmView.value
  const selectedText = view
    ? view.state.sliceDoc(view.state.selection.main.from, view.state.selection.main.to)
    : ''
  const label = selectedText || 'lien'
  wrapSelection(`[`, `](${url})`)
  if (!selectedText) {
    insertAtCursor(label)
  }
}

// File upload handler
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) {
    return
  }

  const fileSizeMB = file.size / (1024 * 1024)
  if (fileSizeMB > props.maxFileSize) {
    toast.error(t('editor.toast.warning.file_size', { size: props.maxFileSize }))
    return
  }

  const newTotalSize = fileSizeTotal.value + file.size
  const newTotalSizeMB = newTotalSize / (1024 * 1024)
  if (newTotalSizeMB > props.maxTotalSize) {
    toast.error(t('editor.toast.warning.max_file_size', { size: props.maxTotalSize }))
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const base64 = e.target?.result as string

    if (pendingFileType.value === 'image') {
      insertAtCursor(`![${file.name}](${base64})`)
    } else if (pendingFileType.value === 'video') {
      insertAtCursor(
        `\n<video controls class="h-auto rounded-lg max-w-full"><source src="${base64}" type="video/mp4"></video>\n`
      )
    }
  }

  reader.readAsDataURL(file)
  target.value = ''
}

const addImage = () => {
  pendingFileType.value = 'image'
  fileInput.value?.click()
}

const addVideo = () => {
  pendingFileType.value = 'video'
  fileInput.value?.click()
}

// Expose methods for parent components
defineExpose({
  getHTML: () => htmlContent.value,
  getMarkdown: () => content.value,
  setContent: (value: string) => {
    content.value = value
    calculateFileSize(value)
  },
  focus: () => cmView.value?.focus(),
  clear: () => {
    content.value = ''
    fileSizeTotal.value = 0
  }
})
</script>
