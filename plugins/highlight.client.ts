// plugins/highlight.client.ts
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

export default defineNuxtPlugin(() => {
  onMounted(() => {
    hljs.highlightAll()
  })
})
