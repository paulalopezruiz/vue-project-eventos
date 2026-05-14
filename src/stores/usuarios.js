import { defineStore } from "pinia";
import { apiGetUsuarios } from "@/services/api.js";

export const useUsuariosStore = defineStore("usuarios", {
  state: () => ({
    items: [],
    loading: false,
  }),

  actions: {
    async fetchAll() {
      this.loading = true;
      this.items = await apiGetUsuarios();
      this.loading = false;
    },
  },
});
