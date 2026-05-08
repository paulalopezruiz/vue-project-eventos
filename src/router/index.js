import { createRouter, createWebHistory } from 'vue-router';

import DashboardView from '@/views/DashboardView.vue';
import EventsListView from '@/views/EventsListView.vue';
import EventDetailView from '@/views/EventDetailView.vue';
import UsersListView from '@/views/UsersListView.vue';
import UserDetailView from '@/views/UserDetailView.vue';
import InscriptionsListView from '@/views/InscriptionsListView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: DashboardView },
    { path: '/eventos', component: EventsListView },
    { path: '/eventos/:id', component: EventDetailView, props: true },
    { path: '/usuarios', component: UsersListView },
    { path: '/usuarios/:dni', component: UserDetailView, props: true },
    { path: '/inscripciones', component: InscriptionsListView },
  ],
});

export default router;
