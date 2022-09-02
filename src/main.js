import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";

import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import RadioButton from "primevue/radiobutton";
import Slider from "primevue/slider";
import InputNumber from "primevue/inputnumber";
import Dialog from "primevue/dialog";

import "primeflex/primeflex.css";

import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css

const app = createApp(App);

app.use(PrimeVue);
app.component("Dropdown", Dropdown);
app.component("Button", Button);
app.component("RadioButton", RadioButton);
app.component("Slider", Slider);
app.component("InputNumber", InputNumber);
app.component("Dialog", Dialog);

app.mount("#app");
