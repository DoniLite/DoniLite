<script setup lang="ts">
import { VisAxis, VisBulletLegend, VisTimeline, VisTooltip, VisXYContainer } from '@unovis/vue'

interface TimelineDataRecord {
  date: string
  event: string
  type: string
  count: number
}

interface Props {
  data?: TimelineDataRecord[]
  height?: number
  showLegend?: boolean
  showTooltip?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  data: () => mockTimelineData,
  height: 250,
  showLegend: true,
  showTooltip: true
})

const chartsColor = ref<string[]>([])

// Accesseurs de données
const x = (d: TimelineDataRecord) => new Date(d.date).getTime()
const y = (d: TimelineDataRecord) => d.count

// Configuration du padding
const padding = computed(() => ({
  left: 50,
  right: 40,
  top: props.showLegend ? 60 : 20,
  bottom: 50
}))

// Types d'événements uniques
const eventTypes = computed(() => {
  const types = [...new Set(props.data.map((d) => d.type))]
  return types
})

// Configuration des couleurs par type
const color = (d: TimelineDataRecord) => {
  const index = eventTypes.value.indexOf(d.type)
  return chartsColor.value[index % chartsColor.value.length]
}

// Légendes par type d'événement
const legends = computed(() =>
  eventTypes.value.map((type, i) => ({
    name: type,
    color: chartsColor.value[i % chartsColor.value.length]
  }))
)

// Configuration du tooltip
const tooltipTemplate = (d: TimelineDataRecord) => `
  <div class="bg-popover border border-border rounded-lg p-3 shadow-lg">
    <div class="font-semibold mb-2 text-foreground">${d.event}</div>
    <div class="space-y-1 text-sm">
      <div class="flex justify-between gap-4">
        <span class="text-muted-foreground">Date:</span>
        <span class="font-medium text-foreground">${new Date(d.date).toLocaleDateString()}</span>
      </div>
      <div class="flex justify-between gap-4">
        <span class="text-muted-foreground">Type:</span>
        <span class="font-medium text-foreground">${d.type}</span>
      </div>
      <div class="flex justify-between gap-4">
        <span class="text-muted-foreground">Nombre:</span>
        <span class="font-medium text-foreground">${d.count}</span>
      </div>
    </div>
  </div>
`

// Formatage de la date pour l'axe X
const xTickFormat = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('fr-FR', {
    month: 'short',
    day: 'numeric'
  })
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
        label="Période"
        position="bottom"
        :grid-line="true"
        :tick-format="xTickFormat"
        class="text-muted-foreground"
      />
      <VisAxis
        type="y"
        label="Nombre d'événements"
        position="left"
        :grid-line="true"
        :tick-format="(d: number) => d.toString()"
        class="text-muted-foreground"
      />

      <!-- Timeline -->
      <VisTimeline
        :x="x"
        :y="y"
        :color="color"
        :row-height="20"
        :line-width="3"
        :show-labels="false"
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

:deep(.unovis-timeline-item) {
  transition: all 0.2s ease;
}

:deep(.unovis-timeline-item:hover) {
  transform: scale(1.1);
  opacity: 0.8;
}

:deep(.unovis-bullet-legend) {
  gap: 1rem;
}
</style>
