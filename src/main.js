import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import $ from 'jquery';
import fontawesome from '@fortawesome/fontawesome';
import solid from '@fortawesome/fontawesome-free-solid';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import store from './store';
import router from './router';
import App from './App.vue';
import MessageHandlerMixin from './mixins/MessageHandlerMixin';

Vue.mixin(MessageHandlerMixin);
global.$ = $;

/* FontAwesome */
fontawesome.library.add(solid);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(
	new VueSocketIO({
		debug: true,
		connection: 'http://localhost:5005',
		vuex: {
			store,
			actionPrefix: 'SOCKET_',
			mutationPrefix: 'SOCKET_'
		}
		// transports: ['websocket', 'polling', 'flashsocket']
	})
);

/* App Mount */
Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
