import { defineStore } from 'pinia'
import type { LumberItem, WorkPiece, Position, Dimension } from '@/models/Lumber'
import { Guid } from "guid-typescript";

interface State {
  lumberItems: LumberItem[]
  workPieces: Map<string, WorkPiece[]>,
  activeLumberItem?: LumberItem,
  activeWorkPiece?: WorkPiece,
}

export const useLumberStore = defineStore('lumber', {
  state: (): State => ({
      lumberItems: [],
      workPieces: new Map<string, WorkPiece[]>(),
      activeLumberItem: undefined,
      activeWorkPiece: undefined,
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
    selectLumberItem(lumberItem: LumberItem) {
      this.activeLumberItem = lumberItem
      this.activeWorkPiece = undefined
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
    removeSelectedWorkPiece() {
      if (!this.activeLumberItem || !this.activeWorkPiece) {
        return
      }
      const workPieces = this.workPieces.get(this.activeLumberItem.id)
      if (workPieces) {
        this.workPieces.set(
          this.activeLumberItem.id,
          workPieces.filter(w => w.id !== this.activeWorkPiece?.id))
      }
      this.activeWorkPiece = undefined
    }, 
    selectWorkPiece(workPiece: WorkPiece) {
      this.activeWorkPiece = workPiece
    },
  },
})
