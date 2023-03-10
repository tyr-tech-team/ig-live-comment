import { createApp } from "vue";
import { createPinia } from "pinia";
import * as $fbFn from "@/plugin/fbSDK";
import antd from "@/plugin/antd";
import App from "./App.vue";

const app = createApp(App);
app.provide("$fb", $fbFn);

app.use(createPinia());
app.use(antd);
console.log(app);
app.mount("#app");
