<template>
    <div class="tag-element" :class="{ 'main-tag': main }">
        <img :src="image" v-if="image">
        {{ tag }}
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { icons } from '../../main';

export default defineComponent({
    emits: ['press'],
    props: {
        tag: {
            type: String as PropType<string>,
            required: true,
        },
        main: {
            type: Boolean as PropType<boolean>,
            required: false,
            default: false
        }
    },
    data() {
        return {
            image: ''
        }
    },
    watch: {
        async tag(): Promise<void> {
            const source = this.tag.toLowerCase().replace('.js', '');
            if (icons.includes(source)) {
                let i = await import(`../../assets/${source}.svg`);
                this.image = i.default;
            }
        }
    },
    async mounted(): Promise<void> {
        const source = this.tag.toLowerCase().replace('.js', '');
        if (icons.includes(source)) {
            let i = await import(`../../assets/${source}.svg`);
            this.image = i.default;
        }
    }
});
</script>

<style scoped lang="scss">
.tag-element {
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;

    img {
        width: 20px;
    }
    &.main-tag {
        justify-content: center;
    }
}
</style>