import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import { useTaskStore } from './store/taskStore';
import { useGradeStore } from './store/gradeStore';
import App from './App.vue';

const pinia = createPinia()
createApp(App).use(pinia).use(router).mount('#app');

export const taskStore = useTaskStore();
export const gradeStore = useGradeStore();
taskStore.updateTags();

export const icons = ['css', 'git', 'html', 'javascript', 'jest', 'mocha',
            'node', 'nuxt', 'php', 'pinia', 'react', 'typescript',
            'vite', 'vue', 'webpack', 'docker', 'vuetify', 'mongodb'];
export const statuses = {
    'done': 'Выполнен',
    'in progress': 'В процессе',
    'not started': 'Не начат'
};
