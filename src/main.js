import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/assets/tailwind.css";
import "@/assets/weather-icons.min.css";
import "@/assets/main.css";

const app = createApp(App);

app.use(router);

app.mount("#app");
