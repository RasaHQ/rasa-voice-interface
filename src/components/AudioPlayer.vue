<template>
    <div id="response-audio-player">
        getCurrentIncomingMessage.link
    <audio v-if="getCurrentIncomingMessage.link" :src="getCurrentIncomingMessage.link" controls autoplay>
        Your browser does not support the audio element.
    </audio>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	data() {
		return {
		};
	},
	computed: {
		...mapGetters(['getCurrentIncomingMessage']),
	},
	mounted () {

	},
	methods: {
		playResponseAudio() {
		}
	},
};
</script>

<style lang="scss" scoped>

</style>
