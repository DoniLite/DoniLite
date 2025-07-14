<script setup lang="ts">
import { INPUT_CLASS } from '~/shared/const'
import EntityCombobox from '../shared/EntityCombobox.vue'
import InputWithLabel from '../shared/InputWithLabel.vue'
import type { ArticleConfig } from '../shared/types'

const articleTitle = ref('')
const articleSlug = ref('')
const articleTopic = ref('')
const articleDescription = ref('')
const slugs = ref<string[]>()

const handleSlugChange = (value: string) => {
  slugs.value = [...value.split(',')]
}

defineExpose({
  article: () => ({
    title: articleTitle.value,
    description: articleDescription.value,
    slug: slugs.value,
    topic: articleTopic.value
  }),
  setArticle: (config: ArticleConfig) => {
    articleTitle.value = config.title
    articleDescription.value = config.description
    articleSlug.value = config.slugs.join(',')
    articleTopic.value = config.topic
  }
})
</script>

<template>
  <div class="container mx-auto rounded-md p-3">
    <h1 class="text-primary text-xl">
      {{ $t('admin.posts.config.title') }}
    </h1>
    <form
      action=""
      class="mt-8 flex flex-col gap-4"
    >
      <InputWithLabel
        v-model:model-value="articleTitle"
        name="title"
        type="text"
        :placeholder="$t('admin.posts.config.form.title.placeholder')"
        :label="$t('admin.posts.config.form.title.label')"
        :required="true"
      />

      <InputWithLabel
        v-model:model-value="articleSlug"
        name="slug"
        type="text"
        :placeholder="$t('admin.posts.config.form.slug.placeholder')"
        :label="$t('admin.posts.config.form.slug.label')"
        :required="true"
        @input="handleSlugChange"
      />

      <div class="flex w-full flex-col gap-2">
        <label
          for="topic"
          class="font-bold"
        >
          {{ $t('admin.posts.config.form.topic.label') }}
        </label>
        <EntityCombobox
          :placeholder="$t('admin.posts.config.form.topic.placeholder')"
          :entries="mockTopic"
          :model-value="articleTopic"
          class="w-full"
        />
      </div>

      <div class="flex w-full flex-col gap-2">
        <label
          for="description"
          class="font-bold"
        >
          {{ $t('admin.posts.config.form.description.label') }}
        </label>
        <textarea
          id="article-description"
          v-model="articleDescription"
          name="description"
          :class="['w-full', INPUT_CLASS]"
          :placeholder="$t('admin.posts.config.form.description.placeholder')"
        ></textarea>
      </div>
    </form>
  </div>
</template>
