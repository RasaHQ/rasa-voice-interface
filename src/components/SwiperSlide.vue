<template>
	<div class="swiper-slide msg-div">
		<div class="upper-wrapper">
			<div class="img-wrapper text-center">
				<img class="gallery" :src="product.imgURL">
			</div>
		</div>
		<div class="lower-wrapper">
			<div class="welcome-text text-center container">
				<div class="heading-1">
					<h5>{{ product.text }}</h5>
				</div>
				<div class="btn-footer">
					<button
						class="btn-card-footer"
						@click="sendQrPayloadToBot({text: product.text, payload: product.text })"
					>{{ product.buttonText }}</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'SwiperSlide',
	props: {
		product: {
			type: Object,
			default: () => {}
		}
	},
	mounted() {
		console.log(this.product);
	}
};
</script>

<style lang="scss" scoped>
.swiper-slide {
	border-radius: 10px !important;
	//border: solid 1px #fff;
	text-align: center;
	font-size: 14px;
	color: #fff;
	width: 100%;
	min-height: 280px;
	max-width: 320px;
	transition: transform 0.75s ease;
	box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px;

	&.swiper-slide-active {
		transform: translateY(-15px);
	}
	.upper-wrapper {
		//top: 10px;
		width: 100%;
		position: relative;

		.img-wrapper {
			max-width: 100%;
			max-height: 100%;
			.gallery {
				min-height: 150px;
				max-width: 320px;
				border-top-left-radius: 10px !important;
				border-top-right-radius: 10px !important;
			}
		}
	}

	.lower-wrapper {
		bottom: 0;
		width: 100%;
		min-height: 150px;
		background-color: #ffffff;
		border-bottom-left-radius: 10px !important;
		border-bottom-right-radius: 15px !important;
		position: relative;

		.btn-footer {
			position: absolute;
			bottom: 0;
			width: 100%;
			left: 0;
			padding: 15px;
		}
		.btn-card-footer {
			width: 100%;
			left: 0;
			height: 60px;
			background: #030e4a;
			color: white;
		}

		.heading-1 {
			color: #262626;
			text-align: left;
			padding-top: 15px;
		}
		.heading-2 {
			color: #262626;
			padding-left: 13px !important;
			padding-right: 13px !important;
			text-align: left;
		}
		.content {
			color: #898989;
			font-size: 12px;
			line-height: 15px;
			font-family: 'Roboto Medium';
			padding: 13px !important;
			text-align: left;

			p {
				margin-bottom: 30px !important;
			}
		}
		.link {
			font-family: 'Roboto Medium';
			margin-left: 13px !important;
			text-align: left;
			position: absolute;
			bottom: 20px;

			a {
				color: #db1f26 !important;
				display: block;

				h6 {
					margin: 0 !important;
				}
			}
		}
	}
}
</style>
