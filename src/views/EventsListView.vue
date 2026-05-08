<template>
  <div class="container mt-4">

    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1 class="mb-0">Eventos</h1>
      <button class="btn btn-primary" @click="abrirCrear">
        <i class="bi bi-plus-lg me-1"></i> Nuevo evento
      </button>
    </div>

    <!-- Filtros -->
    <div class="card mb-3">
      <div class="card-body">
        <div class="row g-2">
          <div class="col-md-3">
            <label class="form-label">Fecha desde</label>
            <input type="date" v-model="filtros.desde" class="form-control" />
          </div>
          <div class="col-md-3">
            <label class="form-label">Fecha hasta</label>
            <input type="date" v-model="filtros.hasta" class="form-control" />
          </div>
          <div class="col-md-3">
            <label class="form-label">Categoría</label>
            <select v-model="filtros.categoria" class="form-select">
              <option value="">Todas</option>
              <option v-for="cat in categorias" :key="cat.codigo" :value="cat.codigo">
                {{ cat.nombre }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Estado</label>
            <select v-model="filtros.estado" class="form-select">
              <option value="">Todos</option>
              <option value="ABIERTO">Abierto</option>
              <option value="CERRADO">Cerrado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <table class="table table-hover align-middle">
      <thead class="table-light">
        <tr>
          <th>Código</th>
          <th>Título</th>
          <th>Fecha</th>
          <th>Categoría</th>
          <th>Estado</th>
          <th class="text-end">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ev in eventosFiltrados" :key="ev.id">
          <td>{{ ev.codigo }}</td>
          <td>{{ ev.titulo }}</td>
          <td>{{ ev.fecha }}</td>
          <td>{{ nombreCategoria(ev.categoria_codigo) }}</td>
          <td>
            <span class="badge"
                  :class="{
                    'bg-success': ev.estado === 'ABIERTO',
                    'bg-secondary': ev.estado === 'CERRADO',
                    'bg-danger': ev.estado === 'CANCELADO'
                  }">
              {{ ev.estado }}
            </span>
          </td>
          <td class="text-end">
            <router-link :to="`/eventos/${ev.id}`" class="btn btn-outline-primary btn-sm me-1">
              Detalle
            </router-link>
            <button class="btn btn-outline-secondary btn-sm me-1" @click="abrirEditar(ev)">
              Editar
            </button>
            <button class="btn btn-outline-danger btn-sm" @click="eliminar(ev)">
              Eliminar
            </button>
          </td>
        </tr>
        <tr v-if="eventosFiltrados.length === 0">
          <td colspan="6" class="text-center text-muted py-4">
            No hay eventos que coincidan con los filtros.
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal formulario -->
    <div class="modal fade" tabindex="-1" ref="modalRef">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form @submit.prevent="guardar">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ modo === 'crear' ? 'Nuevo evento' : 'Editar evento' }}
              </h5>
              <button type="button" class="btn-close" @click="cerrarModal"></button>
            </div>
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Código</label>
                  <input v-model="form.codigo" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Título</label>
                  <input v-model="form.titulo" class="form-control" required />
                </div>
                <div class="col-12">
                  <label class="form-label">Descripción</label>
                  <textarea v-model="form.descripcion" class="form-control" rows="2"></textarea>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Fecha</label>
                  <input type="date" v-model="form.fecha" class="form-control" required />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Hora inicio</label>
                  <input type="time" v-model="form.hora_inicio" class="form-control" required />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Hora fin</label>
                  <input type="time" v-model="form.hora_fin" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Ubicación</label>
                  <input v-model="form.ubicacion" class="form-control" />
                </div>
                <div class="col-md-3">
                  <label class="form-label">Aforo máximo</label>
                  <input type="number" min="1" v-model.number="form.aforo_maximo" class="form-control" required />
                </div>
                <div class="col-md-3">
                  <label class="form-label">Categoría</label>
                  <select v-model="form.categoria_codigo" class="form-select" required>
                    <option v-for="cat in categorias" :key="cat.codigo" :value="cat.codigo">
                      {{ cat.nombre }}
                    </option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Estado</label>
                  <select v-model="form.estado" class="form-select">
                    <option value="ABIERTO">Abierto</option>
                    <option value="CERRADO">Cerrado</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </div>
              </div>
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
import { getEvents, getCategories, createEvent, updateEvent, deleteEvent } from '@/mockData.js';
import * as bootstrap from 'bootstrap';

const categorias = getCategories();
const eventos = ref([...getEvents()]);

const filtros = ref({
  desde: '',
  hasta: '',
  categoria: '',
  estado: '',
});

const eventosFiltrados = computed(() => {
  return eventos.value.filter(ev => {
    if (filtros.value.desde && ev.fecha < filtros.value.desde) return false;
    if (filtros.value.hasta && ev.fecha > filtros.value.hasta) return false;
    if (filtros.value.categoria && ev.categoria_codigo !== filtros.value.categoria) return false;
    if (filtros.value.estado && ev.estado !== filtros.value.estado) return false;
    return true;
  });
});

function nombreCategoria(cod) {
  const cat = categorias.find(c => c.codigo === cod);
  return cat ? cat.nombre : '-';
}

// Modal
const modalRef = ref(null);
let modalInstance = null;
const modo = ref('crear');
const form = ref({});

onMounted(() => {
  modalInstance = new bootstrap.Modal(modalRef.value);
});

function abrirCrear() {
  modo.value = 'crear';
  form.value = {
    codigo: '',
    titulo: '',
    descripcion: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    ubicacion: '',
    aforo_maximo: 10,
    categoria_codigo: categorias[0]?.codigo ?? '',
    estado: 'ABIERTO',
  };
  modalInstance.show();
}

function abrirEditar(ev) {
  modo.value = 'editar';
  form.value = { ...ev };
  modalInstance.show();
}

function cerrarModal() {
  modalInstance.hide();
}

function guardar() {
  if (modo.value === 'crear') {
    createEvent(form.value);
  } else {
    updateEvent(form.value.id, form.value);
  }
  eventos.value = [...getEvents()];
  cerrarModal();
}

function eliminar(ev) {
  if (confirm(`¿Seguro que quieres eliminar el evento "${ev.titulo}"?`)) {
    deleteEvent(ev.id);
    eventos.value = [...getEvents()];
  }
}
</script>
