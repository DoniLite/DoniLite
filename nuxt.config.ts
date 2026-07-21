// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 5
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  components: [
    {
      path: '~/components',
      ignore: ['ui/**']
    }
  ],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['@unovis/vue']
    }
  },

  nitro: {
    experimental: {
      websocket: true
    }
  },

  router: {
    options: {
      linkActiveClass: 'active-link',
      linkExactActiveClass: 'active',
      scrollBehaviorType: 'smooth'
    }
  },

  devServer: {
    port: 4040
  },

  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    'nuxt-og-image',
    '@pinia/nuxt',
    '@nuxt/content',
    'vue-sonner/nuxt'
  ],
  colorMode: {
    classSuffix: ''
  },
  i18n: {
    defaultLocale: 'en',
    langDir: 'locales',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'fr', name: 'Français', file: 'fr.json' }
    ]
  },
  typescript: {
    typeCheck: true
  }
})
