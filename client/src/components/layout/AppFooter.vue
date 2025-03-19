<template>
	<footer class="bg-dark text-white py-5 mt-5">
		<div class="container">
			<div class="row">
				<div class="col-md-4 mb-4 mb-md-0">
					<h5 class="mb-3">{{ appTitle }}</h5>
					<p>Online account buying and selling system with reputation</p>
					<p><i class="map marker alternate icon"></i> 123 ABC Street, XYZ District, Ho Chi Minh City</p>
					<p><i class="envelope icon"></i> info@mevnshop.vn</p>
					<p><i class="phone icon"></i> 0123.456.789</p>
				</div>
				
				<div class="col-md-4 mb-4 mb-md-0">
					<h5 class="mb-3">Quick Links</h5>
					<ul class="list-unstyled">
						<li><router-link class="text-white" to="/">Home</router-link></li>
						<li><router-link class="text-white" to="/products">Store</router-link></li>
						<li><router-link class="text-white" to="/about">About Us</router-link></li>
						<li><router-link class="text-white" to="/contact">Contact</router-link></li>
					</ul>
				</div>
				
				<div class="col-md-4">
					<h5 class="mb-3">Customer Support</h5>
					<ul class="list-unstyled">
						<li><router-link class="text-white" to="/faq">Frequently Asked Questions</router-link></li>
						<li><router-link class="text-white" to="/policy">Privacy Policy</router-link></li>
						<li><router-link class="text-white" to="/terms">Terms of Service</router-link></li>
						<li><router-link class="text-white" to="/payment-guide">Payment Guide</router-link></li>
					</ul>
				</div>
			</div>
			
			<hr class="my-4">
			
			<div class="row">
				<div class="col-md-6 mb-3 mb-md-0">
					<p class="mb-0">&copy; {{ new Date().getFullYear() }} {{ appTitle }} - All Rights Reserved</p>
				</div>
				<div class="col-md-6 text-md-right">
					<div class="social-icons">
						<a href="#" class="text-white mr-3"><i class="facebook f icon"></i></a>
						<a href="#" class="text-white mr-3"><i class="twitter icon"></i></a>
						<a href="#" class="text-white mr-3"><i class="instagram icon"></i></a>
						<a href="#" class="text-white"><i class="youtube icon"></i></a>
					</div>
				</div>
			</div>
		</div>
	</footer>
</template>

<script>
export default {
	name: 'AppFooter',
	data() {
		return {
			appTitle: process.env.VUE_APP_TITLE || 'MEVN Shop'
		}
	}
}
</script>

<style scoped>
footer {
	margin-top: auto;
}

footer a {
	text-decoration: none;
	transition: color 0.3s;
}

footer a:hover {
	color: #17a2b8 !important;
	text-decoration: none;
}

footer ul li {
	margin-bottom: 10px;
}

.social-icons a {
	font-size: 1.2rem;
	transition: transform 0.3s;
	display: inline-block;
}

.social-icons a:hover {
	transform: scale(1.2);
}
</style>
