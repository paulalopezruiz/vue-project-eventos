import { defineStore } from "pinia";
import { apiGetEventos, apiGetEvento } from "@/services/api.js";

export const useEventosStore = defineStore("eventos", {
  state: () => ({
    items: [],
    selected: null,
    loading: false,
  }),

  actions: {
    async fetchAll() {
      this.loading = true;
      this.items = await apiGetEventos();
      this.loading = false;
    },

    async fetchOne(id) {
      this.loading = true;
      this.selected = await apiGetEvento(id);
      this.loading = false;
    },
  },
});
