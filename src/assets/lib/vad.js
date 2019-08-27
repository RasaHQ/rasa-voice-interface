/* eslint-disable no-unused-vars */
(function(window) {
	const VAD = function(options) {
		// Default options
		this.options = {
			fftSize: 512,
			bufferLen: 512,
			voice_stop: function() {},
			voice_start: function() {},
			smoothingTimeConstant: 0.99,
			energy_offset: 1e-8, // The initial offset.
			energy_threshold_ratio_pos: 2, // Signal must be twice the offset
			energy_threshold_ratio_neg: 0.5, // Signal must be half the offset
			energy_integration: 1, // Size of integration change compared to the signal per second.
			filter: [
				{ f: 200, v: 0 }, // 0 -> 200 is 0
				{ f: 2000, v: 1 } // 200 -> 2k is 1
			],
			source: null,
			context: null
		};

		// User options
		// eslint-disable-next-line no-restricted-syntax
		for (const option in options) {
			// eslint-disable-next-line no-prototype-builtins
			if (options.hasOwnProperty(option)) {
				this.options[option] = options[option];
			}
		}

		// Require source
		if (!this.options.source) { throw new Error('The options must specify a MediaStreamAudioSourceNode.'); }

		// Set this.options.context
		this.options.context = this.options.source.context;

		// Calculate time relationships
		this.hertzPerBin = this.options.context.sampleRate / this.options.fftSize;
		this.iterationFrequency = this.options.context.sampleRate / this.options.bufferLen;
		this.iterationPeriod = 1 / this.iterationFrequency;

		const DEBUG = true;
		if (DEBUG) {
			console.log(
				`${'Vad'
      + ' | sampleRate: '}${this.options.context.sampleRate
				} | hertzPerBin: ${this.hertzPerBin
				} | iterationFrequency: ${this.iterationFrequency
				} | iterationPeriod: ${this.iterationPeriod}`
			);
		}

		this.setFilter = function(shape) {
			this.filter = [];
			for (let i = 0, iLen = this.options.fftSize / 2; i < iLen; i += 1) {
				this.filter[i] = 0;
				for (let j = 0, jLen = shape.length; j < jLen; j += 1) {
					if (i * this.hertzPerBin < shape[j].f) {
						this.filter[i] = shape[j].v;
						break; // Exit j loop
					}
				}
			}
		};

		this.setFilter(this.options.filter);

		this.ready = {};
		this.vadState = false; // True when Voice Activity Detected

		// Energy detector props
		this.energy_offset = this.options.energy_offset;
		this.energy_threshold_pos = this.energy_offset * this.options.energy_threshold_ratio_pos;
		this.energy_threshold_neg = this.energy_offset * this.options.energy_threshold_ratio_neg;

		this.voiceTrend = 0;
		this.voiceTrendMax = 10;
		this.voiceTrendMin = -10;
		this.voiceTrendStart = 5;
		this.voiceTrendEnd = -5;

		// Create analyser
		this.analyser = this.options.context.createAnalyser();
		this.analyser.smoothingTimeConstant = this.options.smoothingTimeConstant; // 0.99;
		this.analyser.fftSize = this.options.fftSize;

		this.floatFrequencyData = new Float32Array(this.analyser.frequencyBinCount);

		// Setup local storage of the Linear FFT data
		this.floatFrequencyDataLinear = new Float32Array(this.floatFrequencyData.length);

		// Connect this.analyser
		this.options.source.connect(this.analyser);

		// Create ScriptProcessorNode
		this.scriptProcessorNode = this.options.context.createScriptProcessor(this.options.bufferLen, 1, 1);

		// Connect scriptProcessorNode (Theretically, not required)
		this.scriptProcessorNode.connect(this.options.context.destination);

		// Create callback to update/analyze floatFrequencyData
		const self = this;
		this.scriptProcessorNode.onaudioprocess = function(event) {
			self.analyser.getFloatFrequencyData(self.floatFrequencyData);
			self.update();
			self.monitor();
		};

		// Connect scriptProcessorNode
		this.options.source.connect(this.scriptProcessorNode);

		// log stuff
		this.logging = false;
		this.log_i = 0;
		this.log_limit = 100;

		this.triggerLog = function(limit) {
			this.logging = true;
			this.log_i = 0;
			this.log_limit = typeof limit === 'number' ? limit : this.log_limit;
		};

		this.log = function(msg) {
			if (this.logging && this.log_i < this.log_limit) {
				this.log_i += 1;
				console.log(msg);
			} else {
				this.logging = false;
			}
		};

		this.update = function() {
			// Update the local version of the Linear FFT
			const fft = this.floatFrequencyData;
			for (let i = 0, iLen = fft.length; i < iLen; i += 1) {
				// eslint-disable-next-line no-restricted-properties
				this.floatFrequencyDataLinear[i] = Math.pow(10, fft[i] / 10);
			}
			this.ready = {};
		};

		this.getEnergy = function() {
			if (this.ready.energy) {
				return this.energy;
			}

			let energy = 0;
			const fft = this.floatFrequencyDataLinear;

			for (let i = 0, iLen = fft.length; i < iLen; i += 1) {
				energy += this.filter[i] * fft[i] * fft[i];
			}

			this.energy = energy;
			this.ready.energy = true;

			return energy;
		};

		this.monitor = function() {
			const energy = this.getEnergy();
			const signal = energy - this.energy_offset;

			if (signal > this.energy_threshold_pos) {
				this.voiceTrend = (this.voiceTrend + 1 > this.voiceTrendMax) ? this.voiceTrendMax : this.voiceTrend + 1;
			} else if (signal < -this.energy_threshold_neg) {
				this.voiceTrend = (this.voiceTrend - 1 < this.voiceTrendMin) ? this.voiceTrendMin : this.voiceTrend - 1;
			} else {
				// voiceTrend gets smaller
				// eslint-disable-next-line no-lonely-if
				if (this.voiceTrend > 0) {
					this.voiceTrend -= 1;
				} else if (this.voiceTrend < 0) {
					this.voiceTrend += 1;
				}
			}

			let start = false; let
				end = false;
			if (this.voiceTrend > this.voiceTrendStart) {
				// Start of speech detected
				start = true;
			} else if (this.voiceTrend < this.voiceTrendEnd) {
				// End of speech detected
				end = true;
			}

			// Integration brings in the real-time aspect through the relationship with the frequency this functions is called.
			const integration = signal * this.iterationPeriod * this.options.energy_integration;

			// Idea?: The integration is affected by the voiceTrend magnitude? - Not sure. Not doing atm.

			// The !end limits the offset delta boost till after the end is detected.
			if (integration > 0 || !end) {
				this.energy_offset += integration;
			} else {
				this.energy_offset += integration * 10;
			}
			this.energy_offset = this.energy_offset < 0 ? 0 : this.energy_offset;
			this.energy_threshold_pos = this.energy_offset * this.options.energy_threshold_ratio_pos;
			this.energy_threshold_neg = this.energy_offset * this.options.energy_threshold_ratio_neg;

			// Broadcast the messages
			if (start && !this.vadState) {
				this.vadState = true;
				this.options.voice_start();
			}
			if (end && this.vadState) {
				this.vadState = false;
				this.options.voice_stop();
			}

			this.log(
				`e: ${energy
				} | e_of: ${this.energy_offset
				} | e+_th: ${this.energy_threshold_pos
				} | e-_th: ${this.energy_threshold_neg
				} | signal: ${signal
				} | int: ${integration
				} | voiceTrend: ${this.voiceTrend
				} | start: ${start
				} | end: ${end}`
			);

			return signal;
		};
	};

	// eslint-disable-next-line no-param-reassign
	window.VAD = VAD;
}(window));
