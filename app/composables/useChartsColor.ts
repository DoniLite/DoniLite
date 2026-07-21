export function useChartColors(count = 5): string[] {
  const style = getComputedStyle(document.documentElement)
  return Array.from({ length: count }, (_, i) => style.getPropertyValue(`--chart-${i + 1}`).trim())
}
