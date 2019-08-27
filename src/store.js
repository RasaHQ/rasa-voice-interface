/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const initialActiveData = {
	componentName: '',
	values: []
};
const initialActiveDataImmutable = Object.freeze(initialActiveData);

export default new Vuex.Store({
	state: {
		userId: undefined,
		currentInput: '',
		inputVisible: false,
		typing: false,
		currentActiveData: initialActiveData,
		allMessages: [
			{
				text: 'Hello, Im Sara How can I help you?',
				method: 'in',
				iconStyle: 'none',
				format: 'message'
			}
		],
		currentQuickReply: {
			format: 'quick_replies',
			method: 'in',
			iconStyle: 'none',
			quickReplies: [
				{
					title: 'Start!',
					payload: 'start-bot'
				}
			]
		},
		incomeMessage: [],
		outgoMessage: { text: '' },
		currentEmailForm: undefined,
		activeConnection: false,
		chatStart: false,
		waitForResponse: false,
		disableRecording: false
	},
	getters: {
		userId: state => state.userId,
		allMessages: state => state.allMessages,
		currentQuickReply: state => state.currentQuickReply,
		inputVisible: state => state.inputVisible,
		chatStart: state => state.chatStart,
		typing: state => state.typing,
		currentInput: state => state.currentInput,
		currentActiveData: state => state.currentActiveData,
		activeConnection: state => state.activeConnection,
		outgoMessage: state => state.outgoMessage,
		waitForResponse: state => state.waitForResponse,
		getCurrentIncomingMessage: state => (state.incomeMessage[0] ? state.incomeMessage[0] : { text: '' })
	},
	mutations: {
		setUserId: (state, str) => {
			state.userId = str;
		},
		removeOldIncomingMessage: state => {
			if (state.incomeMessage.length > 1) {
				console.log(`REMOVED MESSAGE: ${state.incomeMessage[0].text}`);
				state.incomeMessage.shift();
			}
		},
		addOutgoingMessage: (state, data) => {
			// state.incomeMessage = [];
			// state.waitForResponse = true;
			state.outgoMessage = data;
		},
		addIncomingMessages(state, data) {
			state.incomeMessage.push(data);
		},
		setCurrentQuickReply: (state, obj) => {
			state.currentQuickReply = obj;
		},
		setTypingIndicator: (state, val) => {
			state.typing = val;
		},
		setInputVisible: (state, val) => {
			state.inputVisible = val;
		},
		setCurrentInput: (state, val) => {
			state.currentInput = val;
		},
		setResponseStatus: (state, val) => {
			state.waitForResponse = val;
		},
		hideComponentsAfterSend: state => {
			state.currentActiveData = JSON.parse(JSON.stringify(initialActiveDataImmutable));
			state.currentQuickReply = undefined;
			state.currentInput = '';
			state.inputVisible = false;
		},
		setActiveConnection: (state, val) => {
			state.activeConnection = val;
		},
		setChatStart: (state, val) => {
			state.chatStart = val;
		},
		setRecordingAvalibility: (state, val) => {
			state.disableRecording = val;
		},
		emptyIncomingMessage: state => {
			state.incomeMessage = [];
		}
	},
	actions: {}
});
