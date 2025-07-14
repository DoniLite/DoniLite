import type { Annotations, Axis, Crosshair, Tooltip, XYComponentCore } from '@unovis/ts'

export type ChartContainerProps<T> = {
  duration?: number
  data?: T[]
  width?: string | number
  xScale?: import('@unovis/ts').ContinuousScale
  yScale?: import('@unovis/ts').ContinuousScale
  tooltip?: Tooltip
  components?: XYComponentCore<T, Partial<import('@unovis/ts').XYComponentConfigInterface<T>>>[]
  annotations?: Annotations
  margin?: import('@unovis/ts').Spacing
  padding?: import('@unovis/ts').Spacing
  sizing?: string
  height?: string | number
  svgDefs?: string
  ariaLabel?: string
  xDomain?: [number, number]
  xDomainMinConstraint?: [number, number]
  xDomainMaxConstraint?: [number, number]
  xRange?: [number, number]
  yDomain?: [number, number]
  yDomainMinConstraint?: [number, number]
  yDomainMaxConstraint?: [number, number]
  yRange?: [number, number]
  yDirection?: string
  xAxis?: Axis<T>
  yAxis?: Axis<T>
  autoMargin?: boolean
  crosshair?: Crosshair<T>
  preventEmptyDomain?: boolean
  scaleByDomain?: boolean
} & import('vue').VNodeProps &
  import('vue').AllowedComponentProps &
  import('vue').ComponentCustomProps
