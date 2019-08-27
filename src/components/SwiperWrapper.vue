<template>
	<div class="wrapper container-fluid">
		<div class="row">
			<div class="col-12 pl-0 pr-0">
				<div class="custom-swiper-container swiper-container swiper-container-horizontal">
					<div class="swiper-wrapper">
						<SwiperSlide v-for="(item, index) in items" :key="index" :product="item"/>
					</div>
					<!-- 	<div class="swiper-button-next"></div>
					<div class="swiper-button-prev"></div>-->
				</div>

				<!-- <div class="swiper-pagination" /> -->
			</div>
		</div>
		<div class="row" style="margin-bottom: 15px;">
			<div class="col-12">
				<!-- <div class="swiper-pagination" /> -->
				<div class="btn-wrapper">
					<div class="swiper-button-left">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="10.548"
							height="17.358"
							viewBox="0 0 10.548 17.358"
						>
							<path
								id="prev"
								d="M2262.878,4318.88l-9.048,7.972,9.048,7.886"
								transform="translate(-2253.08 -4318.13)"
								fill="none"
								stroke="#282828"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
							></path>
						</svg>
					</div>
					<div class="swiper-button-right">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="10.548"
							height="17.358"
							viewBox="0 0 10.548 17.358"
						>
							<path
								id="next"
								d="M2253.83,4318.88l9.048,7.972-9.048,7.886"
								transform="translate(-2253.08 -4318.13)"
								fill="none"
								stroke="#282828"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
							></path>
						</svg>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.min.css';
import SwiperSlide from './SwiperSlide.vue';
// import SliderPart from './SliderPart.vue';

export default {
	name: 'SwiperWrapper',
	components: {
		SwiperSlide
	},
	props: {
		items: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			swiper: undefined
		};
	},
	mounted() {
		this.$nextTick(() => {
			let selector = document.getElementsByClassName('custom-swiper-container');
			selector = selector[selector.length - 1];

			let navNextEl = document.getElementsByClassName('swiper-button-right');
			navNextEl = navNextEl[navNextEl.length - 1];

			let navPrevEl = document.getElementsByClassName('swiper-button-left');
			navPrevEl = navPrevEl[navPrevEl.length - 1];
			/* INIT SWIPER */
			this.swiper = new Swiper(selector, {
				speed: 900,
				parallax: true,
				slidesPerView: 'auto',
				spaceBetween: 30,
				centeredSlides: true,
				preloadImages: true,
				grabCursor: true,
				initialSlide: 0,
				pagination: {
					el: '.swiper-pagination',
					clickable: true
				},
				navigation: {
					nextEl: navNextEl,
					prevEl: navPrevEl
				},
				roundLengths: true,
				autoHeight: true
			});
		});
	}
};
</script>

<style lang="scss" scoped>
.wrapper {
	width: 100%;
	height: 100%;

	.swiper-container {
		width: 100%;
		height: 100%;
		padding-bottom: 20px;
		padding-top: 40px;
	}
}

.btn-wrapper {
	text-align: center;
	cursor: pointer;

	.swiper-button-left,
	.swiper-button-right {
		height: 40px;
		width: 40px;
		border-radius: 50px;
		display: inline-block;
		margin-right: 5px;
		margin-left: 5px;
		outline: none;
		transition: background 0.25s ease;

		&:hover {
			background: #e8e8e8;
		}
		svg {
			position: relative;
			top: 50%;
			-webkit-transform: translateY(-50%);
			-ms-transform: translateY(-50%);
			transform: translateY(-50%);
		}
	}
}
</style>
