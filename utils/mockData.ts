import { Eye, Mail, PenBox } from 'lucide-vue-next'
import type { Article } from '~/shared/types'

export const mockArticles: Article[] = [
  {
    id: 1,
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-06-02T12:00:00Z',
    status: 'posted',
    en: {
      title: 'Understanding TypeScript Generics',
      description: 'A deep dive into generics in TypeScript and how to use them effectively.',
      slug: ['typescript', 'generics'],
      topic: 'TypeScript',
      content: 'Generics provide a way to make components work with any data type...'
    },
    fr: {
      title: 'Comprendre les Génériques en TypeScript',
      description:
        'Une exploration approfondie des génériques en TypeScript et de leur utilisation.',
      slug: ['typescript', 'generiques'],
      topic: 'TypeScript',
      content:
        'Les génériques permettent de rendre les composants compatibles avec tout type de données...'
    },
    views: 10000
  },
  {
    id: 2,
    createdAt: '2024-05-15T09:30:00Z',
    status: 'draft',
    en: {
      title: 'Vue 3 Composition API Patterns',
      description: 'Best practices and patterns for using the Composition API in Vue 3.',
      slug: ['vue', 'composition-api'],
      topic: 'Vue.js',
      content: 'The Composition API in Vue 3 enables better code organization...'
    },
    fr: {
      title: 'Patterns de l’API de Composition Vue 3',
      description: 'Bonnes pratiques et patterns pour utiliser l’API de composition dans Vue 3.',
      slug: ['vue', 'api-composition'],
      topic: 'Vue.js',
      content: 'L’API de composition dans Vue 3 permet une meilleure organisation du code...'
    },
    views: 342
  },
  {
    id: 3,
    createdAt: '2024-04-20T14:45:00Z',
    updatedAt: '2024-04-21T08:00:00Z',
    status: 'archived',
    en: {
      title: 'Getting Started with Rust',
      description: 'An introduction to the Rust programming language for beginners.',
      slug: ['rust', 'getting-started'],
      topic: 'Rust',
      content: 'Rust is a systems programming language focused on safety and performance...'
    },
    fr: {
      title: 'Bien démarrer avec Rust',
      description: 'Une introduction au langage de programmation Rust pour les débutants.',
      slug: ['rust', 'demarrage'],
      topic: 'Rust',
      content:
        'Rust est un langage de programmation système axé sur la sécurité et la performance...'
    },
    views: 90000
  }
]

export const mockFilters = ['Tous', 'Vue.js', 'TypeScript', 'Nuxt', 'Open Source', 'Tutoriels']

export const mockAdminCardData = [
  {
    statsIcon: PenBox,
    title: 'Posts',
    total: 1234,
    stats: 12.5 // positive growth
  },
  {
    statsIcon: Mail,
    title: 'Messages',
    total: 567,
    stats: -3.2 // negative growth
  },
  {
    statsIcon: Eye,
    title: 'Views',
    total: 89,
    stats: 0 // no change
  }
]
