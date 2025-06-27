<script setup>
import HeroSection from '../components/blog/Hero.vue';
</script>
<template>
    <div class="min-h-screen bg-background">
        <!-- Header/Navigation serait ici -->

        <!-- Blog Hero Section -->
        <HeroSection />

        <!-- Blog Category Filter -->
        <section class="py-4 md:py-8 border-b">
            <div class="container px-4 md:px-6">
                <div class="mx-auto max-w-5xl">
                    <div class="flex flex-wrap items-center gap-2">
                        <button
                            class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                            Tous
                        </button>
                        <button
                            class="inline-flex h-9 items-center justify-center rounded-md bg-background px-4 text-xs font-medium text-foreground shadow-sm border border-border transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                            Vue.js
                        </button>
                        <button
                            class="inline-flex h-9 items-center justify-center rounded-md bg-background px-4 text-xs font-medium text-foreground shadow-sm border border-border transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                            TypeScript
                        </button>
                        <button
                            class="inline-flex h-9 items-center justify-center rounded-md bg-background px-4 text-xs font-medium text-foreground shadow-sm border border-border transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                            Nuxt
                        </button>
                        <button
                            class="inline-flex h-9 items-center justify-center rounded-md bg-background px-4 text-xs font-medium text-foreground shadow-sm border border-border transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                            Open Source
                        </button>
                        <button
                            class="inline-flex h-9 items-center justify-center rounded-md bg-background px-4 text-xs font-medium text-foreground shadow-sm border border-border transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
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
                    <div class="overflow-hidden rounded-lg border bg-card shadow">
                        <div class="md:flex">
                            <div class="md:w-1/3 bg-primary/10 flex items-center justify-center p-8">
                                <div class="text-primary rounded-full bg-primary/20 p-4">
                                    <svg class="h-12 w-12" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round">
                                        <path d="m7 11 2-2-2-2" />
                                        <path d="M11 13h4" />
                                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                    </svg>
                                </div>
                            </div>
                            <div class="p-6 md:w-2/3">
                                <div class="flex items-center gap-4">
                                    <span class="text-sm text-muted-foreground">20 Avr 2025</span>
                                    <span
                                        class="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                        À la une
                                    </span>
                                </div>
                                <h2 class="mt-4 text-2xl font-bold text-foreground">Créer une application performante
                                    avec Nuxt 3 et TypeScript</h2>
                                <p class="mt-2 text-muted-foreground">
                                    Découvrez comment construire une application web moderne, performante et typée avec
                                    Nuxt 3 et TypeScript.
                                </p>
                                <div class="mt-6 flex items-center gap-4">
                                    <img src="/avatar.jpeg" alt="Avatar" class="h-10 w-10 rounded-full object-cover" />
                                    <div>
                                        <p class="text-sm font-medium text-foreground">DoniLite</p>
                                        <p class="text-sm text-muted-foreground">Développeur & Chercheur</p>
                                    </div>
                                </div>
                                <div class="mt-6">
                                    <NuxtLink to="/blog/creer-application-nuxt-typescript"
                                        class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
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
                    <h2 class="text-2xl font-bold tracking-tighter text-foreground md:text-3xl">
                        Tous les articles
                    </h2>
                    <div class="mt-8 grid gap-8 md:grid-cols-2">
                        <!-- Blog Post 1 -->
                        <div class="overflow-hidden rounded-lg border bg-card shadow-sm">
                            <div class="p-6">
                                <div class="flex items-center gap-4">
                                    <span class="text-sm text-muted-foreground">15 Avr 2025</span>
                                    <span
                                        class="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                        Vue.js
                                    </span>
                                </div>
                                <h3 class="mt-4 text-xl font-bold text-foreground">Les nouveautés de Vue 3.5</h3>
                                <p class="mt-2 line-clamp-3 text-muted-foreground">
                                    Explorez les dernières fonctionnalités et améliorations de Vue 3.5 et comment les
                                    intégrer dans vos projets.
                                </p>
                                <div class="mt-6 flex items-center gap-4">
                                    <img src="/avatar.jpeg" alt="Avatar" class="h-8 w-8 rounded-full object-cover" />
                                    <div>
                                        <p class="text-sm font-medium text-foreground">DoniLite</p>
                                    </div>
                                </div>
                                <div class="mt-6">
                                    <NuxtLink to="/blog/nouveautes-vue-3-5"
                                        class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                                        Lire l'article
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>

                        <!-- Blog Post 2 -->
                        <div class="overflow-hidden rounded-lg border bg-card shadow-sm">
                            <div class="p-6">
                                <div class="flex items-center gap-4">
                                    <span class="text-sm text-muted-foreground">10 Avr 2025</span>
                                    <span
                                        class="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                        TypeScript
                                    </span>
                                </div>
                                <h3 class="mt-4 text-xl font-bold text-foreground">Utiliser les types génériques en
                                    TypeScript</h3>
                                <p class="mt-2 line-clamp-3 text-muted-foreground">
                                    Comment créer des composants et fonctions réutilisables avec les types génériques en
                                    TypeScript.
                                </p>
                                <div class="mt-6 flex items-center gap-4">
                                    <img src="/avatar.jpeg" alt="Avatar" class="h-8 w-8 rounded-full object-cover" />
                                    <div>
                                        <p class="text-sm font-medium text-foreground">DoniLite</p>
                                    </div>
                                </div>
                                <div class="mt-6">
                                    <NuxtLink to="/blog/types-generiques-typescript"
                                        class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                                        Lire l'article
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>

                        <!-- Blog Post 3 -->
                        <div class="overflow-hidden rounded-lg border bg-card shadow-sm">
                            <div class="p-6">
                                <div class="flex items-center gap-4">
                                    <span class="text-sm text-muted-foreground">5 Avr 2025</span>
                                    <span
                                        class="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                        Nuxt
                                    </span>
                                </div>
                                <h3 class="mt-4 text-xl font-bold text-foreground">Optimisation SEO avec Nuxt 3</h3>
                                <p class="mt-2 line-clamp-3 text-muted-foreground">
                                    Guide complet pour optimiser le référencement de votre application Nuxt 3 et
                                    améliorer sa visibilité.
                                </p>
                                <div class="mt-6 flex items-center gap-4">
                                    <img src="/avatar.jpeg" alt="Avatar" class="h-8 w-8 rounded-full object-cover" />
                                    <div>
                                        <p class="text-sm font-medium text-foreground">DoniLite</p>
                                    </div>
                                </div>
                                <div class="mt-6">
                                    <NuxtLink to="/blog/optimisation-seo-nuxt-3"
                                        class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                                        Lire l'article
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>

                        <!-- Blog Post 4 -->
                        <div class="overflow-hidden rounded-lg border bg-card shadow-sm">
                            <div class="p-6">
                                <div class="flex items-center gap-4">
                                    <span class="text-sm text-muted-foreground">1 Avr 2025</span>
                                    <span
                                        class="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                        Open Source
                                    </span>
                                </div>
                                <h3 class="mt-4 text-xl font-bold text-foreground">Comment contribuer efficacement à
                                    l'open source</h3>
                                <p class="mt-2 line-clamp-3 text-muted-foreground">
                                    Les meilleures pratiques pour débuter et contribuer de manière significative aux
                                    projets open source.
                                </p>
                                <div class="mt-6 flex items-center gap-4">
                                    <img src="/avatar.jpeg" alt="Avatar" class="h-8 w-8 rounded-full object-cover" />
                                    <div>
                                        <p class="text-sm font-medium text-foreground">DoniLite</p>
                                    </div>
                                </div>
                                <div class="mt-6">
                                    <NuxtLink to="/blog/contribuer-open-source"
                                        class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                                        Lire l'article
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <div class="mt-12 flex items-center justify-center space-x-2">
                        <button
                            class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-sm text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                            <span class="sr-only">Page précédente</span>
                        </button>
                        <button
                            class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                            1
                        </button>
                        <button
                            class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-sm text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                            2
                        </button>
                        <button
                            class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-sm text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                            3
                        </button>
                        <button
                            class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-sm text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                            <span class="sr-only">Page suivante</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Newsletter Section -->
        <section class="py-12 md:py-16 bg-card">
            <div class="container px-4 md:px-6">
                <div class="mx-auto max-w-5xl">
                    <div class="rounded-lg bg-background p-8 shadow-sm">
                        <div class="flex flex-col items-center space-y-4 text-center">
                            <div class="rounded-full bg-primary/10 p-3">
                                <svg class="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" width="24"
                                    height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path
                                        d="M21 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
                                    <path d="m3 7 9 6 9-6" />
                                </svg>
                            </div>
                            <h2 class="text-2xl font-bold tracking-tighter text-foreground md:text-3xl">Restez informé
                            </h2>
                            <p class="max-w-[600px] text-muted-foreground md:text-lg">
                                Abonnez-vous à ma newsletter pour recevoir mes derniers articles et actualités
                                directement dans votre boîte mail.
                            </p>
                            <div class="w-full max-w-md">
                                <form class="flex space-x-2">
                                    <input type="email" placeholder="votre-email@exemple.com"
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                                    <button type="submit"
                                        class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
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