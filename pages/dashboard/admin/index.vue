<script setup lang="ts">
import { PlusSquare } from 'lucide-vue-next'
import TopicAreaChart from '~/components/charts/AreaChart.vue'
import TopicBarChart from '~/components/charts/BarChart.vue'
import TopicDonutChart from '~/components/charts/DonutChart.vue'
import TopicLineChart from '~/components/charts/LineChart.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})
</script>

<template>
  <div class="p-4 lg:py-8">
    <div class="flex w-full items-center justify-between lg:flex-row">
      <div>
        <h1 class="text-lg font-bold lg:text-4xl">{{ $t('admin.index.dashboard') }}</h1>
        <p class="mt-2">{{ $t('admin.index.description') }}</p>
      </div>

      <PlusSquare class="text-primary h-8 w-8 cursor-pointer" />
    </div>

    <div class="my-4 grid w-full grid-cols-1 gap-4 lg:w-[80%] lg:grid-cols-3">
      <AdminCard
        v-for="data in mockAdminCardData"
        :key="data.title"
        v-bind="data"
      />
    </div>

    <div class="my-4 p-1 lg:p-3">
      <h1 class="my-6 text-xl font-bold lg:text-3xl">
        {{ $t('charts.articles.title') }}
      </h1>
      <TopicAreaChart />
      <TopicDonutChart />
      <TopicBarChart />
      <TopicLineChart />
    </div>
  </div>
</template>
