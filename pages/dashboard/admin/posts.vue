<template>
  <div class="container mx-auto min-h-screen p-6">
    <h1 class="mb-6 text-3xl font-bold">Dashboard - Éditeur de contenu</h1>

    <!-- Exemple d'utilisation simple -->
    <div class="mb-8">
      <h2 class="mb-4 text-xl font-semibold">Article de blog</h2>
      <div>
        <ClientOnly>
          <Editor
            v-model="articleContent"
            placeholder="Rédigez votre article..."
            :max-file-size="5"
            :max-total-size="20"
            @change="onArticleChange"
          />
        </ClientOnly>
      </div>
    </div>

    <!-- Contrôles -->
    <div class="mb-6 flex gap-4">
      <button
        class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        @click="saveContent"
      >
        Sauvegarder
      </button>
      <button
        class="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        @click="loadContent"
      >
        Charger contenu
      </button>
      <button
        class="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        @click="clearContent"
      >
        Effacer
      </button>
      <button
        class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        @click="exportMarkdown"
      >
        Exporter MD
      </button>
    </div>

    <!-- Aperçu du contenu sauvegardé -->
    <div
      v-if="savedContent"
      class="rounded-lg bg-gray-50 p-4"
    >
      <h3 class="mb-2 text-lg font-semibold">Contenu sauvegardé :</h3>
      <div
        class="prose prose-sm max-w-none"
        v-html="savedContent"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Editor from '~/components/admin/Editor.vue'

// Exemple de données sauvegardées (simulant une base de données)
const sampleContent = `
  <h1>Bienvenue dans l'éditeur TipTap</h1>
  <p>Ceci est un <strong>exemple</strong> de contenu avec du <em>markdown</em> et des <code>éléments</code> formatés.</p>
  <h2>Fonctionnalités</h2>
  <ul>
  <li>Support du <strong>markdown</strong></li>
  <li>Images et vidéos en base64</li>
  <li>Prévisualisation en temps réel</li>
  <li>Toolbar personnalisable</li>
  </ul>
  <blockquote>
  <p>Un éditeur flexible et réutilisable pour votre dashboard Nuxt !</p>
  </blockquote>
  `

const articleContent = ref('')
const savedContent = ref('')
const editorRef = ref()

// Gestionnaire de changement
const onArticleChange = (content: string) => {
  console.log('Contenu modifié:', content)
  // Ici vous pourriez implémenter l'auto-save
}

// Sauvegarder le contenu
const saveContent = () => {
  savedContent.value = articleContent.value
  // Ici vous pourriez sauvegarder dans une base de données
  console.log('Contenu sauvegardé:', articleContent.value)

  // Exemple de sauvegarde dans localStorage (optionnel)
  if (import.meta.client) {
    localStorage.setItem('editorContent', articleContent.value)
  }
}

// Charger le contenu
const loadContent = () => {
  // Charger depuis localStorage ou une API
  if (import.meta.client) {
    const stored = localStorage.getItem('editorContent')
    if (stored) {
      articleContent.value = stored
    } else {
      // Charger le contenu d'exemple
      articleContent.value = sampleContent
    }
  } else {
    articleContent.value = sampleContent
  }
}

// Effacer le contenu
const clearContent = () => {
  articleContent.value = ''
  savedContent.value = ''
  if (import.meta.client) {
    localStorage.removeItem('editorContent')
  }
}

// Exporter en markdown
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

// Charger le contenu au montage
onMounted(() => {
  loadContent()
})
</script>
