<template>
		<div v-if="quickReplies" class="quick-reply-stack">
			<div
				v-for="(reply, index) in quickReplies"
				:key="reply.title + index"
				class="quick-reply-single-wrapper"
			>
				<div
					class="quick-reply"
					:class="iconClassIdentifier"
					@click="sendQuickReply(reply.title, reply.payload )"
				>
					<p class="qr-title">{{ reply.title }}</p>
				</div>
			</div>
		</div>
</template>

<script>
/* Mixins */
import MessageHandlerMixin from '../mixins/MessageHandlerMixin';

export default {
	name: 'QuickReplies',
	mixins: [MessageHandlerMixin],
	props: {
		quickReplies: {
			type: Array,
			required: true
		}
	},
	computed: {
		iconClassIdentifier: function() {
			return this.iconStyle === 'none' || !this.iconStyle ? 'iconless' : '';
		}
	},
	methods: {
		sendQuickReply(title, payload) {
			this.$store.commit('setResponseStatus', true);
			this.sendQrPayloadToBot({ text: title, payload: payload });
		}
	}
};
</script>

<style lang="scss" scoped>
#app .quick-reply-stack {
	/*margin-left: 1rem;
	margin-right: 1rem;*/
	box-sizing: border-box;
	// animation: slide-up-fade-in 0.5s ease;
	transition: all 0.25s ease;
	width: 100%;
	background: transparent;

	.quick-reply-single-wrapper {
		background: transparent;
		display: block;
		width: 100%;
		max-width: 100%;
		cursor: pointer;
		transition: 0.25s all ease;
		border: solid rgba($color: #ffffff, $alpha: 0.2) 1px;
		margin-bottom: 15px;
		-webkit-box-shadow: 0px 1px 10px 2px rgba(0, 0, 0, 0.08);
		-webkit-box-shadow: 0px 1px 10px 2px rgba(0, 0, 0, 0.08);
		box-shadow: 0px 1px 10px 1px rgba(0, 0, 0, 0.08);

		&:hover {
			background-color: rgba(255,255,255, 0.2);
			border: none;
		}

		.quick-reply {
			padding: 16px;
			font-size: 16px;
			line-height: 1.5em;

			.qr-title {
				font-weight: 500;
				color: white;
				margin: 0 0 0 0;
				transition: all 0.25s ease;
			}
		}

		.quick-reply:focus {
			outline: none;
		}
	}
}
</style>
