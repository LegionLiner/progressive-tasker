import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import MainView from '../views/MainView.vue';
import CreateView from '@/views/CreateView.vue';
import GradeView from '@/views/GradeView.vue';
import TaskComponent from '@/components/MainPage/TaskComponent.vue';
import MainPageTagComponent from '@/components/MainPage/MainPageTagComponent.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: MainView
  },
  {
    path: '/tasks/:title',
    name: 'task',
    component: TaskComponent
  },
  {
    path: '/tags/:tag',
    name: 'tag',
    component: MainPageTagComponent
  },
  {
    path: '/create',
    name: 'create',
    component: CreateView
  },
  {
    path: '/grade',
    name: 'grade',
    component: GradeView
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router;
