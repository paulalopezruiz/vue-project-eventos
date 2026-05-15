import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

import DashboardView from '@/views/DashboardView.vue';
import EventsListView from '@/views/EventsListView.vue';
import EventCreateView from '@/views/EventCreateView.vue';
import EventEditView from '@/views/EventEditView.vue';
import EventDetailView from '@/views/EventDetailView.vue';
import UsersListView from '@/views/UsersListView.vue';
import UserDetailView from '@/views/UserDetailView.vue';
import InscriptionsListView from '@/views/InscriptionsListView.vue';
import LoginView from '@/views/LoginView.vue';

const routes = [
  // LOGIN
  {
    path: '/login',
    component: LoginView,
  },

  // RUTA PRINCIPAL
  {
    path: '/',
    redirect: '/eventos',
  },

  // EVENTOS
  {
    path: '/eventos',
    component: EventsListView,
  },
  {
    path: '/eventos/crear',
    component: EventCreateView,
    meta: { requiresAdmin: true },
  },
  {
    path: '/eventos/:id/editar',
    component: EventEditView,
    meta: { requiresAdmin: true },
  },
  {
    path: '/eventos/:id',
    component: EventDetailView,
    props: true,
  },

  // ADMIN
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { requiresAdmin: true },
  },
  {
    path: '/usuarios',
    component: UsersListView,
    meta: { requiresAdmin: true },
  },
  {
    path: '/usuarios/:dni',
    component: UserDetailView,
    props: true,
    meta: { requiresAdmin: true },
  },
  {
    path: '/inscripciones',
    component: InscriptionsListView,
    meta: { requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Protección de rutas privadas
router.beforeEach((to) => {
  const auth = useAuthStore();

  if (to.path === '/login') {
    return true;
  }

  if (to.meta.requiresAdmin && auth.userRole !== 'ADMIN') {
    return '/eventos';
  }

  return true;
});

export default router;
