<template>
	<div class="header">
		<div class="container-fluid">
			<div class="row">
				<div class="col-4 text-left">
					<a href="https://rasa.com/" target="_blank">
						<img id="header-logo" src="@/assets/icon/logo.png">
					</a>
				</div>
				<div class="col-4 text-middle"></div>
				<div class="col-4 text-right header-content-wrapper">
					<div id="close-chatbot" class="close-btn-wrapper">
						<img class="close-icon" src="~@/assets/close-btn.svg" style="height: 20px;">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Header'
};
</script>

<style lang="scss" scoped>
#app .header {
	position: relative;
	line-height: 80px;
	z-index: 2;
	top: 0;
	height: $headerSize;
	width: 100%;

	.close-btn-wrapper {
		position: relative;
		cursor: pointer;
		width: 40px;
		text-align: center;
		float: right;

		.close-icon {
			position: relative;
		}
	}

	#header-logo {
		height: 23px;
		display: block;
	}

	.row > .col-4 {
		color: #ffffff;
		margin: auto;
	}
}
</style>
