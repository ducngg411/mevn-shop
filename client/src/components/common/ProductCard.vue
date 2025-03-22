<template>
	<div class="card h-100 product-card">
		<router-link :to="`/products/${product._id}`">
			<img :src="formatImageUrl(product.image)" class="card-img-top" :alt="product.title">
		</router-link>
		
		<!-- Rating badge -->
		<div class="product-rating-badge" v-if="product.rating">
			<span>{{ product.rating.toFixed(1) }} <i class="star icon"></i></span>
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
					<i class="check circle icon text-success"></i>  {{ product.availableStock }} in stock
				</span>
				<span v-else class="text-danger">
					<i class="times circle icon"></i> Out of stock
				</span>
				
				<!-- Sold count -->
				<span v-if="product.soldCount" class="product-sold">
					{{ product.soldCount }} sold
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
		}
	}
}
</script>

<style scoped>
.product-card {
	transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.card-img-top {
	height: 180px;
	object-fit: cover;
}

.card-title {
	color: #333;
	transition: color 0.3s;
}

a:hover .card-title {
	color: #3498db;
}

.product-price {
	display: flex;
	flex-direction: column;
}

.original-price {
	text-decoration: line-through;
	color: #777;
	font-size: 0.9rem;
}

.current-price {
	font-weight: bold;
	color: #e74c3c;
	font-size: 1.1rem;
}

.btn-outline-primary {
	border-color: #3498db;
	color: #3498db;
}

.btn-outline-primary:hover {
	background-color: #3498db;
	color: white;
}

.btn-primary {
	background-color: #3498db;
	border-color: #3498db;
}

.btn-primary:hover {
	background-color: #2980b9;
	border-color: #2980b9;
}

.product-rating-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #ffd700;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.product-rating-badge .icon {
  margin-left: 2px;
  font-size: 0.8rem;
}

.product-sold {
  color: #777;
  font-size: 0.85rem;
}
</style>
