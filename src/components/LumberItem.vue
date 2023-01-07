<template>
  <div class="container">
    <div 
      class="grid"
      :style="{ 
        'grid-template-columns': gridTemplateColumns,
        width: gridWidth,
      }">
      <div 
        v-for="cell in cells" 
        :key="cell.index" 
        class="cell"
        :class="{
          'drag': cell.inCurrentDrag,
          'last-in-row': cell.x === lumberItem.dimension.widthInches,
          'last-in-col': cell.y === lumberItem.dimension.lengthInches,
        }"
        @mousedown="onCellMouseDown(cell)"
        @mouseover="onCellMouseOver(cell)"
        :title="cell.x + ', ' + cell.y"></div>
    </div>
    <div class="info">
      <div>{{ lumberItem.id }}</div>
      <div>{{ lumberItem.dimension.lengthInches }}in x {{ lumberItem.dimension.widthInches }}in</div>
      <div>{{ dragLength }}in x {{ dragWidth }}in</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { LumberItem } from '@/models/Lumber';

interface GridCell {
  index: number,
  x: number,
  y: number,
  inCurrentDrag?: boolean,
}

interface Data {
  cells: GridCell[],
  dragStart?: GridCell,
  dragEnd?: GridCell,
}

export default defineComponent({
  name: 'LumberItem',
  props: {
    lumberItem: {
      type: Object as PropType<LumberItem>,
      required: true,
    },
  },
  data(): Data {
    return {
      cells: [],
      dragStart: undefined,
      dragEnd: undefined,
    }
  },
  computed: {
    gridTemplateColumns(): string {
      return `repeat(${this.lumberItem.dimension.widthInches}, 1fr)`
    },
    gridWidth(): string {
      return (12 * this.lumberItem.dimension.widthInches) + 'px'
    },
    isDragValid(): boolean {
      return !!(this.dragStart && this.dragEnd)
    },
    dragMinX(): number {
      if (!this.isDragValid) {
        return 0
      }
      return Math.min(this.dragStart?.x ?? 0, this.dragEnd?.x ?? 0)
    },
    dragMaxX(): number {
      if (!this.isDragValid) {
        return 0
      }
      return Math.max(this.dragStart?.x ?? 0, this.dragEnd?.x ?? 0)
    },
    dragMinY(): number {
      if (!this.isDragValid) {
        return 0
      }
      return Math.min(this.dragStart?.y ?? 0, this.dragEnd?.y ?? 0)
    },
    dragMaxY(): number {
      if (!this.isDragValid) {
        return 0
      }
      return Math.max(this.dragStart?.y ?? 0, this.dragEnd?.y ?? 0)
    },
    dragWidth(): number {
      return this.dragMaxX - this.dragMinX
    },
    dragLength(): number {
      return this.dragMaxY - this.dragMinY
    },
  },
  mounted() {
    const width = this.lumberItem.dimension.widthInches
    const numCells = this.lumberItem.dimension.lengthInches * width
    for (var i = 1; i <= numCells; i++) {
      const y = Math.ceil(i / width)
      let x = (i % width)
      if (x === 0) {
        x = width
      }
      this.cells.push({
        index: i,
        x,
        y,
      })
    }
  },
  beforeUnmount() {
  },
  methods: {
    onCellMouseDown(cell: GridCell) {
      if (this.dragStart) {
        this.handleDrag()
      } else {
        this.dragStart = cell
      }
    },
    onCellMouseOver(cell: GridCell) {
      if (this.dragStart) {
        this.dragEnd = cell
        this.updateCurrentDrag()
      }
    },
    updateCurrentDrag() {
      if (!this.isDragValid) {
        return this.resetDrag()
      }
      for (const cell of this.cells) {
        cell.inCurrentDrag = cell.x >= this.dragMinX &&
          cell.x <= this.dragMaxX &&
          cell.y >= this.dragMinY &&
          cell.y <= this.dragMaxY;
      }
    },
    handleDrag() {
      this.resetDrag()
    },
    resetDrag() {
      this.dragStart = undefined
      this.dragEnd = undefined
      for (const cell of this.cells) {
        cell.inCurrentDrag = false 
      }
    }
  },
})
</script>

<style scoped>
.container {
  padding: 20px;
  display: flex;
  flex-direction: row;
}

.grid {
  display: grid;
}

.cell {
  border-top: var(--grid-border);
  border-left: var(--grid-border);
  height: 10px;
  width: 10px;
  cursor: pointer;
}

.cell.last-in-row {
  border-right: var(--grid-border);
}

.cell.last-in-col {
  border-bottom: var(--grid-border);
}

.cell.drag {
  background-color: var(--cell-in-drag)
}

.info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>