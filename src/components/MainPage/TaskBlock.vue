<template>
    <div class="task-wrapper">
        <div class="header">
            <div class="title">
                <svg v-if="!noDelete" @click="$emit('delete-task', task.title)" xmlns="http://www.w3.org/2000/svg"
                    width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M10 2L2 10M10 10L2 2" stroke="#DBDEDF" stroke-width="2.84868" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
                <img v-if="task.in_grade" src="../../assets/in_grade.png" title="Учитывается в общем грейде">
                <h2>{{ task.title }}</h2>
            </div>
            <div class="tags">
                <div v-for="tag in tags" class="tag">
                    <img v-if="tag.type == 'image'" :src="tag.value">
                    <span v-else>{{ tag.value }}</span>
                </div>
            </div>
        </div>
        <div class="main" @click="$router.push(`/tasks/${task.title}`)">
            <div class="statuses">
                <p>Статус: {{ statuses[task.status] }}</p>
                <img v-if="task.priority == 'high'" src="../../assets/high.svg">
                <img v-if="task.priority == 'medium'" src="../../assets/medium.svg">
                <img v-if="task.priority == 'low'" src="../../assets/low.svg">
            </div>
            <div class="description">
                {{ task.description }}
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import { type PropType, defineComponent } from 'vue';
import { Tag, Task } from '@/types';
import { statuses } from '@/main';

export default defineComponent({
    props: {
        task: {
            type: Object as PropType<Task>,
            required: true,
        },
        noDelete: {
            type: Boolean as PropType<boolean>,
            required: false,
            default: false
        }
    },
    emits: ['delete-task'],
    data() {
        return {
            tags: [] as Tag[],
            statuses
        }
    },
    methods: {
        async updateTagImages(): Promise<void> {
            this.tags = [];
            this.task.tags.forEach(async (tag) => {
                const source = tag.toLowerCase().replace('.js', '');
                try {
                    let i = await import(`../../assets/${source}.svg`);
                    this.tags.push({
                        type: 'image',
                        value: i.default
                    });
                } catch (e) {
                    setTimeout(() => {
                        this.tags.push({
                            type: 'string',
                            value: tag
                        });
                    }, 0);
                }
            })
        }
    },
    watch: {
        'task.tags': function (): void {
            this.updateTagImages();
        }
    },
    async mounted(): Promise<void> {
        this.updateTagImages();
    },
});
</script>
  
<style scoped lang="scss">
.task-wrapper {
    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .title {
            display: flex;
            align-items: center;
            gap: 10px;

            h2 {
                margin: 0;

                @media (width < 700px) {
                    font-size: 17px;
                }
            }

            img {
                width: 20px;
                height: 20px;
            }
        }

        .tags {
            display: flex;
            gap: 10px;

            .tag {
                display: flex;
                align-items: center;
            }

            img {
                width: 20px;
            }

            span {
                color: white;
            }
        }
    }

    .main {
        padding: 10px;
        font-size: 18px;

        .statuses {
            display: flex;
            gap: 10px;
            align-items: center;

            p {
                font-size: 16px;
                font-weight: 700;

                @media (width < 700px) {
                    font-size: 13px;
                }
            }

            img {
                width: 20px;
            }
        }

        .description {
            @media (width < 700px) {
                font-size: 14px;
            }
        }
    }
}</style>