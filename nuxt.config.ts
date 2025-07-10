// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],

  vite: {
    plugins: [tailwindcss()]
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
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    'nuxt-og-image',
    '@pinia/nuxt',
    '@nuxt/content',
    'vue-sonner/nuxt'
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  colorMode: {
    classSuffix: ''
  },
  i18n: {
    defaultLocale: 'en',
    langDir: './locales',
    restructureDir: './',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'fr', name: 'Français', file: 'fr.json' }
    ],
    bundle: {
      optimizeTranslationDirective: false
    }
  },
  typescript: {
    typeCheck: true
  }
})
