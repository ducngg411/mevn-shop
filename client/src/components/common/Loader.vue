<template>
	<div class="loader-container" :class="{ 'overlay': overlay }">
		<div class="ui active dimmer" v-if="overlay">
			<div class="ui text loader">{{ message }}</div>
		</div>
		<div class="ui active centered inline loader" v-else></div>
		<p v-if="message && !overlay">{{ message }}</p>
	</div>
</template>

<script>
export default {
	name: 'Loader',
	props: {
		message: {
			type: String,
			default: 'Loading...' // Dịch sang tiếng Anh
		},
		overlay: {
			type: Boolean,
			default: false
		}
	}
}
</script>

<style scoped>
.loader-container {
	text-align: center;
	padding: 2rem;
}

.overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(255, 255, 255, 0.7);
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
