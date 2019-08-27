<template>
	<div class="chat" :class="chatStart ? 'chat-start' : ''">
		<div class="container-fluid full-height">
			<WelcomePage v-if="!chatStart"/>
			<div
				v-else
				class="row main-chat-wrapper justify-content-center align-items-center full-height"
			>
				<div class="chat-container col-12" :class="chatStart ? 'active' : ''">
					<div class="content-wrapper msg-div">
							<IncomingMessage
								:waitForResponse="waitForResponse"
							/>
							<OutgoingMessage
								:message="outgoMessage.text"
							/></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
/* Components */
import IncomingMessage from './IncomingMessage.vue';
import OutgoingMessage from './OutgoingMessage.vue';
import WelcomePage from './WelcomePage.vue';

export default {
	name: 'Chat',
	components: {
		IncomingMessage,
		OutgoingMessage,
		WelcomePage
	},
	data() {
		return {
		};
	},
	computed: {
		...mapGetters([
			'userId',
			'currentInput',
			'inputVisible',
			'typing',
			'currentQuickReply',
			'currentActiveData',
			'chatStart',
			'waitForResponse',
			'outgoMessage'
		])
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#app .chat {
	position: relative;
	height: calc(100% - #{$footerSize});
	line-height: 1.2em !important;

	&.chat-start {
		height: calc(100% - #{$headerSize} - #{$footerSize});
		top: 0;
	}
	.msg-div {
		animation: slide-up-fade-in 1s ease;
	}

	.main-chat-wrapper {
		position: absolute;

		.chat-container {
			height: 100%;
			overflow: auto;
			border-radius: 2px;
			-ms-overflow-style: none;
			padding-bottom: 64px;

			.content-wrapper {
				padding-bottom: 32px;
				padding-top: 32px;

				.qr-wrapper {
					margin-top: 32px;
				}
			}
		}

		.chat-container.active {
			height: 100%;
			top: 0;
			left: 0;
			position: absolute;
		}

		.chat-container::-webkit-scrollbar {
			width: 0 !important;
		}
	}
}
</style>
