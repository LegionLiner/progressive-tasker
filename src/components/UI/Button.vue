<template>
    <div class="button" @click="press()"
     :class="{ 
        'fixed': width == 'fixed', 
        'disabled': disabled 
     }">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
type Width = 'full' | 'fixed';

export default defineComponent({
    emits: ['press'],
    props: {
        disabled: {
            type: Boolean as PropType<boolean>,
            required: false,
            default: false
        },
        width: {
            type: String as PropType<Width>,
            required: false,
            default: 'fixed'
        }
    },
    methods: {
        press() {
            if (!this.disabled) {
                this.$emit('press')
            }
        }
    }
});
</script>

<style scoped lang="scss">
.button {
    user-select: none;
    background: #3A0652;
    border: 1px solid #3e025a;
    border-radius: 5px;
    padding: 10px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #979BF5;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s ease-in;

    &:hover {
        background: #410b5a;
    }
    &:active {
        background: rgb(56, 11, 78);
    }
    &.fixed {
        width: 200px;
    }
    &.disabled {
        opacity: 0.8;
        cursor: not-allowed;
        &:hover, &:active {
            background: #3A0652;
        }
    }
}
</style>