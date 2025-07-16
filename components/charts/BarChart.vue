<script setup lang="ts">
import { VisAxis, VisBulletLegend, VisGroupedBar, VisTooltip, VisXYContainer } from '@unovis/vue'

interface BarDataRecord {
  label: string
  value: number
  articles: number
}

interface Props {
  data?: BarDataRecord[]
  height?: number
  showLegend?: boolean
  showTooltip?: boolean
  orientation?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
  data: () => mockBarChartData,
  height: 300,
  showLegend: true,
  showTooltip: true,
  orientation: 'vertical'
})

const chartsColor = ref<string[]>([])

// Accesseurs de données selon l'orientation
const x = (d: BarDataRecord) => d.articles
const y = (d: BarDataRecord) => d.value

// Configuration du padding
const padding = computed(() => ({
  left: props.orientation === 'horizontal' ? 80 : 40,
  right: 40,
  top: props.showLegend ? 60 : 20,
  bottom: props.orientation === 'vertical' ? 60 : 40
}))

// Configuration des couleurs
const color = (d: BarDataRecord, i: number) => chartsColor.value[i % chartsColor.value.length]

// Légendes
const legends = computed(() =>
  props.data.map((item, i) => ({
    name: item.label,
    color: chartsColor.value[i % chartsColor.value.length]
  }))
)

// Configuration du tooltip
const tooltipTemplate = (d: BarDataRecord) => `
  <div class="bg-popover border border-border rounded-lg p-3 shadow-lg">
    <div class="font-semibold mb-2 text-foreground">${d.label}</div>
    <div class="space-y-1 text-sm">
      <div class="flex justify-between gap-4">
        <span class="text-muted-foreground">Popularité:</span>
        <span class="font-medium text-foreground">${d.value}%</span>
      </div>
      <div class="flex justify-between gap-4">
        <span class="text-muted-foreground">Articles:</span>
        <span class="font-medium text-foreground">${d.articles}</span>
      </div>
    </div>
  </div>
`

// Formatage des ticks pour l'axe X
const xTickFormat = (d: string | number) => {
  if (props.orientation === 'vertical') {
    return typeof d === 'string' ? d : d.toString()
  }
  return typeof d === 'number' ? `${d}%` : d
}

// Formatage des ticks pour l'axe Y
const yTickFormat = (d: string | number) => {
  if (props.orientation === 'vertical') {
    return typeof d === 'number' ? `${d}%` : d
  }
  return typeof d === 'string' ? d : d.toString()
}

onMounted(() => {
  chartsColor.value = useChartColors()
})
</script>

<template>
  <div class="w-full">
    <VisXYContainer
      :data="props.data"
      class="bg-card border-border rounded-lg border shadow-sm"
      :style="{ height: `${props.height}px` }"
      :padding="padding"
    >
      <!-- Légendes -->
      <VisBulletLegend
        v-if="props.showLegend"
        :items="legends"
        orientation="horizontal"
        class="text-muted-foreground text-sm"
      />

      <!-- Tooltip -->
      <VisTooltip
        v-if="props.showTooltip"
        :template="tooltipTemplate"
      />

      <!-- Axes -->
      <VisAxis
        type="x"
        :label="props.orientation === 'vertical' ? 'Technologies' : 'Popularité (%)'"
        position="bottom"
        :grid-line="props.orientation === 'horizontal'"
        :tick-format="xTickFormat"
        class="text-muted-foreground"
      />
      <VisAxis
        type="y"
        :label="props.orientation === 'vertical' ? 'Popularité (%)' : 'Technologies'"
        position="left"
        :grid-line="props.orientation === 'vertical'"
        :tick-format="yTickFormat"
        class="text-muted-foreground"
      />

      <!-- Graphique en barres -->
      <VisGroupedBar
        :x="x"
        :y="y"
        :color="color"
        :rounded-corners="2"
        :bar-padding="0.2"
        :orientation="props.orientation"
      />
    </VisXYContainer>
  </div>
</template>

<style scoped>
:deep(.unovis-xy-container) {
  font-family: inherit;
}

:deep(.unovis-axis) {
  font-size: 12px;
}

:deep(.unovis-bar) {
  transition: all 0.2s ease;
}

:deep(.unovis-bar:hover) {
  opacity: 0.8;
  filter: brightness(1.1);
}

:deep(.unovis-bullet-legend) {
  gap: 1rem;
}
</style>
