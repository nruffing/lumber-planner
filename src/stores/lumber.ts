import { defineStore } from 'pinia'
import type { LumberItem, WorkPiece, Position, Dimension } from '@/models/Lumber'
import { Guid } from "guid-typescript";

interface State {
  lumberItems: LumberItem[]
  workPieces: Map<string, WorkPiece[]>,
}

export const useLumberStore = defineStore('lumber', {
  state: (): State => ({
      lumberItems: [],
      workPieces: new Map<string, WorkPiece[]>(),
  }),
  actions: {
    addNewLumberItem() {
      this.lumberItems.push({
        id: Guid.create().toString(),
        dimension: {
          lengthInches: 12 * 8,
          widthInches: 12 * 4,
        },
      })
    },
    addNewWorkPiece(lumberItemId: string, position: Position, dimension: Dimension) {
      let workPieces = this.workPieces.get(lumberItemId)
      if (!workPieces) {
        workPieces = []
        this.workPieces.set(lumberItemId, workPieces)
      }
      workPieces.push({        
        id: Guid.create().toString(),
        position,
        dimension,
      })
    },
  },
})
