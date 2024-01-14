<template>
    <div class="wrapper">
        <div class="grades">
            <div class="grade global-grade">
                <h1>Общий грейд</h1>
                <div class="grade-name">
                    <span>Junior</span>
                    <span>{{ global?.name }}</span>
                </div>
                <div class="persentage" :title="`${global?.persentage.toFixed(2)}%`">
                    <div class="persent" :style="{ 'width': `${global?.persentage}%` }"></div>
                </div>
            </div>
            <div class="all-grades">
                <div v-for="grade in grades" class="grade">
                    <div class="grade-name">
                        <span>{{ grade?.name }}</span>
                    </div>
                    <div class="persentage" :title="`${grade?.persentage.toFixed(2)}%`">
                        <div class="persent" :style="{ 'width': `${grade?.persentage}%` }"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import { taskStore, gradeStore } from '@/main';

export default defineComponent({
    data() {
        return {
            global: gradeStore.globalGrade,
            grades: gradeStore.grades,
        }
    },
    async mounted() {
        await taskStore.updateTags();
        const data = await gradeStore.updateGrade(taskStore.tags, taskStore.tasks);
        this.global = data.globalGrade;
        this.grades = data.grades;
    },
});
</script>
  
<style scoped lang="scss">
.wrapper {
    width: 100%;
    height: 100dvh;
    padding: 20px;
    box-sizing: border-box;

    .grades {
        color: white;
        background: #241450;
        box-shadow: 2px 2px 12px rgba(255, 255, 255, 0.2);
        width: 100%;
        height: 100%;
        border-radius: 25px;
        display: flex;
        flex-direction: column;
        gap: 100px;
        padding: 35px;
        box-sizing: border-box;
        overflow-y: auto;

        .grade {
            background: #290b7c;
            padding: 25px;
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.2);

            .grade-name {
                display: flex;
                justify-content: space-between;
                font-weight: 700;
                letter-spacing: 1px;
            }

            .global-grade {
                width: 100%;
            }
            .persentage {
                width: 100%;
                height: 8px;
                padding: 2px;
                background: #01272C;
                border: 1px solid #01d8e793;
                border-radius: 20px;
                cursor: pointer;

                .persent {
                    width: 50%;
                    height: 100%;
                    background: #01d8e7b7;
                    border-radius: 20px;
                }
            }
        }
        h1 {
            margin: 10px;
        }
        .all-grades {
            display: grid;
            grid-template-columns: auto auto auto;
            gap: 50px;
        }
            
        &::-webkit-scrollbar {
            width: 0px;
        }
    }
}
</style>