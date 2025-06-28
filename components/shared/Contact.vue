<script setup lang="ts">
import { Github, Mail } from 'lucide-vue-next'
</script>

<template>
  <section class="bg-background py-16 md:py-24">
    <div class="container mx-auto px-4 md:px-6">
      <div class="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
        <div class="flex flex-col justify-center space-y-4">
          <div class="space-y-2">
            <div
              id="contact"
              class="bg-primary/10 text-primary inline-block rounded-lg px-3 py-1 text-sm"
            >
              {{ $t('page.contact.id') }}
            </div>
            <h2 class="text-foreground text-3xl font-bold tracking-tighter md:text-4xl/tight">
              {{ $t('page.contact.title') }}
            </h2>
            <p
              class="text-muted-foreground max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
            >
              {{ $t('page.contact.description') }}
            </p>
          </div>
          <div class="flex flex-col gap-2 min-[400px]:flex-row">
            <a
              href="https://github.com/DoniLite"
              target="_blank"
              rel="noopener noreferrer"
              class="bg-card text-foreground border-border hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md border px-8 text-sm font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <Github class="mr-2 h-4 w-4" />
              {{ $t('common.github') }}
            </a>
            <a
              href="mailto:contact@email.com"
              class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <Mail class="mr-2 h-4 w-4" />
              {{ $t('page.contact.form.email') }}
            </a>
          </div>
        </div>
        <div class="bg-card rounded-lg border shadow">
          <div class="p-6">
            <h3 class="text-foreground text-xl font-bold">
              {{ $t('page.contact.send_me_message') }}
            </h3>
            <form class="mt-4 space-y-4">
              <div class="grid gap-2">
                <label
                  for="name"
                  class="text-foreground text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {{ $t('page.contact.form.name') }}
                </label>
                <input
                  id="name"
                  type="text"
                  class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  :placeholder="
                    $t('page.contact.placeholder.your', { entity: $t('page.contact.form.name') })
                  "
                />
              </div>
              <div class="grid gap-2">
                <label
                  for="email"
                  class="text-foreground text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {{ $t('page.contact.form.email') }}
                </label>
                <input
                  id="email"
                  type="email"
                  class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  :placeholder="
                    $t('page.contact.placeholder.your', { entity: $t('page.contact.form.email') })
                  "
                />
              </div>
              <div class="grid gap-2">
                <label
                  for="message"
                  class="text-foreground text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {{ $t('page.contact.form.message') }}
                </label>
                <textarea
                  id="message"
                  class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  :placeholder="
                    $t('page.contact.placeholder.your', { entity: $t('page.contact.form.message') })
                  "
                ></textarea>
              </div>
              <button
                type="submit"
                class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 w-full items-center justify-center rounded-md px-8 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                {{ $t('page.contact.form.send') }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
