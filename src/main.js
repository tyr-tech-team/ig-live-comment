import { createApp } from "vue";
import { createPinia } from "pinia";
import * as $fbFn from "@/plugin/fbSDK";
import * as $storage from "@/plugin/storage";
import antd from "@/plugin/antd";
import moment from "moment";
import App from "./App.vue";

const app = createApp(App);
app.config.globalProperties.$fb = $fbFn;
app.config.globalProperties.$storage = $storage;
app.config.globalProperties.$moment= moment;
app.use(createPinia());
app.use(antd);
app.mount("#app");
