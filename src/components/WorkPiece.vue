<template>
  <div 
    class="work-piece"
    :style="{
      height: `${(workPiece.dimension.lengthInches * (scale + borderWidth)) - borderWidth}px`,
      width: `${(workPiece.dimension.widthInches * (scale + borderWidth)) - borderWidth}px`,
      top: `${((workPiece.position.y - 1) * (scale + borderWidth)) + gridOrigin.y}px`,
      left: `${((workPiece.position.x - 1) * (scale + borderWidth)) + gridOrigin.x}px`,
    }">
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { WorkPiece, Position } from '@/models/Lumber';

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
  methods: {
    calculatePx(value: number, offset: number = 0): string {
      const scaled = (value * this.scale) + offset
      return  scaled + 'px'
    }
  },
})
</script>

<style>
.work-piece {
  position: absolute;
  background-color: red;
  border: var(--work-piece-border)
}
</style>