<template>
  <div class="container mt-4" v-if="evento">

    <h1>{{ evento.titulo }}</h1>
    <p class="text-muted">{{ evento.descripcion }}</p>

    <div class="row mt-4">
      <div class="col-md-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5>Información</h5>
            <p><strong>Fecha:</strong> {{ evento.fecha }}</p>
            <p><strong>Ubicación:</strong> {{ evento.ubicacion }}</p>
            <p><strong>Aforo máximo:</strong> {{ evento.aforo_maximo }}</p>
            <p><strong>Plazas disponibles:</strong> {{ plazasDisponibles }}</p>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3>Inscripciones</h3>
          <button class="btn btn-primary" @click="abrirInscribir">
            Añadir inscripción
          </button>
        </div>

        <table class="table table-hover">
          <thead>
            <tr>
              <th>Código</th>
              <th>Usuario</th>
              <th>Estado</th>
              <th>Asistencia</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ins in inscripcionesEvento" :key="ins.codigo">
              <td>{{ ins.codigo }}</td>
              <td>{{ nombreUsuario(ins.usuario_dni) }}</td>
              <td>
                <span class="badge"
                  :class="{
                    'bg-success': ins.estado === 'CONFIRMADA',
                    'bg-warning': ins.estado === 'ESPERA',
                    'bg-danger': ins.estado === 'CANCELADA'
                  }">
                  {{ ins.estado }}
                </span>
              </td>
              <td>
                <input type="checkbox"
                       :checked="ins.asistencia_confirmada"
                       @change="toggleAsistencia(ins.codigo)" />
              </td>
              <td>
                <button class="btn btn-outline-danger btn-sm"
                        @click="cancelar(ins.codigo)">
                  Cancelar
                </button>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>

    <!-- Modal inscripción -->
    <div class="modal fade" tabindex="-1" ref="modalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="guardarInscripcion">
            <div class="modal-header">
              <h5 class="modal-title">Nueva inscripción</h5>
              <button type="button" class="btn-close" @click="cerrarModal"></button>
            </div>
            <div class="modal-body">

              <label class="form-label">Usuario</label>
              <select v-model="dniSeleccionado" class="form-select" required>
                <option value="">Selecciona un usuario</option>
                <option v-for="u in usuarios" :key="u.dni" :value="u.dni">
                  {{ u.nombre }} {{ u.apellidos }}
                </option>
              </select>

              <p class="mt-3 text-muted small">
                Si el aforo está completo, la inscripción pasará automáticamente a lista de espera.
              </p>

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" @click="cerrarModal">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  getEvents,
  getUsers,
  getInscriptions,
  createInscription,
  cancelInscription,
  toggleAttendance
} from '@/mockData.js';
import * as bootstrap from 'bootstrap';

const route = useRoute();
const evento = getEvents().find(e => e.id === Number(route.params.id));
const usuarios = getUsers();
const inscripciones = ref([...getInscriptions()]);

const inscripcionesEvento = ref(
  inscripciones.value.filter(i => i.evento_id === evento.id)
);

function nombreUsuario(dni) {
  const u = usuarios.find(u => u.dni === dni);
  return u ? `${u.nombre} ${u.apellidos}` : 'Desconocido';
}

const plazasDisponibles = computed(() => {
  const confirmadas = inscripcionesEvento.value.filter(i => i.estado === 'CONFIRMADA').length;
  return evento.aforo_maximo - confirmadas;
});

// Modal
const modalRef = ref(null);
let modalInstance = null;
const dniSeleccionado = ref('');

onMounted(() => {
  modalInstance = new bootstrap.Modal(modalRef.value);
});

function abrirInscribir() {
  dniSeleccionado.value = '';
  modalInstance.show();
}

function cerrarModal() {
  modalInstance.hide();
}

function guardarInscripcion() {
  try {
    createInscription({
      usuario_dni: dniSeleccionado.value,
      evento_id: evento.id
    });
    inscripciones.value = [...getInscriptions()];
    inscripcionesEvento.value = inscripciones.value.filter(i => i.evento_id === evento.id);
    cerrarModal();
  } catch (e) {
    alert(e.message);
  }
}

function cancelar(codigo) {
  cancelInscription(codigo);
  inscripciones.value = [...getInscriptions()];
  inscripcionesEvento.value = inscripciones.value.filter(i => i.evento_id === evento.id);
}

function toggleAsistencia(codigo) {
  toggleAttendance(codigo);
  inscripciones.value = [...getInscriptions()];
  inscripcionesEvento.value = inscripciones.value.filter(i => i.evento_id === evento.id);
}
</script>
