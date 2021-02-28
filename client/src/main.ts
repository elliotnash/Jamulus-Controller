import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';

import { library } from '@fortawesome/fontawesome-svg-core';

import { faEllipsisH, faEdit, faDownload, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


library.add(faEllipsisH);
library.add(faEdit);
library.add(faDownload);
library.add(faTrashAlt);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

router.mode = "hash";

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');
