import { defineStore } from 'pinia'
import type { LumberItem } from '@/models/Lumber'
import { Guid } from "guid-typescript";

interface State {
  lumberItems: LumberItem[]
}

export const useLumberStore = defineStore('lumber', {
  state: (): State => ({
      lumberItems: []
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
    }
  },
})
