import { mapGetters } from 'vuex';
import store from '../store';

const MessageHandlerMixin = {
	name: 'MessageHandlerMixin',
	computed: { ...mapGetters(['userId', 'currentInput']) },
	methods: {
		sendMessageToBot: function(text) {
			/* Send message to the bot if it isn't empty */
			if (text && text.length >= 1 && text.replace(/\s/g, '').length !== 0) {
			/* Append to array of messages (so that it gets rendered to the screen) */
				console.log('type:', typeof (text));
				// console.log('text:', text);
				this.$store.commit('emptyIncomingMessage');
				this.$store.commit('addOutgoingMessage', { text: this.currentInput });
				this.$socket.emit('user_uttered', { message: text, room: this.userId });
			} else if (typeof (text) === 'object') {
				console.log('type:', typeof (text));
				this.$store.commit('emptyIncomingMessage');
				// this.$store.commit('addOutgoingMessage', { text: this.currentInput });
				this.$socket.emit('user_uttered', { message: text, room: this.userId });
			}
		},
		sendQrPayloadToBot: function(qrObj) {
			if (qrObj.text && qrObj.payload) {
				this.$store.commit('addOutgoingMessage', qrObj);
				this.$socket.emit('user_uttered', { message: qrObj.payload, room: this.userId });
				// this.$store.commit('hideComponentsAfterSend');
			}
		},
		sendFormToBot: function(formObj) {
			if (formObj.text) {
				const messagePayload = {
					method: 'message',
					text: formObj.text,
					channel: 'Web',
					user: this.userId,
					emailFrom: formObj.emailFrom ? formObj.emailFrom : undefined,
					emailContent: formObj.emailContent ? formObj.emailContent : undefined,
					action_type: formObj.action_type
				};

				this.$socket.sendObj(messagePayload);
				this.$store.commit('hideComponentsAfterSend');
			}
		},
		// scrollChatToBottom: function() {
		// 	$('.chat-container').stop();
		// 	const scrollPosition = Math.round($('.chat-container')[0].scrollHeight);
		// 	$('.chat-container').animate({ scrollTop: scrollPosition }, 1000);
		// }
	}
};

export default MessageHandlerMixin;
