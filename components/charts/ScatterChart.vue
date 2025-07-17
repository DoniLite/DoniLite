<script setup lang="ts">
import { VisAxis, VisBulletLegend, VisScatter, VisTooltip, VisXYContainer } from '@unovis/vue'

interface ScatterDataRecord {
  x: number
  y: number
  size: number
  category: string
}

interface Props {
  data?: ScatterDataRecord[]
  height?: number
  showLegend?: boolean
  showTooltip?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  data: () => mockScatterData,
  height: 300,
  showLegend: true,
  showTooltip: true
})

const chartsColor = ref<string[]>([])

// Accesseurs de données
const x = (d: ScatterDataRecord) => d.x
const y = (d: ScatterDataRecord) => d.y
const size = (d: ScatterDataRecord) => d.size

// Configuration du padding
const padding = computed(() => ({
  left: 50,
  right: 40,
  top: props.showLegend ? 60 : 20,
  bottom: 50
}))

// Catégories uniques pour les couleurs
const categories = computed(() => {
  const uniqueCategories = [...new Set(props.data.map((d) => d.category))]
  return uniqueCategories
})

// Configuration des couleurs par catégorie
const color = (d: ScatterDataRecord) => {
  const index = categories.value.indexOf(d.category)
  return chartsColor.value[index % chartsColor.value.length]
}

// Légendes par catégorie
const legends = computed(() =>
  categories.value.map((category, i) => ({
    name: category,
    color: chartsColor.value[i % chartsColor.value.length]
  }))
)

// Configuration du tooltip
const tooltipTemplate = (d: ScatterDataRecord) => `
  <div class="bg-popover border border-border rounded-lg p-3 shadow-lg">
    <div class="font-semibold mb-2 text-foreground">${d.category}</div>
    <div class="space-y-1 text-sm">
      <div class="flex justify-between gap-4">
        <span class="text-muted-foreground">X:</span>
        <span class="font-medium text-foreground">${d.x.toFixed(1)}</span>
      </div>
      <div class="flex justify-between gap-4">
        <span class="text-muted-foreground">Y:</span>
        <span class="font-medium text-foreground">${d.y.toFixed(1)}</span>
      </div>
      <div class="flex justify-between gap-4">
        <span class="text-muted-foreground">Taille:</span>
        <span class="font-medium text-foreground">${d.size.toFixed(1)}</span>
      </div>
    </div>
  </div>
`

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
        label="Complexité"
        position="bottom"
        :grid-line="false"
        class="text-muted-foreground"
      />
      <VisAxis
        type="y"
        label="Popularité"
        position="left"
        :grid-line="false"
        class="text-muted-foreground"
      />

      <!-- Points scatter -->
      <VisScatter
        :x="x"
        :y="y"
        :size="size"
        :color="color"
        :stroke-width="2"
        :stroke-color="'hsl(var(--background))'"
        :opacity="0.8"
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

:deep(.unovis-scatter-point) {
  transition: all 0.2s ease;
}

:deep(.unovis-scatter-point:hover) {
  transform: scale(1.2);
  opacity: 1 !important;
}

:deep(.unovis-bullet-legend) {
  gap: 1rem;
}
</style>
