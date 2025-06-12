<template>
  <section class="bg-card py-16 md:py-24">
    <div class="container px-4 md:px-6">
      <div class="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-10">
        <div class="space-y-4">
          <div
            id="about"
            class="bg-primary/10 text-primary inline-block rounded-lg px-3 py-1 text-sm"
          >
            {{ $t('common.about_me') }}
          </div>
          <h2 class="text-foreground text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {{ $t('page.index.about_section.title') }}
          </h2>
          <p
            class="text-muted-foreground max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
          >
            {{ $t('page.index.about_section.description') }}
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
                  <h3 class="text-foreground font-medium">
                    {{ $t('page.index.about_section.labels.1.title') }}
                  </h3>
                  <p class="text-muted-foreground">
                    {{ $t('page.index.about_section.labels.1.desc') }}
                  </p>
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
                  <h3 class="text-foreground font-medium">
                    {{ $t('page.index.about_section.labels.2.title') }}
                  </h3>
                  <p class="text-muted-foreground">
                    {{ $t('page.index.about_section.labels.2.desc') }}
                  </p>
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
                  <h3 class="text-foreground font-medium">
                    {{ $t('page.index.about_section.labels.3.title') }}
                  </h3>
                  <p class="text-muted-foreground">
                    {{ $t('page.index.about_section.labels.3.desc') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
