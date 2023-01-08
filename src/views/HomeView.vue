<template>
  <main>
    <div class="tabs">
      <div 
        v-for="lumberItem in lumberStore.lumberItems"
        :key="lumberItem.id"
        class="tab"
        :class="{ 
          active: lumberItem.id === lumberStore.activeLumberItem?.id,
        }"
        @click="lumberStore.activeLumberItem = lumberItem">
        {{ lumberItem.name }}
      </div>
      <div class="flex-fill"></div>
      <button @click="lumberStore.addNewLumberItem">
        Add
      </button>
    </div>
    <LumberItem 
      v-if="lumberStore.activeLumberItem"
      :lumber-item="lumberStore.activeLumberItem" />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useLumberStore } from '@/stores/lumber';
import LumberItem from '@/components/LumberItem.vue';

export default defineComponent({
  name: 'Home',
  components: {
    LumberItem,
  },
  computed: {
    ...mapStores(useLumberStore),
  },
  mounted() {
    this.lumberStore.addNewLumberItem()
  },
})
</script>