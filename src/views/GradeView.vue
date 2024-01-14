<template>
    <GradePageComponent />
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import GradePageComponent from '@/components/GradePageComponent.vue';

export default defineComponent({
    name: 'GradeView',
    components: {
        GradePageComponent,
    }
});
</script>
  