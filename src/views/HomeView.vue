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
        @click="lumberStore.selectLumberItem(lumberItem)">
        {{ lumberItem.name }}
      </div>
      <div class="flex-fill"></div>
      <button @click="lumberStore.addNewLumberItem">
        Add
      </button>
      <button @click="lumberStore.saveStateToFile">
        Save
      </button>
      <button @click="lumberStore.loadStateFromFile">
        Open
      </button>
    </div>
    <LumberItem 
      v-if="lumberStore.activeLumberItem"
      :lumber-item="lumberStore.activeLumberItem"
      :key="lumberStore.activeLumberItem.id" />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useLumberStore } from '@/stores/lumber';
import LumberItem from '@/components/LumberItem.vue';

interface Data {
  saveIntervalId?: number,
}

export default defineComponent({
  name: 'Home',
  components: {
    LumberItem,
  },
  data(): Data {
    return {
      saveIntervalId: undefined,
    }
  },
  computed: {
    ...mapStores(useLumberStore),
  },
  mounted() {
    this.lumberStore.loadFromLocalStorage()
    if (!this.lumberStore.lumberItems.length) {
      this.lumberStore.addNewLumberItem()
    }
    
    this.saveIntervalId = setInterval(this.lumberStore.saveToLocalStorage, 5 * 1000)
  },
  beforeUnmount() {
    if (this.saveIntervalId) {
      clearInterval(this.saveIntervalId)
    }
  },
})
</script>