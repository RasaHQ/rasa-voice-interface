<template>
	<div id="app">
		<div class="connecting-overlay" :class="!activeConnection ? 'show' : ''">
			<svg
				width="100%"
				height="200px"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 100 100"
				preserveAspectRatio="xMidYMid"
				class="lds-ball"
				style="background: none; margin-top: 20vh; margin-button: 100px;"
			>
				<circle cx="50" cy="23.0182" r="5" fill="#7B01BC">
					<animate
						attributeName="cy"
						calcMode="spline"
						values="23;77;23"
						keyTimes="0;0.5;1"
						dur="1"
						keySplines="0.45 0 0.9 0.55;0 0.45 0.55 0.9"
						begin="0s"
						repeatCount="indefinite"
					/>
					<animate
						attributeName="fill"
						calcMode="spline"
						values="#FFFFFF;#7B01BC;#FFFFFF"
						keyTimes="0;0.5;1"
						dur="1"
						keySplines="0.45 0 0.9 0.55;0 0.45 0.55 0.9"
						begin="0s"
						repeatCount="indefinite"
					/>
				</circle>
			</svg>
			<p>Waiting for connection ...</p>
		</div>
		<!-- Main components (usually header -> chat -> footer) -->
		<Header v-if="chatStart"/>
		<Chat />
		<Footer v-if="inputVisible"/>
		<audio id="response-voice"
			:src="getCurrentIncomingMessage.link"
		/>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

/* Mixins */
import MessageHandlerMixin from './mixins/MessageHandlerMixin';
/* Components */
import Chat from './components/Chat';
import Footer from './components/VoiceFooter';
import Header from './components/Header';
/* Helpers */
import generateUserId from './helpers';

export default {
	name: 'App',
	components: {
		Chat,
		Footer,
		Header
	},
	mixins: [MessageHandlerMixin],
	data() {
		return {
			welcomeMessage: 'Hello, I\'m Sara. How can I help you?',
			displayNewMesssage: true,
			audio: undefined
		};
	},
	computed: {
		...mapGetters([
			'activeConnection',
			'inputVisible',
			'chatStart',
			'userId',
			'waitForResponse',
			'getCurrentIncomingMessage'
		]),
	},
	mounted() {
		const uid = generateUserId();
		this.$store.commit('addIncomingMessages', { text: this.welcomeMessage });
		/* Append a userId to the user */
		this.$store.commit('setUserId', uid);
		/* Init WebSocket Event Listeners */
		this.$socket.onclose = () => {
			console.log('Socket closed ...');
			this.$store.commit('setActiveConnection', false);
		};

		this.$socket.onerror = () => {
			this.$store.commit('setActiveConnection', false);
		};
	},
	methods: {
		removeOldIncomingMessage(data) {
			if (this.displayNewMesssage) {
				this.displayNewMesssage = false;
				// const audio = new Audio(this.getCurrentIncomingMessage.link);
				if (data.link) {
					const audio = document.getElementById('response-voice');
					console.log(audio);
					audio.src = data.link;
					const playPromise = audio.play();
					if (playPromise !== null) {
						playPromise.catch(() => { audio.play(); });
					}
					audio.addEventListener('ended', () => {
						this.$store.commit('removeOldIncomingMessage');
						this.displayNewMesssage = true;
						this.$store.commit('setRecordingAvalibility', false);
					});
				} else {
					setTimeout(() => {
						this.$store.commit('removeOldIncomingMessage');
						this.displayNewMesssage = true;
						this.$store.commit('setRecordingAvalibility', false);
					}, 5000);
				}
			} else {
				setTimeout(() => {
					this.removeOldIncomingMessage(data);
					this.$store.commit('setRecordingAvalibility', true);
				}, 1000);
			}
		}
	},
	sockets: {
		connect() {
			console.log('socket connected~~~~');
			this.$socket.emit('session_request', { session_id: this.userId });
			this.$store.commit('setActiveConnection', true);
			this.$store.commit('hideComponentsAfterSend');
			this.$store.commit('setInputVisible', true);
		},
		disconnect() {
			this.$store.commit('setActiveConnection', false);
		},
		session_confirm(remoteId) {
			console.log(`session_confirm:${this.$socket.id} session_id:${remoteId}`);

			// if (this.userId === remoteId) {
			// 	console.log('Checked user id :)');
			// 	this.$socket.emit('user_uttered', {
			// 		message: '/get_started',
			// 		session_id: this.local_id
			// 	});
			// }
		},
		bot_uttered(data) {
			console.log(data);
			if (data.user_utterance) { this.$store.commit('addOutgoingMessage', { text: data.user_utterance }); }
			this.$store.commit('addIncomingMessages', data);
			this.$store.commit('setResponseStatus', false);
			this.removeOldIncomingMessage(data);
		}
	}
};
</script>

<style lang="scss">
#app {
	@import '../node_modules/bootstrap/scss/bootstrap';
	@import '@/assets/fonts/SourceSansPro-Regular.ttf';
	font-family: 'Source Sans Pro', sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	width: 100%;
	height: 100%;
	background: rgb(0, 0, 0);
	background: -moz-linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(123, 1, 188, 1) 91%);
	background: -webkit-linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(123, 1, 188, 1) 91%);
	background: linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(123, 1, 188, 1) 91%);
	filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#000000",endColorstr="#7b01bc",GradientType=1);
	@media only screen and (max-width: 600px) {
		background: -moz-linear-gradient(13deg, rgba(0, 0, 0, 1) 0%, rgba(123, 1, 188, 1) 55%);
		background: -webkit-linear-gradient(13deg, rgba(0, 0, 0, 1) 0%, rgba(123, 1, 188, 1) 55%);
		background: linear-gradient(13deg, rgba(0, 0, 0, 1) 0%, rgba(123, 1, 188, 1) 55%);
		filter: progid:DXImageTransform.Microsoft.gradient(
			startColorstr="#000000",
			endColorstr="#7b01bc",
			GradientType=1);
	}
	.connecting-overlay {
		position: absolute;
		min-height: 100px;
		height: 100%;
		width: 100%;
		transition: all 0.5s ease-in-out;
		opacity: 0;
		&.show {
			z-index: 10000;
			background: rgba(0, 0, 0, 0.92);
			opacity: 1;
		}
		& > p {
			position: absolute;
			top: calc(50% + 80px);
			left: 50%;
			transform: translate(-50%, -50%);
			font-size: 12px;
			width: 100%;
			text-align: center;
			background: linear-gradient(to right, #fff 20%, $rasa-color 50%, #fff 100%);
			background-size: 200% auto;
			color: $rasa-color;
			background-clip: text;
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			animation: shine 3s linear infinite;
			@keyframes shine {
				to {
					background-position: 200% center;
				}
			}
		}
	}

	@keyframes slide-up-fade-in {
		0% {
			opacity: 0;
			transform: translate(0px, 40px);
		}
		100% {
			opacity: 1;
			transform: translate(0px, 0px);
		}
	}

	/* Fade-Medium */
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.9s;
	}

	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}

	.slide-fade-enter-active {
		transition: all .8s ease;
	}
	.slide-fade-leave-active {
		transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}
	.slide-fade-enter, .slide-fade-leave-to
		/* .slide-fade-leave-active for <2.1.8 */ {
		transform: translateX(10px);
		opacity: 0;
	}

	.full-height {
		height: 100%;
		width: 100%;
		overflow: hidden;
	}

	.fade-top {
		top: 0;
		width: 100%;
		height: 60px;
		position: fixed;
		z-index: 2;
		pointer-events: none;
		background: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0.8) 0%,
			rgba(0, 0, 0, 0.4) 20%,
			rgba(0, 0, 0, 0.01) 91.9%,
			transparent 100%
		);
	}

	.fade-bottom {
		bottom: 0;
		width: 100%;
		height: 60px;
		position: fixed;
		z-index: 2;
		pointer-events: none;
		background: linear-gradient(
			to top,
			rgba(0, 0, 0, 0.8) 0%,
			rgba(0, 0, 0, 0.4) 20%,
			rgba(0, 0, 0, 0.01) 91.9%,
			transparent 100%
		);
	}
}
</style>
