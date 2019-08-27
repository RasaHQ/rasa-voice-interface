<template>
	<transition name="slide-fade" mode="out-in">
		<div :key="message" class="outgoing-msg row">
			<div class="col-8 offset-4 float-right">
				<div class="message-content float-right">
					<p style="float: right;">{{ message }}</p>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'OutgoingMessage',
	props: {
		message: {
			type: String,
			required: true
		}
	}
};
</script>

<style scoped lang="scss">
#app .outgoing-msg {
	.message-content {
		p {
			display: inline-block;
			width: 100%;
			color: #ffffff;
			font-size: 20px;
			word-break: break-word;
			padding: 8px 15px 8px 15px;
			margin: 0;
		}
		margin-right: 10%;
		max-width: 80%;
		@media only screen and (max-width: 600px) {
			margin-right: 0;
			max-width: 100%;
		}
	}
}
</style>
