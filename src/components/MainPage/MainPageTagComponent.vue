<template>
    <div class="main">
        <div class="left_menu" :class="{ 'scrollMenu': showLeftPanel }" @click="showLeftPanel = !showLeftPanel">
            <div class="tags">
                <div class="tag" @click="$router.replace(`/`)">
                    <Tag :tag="'Главная'" :main="true"></Tag>
                </div>
                <div class="tag" v-for="tag in tags" @click="$router.replace(`/tags/${tag}`)" :class="{ 'active-tag': currentTag == tag }">
                    <Tag :tag="tag"></Tag>
                </div>
            </div>
            <div class="add_task">
                <Button :width="'full'" @click="createTask">Новая таска</Button>
            </div>
        </div>
        <div class="task_viewer">
            <div class="filters-block">
                <div class="filter-buttons">
                    <Button v-if="width" :width="'full'" @click="showLeftPanel = !showLeftPanel">Меню</Button>
                    <div v-if="width" class="length">
                        {{ completed }} / {{ filteredTasks.length }}
                    </div>
                    <Button :width="'full'" @click="$router.push(`/grade`)">Грейды</Button>
                </div>
                <div v-if="!width" class="length">
                    {{ completed }} / {{ filteredTasks.length }}
                </div>
                <div class="filters">
                    <MultiSelect :items="statuses" @set-selected="setStatuses" :labels='["статус", "статуса", "статусов", "статусы"]'></MultiSelect>
                    <MultiSelect :items="priorities" @set-selected="setSort" :multiselect="false" :labels='["приоритет", "приоритета", "приоритетов", "приоритеты"]'></MultiSelect>
                </div>
            </div>
            <div v-if="filteredTasks.length > 0" class="tasks">
                <div class="task" v-for="task in filteredTasks">
                    <TaskBlock :task="task" :noDelete="true"></TaskBlock>
                </div>
            </div>
            <div v-else class="tasks">
                <div class="empty">
                    Тасков нет.
                </div>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import { taskStore } from '@/main';
import { Priority, Select, Status, Task } from '@/types';
import Button from '../UI/Button.vue';
import MultiSelect from '../UI/MultiSelect.vue';
import Tag from '../UI/Tag.vue';
import TaskBlock from './TaskBlock.vue';

export default defineComponent({
    components: {
        Button,
        MultiSelect,
        Tag,
        TaskBlock,
    },
    data() {
        return {
            tasks: [] as Task[],
            filteredTasks: [] as Task[],
            tags: taskStore.updateTags(),
            currentTag: this.$route.params.tag as string,
            statuses: [
                {
                    title: 'Не начато',
                    value: 'not started'
                },
                {
                    title: 'В процессе',
                    value: 'in progress'
                },
                {
                    title: 'Завершено',
                    value: 'done'
                }
            ] as Select[],
            priorities: [
                {
                    title: 'Высокий',
                    value: 'high'
                },
                {
                    title: 'Средний',
                    value: 'medium'
                },
                {
                    title: 'Низкий',
                    value: 'low'
                }
            ] as Select[],
            filters: {
                tags: [this.$route.params.tag] as string[],
                statuses: [] as Status[],
                sort: '' as Priority,
            },
            width: window.innerWidth <= 600,
            showLeftPanel: true
        }
    },
    methods: {
        createTask(): void {
            this.$router.replace(`/create`)
        },
        filterTasks(tags: string[], statuses: Status[], sort: Priority): void {
            this.filteredTasks = taskStore.getFilteredTasks(tags, statuses, sort)
        },
        setStatuses(statusesList: Status[]): void {
            this.filters.statuses = statusesList;

            const { tags, statuses, sort } = this.filters;
            this.filterTasks(tags, statuses, sort);  
        },
        setSort(sortBy: Priority): void {
            this.filters.sort = sortBy;

            const { tags, statuses, sort } = this.filters;
            this.filterTasks(tags, statuses, sort);  
        },
        updateTags() {
            this.tags = taskStore.updateTags();
        }
    },
    computed: {
        tagsArray(): Select[] {
            let result = [] as Select[];
            this.tags.forEach((tag) => {
                result.push({
                    title: tag,
                    value: tag
                })
            })
            return result;
        },
        completed() {
            let result = 0;
            this.filteredTasks.forEach((task) => {
                if (task.status === 'done') result++
            }); 
            return result;
        }
    },
    watch: {
        $route() {
            this.currentTag = this.$route.params.tag as string;
            this.filters.tags = [this.currentTag];
            const tasks = taskStore.getFilteredTasks([this.currentTag], [], null) as Task[];

            this.tasks = tasks;
            this.filteredTasks = tasks; 
        },
    },
    async mounted() {
        if (window.innerWidth <= 600) {
            this.showLeftPanel = false;
        }

        let data: any = [];
        await fetch('https://nimble-parfait-b70fac.netlify.app/.netlify/functions/api')
            .then(res => res.json())
            .then(res => data = res)
        if (data.length) {
            taskStore.tasks = data;
            localStorage.setItem('tasks', JSON.stringify(data));
        } else {
            // @ts-ignore
            taskStore.tasks = JSON.parse(localStorage.getItem('tasks'));
        }

        this.currentTag = this.$route.params.tag as string;
        this.filters.tags = [this.currentTag];
        const tasks = taskStore.getFilteredTasks([this.currentTag], [], null) as Task[];
        
        this.tasks = tasks;
        this.filteredTasks = tasks;  
        this.updateTags();
    }
});
</script>
  
<style scoped lang="scss">
.main {
    box-sizing: border-box;
    width: 100%;
    height: 100dvh;
    display: flex;
    flex-direction: row;
    gap: 30px;
    position: relative;
    overflow-y: hidden;

    .left_menu {
        width: 20%;
        background: linear-gradient(#130735, #6f3c85);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 15px;

        @media (width < 600px) {
            position: absolute;
            z-index: 1000;
            height: 100dvh;
            box-sizing: border-box;
            width: 200px;
            left: -200px;
            transition: left 0.3s ease-in-out;
        }
        .tags {
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-height: 840px;
            overflow-y: auto;
            
            &::-webkit-scrollbar {
                width: 0px;
            }

            .tag {
                background: #350D48;
                box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.2);
                width: 100%;
                height: 46px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                font-weight: 700;
                font-size: 20px;
                border-radius: 5px;
                cursor: pointer;
                transition: transform 0.2s ease-out;

                &:hover {
                    background: #3b0f50;
                    transform: scale(1.01);
                }
                &.active-tag {
                    background: #130735;
                }
            }
        }

        &.scrollMenu {
            left: 0;
        }
    }
    .task_viewer {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px 30px 30px 20px;

        @media (width < 700px) {
            padding: 15px;
            box-sizing: border-box;
        }

        .filters-block {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            @media (width < 1300px) {
                flex-direction: column;
                gap: 20px;
            }

            @media (width < 900px) {
                gap: 10px;
            }

            @media (width < 600px) {
                .filter-buttons {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 10px;
                }
            }
        }

        .length {
            color: white;
            font-size: 18px;
            font-weight: 700;
        }

        .filters {
            display: flex;
            gap: 20px;
            justify-content: flex-end;
            padding-right: 20px;

            @media (width < 900px) {
                flex-direction: column;
                gap: 5px;
                width: 100%;
                padding: 0;
            }
        }

        .tasks {
            background: #241450;
            box-shadow: 2px 2px 12px rgba(255, 255, 255, 0.2);
            width: 100%;
            height: 100%;
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 15px;
            box-sizing: border-box;
            overflow-y: auto;

            .task {
                width: 100%;
                padding: 10px;
                border-radius: 15px;
                background: linear-gradient(#7F4698, #874ba1);
                box-sizing: border-box;
                transition: transform 0.2s ease-out;
                cursor: pointer;

                &:hover {
                    background: #874ba1;
                    transform: scale(1.01);
                }
            }

            .empty {
                width: 100%;
                color: white;
                font-size: 24px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            &::-webkit-scrollbar {
                width: 0px;
            }

        }
    }
}
</style>
