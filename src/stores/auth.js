import { defineStore } from "pinia";
import { login as apiLogin, loadTokensFromStorage, clearTokens, apiGetMe } from "@/services/api.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    userRole: null, // "ADMIN" o "USER"
    username: null,
  }),

  actions: {
    initFromStorage() {
      loadTokensFromStorage();
      const savedUser = localStorage.getItem("username");
      const savedRole = localStorage.getItem("userRole");

      if (savedUser && savedRole) {
        this.isAuthenticated = true;
        this.username = savedUser;
        this.userRole = savedRole;
      }
    },

    async login(username, password) {
      // 1. Pedimos token a Django
      await apiLogin(username, password);

      // 2. Pedimos información del usuario autenticado
      const me = await apiGetMe();

      // 3. Guardamos datos en el store
      this.isAuthenticated = true;
      this.username = me.username;
      this.userRole = me.is_superuser ? "ADMIN" : "USER";

      // 4. Persistimos en localStorage
      localStorage.setItem("username", this.username);
      localStorage.setItem("userRole", this.userRole);
    },

    logout() {
      this.isAuthenticated = false;
      this.username = null;
      this.userRole = null;

      localStorage.removeItem("username");
      localStorage.removeItem("userRole");

      clearTokens();
    },
  },
});
