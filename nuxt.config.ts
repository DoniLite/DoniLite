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
    },
    preset: process.env.NODE_ENV === 'production' ? 'node-server' : undefined,
    compressPublicAssets: process.env.NODE_ENV === 'production' ? true : undefined
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

  runtimeConfig: {
    public: {
      siteUrl: process.env.SITE_URL || 'http://localhost:4040'
    },
    // i18n.baseUrl doesn't read site.url automatically, so we pass it here
    // too. The env var NUXT_I18N_BASE_URL overrides this at runtime.
    i18n: {
      baseUrl: process.env.SITE_URL || 'http://localhost:4040'
    }
  },

  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    'nuxt-og-image',
    '@nuxtjs/sitemap',
    'nuxt-schema-org',
    '@pinia/nuxt',
    '@nuxt/content',
    'vue-sonner/nuxt'
  ],
  colorMode: {
    classSuffix: ''
  },
  // Shared by nuxt-og-image/sitemap/schema-org (all read this via
  // nuxt-site-config) for absolute-URL generation in canonical tags, hreflang
  // alternates, sitemap entries and structured data.
  site: {
    url: '',
    name: 'Doni Lite'
  },
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    // The admin dashboard is auth-gated, but a sitemap listing its routes
    // still advertises they exist — exclude the whole private tree. The
    // unsubscribe page is already noindexed and has no reason to be
    // discoverable via search either.
    exclude: ['/dashboard/**', '/newsletter/unsubscribe']
  },
  i18n: {
    defaultLocale: 'en',
    langDir: 'locales',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'fr', language: 'fr-FR', name: 'Français', file: 'fr.json' }
    ],
    // strictSeo needs its own explicit baseUrl (doesn't read `site.url`
    // automatically) to generate absolute hreflang/canonical links.
    baseUrl: '',
    // Enables automatic hreflang alternate links, canonical link, and a
    // dynamic <html lang>/dir attribute matching the active locale — off by
    // default, was never turned on.
    experimental: {
      strictSeo: true
    }
  },
  typescript: {
    typeCheck: process.env.NUXT_TYPECHECK !== 'false'
  }
})
