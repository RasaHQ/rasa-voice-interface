<template>
	<div id="video-card">
		<video :src="srcUrl" controls></video>
	</div>
</template>

<script>
import $ from 'jquery';

export default {
	props: {
		srcUrl: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			vidWidth: 560,
			vidHeight: 315
		};
	},
	mounted() {
		const vidWidth = $('#video-card').innerWidth();
		const vidHeight = $('#video-card').innerWidth() * (315 / 560);
		$('#video-body').attr('width', vidWidth);
		$('#video-body').attr('height', vidHeight);
	}
};
</script>

<style scoped  lang="scss">
#video-card {
	padding: 0 !important;
	video {
	width: 90%;
	display: block;
	}
	@media only screen and (max-width: 600px) {
		margin-left: 0;
		width: 100%;
		align-self: center;
		video{
			margin-left: 0;
			width: 100%;
		}
	}
}

</style>
