<script setup lang="ts">
import { PlusSquare } from 'lucide-vue-next'
import MessageList from '~/components/admin/MessageList.vue'
import TopicAreaChart from '~/components/charts/AreaChart.vue'
import TopicDonutChart from '~/components/charts/DonutChart.vue'
import TopicLineChart from '~/components/charts/LineChart.vue'
import ScatterChart from '~/components/charts/ScatterChart.vue'

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
      <div class="flex w-full flex-col gap-4 py-8 lg:flex-row">
        <TopicDonutChart />
        <MessageList />
      </div>
      <TopicLineChart :multi-line="true" />
      <ScatterChart />
    </div>
  </div>
</template>
