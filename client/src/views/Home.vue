<template>
	<div class="home">
		<!-- Hero Section -->
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
						<!-- <div class="carousel-overlay"></div> -->
						<img src="https://cdn.divineshop.vn/image/catalog/Netflix-11025.png?hash=1739505080" class="d-block w-100" alt="Slide 1">
						<div class="carousel-caption">
							<!-- <h1>Buy Accounts Online</h1>
							<p>The platform for buying and selling premium accounts at the best prices.</p>
							<router-link to="/products" class="btn btn-primary btn-lg">Explore Now</router-link> -->
						</div>
					</div>
					<div class="carousel-item">
						<!-- <div class="carousel-overlay"></div> -->
						<img src="https://cdn.divineshop.vn/image/catalog/Capcut-86373.png?hash=1735881306" class="d-block w-100" alt="Slide 2">
						<div class="carousel-caption">
							<!-- <h1>Simple Payment</h1>
							<p>Easy payment and instant account delivery</p>
							<router-link to="/products" class="btn btn-primary btn-lg">Buy Now</router-link> -->
						</div>
					</div>
					<div class="carousel-item">
						<!-- <div class="carousel-overlay"></div> -->
						<img src="https://cdn.divineshop.vn/image/catalog/banner%20Google%20One%20(1)-90108.png?hash=1735892847" class="d-block w-100" alt="Slide 3">
						<div class="carousel-caption">
							<!-- <h1>24/7 Support</h1>
							<p>Our support team is always ready to assist you</p>
							<router-link to="/contact" class="btn btn-primary btn-lg">Contact Us</router-link> -->
						</div>
					</div>
					<div class="carousel-item">
						<!-- <div class="carousel-overlay"></div> -->
						<img src="https://cdn.divineshop.vn/image/catalog/Banner/iQIYI2-64713.png?hash=1736914879" class="d-block w-100" alt="Slide 4">
						<div class="carousel-caption">
							<!-- <h1>24/7 Support</h1>
							<p>Our support team is always ready to assist you</p>
							<router-link to="/contact" class="btn btn-primary btn-lg">Contact Us</router-link> -->
						</div>
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

		<!-- Featured Categories -->
		<section class="featured-categories mb-5">
			<div class="container">
				<h2 class="section-title text-center mb-4">Featured Categories</h2>
				<div class="row">
					<div class="col-md-4 mb-4" v-for="(category, index) in categories" :key="index">
						<div class="card h-100 category-card">
							<div class="card-body text-center">
								<div class="category-icon mb-3">
									<i :class="category.icon"></i>
								</div>
								<h5 class="card-title">{{ category.name }}</h5>
								<p class="card-text">{{ category.description }}</p>
								<router-link :to="{ path: '/products', query: { category: category.slug } }" class="btn btn-outline-primary">
									View More
								</router-link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Featured Products -->
		<section class="featured-products mb-5">
			<div class="container">
				<h2 class="section-title text-center mb-4">Featured Products</h2>
				<div class="row">
					<div v-if="productsLoading" class="col-12 text-center py-5">
						<div class="ui active centered inline loader"></div>
						<p class="mt-3">Loading products...</p>
					</div>
					<div v-else-if="products.length === 0" class="col-12 text-center py-5">
						<p>No products available.</p>
					</div>
					<template v-else>
						<div class="col-md-3 mb-4" v-for="product in products" :key="product._id">
							<div class="card h-100 product-card">
								<!-- <img :src="product.image || 'https://picsum.photos/300/200'" class="card-img-top" :alt="product.title"> -->
								<img :src="formatImageUrl(product.image)" class="card-img-top" :alt="product.title">
								<div class="card-body d-flex flex-column">
									<h5 class="card-title">{{ product.title }}</h5>
									<p class="card-text flex-grow-1">{{ truncateText(product.description, 100) }}</p>
									<div class="product-price mb-2">
										<span v-if="product.discountPrice > 0" class="original-price">{{ formatCurrency(product.price) }}</span>
										<span class="current-price">{{ formatCurrency(product.discountPrice > 0 ? product.discountPrice : product.price) }}</span>
									</div>
									<div class="d-flex justify-content-between">
										<router-link :to="`/products/${product._id}`" class="btn btn-outline-primary">
											Details
										</router-link>
										<button class="btn btn-primary" @click="addToCart(product)">
											<i class="shopping cart icon"></i> Add to Cart
										</button>
									</div>
								</div>
							</div>
						</div>
					</template>
				</div>
				<div class="text-center mt-4">
					<router-link to="/products" class="btn btn-primary">View All Products</router-link>
				</div>
			</div>
		</section>

		<!-- Why Choose Us -->
		<section class="why-choose-us mb-5 py-5 bg-light">
			<div class="container">
				<h2 class="section-title text-center mb-5">Why Choose Us?</h2>
				<div class="row">
					<div class="col-md-4 mb-4">
						<div class="feature text-center">
							<div class="feature-icon mb-3">
								<i class="huge shield alternate icon text-primary"></i>
							</div>
							<h5>Guaranteed Safety</h5>
							<p>All transactions are secure and completely safe</p>
						</div>
					</div>
					<div class="col-md-4 mb-4">
						<div class="feature text-center">
							<div class="feature-icon mb-3">
								<i class="huge bolt icon text-primary"></i>
							</div>
							<h5>Instant Delivery</h5>
							<p>Get your account immediately after successful payment</p>
						</div>
					</div>
					<div class="col-md-4 mb-4">
						<div class="feature text-center">
							<div class="feature-icon mb-3">
		                    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill=#0d6efd class="bi bi-headset" viewBox="0 0 16 16">
  <path d="M8 1a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a6 6 0 1 1 12 0v6a2.5 2.5 0 0 1-2.5 2.5H9.366a1 1 0 0 1-.866.5h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 .866.5H11.5A1.5 1.5 0 0 0 13 12h-1a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1V6a5 5 0 0 0-5-5"/>
</svg>
								<!-- <i class="huge bi-headset icon text-primary"></i> -->
							</div>
							<h5>24/7 Support</h5>
							<p>Our support team is always ready to assist you anytime</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Testimonials -->
		<section class="testimonials mb-5">
			<div class="container">
				<h2 class="section-title text-center mb-4">What Our Customers Say</h2>
				<div class="row">
					<div class="col-md-4 mb-4" v-for="(testimonial, index) in testimonials" :key="index">
						<div class="card h-100">
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
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import api from '@/utils/api';
import { formatCurrency, formatImageUrl, truncateText } from '@/utils/helpers';

export default {
	name: 'Home',
	data() {
		return {
			productsLoading: true,
			products: [],
			categories: [
				{
					name: 'Entertainment',
					icon: 'huge film icon text-primary',
					description: 'Netflix, Spotify, Disney+, Youtube Premium...',
					slug: 'Entertainment'
				},
				{
					name: 'Learning',
					icon: 'huge book icon text-primary',
					description: 'Coursera, Udemy, Skillshare, Lynda...',
					slug: 'Education'
				},
				{
					name: 'Games',
					icon: 'huge gamepad icon text-primary',
					description: 'Steam, Origin, Uplay, Epic Games...',
					slug: 'Gaming'
				}
			],
			testimonials: [
				{
					name: 'Nguyễn Văn A',
					title: 'Customer',
					avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
					text: 'I bought a Netflix account and I am very satisfied with the service. The transaction was fast, and the account worked well.',
					rating: 5
				},
				{
					name: 'Trần Thị B',
					title: 'Customer',
					avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
					text: 'Great service quality, received the account right after payment. Will come back to buy again.',
					rating: 4
				},
				{
					name: 'Lê Văn C',
					title: 'Customer',
					avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
					text: 'Reasonable prices, friendly support team. I have bought several times and have always been satisfied.',
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
		async fetchFeaturedProducts() {
			try {
				this.productsLoading = true;
				const response = await api.get('/products?limit=8');
				if (response.data.success) {
					this.products = response.data.products;
				}
			} catch (error) {
				console.error('Error fetching products:', error);
				this.$toast.error('Unable to load featured products');
			} finally {
				this.productsLoading = false;
			}
		},
		addToCart(product) {
			this.addToCartAction({ product, quantity: 1 });
			this.$toast.success(`Added ${product.title} to cart!`);
		}
	},
	mounted() {
		this.fetchFeaturedProducts();

		// Initialize Bootstrap carousel
		if (typeof window !== 'undefined' && window.jQuery) {
			window.jQuery('#homeCarousel').carousel({
				interval: 3000
			});
		}
	}
};
</script>

<style scoped>

/* Home.vue */
.hero-section {
	margin-top: -20px;
	margin-bottom: 4rem;
}

.carousel-item {
	height: 500px;
	position: relative;
}

.carousel-item img {
	object-fit: cover;
	height: 100%;
	filter: brightness(0.85);
}

.carousel-caption {
	z-index: 2;
	top: 50%;
	/* transform: translateY(-50%); */
	bottom: auto;
	/* background: rgba(0, 0, 0, 0.4); */
	padding: 2rem;
	border-radius: 12px;
	max-width: 600px;
	margin: 0 auto;
	/* backdrop-filter: blur(5px); */
}

.carousel-caption h1 {
	font-size: 2.5rem;
	font-weight: 800;
	margin-bottom: 1rem;
	color: white;
	text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.carousel-caption p {
	font-size: 1.2rem;
	margin-bottom: 1.5rem;
}

.carousel-caption .btn-primary {
	border-radius: 30px;
	padding: 10px 25px;
	font-size: 1.1rem;
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.featured-categories {
	padding: 3rem 0;
}

.category-card {
	padding: 2rem;
	text-align: center;
	border-radius: 12px;
	background: white;
	height: 100%;
}

.category-icon i {
	font-size: 3rem;
	color: #4361ee;
	margin-bottom: 1.5rem;
	display: inline-block;
	transition: transform 0.3s;
}

.category-card:hover .category-icon i {
	transform: scale(1.2) rotate(10deg);
}

.category-card h5 {
	font-size: 1.4rem;
	margin-bottom: 1rem;
	font-weight: 700;
}

.product-card {
	overflow: hidden;
	border-radius: 12px;
}

.product-card img {
	transition: transform 0.5s;
}

.product-card:hover img {
	transform: scale(1.05);
}

.product-price {
	display: flex;
	flex-direction: column;
	margin: 15px 0;
}

.original-price {
	text-decoration: line-through;
	color: #777;
	font-size: 0.9rem;
}

.current-price {
	font-weight: 800;
	color: #f72585;
	font-size: 1.3rem;
}

.why-choose-us {
	background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	padding: 5rem 0;
	margin: 5rem 0;
	border-radius: 30px;
}

.feature-icon i {
	font-size: 3.5rem;
	color: #4361ee;
	/* background: white; */
	padding: 20px;
	border-radius: 50%;
	/* margin-bottom: 1.5rem; */
	/* box-shadow: 0 10px 30px rgba(67, 97, 238, 0.1); */
	/* transition: all 0.3s; */
}

/* .feature:hover .feature-icon i {
	transform: translateY(-10px);
	box-shadow: 0 15px 30px rgba(67, 97, 238, 0.2);
} */

.feature h5 {
	font-size: 1.3rem;
	margin-bottom: 1rem;
	color: #2d3748;
}
</style>