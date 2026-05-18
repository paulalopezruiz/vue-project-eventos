<template>
  <div class="container mt-4 usuario-page" v-if="usuario">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h1>{{ usuario.nombre }} {{ usuario.apellidos }}</h1>

        <p class="text-muted mb-0">
          {{ usuario.email }} · {{ usuario.telefono }} · {{ usuario.tipo_usuario }}
        </p>

        <p class="text-muted mb-0">
          DNI: {{ usuario.dni }}
        </p>
      </div>

      <router-link to="/usuarios" class="btn btn-outline-secondary">
        Volver a usuarios
      </router-link>
    </div>

    <div class="d-flex gap-2 mb-4">
      <router-link
        :to="`/usuarios/${usuario.dni}/editar`"
        class="btn btn-warning btn-sm"
      >
        Editar usuario
      </router-link>

      <button
        class="btn btn-danger btn-sm"
        @click="eliminarUsuario"
      >
        Eliminar usuario
      </button>
    </div>

    <div class="row g-3 mt-3">
      <div class="col-md-4">
        <div class="card resumen-card">
          <div class="card-body text-center">
            <h6>Total inscripciones</h6>
            <h2>{{ historico.length }}</h2>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card resumen-card">
          <div class="card-body text-center">
            <h6>Asistencias confirmadas</h6>
            <h2>{{ totalAsistencias }}</h2>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card resumen-card">
          <div class="card-body text-center">
            <h6>Canceladas</h6>
            <h2>{{ totalCanceladas }}</h2>
          </div>
        </div>
      </div>
    </div>

    <h3 class="mt-5">Histórico de asistencia por usuario</h3>

    <div v-if="loading" class="text-center py-4">
      Cargando histórico...
    </div>

    <HistoricoUsuarioTable
      v-else
      :historico="historicoOrdenado"
    />
  </div>

  <div v-else class="container mt-4">
    Cargando usuario...
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useUsuariosStore } from '@/stores/usuarios.js';
import {
  apiGetEventos,
  apiGetInscripcionesEvento,
  apiDeleteUsuario,
} from '@/services/api.js';

import HistoricoUsuarioTable from '@/components/HistoricoUsuarioTable.vue';

const route = useRoute();
const router = useRouter();

const usuariosStore = useUsuariosStore();
const { items: usuarios } = storeToRefs(usuariosStore);

const usuario = ref(null);
const historico = ref([]);
const loading = ref(true);

const totalAsistencias = computed(() => {
  return historico.value.filter(ins => ins.confirmacion_asistencia).length;
});

const totalCanceladas = computed(() => {
  return historico.value.filter(ins => ins.estado === 'CANCELADA').length;
});

const historicoOrdenado = computed(() => {
  return [...historico.value].sort((a, b) => {
    return new Date(b.evento.fecha) - new Date(a.evento.fecha);
  });
});

onMounted(async () => {
  await cargarDatosUsuario();
});

async function cargarDatosUsuario() {
  loading.value = true;
  historico.value = [];

  try {
    // Importante: recargamos siempre los usuarios desde Django.
    // Así evitamos ver datos antiguos después de editar.
    await usuariosStore.fetchAll();

    usuario.value = usuarios.value.find(u => u.dni === route.params.dni) || null;

    if (!usuario.value) {
      loading.value = false;
      return;
    }

    const eventos = await apiGetEventos();
    const acumulado = [];

    for (const ev of eventos) {
      const inscripciones = await apiGetInscripcionesEvento(ev.id);

      for (const ins of inscripciones) {
        if (ins.usuario.dni === route.params.dni) {
          acumulado.push(ins);
        }
      }
    }

    historico.value = acumulado;
  } catch (e) {
    console.error(e);
    alert("No se pudieron cargar los datos del usuario.");
  } finally {
    loading.value = false;
  }
}

async function eliminarUsuario() {
  const confirmado = confirm(
    `¿Seguro que quieres eliminar a "${usuario.value.nombre} ${usuario.value.apellidos}"?`
  );

  if (!confirmado) return;

  try {
    await apiDeleteUsuario(usuario.value.dni);

    // Actualizamos el store después de eliminar para que /usuarios no muestre datos antiguos.
    await usuariosStore.fetchAll();

    router.push('/usuarios');
  } catch (e) {
    console.error(e);
    alert('No se pudo eliminar el usuario. Puede que tenga inscripciones asociadas.');
  }
}
</script>

<style scoped>
.usuario-page {
  color: white;
}

.resumen-card {
  background-color: #111827 !important;
  color: white !important;
  border: 1px solid #374151;
}

.text-muted {
  color: #d1d5db !important;
}
</style>
