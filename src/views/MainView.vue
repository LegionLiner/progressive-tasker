<template>
    <MainPageComponent />
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import MainPageComponent from '@/components/MainPage/MainPageComponent.vue';

export default defineComponent({
    name: 'MainView',
    components: {
        MainPageComponent,
    }
});
</script>
  