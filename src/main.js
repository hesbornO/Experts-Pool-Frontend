import Vue from "vue";

import App from "./App.vue";
import router from "./routes";
import "@/assets/styles/main.css";
import "@/assets/styles/tailwind.css";
import store from './store'
import VueFormulate from '@braid/vue-formulate'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import VueCountryCode from "vue-country-code-select";
import FormulateVSelectPlugin from '@cone2875/vue-formulate-select'

// !important
// Import the vue-select css
import 'vue-select/dist/vue-select.css';
Vue.use(VueCountryCode);

Vue.use(VueToast, {
  position: 'top'
})

Vue.use(VueFormulate, {
  plugins: [FormulateVSelectPlugin],
  classes: {
    outer: 'mb-4',
    input: 'border border-gray-400 rounded px-3 py-2 leading-none focus:border-green-500 outline-none border-box w-full mb-1',
    label: 'font-medium text-sm mb-4',
    help: 'text-xs mb-1 text-gray-600 mb-2',
    error: 'text-red-700 text-xs mb-1'
  }
})

// Vue.prototype.$http = api;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
