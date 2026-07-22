<script setup lang="ts">
import { VisAxis, VisGroupedBar, VisTooltip, VisXYContainer } from '@unovis/vue'

interface BarDataRecord {
  label: string
  value: number
}

interface Props {
  data?: BarDataRecord[]
  height?: number
  showTooltip?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  data: () => mockBarChartData,
  height: 300,
  showTooltip: true
})

const chartsColor = ref<string[]>([])

// Bars use the array index as their numeric x position (categorical axis);
// the x-axis tick-format below maps that index back to the record's label.
const x = (_d: BarDataRecord, i: number) => i
const y = (d: BarDataRecord) => d.value
const color = () => chartsColor.value[0]

const padding = computed(() => ({
  left: 50,
  right: 20,
  top: 20,
  bottom: 60
}))

const tickFormat = (tick: number) => {
  const label = props.data[tick]?.label ?? ''
  return label.length > 14 ? `${label.slice(0, 14)}…` : label
}

const tooltipTemplate = (d: BarDataRecord) => `
  <div class="bg-popover border border-border rounded-lg p-3 shadow-lg">
    <div class="font-semibold mb-1 text-foreground">${d.label}</div>
    <div class="text-sm text-muted-foreground">${d.value.toLocaleString()}</div>
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
      <VisTooltip
        v-if="props.showTooltip"
        :template="tooltipTemplate"
      />

      <VisAxis
        type="x"
        position="bottom"
        :grid-line="false"
        :tick-format="tickFormat"
        :num-ticks="props.data.length"
        class="text-muted-foreground"
      />
      <VisAxis
        type="y"
        position="left"
        :grid-line="false"
        :tick-format="(d: number) => d.toLocaleString()"
        class="text-muted-foreground"
      />

      <VisGroupedBar
        :x="x"
        :y="y"
        :color="color"
        :rounded-corners="4"
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

:deep(.unovis-grouped-bar-rect) {
  transition: opacity 0.2s ease;
}

:deep(.unovis-grouped-bar-rect:hover) {
  opacity: 0.8;
}
</style>
