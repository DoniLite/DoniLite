<script setup lang="ts">
import { VisBulletLegend, VisDonut, VisSingleContainer, VisTooltip } from '@unovis/vue'

interface DonutDataRecord {
  label: string
  value: number
  count: number
}

interface Props {
  data?: DonutDataRecord[]
  size?: number
  showLegend?: boolean
  showTooltip?: boolean
  innerRadius?: number
}

const props = withDefaults(defineProps<Props>(), {
  data: () => mockDonutChartData,
  size: 300,
  showLegend: true,
  showTooltip: true,
  innerRadius: 0.6
})

const chartsColor = ref<string[]>([])

// Accesseurs de données
const value = (d: DonutDataRecord) => d.value
const color = (d: DonutDataRecord, i: number) => chartsColor.value[i]

// Configuration des légendes
const legends = computed(() =>
  props.data.map((item, i) => ({
    name: `${item.label} (${item.count})`,
    color: chartsColor.value[i]
  }))
)

// Configuration du tooltip
const tooltipTemplate = (d: DonutDataRecord) => `
  <div class="bg-popover border border-border rounded-lg p-3 shadow-lg">
    <div class="font-semibold mb-2 text-foreground">${d.label}</div>
    <div class="space-y-1 text-sm">
      <div class="flex justify-between gap-4">
        <span class="text-muted-foreground">Pourcentage:</span>
        <span class="font-medium text-foreground">${d.value}%</span>
      </div>
      <div class="flex justify-between gap-4">
        <span class="text-muted-foreground">Nombre:</span>
        <span class="font-medium text-foreground">${d.count}</span>
      </div>
    </div>
  </div>
`

// Calcul du total pour affichage central
const totalCount = computed(() => props.data.reduce((sum, item) => sum + item.count, 0))

onMounted(() => {
  chartsColor.value = useChartColors()
})
</script>

<template>
  <div class="flex flex-col-reverse items-center gap-4 lg:flex-row">
    <!-- Graphique donut -->
    <div class="bg-card border-border relative rounded-lg border p-3 shadow-sm">
      <VisSingleContainer
        :data="props.data"
        :style="{ width: `${props.size}px`, height: `${props.size}px` }"
      >
        <!-- Tooltip -->
        <VisTooltip
          v-if="props.showTooltip"
          :template="tooltipTemplate"
        />

        <!-- Donut chart -->
        <VisDonut
          :value="value"
          :color="color"
          :inner-radius="props.innerRadius"
          :corner-radius="2"
          :pad-angle="0.02"
          :show-background="false"
        />
      </VisSingleContainer>

      <!-- Texte central -->
      <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div class="text-foreground text-2xl font-bold">{{ totalCount.toLocaleString() }}</div>
        <div class="text-muted-foreground text-sm">
          {{ $t('admin.index.stats.total_posts') }}
        </div>
      </div>
    </div>

    <!-- Légende -->
    <div
      v-if="props.showLegend"
      class="flex justify-center"
    >
      <VisBulletLegend
        :items="legends"
        orientation="vertical"
        class="text-muted-foreground justify-center text-sm"
      />
    </div>
  </div>
</template>

<style scoped>
:deep(.unovis-donut-segment) {
  stroke: hsl(var(--background));
  stroke-width: 2;
}

:deep(.unovis-donut-segment:hover) {
  opacity: 0.8;
  filter: brightness(1.1);
}

:deep(.unovis-bullet-legend) {
  gap: 0.5rem;
}
</style>
