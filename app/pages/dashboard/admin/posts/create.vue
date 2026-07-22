<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import ArticleWizard from '~/components/admin/ArticleWizard.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const localePath = useLocalePath()
const router = useRouter()

const onCreated = () => {
  router.push(localePath('/dashboard/admin/posts'))
}
</script>

<template>
  <div class="flex flex-col gap-6 p-4">
    <div>
      <NuxtLink
        :to="localePath('/dashboard/admin/posts')"
        class="text-muted-foreground hover:text-foreground mb-2 inline-flex items-center gap-2 text-sm"
      >
        <ArrowLeft class="h-4 w-4" />
        {{ $t('admin.posts.wizard.back') }}
      </NuxtLink>
      <h1 class="text-foreground text-2xl font-bold">
        {{ $t('admin.posts.wizard.title') }}
      </h1>
    </div>

    <section class="border-border bg-card rounded-lg border p-4 lg:p-6">
      <ArticleWizard @created="onCreated" />
    </section>
  </div>
</template>
