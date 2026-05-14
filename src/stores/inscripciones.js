import { defineStore } from "pinia";
import { apiGetInscripcionesEvento } from "@/services/api.js";

export const useInscripcionesStore = defineStore("inscripciones", {
  state: () => ({
    items: [],
    loading: false,
  }),

  actions: {
    async fetchByEvento(eventoId) {
      this.loading = true;
      this.items = await apiGetInscripcionesEvento(eventoId);
      this.loading = false;
    },
  },
});
