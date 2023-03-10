import { createApp } from "vue";
import { createPinia } from "pinia";
import * as $fbFn from "@/plugin/fbSDK";
import App from "./App.vue";

const app = createApp(App);

app.provide("$fb", $fbFn);

app.use(createPinia());
console.log(app);
app.mount("#app");
