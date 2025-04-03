<template>
	<div class="card h-100 product-card">
		<router-link :to="`/products/${product._id}`">
			<img :src="formatImageUrl(product.image)" class="card-img-top" :alt="product.title">
		</router-link>
		
		<!-- Rating badge -->
		<div class="product-rating-badge">
			<span>{{ displayRating }} <i class="star icon"></i></span>
			<span class="review-count" v-if="reviewCount > 0">({{ reviewCount }})</span>
		</div>
		
		<div class="card-body d-flex flex-column">
			<router-link :to="`/products/${product._id}`" class="text-decoration-none">
				<h5 class="card-title">{{ product.title }}</h5>
			</router-link>
			
			<p class="card-text flex-grow-1">{{ truncateText(product.description, 100) }}</p>
			
			<div class="product-price mb-2">
				<span v-if="product.discountPrice > 0" class="original-price">{{ formatCurrency(product.price) }}</span>
				<span class="current-price">{{ formatCurrency(product.discountPrice > 0 ? product.discountPrice : product.price) }}</span>
			</div>
			
			<div class="product-stock text-muted small mb-2 d-flex justify-content-between">
				<span v-if="product.availableStock > 0">
					<i class="check circle icon text-success"></i>	{{ product.availableStock }} in stock
				</span>
				<span v-else class="text-danger">
					<i class="times circle icon"></i> Out of stock
				</span>
				
				<!-- Sold count -->
				<span v-if="product.sold" class="product-sold">
					{{ product.sold }} sold
				</span>
			</div>
			
			<div class="d-flex justify-content-between">
				<router-link :to="`/products/${product._id}`" class="btn btn-outline-primary btn-sm">
					<i class="info circle icon"></i> Details
				</router-link>
				<button 
					class="btn btn-primary btn-sm" 
					@click="addToCart"
					:disabled="product.availableStock <= 0"
				>
					<i class="shopping cart icon"></i> Add to cart
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import { formatCurrency, truncateText, formatImageUrl } from '@/utils/helpers';

export default {
	name: 'ProductCard',
	props: {
		product: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			reviews: [],
			isLoadingReviews: false
		}
	},
	computed: {
		displayRating() {
			try {
				if (this.product.rating) {
					return parseFloat(this.product.rating).toFixed(1);
				}
				
				if (this.product.reviews && this.product.reviews.length > 0) {
					const totalRating = this.product.reviews.reduce((sum, review) => sum + review.rating, 0);
					const averageRating = totalRating / this.product.reviews.length;
					return averageRating.toFixed(1);
				}
				
				if (this.reviews.length > 0) {
					const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
					const averageRating = totalRating / this.reviews.length;
					return averageRating.toFixed(1);
				}
				
				return '0.0';
			} catch (error) {
				console.error('Error calculating rating:', error);
				return '0.0';
			}
		},
		reviewCount() {
			if (this.product.reviews) {
				return this.product.reviews.length;
			}
			return this.reviews.length;
		}
	},
	methods: {
		// Mapping the addToCart action from Vuex store
		...mapActions({
			addToCartAction: 'cart/addToCart'
		}),
		// Formatting the currency and truncating text
		formatCurrency,
		truncateText,
		formatImageUrl,
		// Method to add product to the cart
		addToCart() {
			if (this.product.availableStock <= 0) {
				return;
			}
			
			this.addToCartAction({ product: this.product, quantity: 1 });
			this.$toast.success(`Added ${this.product.title} to cart!`);
		},
		// Fetch reviews from API if needed
		async fetchReviews() {
			if (this.product.reviews) {
				return;
			}
			
			try {
				this.isLoadingReviews = true;
				const response = await this.$api.get(`/reviews/product/${this.product._id}`);
				if (response.data.success) {
					this.reviews = response.data.reviews;
				}
			} catch (error) {
				console.error('Error fetching reviews:', error);
			} finally {
				this.isLoadingReviews = false;
			}
		}
	},
	mounted() {
		if (!this.product.reviews) {
			this.fetchReviews();
		}
	}
}
</script>

<style scoped>
.product-card {
	height: 100%;
	border: none;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 5px 15px rgba(0,0,0,0.05);
	transition: all 0.4s ease;
	position: relative;
}

.product-card:hover {
	transform: translateY(-10px);
	box-shadow: 0 20px 30px rgba(0,0,0,0.1);
}

.card-img-top {
	height: 220px;
	object-fit: cover;
	transition: transform 0.5s;
}

.product-card:hover .card-img-top {
	transform: scale(1.1);
}

.card-title {
	font-size: 1.2rem;
	font-weight: 700;
	margin-bottom: 0.5rem;
	transition: color 0.3s;
	height: 2.5rem;
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.product-card:hover .card-title {
	color: #4361ee;
}

.card-text {
	color: #6c757d;
	margin-bottom: 1rem;
	height: 4.5rem;
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
}

.product-price {
	margin-bottom: 1rem;
}

.original-price {
	text-decoration: line-through;
	color: #6c757d;
	font-size: 0.9rem;
}

.current-price {
	font-weight: 800;
	color: #f72585;
	font-size: 1.3rem;
}

.product-rating-badge {
	position: absolute;
	top: 10px;
	right: 10px;
	background-color: rgba(0, 0, 0, 0.7);
	color: #ffd700;
	padding: 5px 10px;
	border-radius: 20px;
	font-weight: 700;
	font-size: 0.9rem;
	z-index: 999;
	backdrop-filter: blur(5px);
	display: flex;
	align-items: center;
	box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.product-rating-badge .icon {
	margin-left: 4px;
	color: #ffd700;
}

.product-rating-badge .review-count {
	font-size: 0.75rem;
	opacity: 0.9;
	margin-left: 3px;
	color: #fff;
}

.product-rating-badge:hover {
	transform: scale(1.1);
	background-color: rgba(0, 0, 0, 0.8);
	transition: all 0.3s ease;
}

.product-stock {
	font-size: 0.85rem;
	margin-bottom: 1rem;
}

.text-success .icon {
	animation: pulse 1.5s infinite;
}

@keyframes pulse {
	0% {
		opacity: 0.7;
	}
	50% {
		opacity: 1;
	}
	100% {
		opacity: 0.7;
	}
}

.product-sold {
    color: #6c757d;
    font-size: 0.85rem;
    font-weight: 600;
}

.btn-outline-primary {
	border-color: #4361ee;
	color: #4361ee;
	border-radius: 6px;
	padding: 0.4rem 0.75rem;
	transition: all 0.3s;
	font-weight: 600;
}

.btn-outline-primary:hover {
	background-color: #4361ee;
	color: white;
	transform: translateY(-2px);
	box-shadow: 0 5px 15px rgba(67, 97, 238, 0.2);
}

.btn-primary {
	background-color: #4361ee;
	border-color: #4361ee;
	border-radius: 6px;
	padding: 0.4rem 0.75rem;
	transition: all 0.3s;
	font-weight: 600;
}

.btn-primary:hover {
	background-color: #3a56d4;
	border-color: #3a56d4;
	transform: translateY(-2px);
	box-shadow: 0 5px 15px rgba(67, 97, 238, 0.2);
}

.btn-primary:disabled {
	background-color: #c8d0fa;
	border-color: #c8d0fa;
	box-shadow: none;
	cursor: not-allowed;
}
</style>