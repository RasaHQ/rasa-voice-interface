<template>
	<div class="image-wrapper">
		<img class="image-main" :src="srcUrl">
	</div>
</template>

<script>
export default {
	name: 'ImageCustom',
	props: {
		srcUrl: {
			type: String,
			required: true
		}
	}
};
</script>

<style lang="scss" scoped>
.image-wrapper {
	width: 100%;
	margin-top: 15px;
	margin-bottom: 15px;

	.image-main {
		max-width: 100%;
	}
}
</style>
