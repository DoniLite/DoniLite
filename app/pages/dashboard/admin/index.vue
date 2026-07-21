<script setup lang="ts">
import { Mail, PenBox, Users } from 'lucide-vue-next'
import MessageList from '~/components/admin/MessageList.vue'
import TopicDonutChart from '~/components/charts/DonutChart.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

interface DashboardStats {
  postsCount: number
  messagesCount: number
  contactsCount: number
  tagDistribution: { label: string; value: number; count: number }[]
}

const { data: stats } = await useFetch<DashboardStats>('/api/admin/stats', {
  default: () => ({ postsCount: 0, messagesCount: 0, contactsCount: 0, tagDistribution: [] })
})

const { t } = useI18n()

const cards = computed(() => [
  { statsIcon: PenBox, title: t('admin.index.cards.posts'), total: stats.value.postsCount },
  { statsIcon: Mail, title: t('admin.index.cards.messages'), total: stats.value.messagesCount },
  { statsIcon: Users, title: t('admin.index.cards.contacts'), total: stats.value.contactsCount }
])
</script>

<template>
  <div class="p-4 lg:py-8">
    <div class="flex w-full items-center justify-between lg:flex-row">
      <div>
        <h1 class="text-lg font-bold lg:text-4xl">{{ $t('admin.index.dashboard') }}</h1>
        <p class="mt-2">{{ $t('admin.index.description') }}</p>
      </div>
    </div>

    <div class="my-4 grid w-full grid-cols-1 gap-4 lg:w-[80%] lg:grid-cols-3">
      <AdminCard
        v-for="data in cards"
        :key="data.title"
        v-bind="data"
      />
    </div>

    <div
      v-if="stats.tagDistribution.length > 0"
      class="my-4 p-1 lg:p-3"
    >
      <h1 class="my-6 text-xl font-bold lg:text-3xl">
        {{ $t('charts.articles.title') }}
      </h1>
      <div class="flex w-full flex-col gap-4 py-8 lg:flex-row">
        <TopicDonutChart :data="stats.tagDistribution" />
        <MessageList />
      </div>
    </div>
    <div
      v-else
      class="my-4 p-1 lg:p-3"
    >
      <MessageList />
    </div>
  </div>
</template>
