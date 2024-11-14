

export type Component =
  | HTMLElement
  | string
  | (new (...args: any[]) => string | HTMLElement)
  | ((...args: any[]) => string);
