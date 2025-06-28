<script setup>
import HeroSection from '../components/blog/Hero.vue'
</script>
<template>
  <div class="bg-background min-h-screen">
    <!-- Header/Navigation serait ici -->

    <!-- Blog Hero Section -->
    <HeroSection />

    <!-- Blog Category Filter -->
    <section class="border-b py-4 md:py-8">
      <div class="container px-4 md:px-6">
        <div class="mx-auto max-w-5xl">
          <div class="flex flex-wrap items-center gap-2">
            <button
              class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md px-4 text-xs font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              Tous
            </button>
            <button
              class="bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md border px-4 text-xs font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              Vue.js
            </button>
            <button
              class="bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md border px-4 text-xs font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              TypeScript
            </button>
            <button
              class="bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md border px-4 text-xs font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              Nuxt
            </button>
            <button
              class="bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md border px-4 text-xs font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              Open Source
            </button>
            <button
              class="bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md border px-4 text-xs font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              Tutoriels
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Article -->
    <section class="py-8 md:py-12">
      <div class="container px-4 md:px-6">
        <div class="mx-auto max-w-5xl">
          <div class="bg-card overflow-hidden rounded-lg border shadow">
            <div class="md:flex">
              <div class="bg-primary/10 flex items-center justify-center p-8 md:w-1/3">
                <div class="text-primary bg-primary/20 rounded-full p-4">
                  <svg
                    class="h-12 w-12"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m7 11 2-2-2-2" />
                    <path d="M11 13h4" />
                    <rect
                      width="18"
                      height="18"
                      x="3"
                      y="3"
                      rx="2"
                      ry="2"
                    />
                  </svg>
                </div>
              </div>
              <div class="p-6 md:w-2/3">
                <div class="flex items-center gap-4">
                  <span class="text-muted-foreground text-sm">20 Avr 2025</span>
                  <span
                    class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                  >
                    À la une
                  </span>
                </div>
                <h2 class="text-foreground mt-4 text-2xl font-bold">
                  Créer une application performante avec Nuxt 3 et TypeScript
                </h2>
                <p class="text-muted-foreground mt-2">
                  Découvrez comment construire une application web moderne, performante et typée
                  avec Nuxt 3 et TypeScript.
                </p>
                <div class="mt-6 flex items-center gap-4">
                  <img
                    src="/avatar.jpeg"
                    alt="Avatar"
                    class="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p class="text-foreground text-sm font-medium">DoniLite</p>
                    <p class="text-muted-foreground text-sm">Développeur & Chercheur</p>
                  </div>
                </div>
                <div class="mt-6">
                  <NuxtLink
                    to="/blog/creer-application-nuxt-typescript"
                    class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    Lire l'article
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- All Blog Posts -->
    <section class="py-8 md:py-12">
      <div class="container px-4 md:px-6">
        <div class="mx-auto max-w-5xl">
          <h2 class="text-foreground text-2xl font-bold tracking-tighter md:text-3xl">
            Tous les articles
          </h2>
          <div class="mt-8 grid gap-8 md:grid-cols-2">
            <!-- Blog Post 1 -->
            <div class="bg-card overflow-hidden rounded-lg border shadow-sm">
              <div class="p-6">
                <div class="flex items-center gap-4">
                  <span class="text-muted-foreground text-sm">15 Avr 2025</span>
                  <span
                    class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                  >
                    Vue.js
                  </span>
                </div>
                <h3 class="text-foreground mt-4 text-xl font-bold">Les nouveautés de Vue 3.5</h3>
                <p class="text-muted-foreground mt-2 line-clamp-3">
                  Explorez les dernières fonctionnalités et améliorations de Vue 3.5 et comment les
                  intégrer dans vos projets.
                </p>
                <div class="mt-6 flex items-center gap-4">
                  <img
                    src="/avatar.jpeg"
                    alt="Avatar"
                    class="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <p class="text-foreground text-sm font-medium">DoniLite</p>
                  </div>
                </div>
                <div class="mt-6">
                  <NuxtLink
                    to="/blog/nouveautes-vue-3-5"
                    class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    Lire l'article
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Blog Post 2 -->
            <div class="bg-card overflow-hidden rounded-lg border shadow-sm">
              <div class="p-6">
                <div class="flex items-center gap-4">
                  <span class="text-muted-foreground text-sm">10 Avr 2025</span>
                  <span
                    class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                  >
                    TypeScript
                  </span>
                </div>
                <h3 class="text-foreground mt-4 text-xl font-bold">
                  Utiliser les types génériques en TypeScript
                </h3>
                <p class="text-muted-foreground mt-2 line-clamp-3">
                  Comment créer des composants et fonctions réutilisables avec les types génériques
                  en TypeScript.
                </p>
                <div class="mt-6 flex items-center gap-4">
                  <img
                    src="/avatar.jpeg"
                    alt="Avatar"
                    class="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <p class="text-foreground text-sm font-medium">DoniLite</p>
                  </div>
                </div>
                <div class="mt-6">
                  <NuxtLink
                    to="/blog/types-generiques-typescript"
                    class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    Lire l'article
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Blog Post 3 -->
            <div class="bg-card overflow-hidden rounded-lg border shadow-sm">
              <div class="p-6">
                <div class="flex items-center gap-4">
                  <span class="text-muted-foreground text-sm">5 Avr 2025</span>
                  <span
                    class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                  >
                    Nuxt
                  </span>
                </div>
                <h3 class="text-foreground mt-4 text-xl font-bold">Optimisation SEO avec Nuxt 3</h3>
                <p class="text-muted-foreground mt-2 line-clamp-3">
                  Guide complet pour optimiser le référencement de votre application Nuxt 3 et
                  améliorer sa visibilité.
                </p>
                <div class="mt-6 flex items-center gap-4">
                  <img
                    src="/avatar.jpeg"
                    alt="Avatar"
                    class="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <p class="text-foreground text-sm font-medium">DoniLite</p>
                  </div>
                </div>
                <div class="mt-6">
                  <NuxtLink
                    to="/blog/optimisation-seo-nuxt-3"
                    class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    Lire l'article
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Blog Post 4 -->
            <div class="bg-card overflow-hidden rounded-lg border shadow-sm">
              <div class="p-6">
                <div class="flex items-center gap-4">
                  <span class="text-muted-foreground text-sm">1 Avr 2025</span>
                  <span
                    class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                  >
                    Open Source
                  </span>
                </div>
                <h3 class="text-foreground mt-4 text-xl font-bold">
                  Comment contribuer efficacement à l'open source
                </h3>
                <p class="text-muted-foreground mt-2 line-clamp-3">
                  Les meilleures pratiques pour débuter et contribuer de manière significative aux
                  projets open source.
                </p>
                <div class="mt-6 flex items-center gap-4">
                  <img
                    src="/avatar.jpeg"
                    alt="Avatar"
                    class="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <p class="text-foreground text-sm font-medium">DoniLite</p>
                  </div>
                </div>
                <div class="mt-6">
                  <NuxtLink
                    to="/blog/contribuer-open-source"
                    class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    Lire l'article
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="mt-12 flex items-center justify-center space-x-2">
            <button
              class="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <svg
                class="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span class="sr-only">Page précédente</span>
            </button>
            <button
              class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              1
            </button>
            <button
              class="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              2
            </button>
            <button
              class="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              3
            </button>
            <button
              class="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <svg
                class="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
              <span class="sr-only">Page suivante</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="bg-card py-12 md:py-16">
      <div class="container px-4 md:px-6">
        <div class="mx-auto max-w-5xl">
          <div class="bg-background rounded-lg p-8 shadow-sm">
            <div class="flex flex-col items-center space-y-4 text-center">
              <div class="bg-primary/10 rounded-full p-3">
                <svg
                  class="text-primary h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M21 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"
                  />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </div>
              <h2 class="text-foreground text-2xl font-bold tracking-tighter md:text-3xl">
                Restez informé
              </h2>
              <p class="text-muted-foreground max-w-[600px] md:text-lg">
                Abonnez-vous à ma newsletter pour recevoir mes derniers articles et actualités
                directement dans votre boîte mail.
              </p>
              <div class="w-full max-w-md">
                <form class="flex space-x-2">
                  <input
                    type="email"
                    placeholder="votre-email@exemple.com"
                    class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    S'abonner
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer serait ici -->
  </div>
</template>
