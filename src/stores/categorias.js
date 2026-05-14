import { defineStore } from "pinia";
import { apiGetCategorias } from "@/services/api.js";

export const useCategoriasStore = defineStore("categorias", {
  state: () => ({
    items: [],
    loading: false,
  }),

  actions: {
    async fetchAll() {
      this.loading = true;
      this.items = await apiGetCategorias();
      this.loading = false;
    },
  },
});
