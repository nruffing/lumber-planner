<template>
  <div class="container">
    <div 
      ref="grid"
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
        :style="{
          height: cellSize + 'px',
          width: cellSize + 'px',
        }"
        @mousedown="onCellMouseDown(cell)"
        @mouseover="onCellMouseOver(cell)"
        :title="cell.x + ', ' + cell.y">
      </div>
    </div>

    <WorkPieceComponent 
      v-for="workPiece in workPieces"
      :work-piece="workPiece"
      :grid-origin="gridOrigin"
      :scale="cellSize"
      :border-width="borderWidth" />

    <div class="info">
      <button @click="lumberStore.removeLumberItem(lumberItem)">Close</button>
      <div>{{ lumberItem.id }}</div>
      <div>{{ lumberItem.dimension.lengthInches }}in x {{ lumberItem.dimension.widthInches }}in</div>
      <div>{{ dragEnd?.y ?? 0 }} {{ dragEnd?.x ?? 0 }}</div>
      <div>{{ dragLength }}in x {{ dragWidth }}in</div>
      <div>
        <input v-model="lumberItem.name" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { mapStores } from 'pinia';
import { useLumberStore } from '@/stores/lumber';
import type { LumberItem, WorkPiece, Position } from '@/models/Lumber';
import WorkPieceComponent from './WorkPiece.vue';

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
  intervalId?: number,
  cellSize: number,
  borderWidth: number,
}

export default defineComponent({
  name: 'LumberItem',
  components: {
    WorkPieceComponent
  },
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
      intervalId: undefined,
      cellSize: 12,
      borderWidth: 1,
    }
  },
  computed: {
    ...mapStores(useLumberStore),
    gridElement(): HTMLDivElement {
      return this.$refs.grid as HTMLDivElement
    },
    gridOrigin(): Position {
      return {
        x: this.gridElement.offsetLeft,
        y: this.gridElement.offsetTop,
      }
    },
    workPieces(): WorkPiece[] {
      return this.lumberStore.workPieces.get(this.lumberItem.id) ?? []
    },
    gridTemplateColumns(): string {
      return `repeat(${this.lumberItem.dimension.widthInches}, 1fr)`
    },
    gridWidth(): string {
      return `${((this.cellSize + this.borderWidth) * this.lumberItem.dimension.widthInches) + this.borderWidth}px`
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
      return this.dragMaxX - this.dragMinX + 1
    },
    dragLength(): number {
      return this.dragMaxY - this.dragMinY + 1
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

    this.intervalId = setInterval(this.updateCurrentDrag, 50)
  },
  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
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
      this.dragEnd = cell
    },
    updateCurrentDrag() {
      if (!this.isDragValid) {
        return
      }
      for (const cell of this.cells) {
        cell.inCurrentDrag = cell.x >= this.dragMinX &&
          cell.x <= this.dragMaxX &&
          cell.y >= this.dragMinY &&
          cell.y <= this.dragMaxY;
      }
    },
    handleDrag() {
      if (!this.isDragValid) {
        return
      }
      this.lumberStore.addNewWorkPiece(
        this.lumberItem.id,
        {
          x: this.dragMinX,
          y: this.dragMinY,
        },
        {
          lengthInches: this.dragLength,
          widthInches: this.dragWidth,
        },
      )
      this.resetDrag()
    },
    resetDrag() {
      this.dragStart = undefined
      for (const cell of this.cells) {
        cell.inCurrentDrag = false 
      }
    },
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

.info input {
  width: 100%;
}
</style>