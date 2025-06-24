<template>
    <section class="py-12 md:py-20 bg-card">
            <div class="container px-4 md:px-6">
                <div class="mx-auto flex max-w-5xl flex-col items-center text-center">
                    <div class="flex flex-col items-center space-y-4">
                        <div class="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                            {{ $t('common.blog') }}
                        </div>
                        <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
                            {{ $t('common.articles') }} & {{ $t('common.news') }}
                        </h1>
                        <p class="max-w-[700px] text-lg text-muted-foreground md:text-xl">
                            {{ $t('blog.hero') }}
                        </p>
                    </div>
                    <div class="mt-8 flex w-full max-w-md items-center space-x-2">
                        <div class="relative flex-1">
                            <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                            <input type="search" :placeholder="$t('blog.form.search.placeholder')"
                                class="flex h-10 w-full rounded-md border border-input bg-background pl-9 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                        </div>
                        <button type="submit"
                            class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                            {{ $t('blog.form.search.id') }}
                        </button>
                    </div>
                </div>
            </div>
        </section>
</template>