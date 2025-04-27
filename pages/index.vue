<!-- pages/index.vue -->
<template>
  <div class="min-h-screen">
    <div class="absolute flex w-full justify-end border">
      <ThemingTrigger />
    </div>
    <!-- Hero Section -->
    <section class="bg-background relative overflow-hidden py-20 md:py-32">
      <div class="container px-4 md:px-6">
        <div class="flex flex-col items-center space-y-4 text-center">
          <div class="relative mb-4">
            <div
              class="from-primary to-primary/50 absolute -inset-1 rounded-full bg-gradient-to-r opacity-75 blur"
            ></div>
            <div class="border-primary/20 bg-card relative rounded-full border p-1">
              <img
                src="/avatar.jpeg"
                alt="Avatar"
                width="100"
                height="100"
                class="h-24 w-24 rounded-full object-cover"
              />
            </div>
          </div>
          <h1
            class="font-heading text-foreground text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
          >
            {{ $t('name') }}
          </h1>
          <p class="text-muted-foreground max-w-[700px] text-lg md:text-xl">
            {{ $t('me') }}
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <NuxtLink
              to="/projects"
              class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              Mes Projets
            </NuxtLink>
            <NuxtLink
              to="/blog"
              class="border-border bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md border px-8 text-sm font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              Blog
            </NuxtLink>
          </div>
        </div>
      </div>
      <!-- Background Effect -->
      <div class="bg-background absolute inset-0 -z-10 h-full w-full opacity-30">
        <div class="from-background to-background/80 absolute inset-0 bg-gradient-to-r"></div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          className="absolute inset-0"
          style="opacity: 0.05"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 40L40 0M0 0L40 40"
                fill="none"
                stroke="currentColor"
                stroke-width="1"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#grid)"
          />
        </svg>
      </div>
    </section>

    <!-- About Me Section -->
    <section class="bg-card py-16 md:py-24">
      <div class="container px-4 md:px-6">
        <div class="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-10">
          <div class="space-y-4">
            <div class="bg-primary/10 text-primary inline-block rounded-lg px-3 py-1 text-sm">
              À Propos de Moi
            </div>
            <h2 class="text-foreground text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Passionné par le Développement Web
            </h2>
            <p
              class="text-muted-foreground max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
            >
              Je suis un développeur spécialisé dans les technologies web modernes comme Vue.js,
              Nuxt, et TypeScript. J'aime créer des applications performantes et accessibles, en
              contribuant activement à l'écosystème open source.
            </p>
          </div>
          <div class="flex flex-col space-y-4">
            <div class="grid gap-2">
              <div class="bg-card rounded-lg border px-6 py-4 shadow-sm">
                <div class="flex items-center gap-4">
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
                      <path d="M12 19l7-7 3 3-7 7-3-3z" />
                      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                      <path d="M2 2l7.586 7.586" />
                      <circle
                        cx="11"
                        cy="11"
                        r="2"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-foreground font-medium">Développement Web</h3>
                    <p class="text-muted-foreground">Vue.js, Nuxt, TypeScript</p>
                  </div>
                </div>
              </div>
              <div class="bg-card rounded-lg border px-6 py-4 shadow-sm">
                <div class="flex items-center gap-4">
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
                        d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
                      />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-foreground font-medium">Open Source</h3>
                    <p class="text-muted-foreground">Contributions actives et partage</p>
                  </div>
                </div>
              </div>
              <div class="bg-card rounded-lg border px-6 py-4 shadow-sm">
                <div class="flex items-center gap-4">
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
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      <circle
                        cx="12"
                        cy="11"
                        r="1"
                      />
                      <path d="M12 11v3" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-foreground font-medium">Sécurité</h3>
                    <p class="text-muted-foreground">Développement sécurisé et bonnes pratiques</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Projects Section -->
    <section class="bg-background py-16 md:py-24">
      <div class="container px-4 md:px-6">
        <div class="flex flex-col items-center justify-center space-y-4 text-center">
          <div class="space-y-2">
            <div class="bg-primary/10 text-primary inline-block rounded-lg px-3 py-1 text-sm">
              Portfolio
            </div>
            <h2 class="text-foreground text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Projets Récents
            </h2>
            <p
              class="text-muted-foreground mx-auto max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
            >
              Découvrez mes derniers travaux et contributions open source.
            </p>
          </div>
        </div>
        <div class="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <!-- Project Card 1 -->
          <div
            class="group bg-card relative overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
          >
            <div class="p-6">
              <h3 class="text-foreground text-lg font-bold">Projet 1</h3>
              <p class="text-muted-foreground text-sm">
                Une description de ce projet impressionnant
              </p>
              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                >
                  Vue
                </span>
                <span
                  class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                >
                  TypeScript
                </span>
              </div>
            </div>
            <div
              class="bg-accent/50 absolute right-0 bottom-0 left-0 border-t px-6 py-3 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <a
                href="#"
                class="text-accent-foreground text-sm font-medium"
              >
                Voir le projet →
              </a>
            </div>
          </div>
          <!-- Project Card 2 -->
          <div
            class="group bg-card relative overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
          >
            <div class="p-6">
              <h3 class="text-foreground text-lg font-bold">Projet 2</h3>
              <p class="text-muted-foreground text-sm">
                Une description de ce projet impressionnant
              </p>
              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                >
                  Nuxt
                </span>
                <span
                  class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                >
                  TailwindCSS
                </span>
              </div>
            </div>
            <div
              class="bg-accent/50 absolute right-0 bottom-0 left-0 border-t px-6 py-3 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <a
                href="#"
                class="text-accent-foreground text-sm font-medium"
              >
                Voir le projet →
              </a>
            </div>
          </div>
          <!-- Project Card 3 -->
          <div
            class="group bg-card relative overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
          >
            <div class="p-6">
              <h3 class="text-foreground text-lg font-bold">Projet 3</h3>
              <p class="text-muted-foreground text-sm">
                Une description de ce projet impressionnant
              </p>
              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                >
                  JavaScript
                </span>
                <span
                  class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                >
                  API
                </span>
              </div>
            </div>
            <div
              class="bg-accent/50 absolute right-0 bottom-0 left-0 border-t px-6 py-3 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <a
                href="#"
                class="text-accent-foreground text-sm font-medium"
              >
                Voir le projet →
              </a>
            </div>
          </div>
        </div>
        <div class="flex justify-center">
          <NuxtLink
            to="/projects"
            class="border-border bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md border px-8 text-sm font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            Voir tous les projets
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Blog Preview Section -->
    <section class="bg-card py-16 md:py-24">
      <div class="container px-4 md:px-6">
        <div class="flex flex-col items-center justify-center space-y-4 text-center">
          <div class="space-y-2">
            <div class="bg-primary/10 text-primary inline-block rounded-lg px-3 py-1 text-sm">
              Blog
            </div>
            <h2 class="text-foreground text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Articles Récents
            </h2>
            <p
              class="text-muted-foreground mx-auto max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
            >
              Découvrez mes derniers articles techniques et réflexions.
            </p>
          </div>
        </div>
        <div class="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
          <!-- Blog Post 1 -->
          <div
            class="group bg-background relative overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
          >
            <div class="p-6">
              <div class="flex items-center gap-4">
                <span class="text-muted-foreground text-sm">12 Avr 2025</span>
                <span
                  class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                >
                  Vue.js
                </span>
              </div>
              <h3 class="text-foreground mt-4 text-xl font-bold">
                Comment utiliser Composition API dans Vue 3
              </h3>
              <p class="text-muted-foreground mt-2 line-clamp-3">
                Un guide complet pour maîtriser la Composition API et améliorer la structure de vos
                applications Vue.js.
              </p>
              <div class="mt-4">
                <a
                  href="#"
                  class="text-primary text-sm font-medium hover:underline"
                >
                  Lire l'article →
                </a>
              </div>
            </div>
          </div>
          <!-- Blog Post 2 -->
          <div
            class="group bg-background relative overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
          >
            <div class="p-6">
              <div class="flex items-center gap-4">
                <span class="text-muted-foreground text-sm">5 Avr 2025</span>
                <span
                  class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                >
                  TypeScript
                </span>
              </div>
              <h3 class="text-foreground mt-4 text-xl font-bold">
                Les types avancés en TypeScript
              </h3>
              <p class="text-muted-foreground mt-2 line-clamp-3">
                Explorez les fonctionnalités avancées de TypeScript pour rendre votre code plus
                robuste et maintenable.
              </p>
              <div class="mt-4">
                <a
                  href="#"
                  class="text-primary text-sm font-medium hover:underline"
                >
                  Lire l'article →
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-center">
          <NuxtLink
            to="/blog"
            class="border-border bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md border px-8 text-sm font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            Voir tous les articles
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="bg-background py-16 md:py-24">
      <div class="container px-4 md:px-6">
        <div class="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
          <div class="flex flex-col justify-center space-y-4">
            <div class="space-y-2">
              <div class="bg-primary/10 text-primary inline-block rounded-lg px-3 py-1 text-sm">
                Contact
              </div>
              <h2 class="text-foreground text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Travaillons ensemble
              </h2>
              <p
                class="text-muted-foreground max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
              >
                Besoin d'un développeur pour votre projet ? Ou simplement envie de discuter de
                technologie ? N'hésitez pas à me contacter.
              </p>
            </div>
            <div class="flex flex-col gap-2 min-[400px]:flex-row">
              <a
                href="https://github.com/DoniLite"
                target="_blank"
                rel="noopener noreferrer"
                class="bg-card text-foreground border-border hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md border px-8 text-sm font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                <svg
                  class="mr-2 h-4 w-4"
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
                    d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
                  />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                GitHub
              </a>
              <a
                href="mailto:contact@email.com"
                class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                <svg
                  class="mr-2 h-4 w-4"
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
                  <rect
                    width="20"
                    height="16"
                    x="2"
                    y="4"
                    rx="2"
                  />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                Email
              </a>
            </div>
          </div>
          <div class="bg-card rounded-lg border shadow">
            <div class="p-6">
              <h3 class="text-foreground text-xl font-bold">Envoyez-moi un message</h3>
              <form class="mt-4 space-y-4">
                <div class="grid gap-2">
                  <label
                    for="name"
                    class="text-foreground text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Nom
                  </label>
                  <input
                    id="name"
                    type="text"
                    class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Votre nom"
                  />
                </div>
                <div class="grid gap-2">
                  <label
                    for="email"
                    class="text-foreground text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="votre-email@exemple.com"
                  />
                </div>
                <div class="grid gap-2">
                  <label
                    for="message"
                    class="text-foreground text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Votre message"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 w-full items-center justify-center rounded-md px-8 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  Envoyer
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer (suite) -->
    <footer class="bg-card border-t py-6 md:py-8">
      <div class="container px-4 md:px-6">
        <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div class="flex flex-col items-center gap-2 md:items-start md:gap-1">
            <p class="text-muted-foreground text-center text-sm leading-loose md:text-left">
              &copy; {{ new Date().getFullYear() }} DoniLite. Tous droits réservés.
            </p>
          </div>
          <div class="flex gap-4">
            <a
              href="https://github.com/DoniLite"
              target="_blank"
              rel="noopener noreferrer"
              class="text-muted-foreground hover:text-foreground"
            >
              <svg
                class="h-5 w-5"
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
                  d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
                />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span class="sr-only">GitHub</span>
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-muted-foreground hover:text-foreground"
            >
              <svg
                class="h-5 w-5"
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
                  d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
                />
              </svg>
              <span class="sr-only">Twitter</span>
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-muted-foreground hover:text-foreground"
            >
              <svg
                class="h-5 w-5"
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
                  d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                />
                <rect
                  width="4"
                  height="12"
                  x="2"
                  y="9"
                />
                <circle
                  cx="4"
                  cy="4"
                  r="2"
                />
              </svg>
              <span class="sr-only">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Les imports nécessaires seraient ajoutés ici
// Par exemple pour shadcn-ui-vue components
defineOgImageComponent('Frame')
</script>
