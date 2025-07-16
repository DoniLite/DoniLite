<script setup lang="ts">
import {
  VisAxis,
  VisBulletLegend,
  VisLine,
  VisScatter,
  VisTooltip,
  VisXYContainer
} from '@unovis/vue'

interface LineDataRecord {
  x: string
  value: number
  value2: number
}

interface Props {
  data?: LineDataRecord[]
  height?: number
  showLegend?: boolean
  showTooltip?: boolean
  showPoints?: boolean
  multiLine?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  data: () => mockLineChartData,
  height: 300,
  showLegend: true,
  showTooltip: true,
  showPoints: true,
  multiLine: false
})

const chartsColor = ref<string[]>([])

// Accesseurs de données
const x = (d: LineDataRecord) => d.x
const y = props.multiLine
  ? [(d: LineDataRecord) => d.value, (d: LineDataRecord) => d.value2]
  : (d: LineDataRecord) => d.value

// Configuration du padding
const padding = computed(() => ({
  left: 50,
  right: 40,
  top: props.showLegend ? 60 : 20,
  bottom: 50
}))

// Configuration des couleurs
const color = (d: LineDataRecord, i: number) => chartsColor.value[i % chartsColor.value.length]

// Légendes pour mode multi-ligne
const legends = computed(() => {
  if (props.multiLine) {
    return [
      { name: 'Série 1', color: chartsColor.value[0] },
      { name: 'Série 2', color: chartsColor.value[1] }
    ]
  }
  return [{ name: 'Valeurs', color: chartsColor.value[0] }]
})

// Configuration du tooltip
const tooltipTemplate = (d: LineDataRecord) => `
  <div class="bg-popover border border-border rounded-lg p-3 shadow-lg">
    <div class="font-semibold mb-2 text-foreground">${d.x}</div>
    <div class="space-y-1 text-sm">
      <div class="flex justify-between gap-4">
        <span class="text-muted-foreground">Valeur:</span>
        <span class="font-medium text-foreground">${d.value.toLocaleString()}</span>
      </div>
      ${
        props.multiLine
          ? `
        <div class="flex justify-between gap-4">
          <span class="text-muted-foreground">Valeur 2:</span>
          <span class="font-medium text-foreground">${d.value2.toLocaleString()}</span>
        </div>
      `
          : ''
      }
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
        label="Période"
        position="bottom"
        :grid-line="true"
        :tick-format="(d: string) => d.substring(5)"
        class="text-muted-foreground"
      />
      <VisAxis
        type="y"
        label="Valeurs"
        position="left"
        :grid-line="true"
        :tick-format="(d: number) => d.toLocaleString()"
        class="text-muted-foreground"
      />

      <!-- Ligne -->
      <VisLine
        :x="x"
        :y="y"
        :color="color"
        :stroke-width="2"
      />

      <!-- Points -->
      <VisScatter
        v-if="props.showPoints"
        :x="x"
        :y="y"
        :color="color"
        :size="4"
        :stroke-width="2"
        :stroke-color="'hsl(var(--background))'"
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

:deep(.unovis-line) {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

:deep(.unovis-scatter-point) {
  transition: all 0.2s ease;
}

:deep(.unovis-scatter-point:hover) {
  transform: scale(1.2);
}

:deep(.unovis-bullet-legend) {
  gap: 1rem;
}
</style>
