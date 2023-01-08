<template>
  <div 
    class="work-piece"
    :class="{
      active: workPiece.id === lumberStore.activeWorkPiece?.id,
    }"
    :style="{
      height: `${(workPiece.dimension.lengthInches * (scale + borderWidth)) - borderWidth}px`,
      width: `${(workPiece.dimension.widthInches * (scale + borderWidth)) - borderWidth}px`,
      top: `${((workPiece.position.y - 1) * (scale + borderWidth)) + gridOrigin.y}px`,
      left: `${((workPiece.position.x - 1) * (scale + borderWidth)) + gridOrigin.x}px`,
      'background-color': colorHex,
    }"
    @click="lumberStore.selectWorkPiece(workPiece)"
    :title="`${workPiece.name} | ${workPiece.dimension.lengthInches}in x ${workPiece.dimension.widthInches}in | ${workPiece.notes}`">
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { mapStores } from 'pinia';
import { useLumberStore } from '@/stores/lumber';
import type { WorkPiece, Position } from '@/models/Lumber'
import uniqolar from 'uniqolor'

export default defineComponent({
  name: 'WorkPiece',
  props: {
    workPiece: {
      type: Object as PropType<WorkPiece>,
      required: true,
    },
    gridOrigin: {
      type: Object as PropType<Position>,
      required: true,
    },
    scale: {
      type: Number,
      required: true,
    },
    borderWidth: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapStores(useLumberStore),
    colorHex(): string {
      return uniqolar(this.workPiece.id).color
    },
  },
  methods: {
    calculatePx(value: number, offset: number = 0): string {
      const scaled = (value * this.scale) + offset
      return  scaled + 'px'
    },
  },
})
</script>

<style>
.work-piece {
  position: absolute;
  border: var(--work-piece-border)
}

.work-piece.active {  
  border: var(--work-piece-border-active)
}
</style>