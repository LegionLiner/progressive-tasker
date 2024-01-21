import { Task, Status, Priority } from '@/types';
import { gradeStore } from '@/main';
import { defineStore } from 'pinia';

function sendData(data: any): void {
  fetch('https://nimble-parfait-b70fac.netlify.app/.netlify/functions/api', {
    method: 'POST',
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(data)
  })
}

export const useTaskStore = defineStore("taskStore", {
  state: () => ({
    tags: [] as string[],
    tasks: [] as Task[]
  }),
  actions: {
    addTask(task: Task): void {
      this.tasks.push(task);
      sendData(this.tasks);
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      gradeStore.updateGrade(this.updateTags(), this.tasks);
    },
    removeTask(title: string): Task[] {
      const index = this.tasks.findIndex((_task) => _task.title == title);
      if (index > -1) {
        this.tasks.splice(index, 1)
      }
      sendData(this.tasks);
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      gradeStore.updateGrade(this.updateTags(), this.tasks);
      return this.tasks;
    },
    editTask(task: Task): Task[] {
      const index = this.tasks.findIndex((_task) => _task.title == task.title);
      if (index > -1) {
        this.tasks[index] = task;
      }
      sendData(this.tasks);
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      gradeStore.updateGrade(this.updateTags(), this.tasks);
      return this.tasks;
    },
    updateTags() {
      let newTags = new Set<string>();
      this.tasks.forEach((task) => {
        task.tags.forEach((tag) => {
          newTags.add(tag);
        })
      })
      this.tags = [...newTags];
      return [...newTags];
    },
    getFilteredTasks(tags: string[], statuses: Status[], sort: Priority | null): Task[] {
      let result = [] as Task[];

      this.tasks.forEach((task) => {
        if (task.tags.some((tag) => tags.includes(tag) || !tags.length)) {
          if (statuses.includes(task.status) || !statuses.length) {
            result.push(task);
          }
        }
      })

      if (sort && (sort !== 'medium')) {
        result.sort((a: Task, b: Task) => sortPriority(a, b, sort))
      }

      return result;
    },
    getTask(title: string): Task | undefined {
      return this.tasks.find((task) => task.title == title);
    }
  },
})

function sortPriority(a: Task, b: Task, sort: Priority): number {
  const weight = {
    'high': 1,
    'medium': 0,
    'low': -1
  }
  if (sort == 'high') {
    return weight[a.priority] > weight[b.priority] ? -1 : 1;
  } else {
    return weight[a.priority] > weight[b.priority] ? 1 : -1;
  }
}