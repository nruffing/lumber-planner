<template>
  <main>
    <LumberItem 
      v-for="lumberItem in lumberStore.lumberItems" 
      :lumber-item="lumberItem"
      :key="lumberItem.id" />
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
