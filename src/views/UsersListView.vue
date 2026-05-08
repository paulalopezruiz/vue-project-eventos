<template>
  <div class="container mt-4">

    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1>Usuarios</h1>
      <button class="btn btn-primary" @click="abrirCrear">Nuevo usuario</button>
    </div>

    <table class="table table-hover">
      <thead>
        <tr>
          <th>DNI</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Tipo</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in usuarios" :key="u.dni">
          <td>{{ u.dni }}</td>
          <td>{{ u.nombre }} {{ u.apellidos }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.tipo_usuario }}</td>
          <td class="text-end">
            <router-link :to="`/usuarios/${u.dni}`" class="btn btn-outline-primary btn-sm me-1">
              Detalle
            </router-link>
            <button class="btn btn-outline-secondary btn-sm me-1" @click="abrirEditar(u)">
              Editar
            </button>
            <button class="btn btn-outline-danger btn-sm" @click="eliminar(u.dni)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div class="modal fade" tabindex="-1" ref="modalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="guardar">
            <div class="modal-header">
              <h5 class="modal-title">{{ modo === 'crear' ? 'Nuevo usuario' : 'Editar usuario' }}</h5>
              <button type="button" class="btn-close" @click="cerrarModal"></button>
            </div>
            <div class="modal-body">

              <label class="form-label">DNI</label>
              <input v-model="form.dni" class="form-control" :disabled="modo === 'editar'" required />

              <label class="form-label mt-3">Nombre</label>
              <input v-model="form.nombre" class="form-control" required />

              <label class="form-label mt-3">Apellidos</label>
              <input v-model="form.apellidos" class="form-control" required />

              <label class="form-label mt-3">Email</label>
              <input v-model="form.email" class="form-control" required />

              <label class="form-label mt-3">Teléfono</label>
              <input v-model="form.telefono" class="form-control" required />

              <label class="form-label mt-3">Tipo</label>
              <select v-model="form.tipo_usuario" class="form-select">
                <option value="ALUMNO">Alumno</option>
                <option value="PROFESOR">Profesor</option>
              </select>

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" @click="cerrarModal">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUsers, createUser, updateUser, deleteUser } from '@/mockData.js';
import * as bootstrap from 'bootstrap';

const usuarios = ref([...getUsers()]);

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
    dni: '',
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    tipo_usuario: 'ALUMNO',
  };
  modalInstance.show();
}

function abrirEditar(u) {
  modo.value = 'editar';
  form.value = { ...u };
  modalInstance.show();
}

function cerrarModal() {
  modalInstance.hide();
}

function guardar() {
  try {
    if (modo.value === 'crear') {
      createUser(form.value);
    } else {
      updateUser(form.value.dni, form.value);
    }
    usuarios.value = [...getUsers()];
    cerrarModal();
  } catch (e) {
    alert(e.message);
  }
}

function eliminar(dni) {
  if (confirm('¿Eliminar usuario?')) {
    deleteUser(dni);
    usuarios.value = [...getUsers()];
  }
}
</script>
