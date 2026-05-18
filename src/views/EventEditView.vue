<template>
  <div class="container mt-4 evento-page">
    <h1>Editar evento</h1>

    <div v-if="loadingDatos" class="text-center py-4">
      Cargando evento...
    </div>

    <EventForm
      v-else
      :evento-inicial="evento"
      :categorias="categorias"
      :loading="loading"
      :error="error"
      texto-boton="Guardar cambios"
      @guardar="guardarEvento"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import EventForm from "@/components/EventForm.vue";
import {
  apiGetEvento,
  apiGetCategorias,
  apiUpdateEvento,
} from "@/services/api.js";

const route = useRoute();
const router = useRouter();

const evento = ref(null);
const categorias = ref([]);

const loadingDatos = ref(true);
const loading = ref(false);
const error = ref("");

onMounted(async () => {
  try {
    const id = route.params.id;

    evento.value = await apiGetEvento(id);
    categorias.value = await apiGetCategorias();
  } catch (e) {
    console.error(e);
    error.value = "No se pudo cargar el evento.";
  } finally {
    loadingDatos.value = false;
  }
});

async function guardarEvento(datosEvento) {
  loading.value = true;
  error.value = "";

  try {
    const eventoActualizado = await apiUpdateEvento(route.params.id, datosEvento);
    router.push(`/eventos/${eventoActualizado.id}`);
  } catch (e) {
    console.error(e);
    error.value = "No se pudo actualizar el evento. Revisa código, fechas, horas o categoría.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.evento-page {
  color: white;
}
</style>
