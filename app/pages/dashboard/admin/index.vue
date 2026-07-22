<script setup lang="ts">
import {
  Briefcase,
  Eye,
  FilePenLine,
  Inbox,
  ListChecks,
  Mail,
  PenBox,
  Users
} from 'lucide-vue-next'
import MessageList from '~/components/admin/MessageList.vue'
import AreaChart from '~/components/charts/AreaChart.vue'
import BarChart from '~/components/charts/BarChart.vue'
import TopicDonutChart from '~/components/charts/DonutChart.vue'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import type { Repos } from '~~/shared/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

interface DashboardStats {
  postsCount: number
  messagesCount: number
  contactsCount: number
  totalViews: number
  failedJobsCount: number
  tagDistribution: { label: string; value: number; count: number }[]
  topArticles: { label: string; value: number }[]
  monthlyGrowth: {
    x: number
    month: string
    articles: number
    messages: number
    subscribers: number
  }[]
}

const { data: stats } = await useFetch<DashboardStats>('/api/admin/stats', {
  default: () => ({
    postsCount: 0,
    messagesCount: 0,
    contactsCount: 0,
    totalViews: 0,
    failedJobsCount: 0,
    tagDistribution: [],
    topArticles: [],
    monthlyGrowth: []
  })
})

const { data: repos } = await useFetch<Repos[]>('/api/repos', { default: () => [] })

const { t, d } = useI18n()
const localePath = useLocalePath()

const growthChartData = computed(() =>
  stats.value.monthlyGrowth.map((point) => ({
    x: point.x,
    y1: point.articles,
    y2: point.messages,
    y3: point.subscribers
  }))
)

const monthTickFormat = (index: number) => {
  const point = stats.value.monthlyGrowth[index]
  if (!point) {
    return ''
  }
  const [year, month] = point.month.split('-').map(Number)
  return d(new Date(year ?? 0, (month ?? 1) - 1, 1), { month: 'short', year: '2-digit' })
}

const cards = computed(() => [
  { statsIcon: PenBox, title: t('admin.index.cards.posts'), total: stats.value.postsCount },
  { statsIcon: Mail, title: t('admin.index.cards.messages'), total: stats.value.messagesCount },
  { statsIcon: Users, title: t('admin.index.cards.contacts'), total: stats.value.contactsCount },
  { statsIcon: Briefcase, title: t('admin.index.stats.total_projects'), total: repos.value.length },
  { statsIcon: Eye, title: t('admin.index.stats.total_visitors'), total: stats.value.totalViews }
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

    <div class="my-4 flex flex-wrap gap-2">
      <Button as-child>
        <NuxtLink :to="localePath('/dashboard/admin/posts/create')">
          <FilePenLine class="h-4 w-4" />
          {{ $t('admin.index.actions.create_post') }}
        </NuxtLink>
      </Button>
      <Button
        as-child
        variant="outline"
      >
        <NuxtLink :to="localePath('/dashboard/admin/inbox')">
          <Inbox class="h-4 w-4" />
          {{ $t('admin.index.actions.view_inbox') }}
          <Badge
            v-if="stats.messagesCount > 0"
            variant="secondary"
          >
            {{ stats.messagesCount }}
          </Badge>
        </NuxtLink>
      </Button>
      <Button
        as-child
        variant="outline"
      >
        <NuxtLink :to="localePath('/dashboard/admin/jobs')">
          <ListChecks class="h-4 w-4" />
          {{ $t('admin.index.actions.view_jobs') }}
          <Badge
            v-if="stats.failedJobsCount > 0"
            variant="destructive"
          >
            {{ stats.failedJobsCount }}
          </Badge>
        </NuxtLink>
      </Button>
    </div>

    <div class="my-4 grid w-full grid-cols-1 gap-4 lg:w-[80%] lg:grid-cols-3">
      <AdminCard
        v-for="data in cards"
        :key="data.title"
        v-bind="data"
      />
    </div>

    <section class="my-8 p-1 lg:p-3">
      <h2 class="mb-4 text-xl font-bold lg:text-3xl">
        {{ $t('admin.index.charts.growth') }}
      </h2>
      <AreaChart
        v-if="growthChartData.length > 0"
        :data="growthChartData"
        :legend-labels="[
          $t('admin.index.charts.articles'),
          $t('admin.index.charts.messages'),
          $t('admin.index.charts.subscribers')
        ]"
        :x-axis-label="$t('admin.index.charts.period')"
        :x-tick-format="monthTickFormat"
      />
    </section>

    <section class="my-8 grid grid-cols-1 gap-6 p-1 lg:grid-cols-2 lg:p-3">
      <div>
        <h2 class="mb-4 text-xl font-bold lg:text-3xl">
          {{ $t('admin.index.charts.topArticles') }}
        </h2>
        <BarChart
          v-if="stats.topArticles.length > 0"
          :data="stats.topArticles"
        />
        <p
          v-else
          class="text-muted-foreground border-border rounded-lg border border-dashed p-6 text-center text-sm"
        >
          {{ $t('admin.index.charts.noData') }}
        </p>
      </div>

      <div v-if="stats.tagDistribution.length > 0">
        <h2 class="mb-4 text-xl font-bold lg:text-3xl">
          {{ $t('charts.articles.title') }}
        </h2>
        <TopicDonutChart :data="stats.tagDistribution" />
      </div>
    </section>

    <section class="my-8 p-1 lg:p-3">
      <h2 class="mb-4 text-xl font-bold lg:text-3xl">
        {{ $t('admin.index.charts.recentMessages') }}
      </h2>
      <MessageList />
    </section>
  </div>
</template>
