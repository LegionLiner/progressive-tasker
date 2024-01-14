<template>
    <div class="wrapper">
        <div class="task-body">
            <div class="left-part">
                <div class="header">
                    <div class="block">
                        <div class="title">
                            Название:
                        </div>
                        <div class="value">
                            {{ task.title }}
                        </div>
                    </div>
                </div>
                <div class="short-description">
                    <div class="block">
                        <div class="title">
                            Приоритет:
                        </div>
                        <div v-if="editing.priority" class="value">
                            <MultiSelect 
                            :items="[{ title: 'Высокиий', value: 'high' }, { title: 'Средний', value: 'medium' }, { title: 'Низкий', value: 'low' }]" 
                            :multiselect="false"
                            @set-selected="task.priority = $event; editing.priority = false; setData()"></MultiSelect>
                        </div>
                        <div v-else class="value" @click="editing.priority = true">
                            <img v-if="task.priority == 'high'" src="../../assets/high.svg">
                            <img v-if="task.priority == 'medium'" src="../../assets/medium.svg">
                            <img v-if="task.priority == 'low'" src="../../assets/low.svg">
                        </div>
                    </div>
                    <div class="block">
                        <div class="title">
                            Статус:
                        </div>
                        <div v-if="editing.status" class="value">
                            <MultiSelect 
                            :items="[{ title: 'Выполнен', value: 'done' }, { title: 'В процессе', value: 'in progress' }, { title: 'Не начат', value: 'not started' }]" 
                            :multiselect="false"
                            @set-selected="task.status = $event; editing.status = false; setData()"></MultiSelect>
                        </div>
                        <div v-else class="value" @click="editing.status = true"
                            :class="{ 'green': task.status == 'done', 'yellow': task.status == 'in progress', 'red': task.status == 'not started' }">
                            {{ statuses[task.status] }}
                        </div>
                    </div>
                    <div class="block">
                        <div class="title">
                            Учет в общем грейде:
                        </div>
                        <div v-if="editing.in_grade" class="value">
                            <Checkbox :checked="task.in_grade" @check="task.in_grade = $event; editing.in_grade = false; setData();"></Checkbox>
                        </div>
                        <div v-else class="value" @click="editing.in_grade = true">
                            {{ task.in_grade ? 'Да' : 'Нет' }}
                        </div>
                    </div>
                </div>
                <div class="tags-wrapper" @click="editing.tags = true;">
                    <div v-if="editing.tags" class="tags">
                        <Input :value="tagsString" @input="tagsString = $event" @keyup.enter="setTags" :forTags="true"></Input>
                    </div>
                    <div v-else-if="!tagsString" class="tags">
                        <span class="tag">Добавить теги</span>
                    </div>
                    <div v-else class="tags">
                        <div class="tag" v-for="tag in tags">
                            <img v-if="tag.type =='image'"  :src="tag.value" class="tag">
                            <p v-else>{{ tag.value }}</p>
                        </div>
                    </div>
                </div>
                <div v-if="editing.description" class="description">
                    <MultilineInput :value="task.description" @input="task.description = $event" @keyup.enter="editing.description = false; setData()"></MultilineInput>
                </div>
                <div v-else class="description" @click="editing.description = true">
                    <p>{{ task.description }}</p>
                </div>
            </div>
            <div class="right-part">
                <div v-if="task.paragraphs?.length > 0" class="paragraphs">
                    <div v-for="paragraph in task.paragraphs" class="paragraph">
                        <div class="paragraph-header">
                            <div class="paragraph-name">
                                <Checkbox v-if="paragraph.done" :checked="true" @check="paragraph.done = $event; checkParagraph(paragraph)"></Checkbox>
                                <Checkbox v-else :checked="paragraph.done" @check="paragraph.done = $event; checkParagraph(paragraph)"></Checkbox>
                                <div v-if="paragraph.editing?.name">
                                    <Input :value="paragraph.name" @input="paragraph.name = $event" @keyup.enter="paragraph.editing.name = false"></Input>
                                </div>
                                <div v-else @click="paragraph.editing.name = true">
                                    {{ paragraph.name }}
                                </div>
                                <svg @click="deleteParagraph(paragraph)" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M10 2L2 10M10 10L2 2" stroke="#DBDEDF" stroke-width="2.84868" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <div class="paragraph-close">
                                <svg @click="paragraph.show = !paragraph.show" :class="{ 'reversed':  !paragraph.show }" xmlns="http://www.w3.org/2000/svg" width="20" height="12" viewBox="0 0 10 6" fill="none">
                                    <path d="M1 1L5 5L9 1" stroke="#2E3640" stroke-linecap="round"/>
                                </svg>
                            </div>
                        </div>
                        <div v-if="paragraph.show" class="paragraph-description">
                            <div v-if="paragraph.editing?.description">
                                <MultilineInput :value="paragraph.description" @input="paragraph.description = $event" @keyup.enter="paragraph.editing.description = false"></MultilineInput>
                            </div>
                            <div v-else @click="paragraph.editing.description = true">
                                {{ paragraph.description }}
                            </div>
                        </div>
                        <div v-if="paragraph.show && (paragraph.subparagraphs.length > 0)" class="subparagraphs">
                            <div v-for="subparagraph in paragraph.subparagraphs" class="subparagraph">
                                <div class="subparagraph-name">
                                    <Checkbox v-if="paragraph.done" :checked="true" @check="subparagraph.done = $event; checkSubparagraph(paragraph)"></Checkbox>
                                    <Checkbox v-else :checked="subparagraph.done" @check="subparagraph.done = $event; checkSubparagraph(paragraph)"></Checkbox>
                                    <div v-if="subparagraph.editing?.name">
                                        <Input :value="subparagraph.name" @input="subparagraph.name = $event" @keyup.enter="subparagraph.editing.name = false"></Input>
                                    </div>
                                    <div v-else @click="subparagraph.editing.name = true">
                                        {{ subparagraph.name }}
                                    </div>
                                    <svg @click="deleteSubparagraph(paragraph, subparagraph)" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M10 2L2 10M10 10L2 2" stroke="#DBDEDF" stroke-width="2.84868" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <div class="subparagraph-description">
                                    <div v-if="subparagraph.editing?.description">
                                        <MultilineInput :value="subparagraph.description" @input="subparagraph.description = $event" @keyup.enter="subparagraph.editing.description = false"></MultilineInput>
                                    </div>
                                    <div v-else @click="subparagraph.editing.description = true">
                                        {{ subparagraph.description }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="add-subparagraph">
                            <Button :width="'full'" @click="addSubparagraph(paragraph)">Новая подтема</Button>
                        </div>
                    </div>
                </div>
                <div v-else class="paragraphs">
                    <h2 style="text-align: center;">Тем нет</h2>
                </div>
                <div class="add-paragraph">
                    <Button :width="'full'" @click="addParagraph">Новая тема</Button>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import { taskStore, statuses } from '@/main';
import { Task, Tag, Subparagraph, Paragraph } from '@/types';
import Button from '../UI/Button.vue'
import Checkbox from '../UI/Checkbox.vue';
import MultiSelect from '../UI/MultiSelect.vue';
import MultilineInput from '../UI/MultilineInput.vue';
import Input from '../UI/Input.vue';

export default defineComponent({
    components: {
    Button,
    Checkbox,
    MultilineInput,
    MultiSelect,
    Input
    },
    data() {
        return {
            task: {} as Task,
            tags: [] as Tag[],
            editing: {
                priority: false,
                status: false,
                in_grade: false,
                tags: false,
                description: false,
            },
            statuses,
            tagsString: '',
        }
    },
    methods: {
        setData(): void {
            taskStore.editTask(this.task);
        },
        setTags(): void {
            this.editing.tags = false;
            const tags = this.tagsString.trim().split(', ')
            this.task.tags = tags;
            this.setData();
            this.updateTagImages();   
        },
        updateTagImages(): void {
            this.tagsString = '';
            this.tags = [];
            
            this.task.tags.forEach(async (tag) => {
                this.tagsString += `${tag}, `;
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
            this.tagsString = this.tagsString.slice(0, -2);
        },
        addParagraph(): void {
            this.task.paragraphs.push({
                name: 'Название',
                description: 'Описание',
                subparagraphs: [] as Subparagraph[],
                done: false,
                show: true,
                editing: {
                    name: false,
                    description: false
                }
            });
        },
        addSubparagraph(paragraph: Paragraph): void {
            paragraph.subparagraphs.push({
                name: 'Название',
                description: 'Описание',
                done: false,
                editing: {
                    name: false,
                    description: false
                }
            });        
        },
        checkParagraph(paragraph: Paragraph): void {
            const bool = paragraph.done;
            paragraph.subparagraphs.forEach((subparagraph) => {
                subparagraph.done = bool;
            });
            const index = this.task.paragraphs.findIndex((_paragraph) => _paragraph.name == paragraph.name);
            this.task.paragraphs.splice(index, 1, paragraph);
            this.setData(); 
        },
        checkSubparagraph(paragraph: Paragraph): void {
            let bool = true;
            paragraph.subparagraphs.forEach((subparagraph) => {
                if (!subparagraph.done) bool = false;
            });
            paragraph.done = bool;
            const index = this.task.paragraphs.findIndex((_paragraph) => _paragraph.name == paragraph.name);
            this.task.paragraphs.splice(index, 1, paragraph);
            this.setData(); 
        },
        deleteParagraph(paragraph: Paragraph): void {
            const index = this.task.paragraphs.findIndex((_paragraph) => _paragraph.name == paragraph.name);
            this.task.paragraphs.splice(index, 1);
            this.setData(); 
        },
        deleteSubparagraph(paragraph: Paragraph, subparagraph: Subparagraph): void {
            const subIndex = paragraph.subparagraphs.findIndex((_subparagraph) => _subparagraph.name == subparagraph.name);
            paragraph.subparagraphs.splice(subIndex, 1);
            const index = this.task.paragraphs.findIndex((_paragraph) => _paragraph.name == paragraph.name);
            this.task.paragraphs.splice(index, 1, paragraph);
            this.setData(); 
        }
    },
    async mounted(): Promise<void> {
        const title = this.$route.params.title as string;
        
        const task = taskStore.getTask(title) as Task;
        this.task = task;
        this.task?.paragraphs?.forEach((paragraph) => {
            paragraph.show = true;
            paragraph.editing = {
                name: false,
                description: false
            };
            paragraph?.subparagraphs?.forEach((subparagraph) => {
                subparagraph.editing = {
                    name: false,
                    description: false
                };
            });
        })
        this.updateTagImages();
    }
});
</script>
  
<style scoped lang="scss">
.wrapper {
    width: 100%;
    height: 100dvh;
    padding: 20px;
    box-sizing: border-box;

    .task-body {
        color: white;
        background: #241450;
        box-shadow: 2px 2px 12px rgba(255, 255, 255, 0.2);
        width: 100%;
        height: 100%;
        border-radius: 25px;
        display: flex;
        flex-direction: row;
        gap: 100px;
        padding: 35px;
        box-sizing: border-box;

        .left-part {
            display: flex;
            flex-direction: column;
            gap: 20px;

            .block {
                display: flex;
                width: 400px;
                height: 66px;
                justify-content: space-between;
                align-items: center;
                padding: 10px 25px;
                box-sizing: border-box;

                .value {
                    cursor: pointer;
                    transition: background 0.2s ease-in;
                    padding: 5px;
                    border-radius: 10px;

                    &:hover {
                        background: #835796;
                    }

                    &.green,
                    &.yellow,
                    &.red {
                        padding: 5px;
                        border-radius: 10px;
                        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
                    }

                    &.green {
                        background: rgb(1, 110, 1);
                    }

                    &.yellow {
                        background: rgb(145, 145, 16);
                    }

                    &.red {
                        background: rgb(143, 0, 0);
                    }

                    img {
                        widows: 20px;
                        height: 20px;
                    }
                }
            }

            .short-description {
                width: 400px;
                background: #7F4698;
                border-radius: 20px;
                padding: 5px;
                box-sizing: border-box;
            }

            .header {
                width: 400px;
                box-sizing: border-box;

                .block {
                    background: #7F4698;
                    padding: 25px;
                    border-radius: 20px;

                    .value {
                        font-weight: 700;
                    }
                }
            }

            .tags-wrapper {
                width: 400px;
                background: #1b084b;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 10px;
                cursor: pointer;
                transition: background 0.2s ease-in;

                &:hover {
                    background: #200a58;
                }

                .tags {
                    display: flex;
                    align-items: center;
                    width: 100%;

                    .tag {
                        padding: 10px 0 10px 10px;
                        font-size: 18px;
                        line-height: 30px;
                    }
                    img {
                        width: 30px;
                    }
                }
            }
            .description {
                width: 400px;
                height: 100%;
                background: #7F4698;
                border-radius: 20px;
                box-sizing: border-box;
                cursor: pointer;
                transition: background 0.2s ease-in;

                p {
                    margin: 20px;
                }

                &:hover {
                    background: #835796;
                }
            }
        }

        .right-part {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 30px;
            border-radius: 20px;
            background: #7F4698;
            overflow-y: auto;
            width: 100%;

            &::-webkit-scrollbar {
                width: 0px;
            }

            .paragraphs {
                background: #140836;
                padding: 10px;
                border-radius: 15px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-height: 700px;
                overflow-y: auto;

                &::-webkit-scrollbar {
                    width: 0px;
                }
                svg {
                    cursor: pointer;
                }

                .paragraph {
                    background: #1a0a44;
                    padding: 10px;
                    border-radius: 15px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;

                    .paragraph-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .paragraph-name {
                            display: flex;
                            gap: 20px;
                            align-items: center;
                        }
                        .paragraph-close svg {
                            margin-right: 10px;
                            cursor: pointer;
                            &.reversed {
                                transform: rotate(180deg);
                            }
                        }
                    }

                    .paragraph-description {
                        background: #140836;
                        padding: 20px;
                        border-radius: 15px;
                    }

                    .subparagraphs {
                        background: #140836;
                        padding: 10px;
                        margin: 10px;
                        border-radius: 15px;
                        display: flex;
                        flex-direction: column;
                        gap: 20px;

                        .subparagraph-name {
                            display: flex;
                            gap: 20px;
                            align-items: center;
                        }

                        .subparagraph-description {
                            background: #140836;
                            padding: 10px;
                            border-radius: 15px;
                        }
                    }
                }
            }
        }
    }

    p {
        margin: 0;
    }
}
</style>