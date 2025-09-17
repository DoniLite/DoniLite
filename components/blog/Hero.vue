<script setup lang="ts">
import { Search } from 'lucide-vue-next'
</script>

<template>
  <section class="bg-card py-12 md:py-20">
    <div class="container mx-auto px-4 md:px-6">
      <div class="mx-auto flex max-w-5xl flex-col items-center text-center">
        <div class="flex flex-col items-center space-y-4">
          <div class="bg-primary/10 text-primary inline-block rounded-lg px-3 py-1 text-sm">
            {{ $t('common.blog') }}
          </div>
          <h1 class="text-foreground text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            {{ $t('common.articles') }} & {{ $t('common.news') }}
          </h1>
          <p class="text-muted-foreground max-w-[700px] text-lg md:text-xl">
            {{ $t('blog.hero') }}
          </p>
        </div>
        <div class="mt-8 flex w-full max-w-md items-center space-x-2">
          <div class="relative flex-1">
            <Search
              class="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            />
            <input
              type="text"
              :placeholder="$t('blog.form.search.placeholder')"
              class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border py-2 pl-9 text-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            {{ $t('blog.form.search.id') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
