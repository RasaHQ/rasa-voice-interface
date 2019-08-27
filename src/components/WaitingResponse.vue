<template>
            <svg
                class="lds-message"
                width="200px"
                height="200px"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 50 50"
                preserveAspectRatio="xMidYMid"
                style="background: none;"
            >
                <g transform="translate(10 25)">
                    <circle cx="0" cy="0" r="1.5" fill="#ffffff" transform="scale(0.994244 0.994244)">
                        <animateTransform
                            attributeName="transform"
                            type="scale"
                            begin="-0.375s"
                            calcMode="spline"
                            keySplines="0.3 0 0.7 1;0.3 0 0.7 1"
                            values="0;1;0"
                            keyTimes="0;0.5;1"
                            dur="1s"
                            repeatCount="indefinite"
                        >
                        </animateTransform>
                    </circle>
                </g>
                <g transform="translate(20 25)">
                <circle cx="0" cy="0" r="1.5" fill="#ffffff" transform="scale(0.881031 0.881031)">
                <animateTransform
                    attributeName="transform"
                    type="scale"
                    begin="-0.25s"
                    calcMode="spline"
                    keySplines="0.3 0 0.7 1;0.3 0 0.7 1"
                    values="0;1;0"
                    keyTimes="0;0.5;1"
                    dur="1s"
                    repeatCount="indefinite"
                >
                </animateTransform>
                </circle>
                </g><g transform="translate(30 25)">
                <circle cx="0" cy="0" r="1.5" fill="#ffffff" transform="scale(0.566526 0.566526)">
                <animateTransform
                    attributeName="transform"
                    type="scale"
                    begin="-0.125s"
                    calcMode="spline"
                    keySplines="0.3 0 0.7 1;0.3 0 0.7 1"
                    values="0;1;0"
                    keyTimes="0;0.5;1"
                    dur="1s"
                    repeatCount="indefinite"
                >
                </animateTransform>
                </circle>
                </g>

            </svg>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'WaitingResponse',
	computed: {
		...mapGetters([
			'waitForResponse'
		])
	}
};
</script>

<style lang="scss" scoped>

</style>
