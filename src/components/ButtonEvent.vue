<template>
	<div class="incoming-msg msg-div row text-center">
		<div class="col-12">
			<div
				v-for="(button, index) in buttons.buttons"
				:key="button.title + index"
				class="buttons-wrapper"
			>
				<div class="button-event">
					<a
						v-if="button.content_type === 'link'"
						class="button-link"
						:href="button.url"
						target="”_blank”"
					>{{ button.title }}</a>
					<a
						v-if="button.content_type === 'email'"
						class="button-link"
						:href="'mailto:' + button.email"
					>{{ button.title }}</a>
					<a
						v-if="button.content_type === 'phone'"
						class="button-link"
						:href="'tel:' + button.phone"
					>{{ button.title }}</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'ButtonEvent',
	props: {
		buttons: {
			type: Object,
			required: true
		}
	},
	methods: {
		sendButtonEvent(title, payload) {
			this.$emit('sendButtonEvent', { text: title, payload: payload });
		}
	}
};
</script>

<style lang="scss" scoped>
#app .incoming-msg {
	padding-bottom: 15px;

	.buttons-wrapper {
		display: inline-block;
		width: auto;
		border: solid 1px #ccc;
		border-radius: 1.3em;
		transition: all 0.25s ease;
		background: rgba(210, 210, 210, 0.2);

		.button-link {
			display: block;
			width: 100%;
			min-height: 35px;
			color: #fff;
			border-radius: 10px;
			padding: 8px;
			padding-left: 15px;
			padding-right: 15px;
			text-decoration: none;
			font-size: 12px;
		}
	}

	.buttons-wrapper:hover {
		background: transparent;
	}
}
</style>
