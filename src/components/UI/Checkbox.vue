<template>
    <div class="checkbox" :class="{ 'disabled': disabled }" @click="setValue()">
        <div class="checked" v-if="value"></div>
    </div>
</template>

<script lang="ts">
import { type PropType, defineComponent } from 'vue';

export default defineComponent({
    emits: ['check'],
    props: {
        checked: {
            type: Boolean as PropType<boolean>,
            required: false,
            default: false
        },
        disabled: {
            type: Boolean as PropType<boolean>,
            required: false,
            default: false
        }
    },
    data() {
        return {
            value: this.checked
        }
    },
    methods: {
        setValue() {
            if (this.disabled) return;
            this.value = !this.value;
            this.$emit('check', this.value)
        }
    },
});
</script>

<style scoped lang="scss">
.checkbox {
    user-select: none;
    width: 16px;
    height: 16px;
    border: 1px solid black;
    background: #7F4698;
    border-radius: 100%;
    cursor: pointer;
    box-shadow: inset 0px 0px 1px 1px rgba(0, 0, 0, 0.1);

    .checked {
        width: 10px;
        height: 10px;
        background: #230b66;
        border-radius: 100%;
        margin: 3px;
    }

    &.disabled {
        opacity: 0.8;
        cursor: not-allowed;
    }
}
</style>