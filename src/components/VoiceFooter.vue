<template>
	<!-- Footer: Input field + button -->
	<footer>
		<audio class="sound-clips"></audio>
		<canvas id="sound-visualizer" width="100%" height="300px">
		</canvas>
		<transition name="fade" mode="out-in">
			<div v-if="chatStart && !isRecording">
				<button class="start-button btn" :disabled="disableRecording" @click="startRecord()">
					<font-awesome-icon icon="microphone" class="micro-icon"/>
				</button>
			</div>
		</transition>
		<transition name="fade" mode="out-in">
			<div v-if="!chatStart">
				<button class="start-button btn" @click="startChat()">START</button>
			</div>
		</transition>
		<transition name="fade" mode="out-in">
			<div v-if="chatStart && isRecording">
				<button class="start-button btn" @click="stopRecording()">PAUSE</button>
			</div>
		</transition>
	</footer>
</template>

<script>
/* eslint-disable no-unused-vars */
/* Helpers */
import { mapGetters, mapState } from 'vuex';
/* Mixins */
import MessageHandlerMixin from '../mixins/MessageHandlerMixin';

import '@/assets/lib/vad';

export default {
	name: 'Footer',
	mixins: [MessageHandlerMixin],
	data() {
		return {
			audioContext: undefined,
			mediaRecorder: {},
			isRecording: false,
			dataArray: [],
			analyser: undefined,
			canvas: undefined,
			ctx: undefined,
			canvasHeight: undefined,
			canvasWidth: undefined,
			countFrame: 0,
			recordTime: undefined
		};
	},
	computed: {
		...mapGetters(['chatStart', 'inputVisible', 'currentMessage', 'waitForResponse']),
		...mapState(['incomeMessage', 'disableRecording']),
		readyToRecord() {
			console.log('computed');
			if (this.waitForRespose && this.incomeMessage.length === 1) { return true; }
			return false;
		}
	},
	// watch: {
	// 	waitForResponse(value) {
	// 		console.log('watch');
	// 		console.log(value);
	// 		console.log(this.currentMessage.in.length);
	// 		if (!value && this.currentMessage.in.length === 1) {
	// 			this.mediaRecorder.start();
	// 			this.isRecording = true;
	// 		}
	// 	}
	// },
	mounted() {
		// init canvas
		this.canvas = document.getElementById('sound-visualizer');
		this.ctx = this.canvas.getContext('2d');
		this.canvasHeight = this.canvas.scrollHeight;
		this.canvasWidth = this.canvas.scrollWidth;
	},
	methods: {
		startChat() {
			this.$store.commit('setChatStart', true);
			// this.startRecord();
		},
		startRecord() {
			const vm = this;
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			this.audioContext = new AudioContext({ sampleRate: 16000 });
			this.isRecording = true;
			// Ask for audio device
			navigator.getUserMedia = navigator.getUserMedia
				|| navigator.mozGetUserMedia
				|| navigator.webkitGetUserMedia;
			navigator.getUserMedia({ audio: true }, vm.startUserMedia, e => {
				console.log(`No live audio input in this browser: ${e}`);
			});
		},
		stopRecording() {
			this.isRecording = false;
			this.audioContext.close().then(() => {
				console.log('streaming close');
			});
		},
		startUserMedia(stream) {
			const vm = this;
			vm.analyser = vm.audioContext.createAnalyser();
			const source = vm.audioContext.createMediaStreamSource(stream).connect(vm.analyser);
			console.log(vm.analyser);
			vm.dataArray = new Uint8Array(vm.analyser.fftSize / 32);
			vm.animate();
			const chunks = [];
			const audioOptions = {
				audioBitsPerSecond: 16000
			};
			/*         This two lines using Mediarecorder            */
			// vm.mediaRecorder = new MediaRecorder(stream, audioOptions);
			// vm.mediaRecorder.start();
			vm.mediaRecorder = new Recorder(source, { numChannels: 1 });
			vm.mediaRecorder.record();
			window.setTimeout(() => {
				if (vm.mediaRecorder.state === 'recording') {
					vm.mediaRecorder.stop();
					console.log('10 seconds, stop recording');
				}
			}, 10000);
			// Setup options
			const options = {
				source: source,
				voice_stop: function() {
					/*         This line using Mediarecorder            */
					// if (vm.mediaRecorder.state === 'recording') {
					if (vm.isRecording) {
						vm.mediaRecorder.stop();
						vm.mediaRecorder.exportWAV(vm.createFileLink);
						vm.stopRecording();
						console.log('voice_stop');
					}
				},
				voice_start: function() {
					if (vm.isRecording) {
						console.log('voice_start');
					// } else if (!vm.isRecording && (this.incomeMessage.length === 0)) {
					// 	console.log('StartRecording');
					// 	vm.startRecord();
					}
				}
			};
			// Create VAD
			// eslint-disable-next-line no-undef
			const vad = new VAD(options);

			/*              BELOW ARE USING MEDIARECORDER             */
			// Store sound in datas
			// this.mediaRecorder.ondataavailable = function(e) {
			// 	chunks.push(e.data);
			// };

			// this.mediaRecorder.onstop = function(e) {
			// 	console.log('recorder stopped');
			// 	vm.$store.commit('setResponseStatus', true);
			// 	this.waitForRespose = true;
			// 	const blob = new Blob(chunks, { type: 'audio/ogg;codecs=0' });
			// 	chunks = [];
			// 	const audioURL = window.URL.createObjectURL(blob);

			// 	const request = new XMLHttpRequest();
			// 	request.open('GET', audioURL, true);
			// 	request.responseType = 'blob';
			// 	request.onload = function() {
			// 		const reader = new FileReader();
			// 		reader.readAsDataURL(request.response);
			// 		reader.onload = function(el) {
			// 			console.log('DataURL:', el.target.result);
			// 			vm.sendMessageToBot(el.target.result);
			// 		};
			// 	};
			// 	request.send();
			// };
		},
		createFileLink(blob) {
			const vm = this;
			console.log('recorder stopped');
			vm.$store.commit('setResponseStatus', true);
			this.waitForRespose = true;
			const audioURL = window.URL.createObjectURL(blob);

			const request = new XMLHttpRequest();
			request.open('GET', audioURL, true);
			request.responseType = 'blob';
			request.onload = function() {
				const reader = new FileReader();
				reader.readAsDataURL(request.response);
				reader.onload = function(el) {
					// console.log('DataURL:', el.target.result);
					console.log('SEND RESULT TO THE BOT');
					vm.sendMessageToBot(el.target.result);
				};
			};
			request.send();
		},
		playMedia(audioPath) {
			const audio = document.querySelector('.sound-clips');
			audio.setAttribute('controls', '');
			audio.setAttribute('autoplay', '');
			audio.src = audioPath;
		},
		animate() {
			this.ctx.globalAlpha = 0.5;
			if (this.countFrame > 90) {
				this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
				this.countFrame = 0;
			}
			this.analyser.getByteFrequencyData(this.dataArray);
			this.ctx.strokeStyle = '#fff';
			// this.ctx.lineWidth = 0.5;
			this.ctx.beginPath();
			this.ctx.moveTo(-2, this.canvasHeight / 2);
			const arrayLength = this.dataArray.length;
			const countStep = this.canvasWidth / arrayLength;

			for (let i = 1; i < arrayLength - 2; i += 1) {
				const points = [];
				points[0] = {
					x: i * countStep,
					y: (this.canvasHeight - this.dataArray[i]) / 2
				};
				points[1] = {
					x: (i + 1) * countStep,
					y: (this.canvasHeight - this.dataArray[i + 1]) / 2
				};
				const xc = (points[0].x + points[1].x) / 2;
				const yc = (points[0].y + points[1].y) / 2;
				this.ctx.quadraticCurveTo(points[0].x, points[0].y, xc, yc);
			}
			this.ctx.stroke();
			this.countFrame += 1;
			window.requestAnimationFrame(this.animate);
		}
	}
};
</script>

<style lang="scss" scoped>
#app footer {
	margin-top: 30px;
	background: #fff;
	position: relative;
	bottom: 32px;
	width: 100%;
	height: calc(#{$footerSize} + 10px);
	padding-bottom: 0;
	/* border-top: 3px solid #eee; */
	z-index: 3;

	&.active {
		display: block;
	}

	.container-fluid {
		height: 100%;
		background: #f3f7fb;
		width: calc(100% - 30px);
		border-radius: 32px;
	}
	.start-button {
		font-size: 11pt;
		color: #fff;
		position: absolute;
		top: -37.5px;
		left: calc(50% - 37.5px);
		width: 75px;
		height: 75px;
		border-radius: 37.5px;
		border: none;
		box-shadow: -10px -10px 15px rgba(123, 1, 188, 1) inset,
			-1px -1px 15px rgba(0, 0, 0, 0.8);
		background: rgb(187,133,216);
		background: -moz-linear-gradient(151deg, rgba(187,133,216,1) 0%, rgba(123,1,188,1) 89%);
		background: -webkit-linear-gradient(151deg, rgba(187,133,216,1) 0%, rgba(123,1,188,1) 89%);
		background: linear-gradient(151deg, rgba(187,133,216,1) 0%, rgba(123,1,188,1) 89%);
		filter: progid:DXImageTransform.Microsoft.gradient(
			startColorstr="#bb85d8",
			endColorstr="#7b01bc",
			GradientType=1
		);
	}
	.micro-icon{
		width: 30px;
		height: 30px;
	}

	#sound-visualizer{
		position: absolute;
		width: 100%;
		height: 300px;
		top: -300px;
	}
}
</style>
