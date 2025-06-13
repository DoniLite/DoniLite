<template>
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
            {{ $t('page.index.my_projects') }}
          </NuxtLink>
          <NuxtLink
            to="/blog"
            class="border-border bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md border px-8 text-sm font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            {{ $t('common.blog') }}
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
</template>
