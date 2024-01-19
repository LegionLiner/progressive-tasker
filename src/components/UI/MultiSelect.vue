<template>
    <div class="select" ref="select">
        <div class="visible-part" @click="opened = !opened">
            <span v-if="(multiselect == true) && currentArray?.length > 0">{{ `${currentArray?.length} ${label}` || `Выберите ${labels[3]}` }}</span>
            <span v-else-if="multiselect == true">{{ `Выберите ${labels[3]}` }}</span>
            <span v-else>{{ current?.title || `Выберите ${labels[0]}`  }}</span>

            <svg :class="{ 'reversed': opened }" xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="#2E3640" stroke-linecap="round"/>
            </svg>
        </div>
        <div class="elements-list" v-if="opened && (multiselect == true)">
            <div class="element" v-for="item in items" @click="multiSelect(item)" :class="{ 'selected': currentArray?.some((select) => select.value == item.value) }">
                {{ item.title }}
            </div>
        </div>
        <div class="elements-list" v-if="opened && (multiselect == false)">
            <div class="element" v-for="item in items" @click="select(item)" :class="{ 'selected': current?.value == item.value }">
                {{ item.title }}
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent, toRaw, type PropType } from 'vue';
import Checkbox from './Checkbox.vue';
import { Select } from '@/types'

export default defineComponent({
    components: {
        Checkbox
    },
    props: {
        selected: {
            type: Object as PropType<Select | Select[]>,
            required: false,
        },
        items: {
            type: Array as PropType<Select[]>,
            required: true
        },
        multiselect: {
            type: Boolean as PropType<boolean>,
            required: false,
            default: true
        },
        labels: {
            type: Array as PropType<string[]>,
            required: false,
            default: ['элемент', 'элемента' , 'элементов', 'элементы']
        }
    },
    emits: ['set-selected'],
    data() {
        return {
            opened: false,
            current: {} as Select,
            currentArray: [] as Select[]
        }
    },
    methods: {
        select(item: Select) {
            this.current = item;
            this.opened = false;
            this.$emit('set-selected', item.value);
        },
        multiSelect(item: Select) {
            const index = this.currentArray?.findIndex(((select) => select.value == item.value));
            
            if (index > -1) {    
                this.currentArray?.splice(index,  1);
            } else {
                this.currentArray?.push(item);
            }
            let result = [] as Array<string | boolean>;
            this.currentArray.forEach((select) => {
                result.push(select.value)
            })
            this.$emit('set-selected', result);
        }
    },
    computed: {
        label(): string {
            if (this.currentArray?.length == 0) return '';
            if (this.currentArray?.length == 1) {
                return this.labels[0];
            } else if (this.currentArray?.length > 4) {
                return this.labels[2];
            } else {
                return this.labels[1];
            }
        }
    },
    mounted() {
        if ((this.multiselect == true) && this.selected) {
            // @ts-ignore
            this.currentArray = structuredClone(toRaw(this.selected));
        } else {
            // @ts-ignore
            this.current = structuredClone(toRaw(this.selected));
        }
        document.addEventListener('click', (e: any) => {
            let el = e.target;
            const nodes = [];
            nodes.push(el);

            while(el) {
                nodes.unshift(el.parentNode);
                el = el.parentNode;
            }

            const hasWrapper = nodes.reduce((res, element) => {
                return res || element === this.$refs.select;
            }, false);

            if (!hasWrapper) {
                this.opened = false;
            }
        });
    },
});
</script>


<style scoped lang="scss">
    .select {
        user-select: none;
        width: 200px;
        height: 34px;
        background: #7F4698;
        border-radius: 3px;
        border: 1px solid #241450;
        color: white;
        position: relative;
        cursor: pointer;
        @media (width < 900px) {
                width: 100%;
            }

        .visible-part {
            padding: 0 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100%;

            svg.reversed {
                transform: rotate(180deg);
            }
        }

        .elements-list {
            box-sizing: border-box;
            width: 100%;
            padding: 2px;
            border: 1px solid #241450;
            background: #10062C;
            box-shadow: 3px 3px 16px rgba(0, 0, 0, 0.2);
            border-radius: 3px;
            position: absolute;
            z-index: 100;
            top: 36px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            max-height: 300px;
            overflow-y: auto;
            &::-webkit-scrollbar {
                width: 0px;
            }

            .element {
                background: #7F4698;
                border-radius: 2px;
                padding: 4px 6px;

                &:hover {
                    background: #4219a1;
                }
                &.selected {
                    background: #391199;
                }
            }
        }
    }
</style>
