import { Grade, Task } from '@/types';
import { defineStore } from 'pinia';

export const useGradeStore = defineStore("gradeStore", {
  state: () => ({ 
      globalGrade: {
        name: "Middle",
        persentage: 0,
      } as Grade,
      grades: [] as Grade[],
    }),
  actions: {
    updateGrade(tags: string[], tasks: Task[]): { globalGrade: Grade, grades: Grade[] } {
      this.grades = [];
      let inGrade = 0;
      let globalPersentage = 0;
      let localPersentages = {} as any;

      tags.forEach((tag) => {
        this.grades.push({
          name: tag,
          persentage: 0,
        })
        localPersentages[tag] = {
          name: tag,
          persentage: 0,
          count: 0,
        }
      })
      tasks.forEach((task) => {
        if (task.in_grade) {
          inGrade++;
          if (task.status === 'done') {
            globalPersentage++;
          }
        }
        task.tags.forEach((tag) => {
          localPersentages[tag].count++;
          if (task.status === 'done') {
            // @ts-ignore
            localPersentages[tag].persentage++;
          }
        });
      });
      this.globalGrade.persentage = (globalPersentage / inGrade) * 100;
      this.grades.forEach((grade) => {
        grade.persentage = (localPersentages[grade.name]?.persentage / localPersentages[grade.name]?.count) * 100
      });
      
      return {
        globalGrade: this.globalGrade,
        grades: this.grades
      }
    }
  },
})
