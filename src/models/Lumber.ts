export interface LumberItem {
  id: string,
  dimension: Dimension,
}

export interface Dimension {
  lengthInches: number,
  widthInches: number,
}