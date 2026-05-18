<template>
  <div class="container mt-4 evento-page">
    <h1>Crear evento</h1>

    <div v-if="loadingCategorias" class="text-center py-4">
      Cargando categorías...
    </div>

    <EventForm
      v-else
      :categorias="categorias"
      :loading="loading"
      :error="error"
      texto-boton="Crear evento"
      @guardar="guardarEvento"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import EventForm from "@/components/EventForm.vue";
import { apiCreateEvento, apiGetCategorias } from "@/services/api.js";

const router = useRouter();

const categorias = ref([]);
const loadingCategorias = ref(true);
const loading = ref(false);
const error = ref("");

onMounted(async () => {
  try {
    categorias.value = await apiGetCategorias();
  } catch (e) {
    console.error(e);
    error.value = "No se pudieron cargar las categorías.";
  } finally {
    loadingCategorias.value = false;
  }
});

async function guardarEvento(datosEvento) {
  loading.value = true;
  error.value = "";

  try {
    const nuevoEvento = await apiCreateEvento(datosEvento);
    router.push(`/eventos/${nuevoEvento.id}`);
  } catch (e) {
    console.error(e);
    error.value = "No se pudo crear el evento. Revisa código, fechas, horas o categoría.";
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
