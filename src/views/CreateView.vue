<template>
    <CreatePageComponent />
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import CreatePageComponent from '@/components/CreatePageComponent.vue';

export default defineComponent({
    name: 'CreateView',
    components: {
        CreatePageComponent,
    }
});
</script>
  