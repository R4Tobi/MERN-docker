import { createApp } from "vue";

import App from "./App.vue";

const app = createApp(App);
const router = require("./router/index.js")

app.use(router);

app.mount("#app");
