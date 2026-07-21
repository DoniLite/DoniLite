<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { tagService } from '~/lib/service/tag.service'
import { INPUT_CLASS } from '~~/shared/const'
import type { ArticleLocale } from '~~/shared/types'
import EntityCombobox from '../shared/EntityCombobox.vue'
import InputWithLabel from '../shared/InputWithLabel.vue'
import type { ArticleConfig } from '../shared/types'

const supportedLocales: ArticleLocale[] = ['en', 'fr']

// Owned by the parent (survives the settings Sheet unmounting/remounting on close).
const model = defineModel<ArticleConfig>({ required: true })

const slugInput = computed({
  get: () => model.value.slugs.join(','),
  set: (value: string) => {
    model.value.slugs = value
      .split(',')
      .map((slug) => slug.trim())
      .filter(Boolean)
  }
})

const newTagLabel = ref('')
const tagBusy = ref(false)

const { data: tags, refresh: refreshTags } = await tagService.list()
const tagEntries = computed(() => tags.value.map((tag) => ({ id: tag.id, label: tag.label })))

const createTag = async () => {
  if (!newTagLabel.value.trim()) {
    return
  }
  tagBusy.value = true
  try {
    const created = await tagService.createTag({ label: newTagLabel.value.trim() })
    await refreshTags()
    model.value.tagIds = [...model.value.tagIds, created.id]
    newTagLabel.value = ''
  } finally {
    tagBusy.value = false
  }
}
</script>

<template>
  <div class="container mx-auto rounded-md p-3">
    <form
      action=""
      class="mt-8 flex flex-col gap-4"
    >
      <div class="flex w-full flex-col gap-2">
        <span class="font-bold">
          {{ $t('admin.posts.config.form.sourceLocale.label') }}
        </span>
        <div class="flex gap-2">
          <Button
            v-for="localeOption in supportedLocales"
            :key="localeOption"
            type="button"
            size="sm"
            :variant="model.sourceLocale === localeOption ? 'default' : 'outline'"
            @click="model.sourceLocale = localeOption"
          >
            {{ localeOption.toUpperCase() }}
          </Button>
        </div>
        <p class="text-muted-foreground text-xs">
          {{ $t('admin.posts.config.form.sourceLocale.hint') }}
        </p>
      </div>

      <InputWithLabel
        v-model:model-value="model.title"
        name="title"
        type="text"
        :placeholder="$t('admin.posts.config.form.title.placeholder')"
        :label="$t('admin.posts.config.form.title.label')"
        :required="true"
      />

      <InputWithLabel
        v-model:model-value="slugInput"
        name="slug"
        type="text"
        :placeholder="$t('admin.posts.config.form.slug.placeholder')"
        :label="$t('admin.posts.config.form.slug.label')"
        :required="true"
      />

      <div class="flex w-full flex-col gap-2">
        <label
          for="topic"
          class="font-bold"
        >
          {{ $t('admin.posts.config.form.topic.label') }}
        </label>
        <EntityCombobox
          v-model="model.tagIds"
          :multiple="true"
          :placeholder="$t('admin.posts.config.form.topic.placeholder')"
          :entries="tagEntries"
          class="w-full"
        />
        <div class="flex gap-2">
          <Input
            v-model="newTagLabel"
            :placeholder="$t('admin.posts.config.form.topic.newTagPlaceholder')"
            class="h-9"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            :disabled="tagBusy || !newTagLabel.trim()"
            @click="createTag"
          >
            <Plus class="h-4 w-4" />
          </Button>
        </div>
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
          v-model="model.description"
          name="description"
          :class="['w-full', INPUT_CLASS]"
          :placeholder="$t('admin.posts.config.form.description.placeholder')"
        ></textarea>
      </div>
    </form>
  </div>
</template>
