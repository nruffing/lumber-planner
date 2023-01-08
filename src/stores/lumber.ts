import { defineStore } from 'pinia'
import type { LumberItem, WorkPiece, Position, Dimension } from '@/models/Lumber'
import { Guid } from "guid-typescript";

interface State {
  lumberItems: LumberItem[]
  workPieces: Map<string, WorkPiece[]>,
  activeLumberItem?: LumberItem,
  activeWorkPiece?: WorkPiece,
}

interface SaveState {  
  lumberItems: LumberItem[]
  workPieces: [string, WorkPiece[]][],
}

export const useLumberStore = defineStore('lumber', {
  state: (): State => ({
      lumberItems: [],
      workPieces: new Map<string, WorkPiece[]>(),
      activeLumberItem: undefined,
      activeWorkPiece: undefined,
  }),
  getters: {
    saveState(): SaveState {
      return {
        lumberItems: this.lumberItems,
        workPieces: Array.from(this.workPieces.entries()),
      }
    },
  },
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
      this.activeWorkPiece = undefined
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
      const workPiece = {
        id: Guid.create().toString(),
        position,
        dimension,
        name: 'new workpiece',
      }
      workPieces.push(workPiece)
      this.activeWorkPiece = workPiece
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
    saveToLocalStorage() {
      localStorage.setItem('lumber-state', JSON.stringify(this.saveState))
    },
    loadFromLocalStorage() {
      const saveStateJson = localStorage.getItem('lumber-state')
      if (saveStateJson) {
        this.loadFromSaveStateJson(saveStateJson)
      }
    },
    loadFromSaveStateJson(json: string) {
      this.$reset()
      const saveState = JSON.parse(json) as SaveState
      for (const workPiece of saveState.workPieces) {
        const [lumberItemId, lumberWorkPieces] = workPiece
        this.workPieces.set(lumberItemId, [...lumberWorkPieces])
      }
      for (const lumberItem of saveState.lumberItems) {
        this.lumberItems.push({...lumberItem})
      }
      if (this.lumberItems.length) {
        this.selectLumberItem(this.lumberItems[0])
      }
    }
  },
})
