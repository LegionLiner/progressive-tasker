<template>
    <input
        type="text"
        ref="input"
        :class="{ 'forTags': forTags }"
        :maxlength="max"
        :placeholder="placeholder"
        :disabled="disabled"
        :value="value"
        @input="$emit('input', $event?.target?.value)"
    >
</template>

<script lang="ts">
import { type PropType, defineComponent } from 'vue';

export default defineComponent({
    emits: ['input'],
    props: {
        placeholder: {
            type: String as PropType<string>,
            required: false
        },
        max: {
            type: Number as PropType<number>,
            required: false
        },
        disabled: {
            type: Boolean as PropType<boolean>,
            required: false
        },
        value: {
            type: String as PropType<string>,
            required: false 
        },
        forTags: {
            type: Boolean as PropType<boolean>,
            required: false,
            default: false
        }
    },
    mounted() {
        (this.$refs.input as any).focus();
    }
});
</script>

<style scoped lang="scss">
input {
    outline: none;
    padding: 6px 8px;
    border: 1px solid black;
    border-radius: 3px;
    letter-spacing: 1px;
    background: #7F4698;
    color: white;
    box-shadow: inset 0px 0px 1px 1px rgba(0, 0, 0, 0.1);
    width: 250px;

    &:disabled {
        opacity: 0.8;
        cursor: not-allowed;
    }

    &.forTags {
        width: 100%;
        height: 50px;
        padding: 10px;
        box-sizing: border-box;
    }
}
</style>