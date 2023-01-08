import { defineStore } from 'pinia'
import type { LumberItem, WorkPiece, Position, Dimension } from '@/models/Lumber'
import { Guid } from "guid-typescript";

interface State {
  lumberItems: LumberItem[]
  workPieces: Map<string, WorkPiece[]>,
  activeLumberItem?: LumberItem,
}

export const useLumberStore = defineStore('lumber', {
  state: (): State => ({
      lumberItems: [],
      workPieces: new Map<string, WorkPiece[]>(),
      activeLumberItem: undefined,
  }),
  actions: {
    addNewLumberItem() {
      const lumberItem = {
        id: Guid.create().toString(),
        dimension: {
          lengthInches: 12 * 8,
          widthInches: 12 * 4,
        },
        name: 'new lumber',
      }
      this.lumberItems.push(lumberItem)
      this.activeLumberItem = lumberItem
    },
    removeLumberItem(lumberItem: LumberItem) {
      this.lumberItems = this.lumberItems.filter(l => l.id !== lumberItem.id)
      this.workPieces.delete(lumberItem.id)
      if (this.lumberItems.length) {
        this.activeLumberItem = this.lumberItems[this.lumberItems.length - 1]
      } else {
        this.activeLumberItem = undefined
      }
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
        name: '',
      })
    },
  },
})
