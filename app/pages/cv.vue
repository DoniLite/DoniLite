<script setup lang="ts">
const { t } = useI18n()

const cvFiles = [
  {
    label: 'English',
    file: '/CV/CV_NOGBEDZI_Yao_EN.pdf',
    ats: '/CV/CV_NOGBEDZI_Yao_EN_ATS.pdf'
  },
  {
    label: 'Français',
    file: '/CV/CV_NOGBEDZI_Yao_FR.pdf',
    ats: '/CV/CV_NOGBEDZI_Yao_FR_ATS.pdf'
  }
]

useSeoMeta({
  title: 'Doni Lite | CV',
  ogTitle: 'Doni Lite | CV',
  description: 'Download my resume in English or French.',
  ogDescription: 'Download my resume in English or French.'
})

defineOgImage('Frame', {
  headline: t('page.cv.headline'),
  title: t('page.cv.title'),
  description: t('page.cv.description')
})
</script>

<template>
  <div class="min-h-screen">
    <section class="bg-background py-16 md:py-24">
      <div class="container mx-auto px-4 md:px-6">
        <div class="mx-auto max-w-2xl space-y-12">
          <div class="space-y-4 text-center">
            <div class="bg-primary/10 text-primary inline-block rounded-lg px-3 py-1 text-sm">
              {{ t('page.cv.headline') }}
            </div>
            <h1 class="text-foreground text-3xl font-bold tracking-tighter md:text-4xl/tight">
              {{ t('page.cv.title') }}
            </h1>
            <p class="text-muted-foreground mx-auto max-w-[500px] md:text-xl/relaxed">
              {{ t('page.cv.description') }}
            </p>
          </div>

          <div class="space-y-6">
            <div
              v-for="cv in cvFiles"
              :key="cv.label"
              class="border-border rounded-lg border p-6"
            >
              <h2 class="text-foreground mb-4 text-lg font-semibold">
                {{ cv.label }}
              </h2>
              <div class="flex flex-wrap gap-3">
                <a
                  :href="cv.file"
                  download
                  class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-medium transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line
                      x1="12"
                      y1="15"
                      x2="12"
                      y2="3"
                    />
                  </svg>
                  {{ t('page.cv.download') }}
                </a>
                <a
                  :href="cv.ats"
                  download
                  class="border-border bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 items-center justify-center rounded-md border px-6 text-sm font-medium transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line
                      x1="16"
                      y1="13"
                      x2="8"
                      y2="13"
                    />
                    <line
                      x1="16"
                      y1="17"
                      x2="8"
                      y2="17"
                    />
                  </svg>
                  {{ t('page.cv.ats') }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
