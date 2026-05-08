<template>
  <div class="card h-100">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ event.titulo }}</h5>
      <p class="card-text small text-muted">{{ event.descripcion }}</p>

      <ul class="list-unstyled small">
        <li><i class="bi bi-calendar"></i> {{ event.fecha }}</li>
        <li><i class="bi bi-geo-alt"></i> {{ event.ubicacion }}</li>
        <li><i class="bi bi-people"></i> {{ event.aforo_ocupado }} / {{ event.aforo_maximo }}</li>
      </ul>

      <div class="mt-auto d-flex justify-content-between align-items-center">
        <span :class="plazasClass">{{ plazasTexto }}</span>

        <router-link :to="`/eventos/${event.id}`" class="btn btn-primary btn-sm">
          Ver detalle
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  event: Object
});

const plazasDisponibles = computed(() =>
  props.event.aforo_maximo - props.event.aforo_ocupado
);

const plazasTexto = computed(() => {
  if (plazasDisponibles.value <= 0) return "Sin plazas (lista de espera)";
  if (plazasDisponibles.value <= 5) return `Últimas ${plazasDisponibles.value} plazas`;
  return `${plazasDisponibles.value} plazas disponibles`;
});

const plazasClass = computed(() => {
  if (plazasDisponibles.value <= 0) return "text-danger";
  if (plazasDisponibles.value <= 5) return "text-warning";
  return "text-success";
});
</script>
