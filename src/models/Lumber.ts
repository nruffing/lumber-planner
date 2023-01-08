export interface LumberItem {
  id: string,
  dimension: Dimension,
  name: string,
}

export interface WorkPiece {
  id: string,
  dimension: Dimension,
  position: Position,
  name: string,
}

export interface Dimension {
  lengthInches: number,
  widthInches: number,
}

export interface Position {
  x: number,
  y: number,
}