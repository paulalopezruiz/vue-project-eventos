import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

import DashboardView from '@/views/DashboardView.vue';
import EventsListView from '@/views/EventsListView.vue';
import EventDetailView from '@/views/EventDetailView.vue';
import UsersListView from '@/views/UsersListView.vue';
import UserDetailView from '@/views/UserDetailView.vue';
import InscriptionsListView from '@/views/InscriptionsListView.vue';
import LoginView from '@/views/LoginView.vue';

const routes = [
  // LOGIN
  { path: '/login', component: LoginView },

  // ⭐ RUTAS PÚBLICAS
  { path: '/', redirect: '/eventos' },
  { path: '/eventos', component: EventsListView },
  { path: '/eventos/:id', component: EventDetailView, props: true },

  // ⭐ RUTAS PRIVADAS (solo admin)
  { path: '/dashboard', component: DashboardView, meta: { requiresAdmin: true } },
  { path: '/usuarios', component: UsersListView, meta: { requiresAdmin: true } },
  { path: '/usuarios/:dni', component: UserDetailView, props: true, meta: { requiresAdmin: true } },
  { path: '/inscripciones', component: InscriptionsListView, meta: { requiresAdmin: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ⭐ PROTECCIÓN DE RUTAS
router.beforeEach((to) => {
  const auth = useAuthStore();

  // Permitir login siempre
  if (to.path === '/login') return true;

  // Si requiere admin y NO lo es → fuera
  if (to.meta.requiresAdmin && auth.userRole !== 'ADMIN') {
    return '/eventos';
  }

  return true;
});

export default router;
