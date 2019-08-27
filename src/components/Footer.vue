<template>
	<!-- Footer: Input field + button -->
	<transition name="fade" mode="out-in">
		<footer v-show="inputVisible" :class="inputVisible ? 'footer-send active' : 'footer-send'">
			<form class="container-fluid" style="height: 100%" @submit.prevent="submitMessage(currentInput)">
				<div class="row" style="height: 100%">
					<div class="col-10" style="align-self: center">
						<input
							id="messenger_input"
							ref="text_input"
							v-model="setInput"
							:class="{ input_disabled: !inputVisible }"
							type="text"
							placeholder="Type something"
							autofocus
							autocomplete="off"
							:disabled="inputVisible ? false : true"
						>
					</div>
					<div class="col-2" style="align-self: center">
						<button
							id="send-message-button"
							:class="{ input_disabled: !inputVisible }"
							class="float-right"
							:disabled="inputVisible ? false : true"
						>
							<font-awesome-icon icon="paper-plane"/>
						</button>
					</div>
				</div>
			</form>
		</footer>
	</transition>
</template>

<script>
/* Helpers */
import { mapGetters, mapState } from 'vuex';
/* Mixins */
import { setTimeout } from 'timers';
import MessageHandlerMixin from '../mixins/MessageHandlerMixin';

export default {
	name: 'Footer',
	mixins: [MessageHandlerMixin],
	computed: {
		...mapGetters(['inputVisible', 'currentInput']),
		...mapState(['currentInput']),
		setInput: {
			set(val) {
				this.$store.commit('setCurrentInput', val);
			},
			get() {
				return this.currentInput;
			}
		}
	},
	mounted() {
		console.log('FOCUSING');
		this.$refs.text_input.focus();
	},
	methods: {
		submitMessage: function(text) {
			this.$store.commit('setResponseStatus', true);
			this.sendMessageToBot(text);
			this.$store.commit('setCurrentInput', '');
		}
	}
};
</script>

<style lang="scss" scoped>
#app .footer-send {
	display: none;
	background: transparent;
	position: relative;
	bottom: 32px;
	width: 100%;
	height: 64px;
	padding-bottom: 0;
	/* border-top: 3px solid #eee; */
	z-index: 3;

	&.active {
		display: block;
	}

	.container-fluid {
		height: 100%;
		background: #f3f7fb;
		width: calc(100% - 30px);
		border-radius: 32px;
	}

	#send-message-button {
		height: 35px;
		width: 35px;
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
		border-radius: 50%;
		background: transparent;
		background-position: center center;
		background-repeat: no-repeat;
		background-size: 35px 35px;
		-webkit-transition: all 1s ease-in-out;
		-moz-transition: all 1s ease-in-out;
		-ms-transition: all 1s ease-in-out;
		-o-transition: all 1s ease-in-out;
		transition: all 1s ease-in-out;
		svg {
			color: #525ca3;
		}
	}
	#messenger_input {
		outline: none;
		border: none;
		width: 100%;
		background: transparent;
		color: #525ca3;
		height: 35px;
		padding-left: 15px;
		padding-right: 15px;
		-webkit-transition: all 1s ease-in-out;
		-moz-transition: all 1s ease-in-out;
		-ms-transition: all 1s ease-in-out;
		-o-transition: all 1s ease-in-out;
		transition: all 1s ease-in-out;
	}
}
</style>
