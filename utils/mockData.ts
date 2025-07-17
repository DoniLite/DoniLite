import { Mail, PenBox, Users } from 'lucide-vue-next'
import type { Article, EntryType } from '~/shared/types'

/* --- ARTICLES --- */
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
      title: "Patterns de l'API de Composition Vue 3",
      description: "Bonnes pratiques et patterns pour utiliser l'API de composition dans Vue 3.",
      slug: ['vue', 'api-composition'],
      topic: 'Vue.js',
      content: "L'API de composition dans Vue 3 permet une meilleure organisation du code..."
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

/* --- TOPICS --- */
export const mockFilters = ['Tous', 'Vue.js', 'TypeScript', 'Nuxt', 'Open Source', 'Tutoriels']

export const mockTopic: EntryType[] = mockFilters
  .filter((f) => f !== 'Tous')
  .map((t, idx) => ({
    id: `${idx}_${t}`,
    label: t
  }))

/* --- ADMIN CARD DATA --- */
export const mockAdminCardData = [
  {
    statsIcon: PenBox,
    title: 'Posts',
    total: 1234,
    stats: 12.5
  },
  {
    statsIcon: Mail,
    title: 'Messages',
    total: 567,
    stats: -3.2
  },
  {
    statsIcon: Users,
    title: 'Contacts',
    total: 2431,
    stats: 15.3
  }
]

/* --- ENHANCED AREA CHART DATA --- */
export const mockAreaChartData = Array.from({ length: 12 }, (_, i) => ({
  x: i,
  y1: Math.floor(Math.random() * 100) + 20,
  y2: Math.floor(Math.random() * 50) + 10,
  y3: Math.floor(Math.random() * 75) + 15
}))

/* --- LINE CHART DATA --- */
export const mockLineChartData = Array.from({ length: 12 }, (_, i) => ({
  x: i * i,
  value: Math.floor(Math.random() * 100) + 10,
  value2: Math.floor(Math.random() * 80) + 20
}))

/* --- BAR CHART DATA --- */
export const mockBarChartData = [
  { label: 'Vue.js', value: 58, articles: 12 },
  { label: 'React', value: 72, articles: 8 },
  { label: 'Svelte', value: 33, articles: 5 },
  { label: 'Nuxt', value: 91, articles: 15 },
  { label: 'Astro', value: 49, articles: 7 },
  { label: 'Angular', value: 64, articles: 9 }
]

/* --- DONUT CHART DATA --- */
export const mockDonutChartData = [
  { label: 'Vue.js', value: 35, count: 142 },
  { label: 'TypeScript', value: 25, count: 98 },
  { label: 'Nuxt', value: 20, count: 76 },
  { label: 'Open Source', value: 15, count: 54 },
  { label: 'Tutoriels', value: 5, count: 23 }
]

/* --- PIE CHART DATA --- */
export const mockPieChartData = [
  { category: 'Desktop', value: 45.2 },
  { category: 'Mobile', value: 38.7 },
  { category: 'Tablet', value: 16.1 }
]

/* --- SCATTER PLOT DATA --- */
export const mockScatterData = Array.from({ length: 50 }, (_) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 20 + 5,
  category: ['Vue.js', 'TypeScript', 'Nuxt', 'Open Source'][Math.floor(Math.random() * 4)]
}))

/* --- TIMELINE / EVENT DATA --- */
export const mockTimelineData = [
  { date: '2024-06-01', event: 'Article publié', type: 'post', length: 3 },
  { date: '2024-06-05', event: 'Article modifié', type: 'edit', length: 1 },
  { date: '2024-06-10', event: 'Commentaire ajouté', type: 'comment', length: 5 },
  { date: '2024-06-12', event: 'Archivé', type: 'archive', length: 2 },
  { date: '2024-06-13', event: 'Rétabli', type: 'restore', length: 1 },
  { date: '2024-06-15', event: 'Nouveau utilisateur', type: 'user', length: 12 }
]

/* --- MIXED CHART DATA (Line + Bar) --- */
export const mockMixedChartData = Array.from({ length: 7 }, (_, i) => ({
  x: `Semaine ${i + 1}`,
  bar: Math.floor(Math.random() * 100) + 20,
  line: 50 + Math.floor(Math.random() * 30) - 15,
  area: Math.floor(Math.random() * 60) + 30
}))

/* --- HEATMAP DATA --- */
export const mockHeatmapData = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => ({
    day: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][day],
    hour: hour,
    value: Math.floor(Math.random() * 100)
  }))
).flat()

/* --- GAUGE CHART DATA --- */
export const mockGaugeData = [
  { label: 'Performance', value: 85, max: 100 },
  { label: 'Engagement', value: 73, max: 100 },
  { label: 'Qualité', value: 92, max: 100 }
]

/* --- SANKEY DIAGRAM DATA --- */
export const mockSankeyData = {
  nodes: [
    { id: 'Vue.js', label: 'Vue.js' },
    { id: 'TypeScript', label: 'TypeScript' },
    { id: 'Nuxt', label: 'Nuxt' },
    { id: 'Articles', label: 'Articles' },
    { id: 'Tutorials', label: 'Tutoriels' },
    { id: 'Docs', label: 'Documentation' }
  ],
  links: [
    { source: 'Vue.js', target: 'Articles', value: 40 },
    { source: 'Vue.js', target: 'Tutorials', value: 25 },
    { source: 'TypeScript', target: 'Articles', value: 30 },
    { source: 'Nuxt', target: 'Docs', value: 35 },
    { source: 'Articles', target: 'Docs', value: 20 }
  ]
}

/* --- RADAR CHART DATA --- */
export const mockRadarData = [
  {
    skill: 'Vue.js',
    beginner: 80,
    intermediate: 60,
    advanced: 40
  },
  {
    skill: 'TypeScript',
    beginner: 70,
    intermediate: 85,
    advanced: 65
  },
  {
    skill: 'Nuxt',
    beginner: 60,
    intermediate: 70,
    advanced: 80
  },
  {
    skill: 'CSS',
    beginner: 90,
    intermediate: 75,
    advanced: 55
  },
  {
    skill: 'JavaScript',
    beginner: 85,
    intermediate: 90,
    advanced: 70
  }
]

/* --- TREEMAP DATA --- */
export const mockTreemapData = [
  { name: 'Vue.js', size: 1200, category: 'Framework' },
  { name: 'TypeScript', size: 800, category: 'Language' },
  { name: 'Nuxt', size: 950, category: 'Framework' },
  { name: 'Vite', size: 600, category: 'Tool' },
  { name: 'Pinia', size: 400, category: 'Library' },
  { name: 'Tailwind', size: 700, category: 'CSS' }
]

/* --- FUNNEL CHART DATA --- */
export const mockFunnelData = [
  { stage: 'Visiteurs', value: 10000, percentage: 100 },
  { stage: 'Lectures', value: 7500, percentage: 75 },
  { stage: 'Interactions', value: 3200, percentage: 32 },
  { stage: 'Commentaires', value: 1200, percentage: 12 },
  { stage: 'Partages', value: 450, percentage: 4.5 }
]

/* --- WATERFALL CHART DATA --- */
export const mockWaterfallData = [
  { label: 'Début', value: 1000, type: 'start' },
  { label: 'Nouveaux articles', value: 300, type: 'positive' },
  { label: 'Modifications', value: -50, type: 'negative' },
  { label: 'Suppressions', value: -25, type: 'negative' },
  { label: 'Restaurations', value: 10, type: 'positive' },
  { label: 'Total', value: 1235, type: 'total' }
]

export const mockMessages = [
  {
    id: 'message_1',
    user: {
      name: 'Emily Carter',
      profile: 'https://randomuser.me/api/portraits/women/1.jpg',
      email: 'emily.carter@example.com'
    },
    message: `odit vitae, nam possimus omnis? Modi, ducimus! Fugit labore deserunt at maiores, omnis
          tempore quaerat. Odit accusantium vitae, provident obcaecati vel eaque maxime quod in
          impedit iure aspernatur qui corporis, voluptate esse est laborum tempore, explicabo beatae
          eligendi. Modi commodi, incidunt eligendi expedita vero numquam nemo placeat fugit fugiat!
          Commodi animi architecto ea? Necessitatibus, architecto? Consectetur eos iusto enim
          aspernatur debitis. Iste eaque modi ipsam unde minima illo consequuntur, assumenda harum!
          Magni, vitae nisi natus quidem harum animi beatae laborum doloribus. Totam culpa porro
          reiciendis unde aliquid deleniti accusamus commodi rem, perspiciatis quis rerum
          praesentium quia, nemo esse nisi vero similique? Sapiente maiores exercitationem quis
          quibusdam, iusto, enim molestias facere amet tempore totam libero in, minima vitae
          molestiae voluptate laboriosam quia repudiandae nihil esse. Reiciendis, tenetur a!
          Delectus repellendus iure incidunt quia suscipit neque voluptates, fugiat explicabo
          consectetur nihil deleniti, quam laboriosam minus placeat a. Velit eaque eius aperiam
          quasi a excepturi eos sapiente, vero at temporibus eveniet, possimus aliquid voluptas
          inventore veniam nostrum fugiat cum nisi cupiditate reiciendis! Commodi numquam distinctio
          voluptas consequuntur est quae velit voluptatum asperiores delectus, quasi sunt doloribus
          sed quas labore magni magnam unde error minima nesciunt? Illo iure aspernatur, excepturi
          animi aut nemo rem quae. Magni eos minima maiores corporis soluta architecto quis labore.
          Necessitatibus, maxime suscipit doloribus eligendi commodi blanditiis saepe unde amet non
          ratione, corporis repudiandae molestias nobis veritatis tempora ea dolores dolorem totam
          atque. Laudantium incidunt facilis, in consequuntur aspernatur voluptatem quis placeat
          saepe ratione. Nesciunt necessitatibus architecto sed ducimus explicabo eveniet provident,
          autem aperiam hic minima id laudantium veniam animi beatae, repudiandae accusamus commodi
          vitae perspiciatis in cumque quo asperiores error doloribus quas. Consequatur asperiores
          voluptatem enim recusandae nulla aspernatur quidem facilis dolorem, quae reiciendis nisi
          quam vero optio magnam aliquam esse sed repellendus ducimus harum officiis? Architecto
          nobis earum quo perferendis ab error recusandae dignissimos, sint ipsam. Voluptatem,
          nihil. Eum nobis corrupti obcaecati, suscipit nam tenetur sed enim pariatur qui accusamus
          possimus? Nam architecto veniam libero quas excepturi, deserunt facilis quis magni
          molestiae asperiores! Dolore aspernatur labore vel est porro placeat facere id aut rem!
          Vel ipsam, commodi ducimus rem laborum blanditiis neque voluptatibus enim atque in
          molestias fugiat consequuntur recusandae qui exercitationem esse accusantium eaque, animi
          quae aspernatur quas laudantium fugit. Veritatis ipsa non, placeat consequuntur et
          molestias impedit eligendi totam natus? Quasi, repudiandae cupiditate. Perferendis dolor
          quos qui perspiciatis aperiam fugiat ad doloribus repellat. Fugiat nesciunt deserunt
          adipisci animi eligendi! Mollitia, veritatis recusandae.`,
    date: '2025-07-17T08:15:00Z',
    state: 'opened' as const
  },
  {
    id: 'message_2',
    user: {
      name: 'Marcus Nguyen',
      email: 'marcus.nguyen@example.com'
    },
    message: `odit vitae, nam possimus omnis? Modi, ducimus! Fugit labore deserunt at maiores, omnis
              tempore quaerat. Odit accusantium vitae, provident obcaecati vel eaque maxime quod in...`, // raccourci volontaire
    date: '2025-07-17T09:30:00Z',
    state: 'new' as const
  },
  {
    id: 'message_3',
    user: {
      name: 'Liam Smith',
      profile: 'https://randomuser.me/api/portraits/men/5.jpg',
      email: 'liam.smith@example.com'
    },
    message: `odit vitae, nam possimus omnis? Modi, ducimus! Fugit labore deserunt at maiores, omnis
          tempore quaerat. Odit accusantium vitae, provident obcaecati vel eaque maxime quod in
          impedit iure aspernatur qui corporis, voluptate esse est laborum tempore, explicabo beatae
          eligendi. Modi commodi, incidunt eligendi expedita vero numquam nemo placeat fugit fugiat!
          Commodi animi architecto ea? Necessitatibus, architecto? Consectetur eos iusto enim
          aspernatur debitis. Iste eaque modi ipsam unde minima illo consequuntur, assumenda harum!
          Magni, vitae nisi natus quidem harum animi beatae laborum doloribus. Totam culpa porro
          reiciendis unde aliquid deleniti accusamus commodi rem, perspiciatis quis rerum
          praesentium quia, nemo esse nisi vero similique? Sapiente maiores exercitationem quis
          quibusdam, iusto, enim molestias facere amet tempore totam libero in, minima vitae
          molestiae voluptate laboriosam quia repudiandae nihil esse. Reiciendis, tenetur a!
          Delectus repellendus iure incidunt quia suscipit neque voluptates, fugiat explicabo
          consectetur nihil deleniti, quam laboriosam minus placeat a. Velit eaque eius aperiam
          quasi a excepturi eos sapiente, vero at temporibus eveniet, possimus aliquid voluptas
          inventore veniam nostrum fugiat cum nisi cupiditate reiciendis! Commodi numquam distinctio
          voluptas consequuntur est quae velit voluptatum asperiores delectus, quasi sunt doloribus
          sed quas labore magni magnam unde error minima nesciunt? Illo iure aspernatur, excepturi
          animi aut nemo rem quae. Magni eos minima maiores corporis soluta architecto quis labore.
          Necessitatibus, maxime suscipit doloribus eligendi commodi blanditiis saepe unde amet non
          ratione, corporis repudiandae molestias nobis veritatis tempora ea dolores dolorem totam
          atque. Laudantium incidunt facilis, in consequuntur aspernatur voluptatem quis placeat
          saepe ratione. Nesciunt necessitatibus architecto sed ducimus explicabo eveniet provident,
          autem aperiam hic minima id laudantium veniam animi beatae, repudiandae accusamus commodi
          vitae perspiciatis in cumque quo asperiores error doloribus quas. Consequatur asperiores
          voluptatem enim recusandae nulla aspernatur quidem facilis dolorem, quae reiciendis nisi
          quam vero optio magnam aliquam esse sed repellendus ducimus harum officiis? Architecto
          nobis earum quo perferendis ab error recusandae dignissimos, sint ipsam. Voluptatem,
          nihil. Eum nobis corrupti obcaecati, suscipit nam tenetur sed enim pariatur qui accusamus
          possimus? Nam architecto veniam libero quas excepturi, deserunt facilis quis magni
          molestiae asperiores! Dolore aspernatur labore vel est porro placeat facere id aut rem!
          Vel ipsam, commodi ducimus rem laborum blanditiis neque voluptatibus enim atque in
          molestias fugiat consequuntur recusandae qui exercitationem esse accusantium eaque, animi
          quae aspernatur quas laudantium fugit. Veritatis ipsa non, placeat consequuntur et
          molestias impedit eligendi totam natus? Quasi, repudiandae cupiditate. Perferendis dolor
          quos qui perspiciatis aperiam fugiat ad doloribus repellat. Fugiat nesciunt deserunt
          adipisci animi eligendi! Mollitia, veritatis recusandae.`,
    date: '2025-07-16T18:45:00Z',
    state: 'archived' as const
  },
  {
    id: 'message_4',
    user: {
      name: 'Olivia Johnson',
      profile: 'https://randomuser.me/api/portraits/women/7.jpg',
      email: 'olivia.johnson@example.com'
    },
    message: 'Awesome job on the presentation!',
    date: '2025-07-15T14:10:00Z',
    state: 'opened' as const
  },
  {
    id: 'message_5',
    user: {
      name: 'Noah Davis',
      email: 'noah.davis@example.com'
    },
    message: "Can someone share the notes from yesterday's session?",
    date: '2025-07-14T16:25:00Z',
    state: 'new' as const
  }
]
