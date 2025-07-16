<script setup lang="ts">
import { VisArea, VisAxis, VisBulletLegend, VisXYContainer } from '@unovis/vue'
interface DataRecord {
  x: string
  y1: number
  y2: number
  y3: number
}
const chartsColor = ref<string[]>([])
const x = (d: DataRecord) => d.x
const y = [(d: DataRecord) => d.y1, (d: DataRecord) => d.y2, (d: DataRecord) => d.y3]
const padding = { left: 20, right: 20, top: 20, bottom: 2 }
const color = (d: DataRecord, i: number) => chartsColor.value[i]
const legends = computed(() =>
  ['views', 'articles', 'total'].map((b, i) => ({
    name: b,
    color: chartsColor.value[i]
  }))
)
const topicLegends = computed(() =>
  mockFilters
    .filter((f) => f !== 'Tous')
    .map((f, i) => ({
      name: f,
      color: chartsColor.value[i]
    }))
)

onMounted(() => {
  chartsColor.value = useChartColors()
})
</script>

<template>
  <VisXYContainer
    :data="mockAreaChartData"
    class="bg-card container mx-auto h-[300px] rounded-md"
    :padding="padding"
  >
    <VisBulletLegend
      :items="topicLegends"
      orientation="horizontal"
    />
    <VisBulletLegend
      :items="legends"
      orientation="vertical"
    />
    <VisAxis
      type="x"
      label="Topics"
      position="bottom"
      :grid-line="false"
    />
    <VisAxis
      type="y"
      position="left"
      :grid-line="false"
    />
    <VisArea
      :x="x"
      :y="y"
      :color="color"
    />
  </VisXYContainer>
</template>
