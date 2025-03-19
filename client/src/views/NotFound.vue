<template>
	<div class="not-found text-center py-5">
		<div class="container">
			<div class="page-content">
				<i class="massive frown outline icon text-muted"></i>
				<h1 class="mt-4 mb-3">404 - Page Not Found</h1>
				<p class="lead mb-4">The page you are looking for does not exist or has been removed.</p>
				<div class="mt-4">
					<router-link to="/" class="btn btn-primary mr-3">
						<i class="home icon"></i> Back to Home
					</router-link>
					<button @click="goBack" class="btn btn-outline-secondary">
						<i class="arrow left icon"></i> Go Back
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'NotFound',
	methods: {
		// Method to go back to the previous page
		goBack() {
			this.$router.go(-1);
		}
	}
}
</script>

<style scoped>
.not-found i.icon {
	opacity: 0.3; /* Set opacity for the icon */
}

.page-content {
	max-width: 600px;
	margin: 0 auto;
	padding: 60px 20px;
}

h1 {
	font-size: 2.5rem;
	color: #333;
}
</style>
