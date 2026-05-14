import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

import "@/assets/bootstrap.scss";
import "bootstrap";

import { useAuthStore } from "@/stores/auth.js";

const app = createApp(App);
app.use(createPinia());
app.use(router);

const auth = useAuthStore();
auth.initFromStorage();

app.mount("#app");
