<script setup lang="ts">
import { VisArea, VisAxis, VisBulletLegend, VisXYContainer } from '@unovis/vue'

interface DataRecord {
  x: number
  y1: number
  y2: number
  y3: number
}

interface Props {
  data?: DataRecord[]
  height?: number
  showLegend?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  data: () => mockAreaChartData,
  height: 300,
  showLegend: true
})

const chartsColor = ref<string[]>([])
const containerRef = ref<HTMLElement>()

const x = (d: DataRecord) => d.x
const y = [(d: DataRecord) => d.y1, (d: DataRecord) => d.y2, (d: DataRecord) => d.y3]

const padding = computed(() => ({
  left: 10,
  right: 10,
  top: props.showLegend ? 60 : 20,
  bottom: 10
}))

const color = computed(() => (d: DataRecord, i: number) => chartsColor.value[i])

const dataLegends = computed(() =>
  ['Vues', 'Articles', 'Total'].map((label, i) => ({
    name: label,
    color: chartsColor.value[i]
  }))
)

// const topicLegends = computed(() =>
//   mockFilters
//     .filter((f) => f !== 'Tous')
//     .map((f, i) => ({
//       name: f,
//       color: chartsColor.value[i]
//     }))
// )

onMounted(() => {
  chartsColor.value = useChartColors()
})
</script>

<template>
  <div
    ref="containerRef"
    class="w-full"
  >
    <VisXYContainer
      :data="props.data"
      class="bg-card border-border rounded-lg border shadow-sm"
      :style="{ height: `${props.height}px` }"
      :padding="padding"
    >
      <VisBulletLegend
        v-if="props.showLegend"
        :items="dataLegends"
        orientation="horizontal"
        class="text-muted-foreground text-sm"
      />
      <VisAxis
        type="x"
        label="Période"
        position="bottom"
        :grid-line="false"
        class="text-muted-foreground"
      />
      <VisAxis
        type="y"
        position="left"
        :grid-line="false"
        :tick-format="(d: number) => d.toLocaleString()"
        class="text-muted-foreground"
      />

      <VisArea
        :x="x"
        :y="y"
        :color="color"
        :opacity="0.7"
      />
    </VisXYContainer>
  </div>
</template>
