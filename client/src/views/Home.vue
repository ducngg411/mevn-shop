<template>
	<div class="home">
	<!-- Hero Carousel Section -->
	<section class="hero-section mb-5">
		<div id="homeCarousel" class="carousel slide" data-ride="carousel">
		<ol class="carousel-indicators">
			<li data-target="#homeCarousel" data-slide-to="0" class="active"></li>
			<li data-target="#homeCarousel" data-slide-to="1"></li>
			<li data-target="#homeCarousel" data-slide-to="2"></li>
			<li data-target="#homeCarousel" data-slide-to="3"></li>
		</ol>
		<div class="carousel-inner">
			<div class="carousel-item active">
			<img src="https://cdn.divineshop.vn/image/catalog/Netflix-11025.png?hash=1739505080" class="d-block w-100" alt="Slide 1">
			</div>
			<div class="carousel-item">
			<img src="https://cdn.divineshop.vn/image/catalog/Capcut-86373.png?hash=1735881306" class="d-block w-100" alt="Slide 2">
			</div>
			<div class="carousel-item">
			<img src="https://cdn.divineshop.vn/image/catalog/banner%20Google%20One%20(1)-90108.png?hash=1735892847" class="d-block w-100" alt="Slide 3">
			
			</div>
			<div class="carousel-item">
			<img src="https://cdn.divineshop.vn/image/catalog/Banner/iQIYI2-64713.png?hash=1736914879" class="d-block w-100" alt="Slide 4">
			</div>
		</div>
		<a class="carousel-control-prev" href="#homeCarousel" role="button" data-slide="prev">
			<span class="carousel-control-prev-icon" aria-hidden="true"></span>
			<span class="sr-only">Previous</span>
		</a>
		<a class="carousel-control-next" href="#homeCarousel" role="button" data-slide="next">
			<span class="carousel-control-next-icon" aria-hidden="true"></span>
			<span class="sr-only">Next</span>
		</a>
		</div>
	</section>
	
	<!-- Highlighted Categories -->
	<section class="featured-categories mb-5">
		<div class="container">
		<h2 class="section-title text-center">Explore Categories</h2>
		<p class="section-subtitle text-center mb-4">Find premium accounts for all your digital needs</p>
		
		<div class="row">
			<div class="col-md-3 mb-4" v-for="(category, index) in categories" :key="index">
			<div class="card h-100 category-card">
				<div class="card-body text-center">
				<div class="category-icon mb-3">
					<i :class="category.icon"></i>
				</div>
				<h5 class="card-title">{{ category.name }}</h5>
				<p class="card-text">{{ category.description }}</p>
				<router-link :to="{ path: '/products', query: { category: category.slug } }" class="btn btn-outline-primary">
					Explore
				</router-link>
				</div>
			</div>
			</div>
		</div>
		</div>
	</section>
	
	<!-- Sale Banner -->
	<section class="sale-banner mb-5">
		<div class="container">
		<div class="banner-wrapper">
			<div class="row align-items-center">
			<div class="col-md-6">
				<h2 class="banner-title">Summer Special Offer</h2>
				<h3 class="banner-subtitle">Up to 30% Off on All Entertainment Accounts</h3>
				<p class="banner-description">Limited time offer - Get your premium streaming experience at unbeatable prices!</p>
				<router-link to="/products?category=Entertainment" class="btn btn-danger btn-lg mt-3">
				Shop Now
				</router-link>
			</div>
			<div class="col-md-6 text-center">
				<img src="img/bannersale.png" alt="Summer Sale" class="img-fluid banner-image">
			</div>
			</div>
		</div>
		</div>
	</section>
	
	<!-- Best Sellers Section -->
	<section class="best-sellers mb-5">
		<div class="container">
		<h2 class="section-title text-center">Best Sellers</h2>
		<p class="section-subtitle text-center mb-4">Our most popular accounts that customers love</p>
		
		<div v-if="productsLoading" class="text-center py-5">
			<div class="ui active centered inline loader"></div>
			<p class="mt-3">Loading best sellers...</p>
		</div>
		
		<div v-else class="row">
			<div class="col-md-3 mb-4" v-for="product in bestSellers" :key="product._id">
			<product-card :product="product"></product-card>
			</div>
		</div>
		
		<div class="text-center mt-3">
			<router-link to="/products" class="btn btn-primary">View All Products</router-link>
		</div>
		</div>
	</section>
	
	<!-- Entertainment Section -->
	<section class="entertainment-section mb-5">
		<div class="container">
		<h2 class="section-title text-center">Entertainment</h2>
		<p class="section-subtitle text-center mb-4">Stream your favorite shows, movies and music</p>
		
		<div v-if="productsLoading" class="text-center py-5">
			<div class="ui active centered inline loader"></div>
			<p class="mt-3">Loading entertainment products...</p>
		</div>
		
		<div v-else class="row">
			<div class="col-md-3 mb-4" v-for="product in entertainmentProducts" :key="product._id">
			<product-card :product="product"></product-card>
			</div>
		</div>
		
		<div class="text-center mt-3">
			<router-link to="/products?category=Entertainment" class="btn btn-outline-primary">View All Entertainment</router-link>
		</div>
		</div>
	</section>
	
	<!-- Education & Learning Section -->
	<section class="education-section mb-5">
		<div class="container">
		<h2 class="section-title text-center">Education & Learning</h2>
		<p class="section-subtitle text-center mb-4">Enhance your skills with premium learning platforms</p>
		
		<div v-if="productsLoading" class="text-center py-5">
			<div class="ui active centered inline loader"></div>
			<p class="mt-3">Loading education products...</p>
		</div>
		
		<div v-else class="row">
			<div class="col-md-3 mb-4" v-for="product in educationProducts" :key="product._id">
			<product-card :product="product"></product-card>
			</div>
		</div>
		
		<div class="text-center mt-3">
			<router-link to="/products?category=Education" class="btn btn-outline-primary">View All Education</router-link>
		</div>
		</div>
	</section>
	
	<!-- Why Choose Us -->
	<section class="why-choose-us mb-5 py-5">
		<div class="container">
		<h2 class="section-title text-center">Why Choose Us?</h2>
		<p class="section-subtitle text-center mb-5">Experience premium service with peace of mind</p>
		
		<div class="row features-row">
			<div class="col-md-4 mb-4">
			<div class="feature text-center">
				<div class="feature-icon mb-3">
				<i class="huge shield alternate icon text-primary"></i>
				</div>
				<h4>Guaranteed Security</h4>
				<p>100% secure payment process and account protection</p>
			</div>
			</div>
			<div class="col-md-4 mb-4">
			<div class="feature text-center">
				<div class="feature-icon mb-3">
				<i class="huge bolt icon text-primary"></i>
				</div>
				<h4>Instant Delivery</h4>
				<p>Get your account credentials immediately after payment</p>
			</div>
			</div>
			<div class="col-md-4 mb-4">
			<div class="feature text-center">
				<div class="feature-icon mb-3">
				<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="#0d6efd" class="bi bi-headset" viewBox="0 0 16 16">
					<path d="M8 1a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a6 6 0 1 1 12 0v6a2.5 2.5 0 0 1-2.5 2.5H9.366a1 1 0 0 1-.866.5h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 .866.5H11.5A1.5 1.5 0 0 0 13 12h-1a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1V6a5 5 0 0 0-5-5"/>
				</svg>
				</div>
				<h4>24/7 Support</h4>
				<p>Our dedicated team is always ready to assist you</p>
			</div>
			</div>
		</div>
		</div>
	</section>
	
	<!-- Latest Discounts Section -->
	<section class="latest-discounts mb-5">
		<div class="container">
		<h2 class="section-title text-center">Latest Discounts</h2>
		<p class="section-subtitle text-center mb-4">Catch these deals before they're gone</p>
		
		<div v-if="productsLoading" class="text-center py-5">
			<div class="ui active centered inline loader"></div>
			<p class="mt-3">Loading discounted products...</p>
		</div>
		
		<div v-else class="row">
			<div class="col-md-3 mb-4" v-for="product in discountedProducts" :key="product._id">
			<product-card :product="product"></product-card>
			</div>
		</div>
		
		<div class="text-center mt-3">
			<router-link to="/products" class="btn btn-outline-primary">View All Products</router-link>
		</div>
		</div>
	</section>
	
	<!-- Reviews and Testimonials -->
	<section class="testimonials mb-5">
		<div class="container">
		<h2 class="section-title text-center">Customer Feedback</h2>
		<p class="section-subtitle text-center mb-4">What our happy customers say about us</p>
		
		<div class="row">
			<div class="col-md-4 mb-4" v-for="(testimonial, index) in testimonials" :key="index">
			<div class="card testimonial-card">
				<div class="card-body">
				<div class="testimonial-rating mb-3">
					<i class="star icon" v-for="n in testimonial.rating" :key="n"></i>
				</div>
				<p class="card-text testimonial-text">{{ testimonial.text }}</p>
				<div class="testimonial-author d-flex align-items-center mt-3">
					<img :src="testimonial.avatar" alt="Avatar" class="testimonial-avatar mr-3">
					<div>
					<h6 class="mb-0">{{ testimonial.name }}</h6>
					<small class="text-muted">{{ testimonial.title }}</small>
					</div>
				</div>
				</div>
			</div>
			</div>
		</div>
		</div>
	</section>
	
	<!-- Newsletter Subscription -->
	<section class="newsletter mb-5">
		<div class="container">
		<div class="newsletter-wrapper">
			<div class="row align-items-center">
			<div class="col-md-6">
				<h3 class="newsletter-title">Subscribe to Our Newsletter</h3>
				<p class="newsletter-description">Stay updated with the latest offers and new products</p>
			</div>
			<div class="col-md-6">
				<form @submit.prevent="subscribeNewsletter" class="newsletter-form">
				<div class="input-group">
					<input type="email" class="form-control" placeholder="Your email address" v-model="newsletterEmail" required>
					<div class="input-group-append">
					<button class="btn btn-primary" type="submit">Subscribe</button>
					</div>
				</div>
				</form>
			</div>
			</div>
		</div>
		</div>
	</section>
	</div>
	</template>
	
	<script>
	import { mapActions } from 'vuex';
	import ProductCard from '@/components/common/ProductCard.vue';
	import api from '@/utils/api';
	import { formatCurrency, formatImageUrl, truncateText } from '@/utils/helpers';
	
	export default {
	name: 'Home',
	components: {
	ProductCard
	},
	data() {
	return {
		productsLoading: true,
		featuredProducts: [],
		bestSellers: [],
		entertainmentProducts: [],
		educationProducts: [],
		discountedProducts: [],
		newsletterEmail: '',
		categories: [
		{
			name: 'Entertainment',
			icon: 'huge film icon text-primary',
			description: 'Netflix, Spotify, Disney+, Youtube Premium...',
			slug: 'Entertainment'
		},
		{
			name: 'Education',
			icon: 'huge book icon text-primary',
			description: 'Coursera, Udemy, Skillshare, Lynda...',
			slug: 'Education'
		},
		{
			name: 'Gaming',
			icon: 'huge gamepad icon text-primary',
			description: 'Steam, Origin, Uplay, Epic Games...',
			slug: 'Gaming'
		},
		{
			name: 'Tools & Productivity',
			icon: 'huge wrench icon text-primary',
			description: 'Office 365, Adobe CC, Cloud Storage...',
			slug: 'Tools'
		}
		],
		testimonials: [
		{
			name: 'Nguyễn Văn A',
			title: 'Verified Customer',
			avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
			text: 'I bought a Netflix account and I am very satisfied with the service. The transaction was fast, and the account worked well with no issues.',
			rating: 5
		},
		{
			name: 'Trần Thị B',
			title: 'Verified Customer',
			avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
			text: 'Great service quality, received the account right after payment. Customer support was very responsive when I had questions.',
			rating: 4
		},
		{
			name: 'Lê Văn C',
			title: 'Premium Member',
			avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
			text: 'Reasonable prices, friendly support team. I have bought several times and have always been satisfied with the quality of accounts.',
			rating: 5
		}
		]
	};
	},
	methods: {
	...mapActions({
		addToCartAction: 'cart/addToCart'
	}),
	formatCurrency,
	truncateText,
	formatImageUrl,
		
	async fetchProductsByCategory(category, limit = 4) {
		try {
		const response = await api.get(`/products?category=${category}&limit=${limit}`);
		if (response.data.success) {
			return response.data.products;
		}
		return [];
		} catch (error) {
		console.error(`Error fetching ${category} products:`, error);
		return [];
		}
	},
		
	async fetchBestSellers(limit = 4) {
		try {
		// In a real API, you might have a dedicated endpoint for best sellers
		// Here we're simulating by sorting products by 'sold' count
		const response = await api.get(`/products?limit=${limit}&sortBy=sold_desc`);
		if (response.data.success) {
			return response.data.products.sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, limit);
		}
		return [];
		} catch (error) {
		console.error('Error fetching best sellers:', error);
		return [];
		}
	},
		
	async fetchDiscountedProducts(limit = 4) {
		try {
		// This would ideally filter products that have a discount price
		const response = await api.get(`/products?limit=${limit * 2}`);
		if (response.data.success) {
			return response.data.products
			.filter(p => p.discountPrice > 0)
			.sort((a, b) => {
				const discountPercentA = ((a.price - a.discountPrice) / a.price) * 100;
				const discountPercentB = ((b.price - b.discountPrice) / b.price) * 100;
				return discountPercentB - discountPercentA;
			})
			.slice(0, limit);
		}
		return [];
		} catch (error) {
		console.error('Error fetching discounted products:', error);
		return [];
		}
	},
		
	async fetchAllProductCategories() {
		try {
		this.productsLoading = true;
		
		// Fetch products for different sections in parallel
		const [bestSellers, entertainmentProducts, educationProducts, discountedProducts] = await Promise.all([
			this.fetchBestSellers(4),
			this.fetchProductsByCategory('Entertainment', 4),
			this.fetchProductsByCategory('Education', 4),
			this.fetchDiscountedProducts(4)
		]);
		
		this.bestSellers = bestSellers;
		this.entertainmentProducts = entertainmentProducts;
		this.educationProducts = educationProducts;
		this.discountedProducts = discountedProducts;
		} catch (error) {
		console.error('Error fetching products:', error);
		this.$toast.error('Unable to load products. Please try again later.');
		} finally {
		this.productsLoading = false;
		}
	},
		
	addToCart(product) {
		this.addToCartAction({ product, quantity: 1 });
		this.$toast.success(`Added ${product.title} to cart!`);
	},
		
	displayRating(product) {
		try {
		if (product.rating) {
			return parseFloat(product.rating).toFixed(1);
		}
		
		if (product.reviews && product.reviews.length > 0) {
			const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
			const averageRating = totalRating / product.reviews.length;
			return averageRating.toFixed(1);
		}
		
		return '0.0';
		} catch (error) {
		console.error('Error calculating rating:', error);
		return '0.0';
		}
	},
		
	subscribeNewsletter() {
		// This would typically connect to a newsletter API
		this.$toast.success(`Thanks for subscribing with ${this.newsletterEmail}!`);
		this.newsletterEmail = '';
	}
	},
	mounted() {
	this.fetchAllProductCategories();
	
	// Initialize Bootstrap carousel with custom settings
	if (typeof window !== 'undefined' && window.jQuery) {
		window.jQuery('#homeCarousel').carousel({
		interval: 5000,
		pause: 'hover'
		});
	}
	}
	};
	</script>
	
<style scoped>
	/* Hero Section Styles */
	.hero-section {
	margin-top: -20px;
	margin-bottom: 4rem;
	position: relative;
	}
	
	.carousel-item {
	height: 500px;
	position: relative;
	}
	
	.carousel-item img {
	object-fit: cover;
	height: 100%;
	width: 100%;
	/* filter: brightness(0.7); */
	}
	
	
	
	.caption-box {
	background-color: rgba(0, 0, 0, 0.6);
	padding: 2rem;
	border-radius: 10px;
	max-width: 600px;
	backdrop-filter: blur(5px);
	border-left: 5px solid #4361ee;
	}
	
	.carousel-caption h2 {
	font-size: 2.8rem;
	font-weight: 800;
	margin-bottom: 1rem;
	color: white;
	text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
	}
	
	.carousel-caption p {
	font-size: 1.3rem;
	margin-bottom: 1.5rem;
	color: rgba(255, 255, 255, 0.9);
	}
	
	.carousel-indicators li {
	width: 12px;
	height: 12px;
	border-radius: 50%;
	margin: 0 5px;
	}
	
	.carousel-control-prev, .carousel-control-next {
	width: 10%;
	opacity: 0.7;
	}
	
	/* Section Styles */
	.section-title {
	font-size: 2.5rem;
	font-weight: 800;
	margin-bottom: 1rem;
	color: #2d3748;
	position: relative;
	padding-bottom: 15px;
	}
	
	.section-title:after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 80px;
	height: 4px;
	background: linear-gradient(to right, #4361ee, #3a0ca3);
	border-radius: 2px;
	}
	
	.section-subtitle {
	color: #6c757d;
	font-size: 1.1rem;
	max-width: 700px;
	margin: 0 auto;
	}
	
	/* Category Card Styles */
	.category-card {
	border-radius: 15px;
	padding: 2rem 1.5rem;
	transition: all 0.4s ease;
	border: none;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
	overflow: hidden;
	height: 100%;
	}
	
	.category-card:hover {
	transform: translateY(-10px);
	box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
	}
	
	.category-icon {
	margin-bottom: 1.5rem;
	transition: all 0.4s ease;
	}
	
	.category-icon i {
	font-size: 3.5rem;
	color: #4361ee;
	}
	
	.category-card:hover .category-icon {
	transform: scale(1.1) rotate(5deg);
	}
	
	.category-card .card-title {
	font-size: 1.5rem;
	font-weight: 700;
	margin-bottom: 1rem;
	color: #2d3748;
	}
	
	.category-card .card-text {
	color: #6c757d;
	margin-bottom: 1.5rem;
	}
	
	.category-card .btn-outline-primary {
	border-color: #4361ee;
	color: #4361ee;
	border-radius: 30px;
	padding: 0.5rem 2rem;
	font-weight: 600;
	transition: all 0.3s;
	}
	
	.category-card .btn-outline-primary:hover {
	background-color: #4361ee;
	color: white;
	transform: translateY(-3px);
	box-shadow: 0 10px 20px rgba(67, 97, 238, 0.2);
	}
	
	/* Sale Banner Styles */
	.sale-banner {
	padding: 3rem 0;
	}
	
	.banner-wrapper {
	background: linear-gradient(135deg, #4cc9f0, #4361ee);
	padding: 3rem;
	border-radius: 20px;
	color: white;
	box-shadow: 0 15px 35px rgba(76, 201, 240, 0.2);
	overflow: hidden;
	position: relative;
	}
	
	.banner-title {
	font-size: 3rem;
	font-weight: 800;
	margin-bottom: 1rem;
	color: white;
	}
	
	.banner-subtitle {
	font-size: 1.8rem;
	font-weight: 600;
	margin-bottom: 1.5rem;
	color: rgba(255, 255, 255, 0.9);
	}
	
	.banner-description {
	font-size: 1.1rem;
	margin-bottom: 2rem;
	color: rgba(255, 255, 255, 0.8);
	}
	
	.banner-image {
	border-radius: 15px;
	box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
	max-height: 300px;
	transform: rotate(3deg);
	transition: transform 0.5s;
	}
	
	.banner-wrapper:hover .banner-image {
	transform: rotate(0deg);
	}
	
	.btn-danger {
	background-color: #f72585;
	border-color: #f72585;
	border-radius: 30px;
	padding: 0.75rem 2.5rem;
	font-weight: 700;
	transition: all 0.3s;
	}
	
	.btn-danger:hover {
	background-color: #e5177a;
	border-color: #e5177a;
	transform: translateY(-5px);
	box-shadow: 0 10px 20px rgba(247, 37, 133, 0.3);
	}
	
	/* Why Choose Us Styles */
	.why-choose-us {
	background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	padding: 5rem 0;
	border-radius: 30px;
	margin-top: 3rem;
	margin-bottom: 3rem;
	}
	
	.features-row {
	margin-top: 3rem;
	}
	
	.feature {
	background-color: white;
	padding: 2.5rem;
	border-radius: 15px;
	box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
	transition: all 0.4s ease;
	height: 100%;
	}
	
	.feature:hover {
	transform: translateY(-10px);
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
	}
	
	.feature-icon {
	margin-bottom: 2rem;
	}
	
	.feature-icon i, .feature-icon svg {
	font-size: 4rem;
	color: #4361ee;
	}
	
	.feature h4 {
	font-size: 1.5rem;
	font-weight: 700;
	margin-bottom: 1rem;
	color: #2d3748;
	}
	
	.feature p {
	color: #6c757d;
	}
	
	/* Testimonial Styles */
	.testimonial-card {
	border-radius: 15px;
	padding: 1.5rem;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
	border: none;
	transition: all 0.4s ease;
	height: 100%;
	}
	
	.testimonial-card:hover {
	transform: translateY(-10px);
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
	}
	
	.testimonial-rating {
	color: #ffc107;
	font-size: 1.2rem;
	}
	
	.testimonial-text {
	font-style: italic;
	color: #4a5568;
	font-size: 1.1rem;
	line-height: 1.7;
	margin-bottom: 1.5rem;
	min-height: 100px;
	}
	
	.testimonial-avatar {
	width: 50px;
	height: 50px;
	border-radius: 50%;
	object-fit: cover;
	border: 2px solid #4361ee;
	}
	
	/* Newsletter Styles */
	.newsletter {
	padding: 3rem 0;
	}
	
	.newsletter-wrapper {
	background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	padding: 3rem;
	border-radius: 20px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
	}
	
	.newsletter-title {
	font-size: 2rem;
	font-weight: 700;
	margin-bottom: 1rem;
	color: #2d3748;
	}
	
	.newsletter-description {
	color: #6c757d;
	font-size: 1.1rem;
	margin-bottom: 0;
	}
	
	.newsletter-form .form-control {
	height: 50px;
	border-radius: 30px 0 0 30px;
	border: none;
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
	padding: 0 1.5rem;
	}
	
	.newsletter-form .btn {
	border-radius: 0 30px 30px 0;
	padding: 0 1.5rem;
	height: 50px;
	font-weight: 600;
	}
	
	/* Product Sections */
	.best-sellers,
	.entertainment-section,
	.education-section,
	.latest-discounts {
	padding: 3rem 0;
	}
	
	/* Responsive Adjustments */
	@media (max-width: 991px) {
	.carousel-item {
	height: 400px;
	}
	
	.carousel-caption {
	bottom: 20px;
	}
	
	.caption-box {
	padding: 1.5rem;
	}
	
	.carousel-caption h2 {
	font-size: 2rem;
	}
	
	.carousel-caption p {
	font-size: 1rem;
	}
	
	.banner-title {
	font-size: 2.2rem;
	}
	
	.banner-subtitle {
	font-size: 1.4rem;
	}
	
	.section-title {
	font-size: 2rem;
	}
	}
	
	@media (max-width: 767px) {
	.carousel-item {
	height: 300px;
	}
	
	.carousel-caption {
	text-align: center;
	}
	
	.caption-box {
	max-width: 100%;
	padding: 1rem;
	}
	
	.carousel-caption h2 {
	font-size: 1.5rem;
	}
	
	.banner-wrapper {
	padding: 2rem;
	text-align: center;
	}
	
	.banner-image {
	margin-top: 2rem;
	transform: none;
	}
	
	.newsletter-wrapper {
	text-align: center;
	}
	
	.newsletter-form {
	margin-top: 1.5rem;
	}
}
</style>