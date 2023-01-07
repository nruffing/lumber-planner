export interface LumberItem {
  id: string,
  dimension: Dimension,
}

export interface WorkPiece {
  id: string,
  dimension: Dimension,
  position: Position,
}

export interface Dimension {
  lengthInches: number,
  widthInches: number,
}

export interface Position {
  x: number,
  y: number,
}