<template>
  <div class="container mt-4" v-if="evento">
    <h1>{{ evento.titulo }}</h1>

    <div v-if="auth.userRole === 'ADMIN'" class="d-flex gap-2 mb-3">
      <router-link :to="`/eventos/${evento.id}/editar`" class="btn btn-warning btn-sm">
        Editar evento
      </router-link>

      <button class="btn btn-danger btn-sm" @click="eliminarEvento">
        Eliminar evento
      </button>
    </div>

    <p class="text-muted">{{ evento.descripcion }}</p>

    <div class="row mt-4">
      <div class="col-md-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5>Información</h5>
            <p><strong>Código:</strong> {{ evento.codigo_evento }}</p>
            <p><strong>Fecha:</strong> {{ evento.fecha }}</p>
            <p><strong>Hora:</strong> {{ evento.hora_inicio }} - {{ evento.hora_fin }}</p>
            <p><strong>Ubicación:</strong> {{ evento.ubicacion }}</p>
            <p><strong>Categoría:</strong> {{ evento.categoria?.nombre }}</p>
            <p><strong>Aforo máximo:</strong> {{ evento.aforo_maximo }}</p>
            <p><strong>Plazas ocupadas:</strong> {{ evento.aforo_ocupado }}</p>
            <p><strong>Plazas disponibles:</strong> {{ evento.plazas_disponibles }}</p>
            <p><strong>Estado:</strong> {{ evento.estado }}</p>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="mb-0">Inscripciones</h3>
        </div>

        <div v-if="auth.userRole === 'ADMIN'" class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Nueva inscripción</h5>

            <form @submit.prevent="crearInscripcion">
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label">Código</label>
                  <input
                    v-model="nuevaInscripcion.codigo_inscripcion"
                    class="form-control"
                    placeholder="INS002"
                    required
                  />
                </div>

                <div class="col-md-4">
                  <label class="form-label">Fecha inscripción</label>
                  <input
                    v-model="nuevaInscripcion.fecha_inscripcion"
                    type="date"
                    class="form-control"
                    required
                  />
                </div>

                <div class="col-md-4">
                  <label class="form-label">Estado</label>
                  <select v-model="nuevaInscripcion.estado" class="form-select" required>
                    <option value="CONFIRMADA">Confirmada</option>
                    <option value="LISTA_ESPERA">Lista de espera</option>
                    <option value="CANCELADA">Cancelada</option>
                  </select>
                </div>

                <div class="col-md-8">
                  <label class="form-label">Usuario</label>
                  <select v-model.number="nuevaInscripcion.usuario" class="form-select" required>
                    <option disabled value="">Selecciona un usuario</option>
                    <option v-for="u in usuarios" :key="u.id" :value="u.id">
                      {{ u.nombre }} {{ u.apellidos }} - {{ u.dni }}
                    </option>
                  </select>
                </div>
              </div>

              <p v-if="errorInscripcion" class="text-danger mt-3">
                {{ errorInscripcion }}
              </p>

              <button class="btn btn-success btn-sm mt-3" :disabled="creandoInscripcion">
                {{ creandoInscripcion ? "Creando..." : "Crear inscripción" }}
              </button>
            </form>
          </div>
        </div>

        <div v-if="loadingInscripciones" class="text-center py-4">
          Cargando inscripciones...
        </div>

        <InscripcionesTable
          v-else
          :inscripciones="inscripciones"
          :is-admin="auth.userRole === 'ADMIN'"
          @cancelar="cancelarInscripcion"
          @cambiar-asistencia="cambiarAsistencia"
        />
      </div>
    </div>
  </div>

  <div v-else class="container mt-4">
    Cargando evento...
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useEventosStore } from '@/stores/eventos.js';
import { useInscripcionesStore } from '@/stores/inscripciones.js';
import { useAuthStore } from '@/stores/auth.js';
import InscripcionesTable from '@/components/InscripcionesTable.vue';

import {
  apiDeleteEvento,
  apiGetUsuarios,
  apiCreateInscripcionEvento,
  apiCancelarInscripcion,
  apiToggleAsistenciaInscripcion
} from '@/services/api.js';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const eventosStore = useEventosStore();
const inscripcionesStore = useInscripcionesStore();

const { selected: evento } = storeToRefs(eventosStore);
const { items: inscripciones, loading: loadingInscripciones } = storeToRefs(inscripcionesStore);

const usuarios = ref([]);
const errorInscripcion = ref("");
const creandoInscripcion = ref(false);

const nuevaInscripcion = ref({
  codigo_inscripcion: "",
  fecha_inscripcion: "",
  estado: "CONFIRMADA",
  usuario: "",
  confirmacion_asistencia: false,
});

onMounted(async () => {
  const id = Number(route.params.id);

  await eventosStore.fetchOne(id);
  await inscripcionesStore.fetchByEvento(id);

  usuarios.value = await apiGetUsuarios();
});

async function eliminarEvento() {
  const confirmado = confirm(`¿Seguro que quieres eliminar el evento "${evento.value.titulo}"?`);

  if (!confirmado) return;

  try {
    await apiDeleteEvento(evento.value.id);
    router.push('/eventos');
  } catch (e) {
    console.error(e);
    alert('No se pudo eliminar el evento.');
  }
}

async function crearInscripcion() {
  creandoInscripcion.value = true;
  errorInscripcion.value = "";

  try {
    await apiCreateInscripcionEvento(evento.value.id, nuevaInscripcion.value);

    await inscripcionesStore.fetchByEvento(evento.value.id);
    await eventosStore.fetchOne(evento.value.id);

    nuevaInscripcion.value = {
      codigo_inscripcion: "",
      fecha_inscripcion: "",
      estado: "CONFIRMADA",
      usuario: "",
      confirmacion_asistencia: false,
    };
  } catch (e) {
    console.error(e);
    errorInscripcion.value = "No se pudo crear la inscripción. Revisa duplicados, aforo o datos.";
  } finally {
    creandoInscripcion.value = false;
  }
}

async function cancelarInscripcion(inscripcion) {
  const confirmado = confirm(
    `¿Seguro que quieres cancelar la inscripción "${inscripcion.codigo_inscripcion}"?`
  );

  if (!confirmado) return;

  try {
    await apiCancelarInscripcion(inscripcion.id);

    await inscripcionesStore.fetchByEvento(evento.value.id);
    await eventosStore.fetchOne(evento.value.id);
  } catch (e) {
    console.error(e);
    alert("No se pudo cancelar la inscripción.");
  }
}

async function cambiarAsistencia(inscripcion) {
  try {
    await apiToggleAsistenciaInscripcion(inscripcion.id);
    await inscripcionesStore.fetchByEvento(evento.value.id);
  } catch (e) {
    console.error(e);
    alert("No se pudo actualizar la asistencia.");
  }
}
</script>
