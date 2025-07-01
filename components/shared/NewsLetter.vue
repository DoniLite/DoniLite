<template>
  <section class="bg-card py-12 md:py-16">
    <div class="container mx-auto px-4 md:px-6">
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
              {{ $t('newsletter.title') }}
            </h2>
            <p class="text-muted-foreground max-w-[600px] md:text-lg">
              {{ $t('newsletter.description') }}
            </p>
            <div class="w-full max-w-md">
              <form class="flex space-x-2">
                <input
                  type="email"
                  placeholder="email@example.com"
                  class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                  type="submit"
                  class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  {{ $t('newsletter.subscribe') }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
