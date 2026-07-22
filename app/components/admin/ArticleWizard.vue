<script setup lang="ts">
import { CheckCircle2 } from 'lucide-vue-next'
import Editor from '~/components/shared/Editor.vue'
import { Button } from '~/components/ui/button'
import type { Article, ArticleLocale } from '~~/shared/types'
import type { ArticleConfig as Config } from '../shared/types'
import ArticleConfig from './ArticleConfig.vue'

const emit = defineEmits<{ created: [] }>()

const { locale, t } = useI18n()

type WizardStep = 'write' | 'configure' | 'translate' | 'publish'
const steps: WizardStep[] = ['write', 'configure', 'translate', 'publish']
const currentStep = ref<WizardStep>('write')
const currentStepIndex = computed(() => steps.indexOf(currentStep.value))

const articleContent = ref('')
const defaultConfig = (): Config => ({
  title: '',
  description: '',
  slugs: [],
  tagIds: [],
  sourceLocale: locale.value === 'fr' ? 'fr' : 'en'
})
const articleConfig = ref<Config>(defaultConfig())

const draftArticle = ref<Article | null>(null)
const saving = ref(false)
const saveError = ref('')
const translationChoice = ref<'skip' | 'translate' | null>(null)
const translating = ref(false)
const publishing = ref(false)

const otherLocale = computed<ArticleLocale>(() =>
  articleConfig.value.sourceLocale === 'en' ? 'fr' : 'en'
)

const canGoNext = computed(() => {
  if (currentStep.value === 'write') {
    return articleContent.value.trim().length > 0
  }
  if (currentStep.value === 'configure') {
    return articleConfig.value.title.trim().length > 0
  }
  return true
})

const stepStatus = (index: number) => {
  if (index < currentStepIndex.value) {
    return 'done'
  }
  if (index === currentStepIndex.value) {
    return 'active'
  }
  return 'pending'
}

const ensureDraftCreated = async () => {
  if (draftArticle.value) {
    return
  }
  saving.value = true
  saveError.value = ''
  try {
    draftArticle.value = await $fetch<Article>('/api/articles', {
      method: 'POST',
      body: {
        status: 'draft',
        sourceLocale: articleConfig.value.sourceLocale,
        tagIds: articleConfig.value.tagIds,
        translation: {
          locale: articleConfig.value.sourceLocale,
          translationStatus: 'reviewed',
          title: articleConfig.value.title,
          slug: articleConfig.value.slugs[0],
          description: articleConfig.value.description || articleConfig.value.title,
          content: articleContent.value,
          contentFormat: 'markdown'
        }
      }
    })
  } catch (error) {
    saveError.value = error instanceof Error ? error.message : 'Unable to save draft'
  } finally {
    saving.value = false
  }
}

const goNext = async () => {
  if (currentStep.value === 'write') {
    currentStep.value = 'configure'
    return
  }
  if (currentStep.value === 'configure') {
    await ensureDraftCreated()
    if (!saveError.value) {
      currentStep.value = 'translate'
    }
    return
  }
  if (currentStep.value === 'translate') {
    currentStep.value = 'publish'
  }
}

const goBack = () => {
  const index = currentStepIndex.value
  if (index > 0) {
    currentStep.value = steps[index - 1] as WizardStep
  }
}

const skipTranslation = () => {
  translationChoice.value = 'skip'
  currentStep.value = 'publish'
}

const translateNow = async () => {
  if (!draftArticle.value) {
    return
  }
  translating.value = true
  saveError.value = ''
  try {
    draftArticle.value = await $fetch<Article>(
      `/api/articles/${draftArticle.value.id}/translations/queue`,
      {
        method: 'POST',
        body: { targetLocale: otherLocale.value, sourceLocale: articleConfig.value.sourceLocale }
      }
    )
    translationChoice.value = 'translate'
    currentStep.value = 'publish'
  } catch (error) {
    saveError.value = error instanceof Error ? error.message : 'Unable to prepare translation'
  } finally {
    translating.value = false
  }
}

const resetWizard = () => {
  articleContent.value = ''
  articleConfig.value = defaultConfig()
  draftArticle.value = null
  translationChoice.value = null
  currentStep.value = 'write'
}

const finish = async (status: 'draft' | 'published') => {
  if (!draftArticle.value) {
    return
  }
  publishing.value = true
  saveError.value = ''
  try {
    await $fetch(`/api/articles/${draftArticle.value.id}`, {
      method: 'PATCH',
      body: {
        status,
        publishedAt: status === 'published' ? new Date().toISOString() : null
      }
    })
    emit('created')
    resetWizard()
  } catch (error) {
    saveError.value = error instanceof Error ? error.message : 'Unable to publish article'
  } finally {
    publishing.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Stepper -->
    <ol class="flex items-center">
      <li
        v-for="(step, index) in steps"
        :key="step"
        class="flex flex-1 items-center gap-2 last:flex-none"
      >
        <div class="flex items-center gap-2">
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors"
            :class="{
              'border-primary bg-primary text-primary-foreground': stepStatus(index) === 'done',
              'border-primary text-primary': stepStatus(index) === 'active',
              'border-border text-muted-foreground': stepStatus(index) === 'pending'
            }"
          >
            <CheckCircle2
              v-if="stepStatus(index) === 'done'"
              class="h-5 w-5"
            />
            <span v-else>{{ index + 1 }}</span>
          </span>
          <span
            class="text-sm font-medium whitespace-nowrap"
            :class="stepStatus(index) === 'pending' ? 'text-muted-foreground' : 'text-foreground'"
          >
            {{ $t(`admin.posts.wizard.steps.${step}`) }}
          </span>
        </div>
        <div
          v-if="index < steps.length - 1"
          class="mx-2 h-px flex-1 transition-colors"
          :class="stepStatus(index) === 'done' ? 'bg-primary' : 'bg-border'"
        ></div>
      </li>
    </ol>

    <p
      v-if="saveError"
      class="border-destructive bg-destructive/10 text-destructive rounded-md border p-3 text-sm"
    >
      {{ saveError }}
    </p>

    <Transition
      name="step"
      mode="out-in"
    >
      <div :key="currentStep">
        <ClientOnly
          v-if="currentStep === 'write'"
          :fallback="t('common.loading')"
        >
          <Editor v-model="articleContent" />
        </ClientOnly>

        <div
          v-else-if="currentStep === 'configure'"
          class="bg-card rounded-lg border"
        >
          <ArticleConfig v-model="articleConfig" />
        </div>

        <div
          v-else-if="currentStep === 'translate'"
          class="bg-card flex flex-col gap-4 rounded-lg border p-6"
        >
          <div v-if="!translationChoice">
            <h3 class="font-semibold">
              {{ $t('admin.posts.wizard.translate.prompt', { locale: otherLocale.toUpperCase() }) }}
            </h3>
            <p class="text-muted-foreground mt-1 text-sm">
              {{ $t('admin.posts.wizard.translate.hint') }}
            </p>
            <div class="mt-4 flex gap-2">
              <Button
                variant="outline"
                @click="skipTranslation"
              >
                {{ $t('admin.posts.wizard.translate.skip') }}
              </Button>
              <Button
                :disabled="translating"
                @click="translateNow"
              >
                {{
                  translating
                    ? t('common.loading')
                    : t('admin.posts.wizard.translate.now', { locale: otherLocale.toUpperCase() })
                }}
              </Button>
            </div>
          </div>
          <div
            v-else-if="translationChoice === 'translate'"
            class="text-primary flex items-center gap-2 text-sm"
          >
            <CheckCircle2 class="h-5 w-5" />
            {{ $t('admin.posts.wizard.translate.done') }}
          </div>
          <div
            v-else
            class="text-muted-foreground text-sm"
          >
            {{ $t('admin.posts.wizard.translate.skipped') }}
          </div>
        </div>

        <div
          v-else-if="currentStep === 'publish'"
          class="bg-card flex flex-col gap-4 rounded-lg border p-6"
        >
          <div>
            <h3 class="text-foreground font-semibold">{{ articleConfig.title }}</h3>
            <p class="text-muted-foreground text-sm">{{ articleConfig.description }}</p>
          </div>
          <div class="flex gap-2">
            <Button
              variant="outline"
              :disabled="publishing"
              @click="finish('draft')"
            >
              {{ $t('admin.posts.actions.draft') }}
            </Button>
            <Button
              :disabled="publishing"
              @click="finish('published')"
            >
              {{ $t('admin.posts.actions.publish') }}
            </Button>
          </div>
        </div>
      </div>
    </Transition>

    <div class="flex justify-between">
      <Button
        v-if="currentStepIndex > 0 && currentStep !== 'publish'"
        variant="ghost"
        @click="goBack"
      >
        {{ $t('common.previous') }}
      </Button>
      <div v-else></div>
      <Button
        v-if="currentStep !== 'publish'"
        :disabled="!canGoNext || saving"
        @click="goNext"
      >
        {{ saving ? t('common.saving') : t('common.next') }}
      </Button>
    </div>
  </div>
</template>

<style scoped>
.step-enter-active,
.step-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.step-enter-from {
  opacity: 0;
  transform: translateX(12px);
}
.step-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}
</style>
