<template>
    <div class="product-detail">
        <div class="container">
            <!-- Breadcrumb -->
            <nav aria-label="breadcrumb" class="mb-4">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
                    <li class="breadcrumb-item"><router-link to="/products">Shop</router-link></li>
                    <li class="breadcrumb-item active" aria-current="page">{{ product.title || 'Product Details' }}</li>
                </ol>
            </nav>
            
            <div v-if="loading" class="text-center py-5">
                <div class="ui active centered inline loader"></div>
                <p class="mt-3">Loading product details...</p>
            </div>
            
            <div v-else-if="error" class="alert alert-danger">
                {{ error }}
            </div>
            
            <div v-else class="page-content">
                <div class="row">
                    <!-- Product Image -->
                    <div class="col-md-5 mb-4">
                        <div class="product-image">
                            <!-- <img :src="product.image || 'https://picsum.photos/600/400'" alt="Product" class="img-fluid rounded"> -->
                            <img :src="formatImageUrl(product.image)" class="card-img-top border" :alt="product.title">
                        </div>
                    </div>
                    
                    <!-- Product Info -->
                    <div class="col-md-7">
                        <h1 class="product-title mb-3">{{ product.title }}</h1>
                        
                        <div class="product-meta mb-3">
                            <span class="badge badge-primary mr-2">{{ product.category }}</span>
                            <span class="text-muted">
                                <i class="clock outline icon"></i> Updated: {{ formatDate(product.updatedAt) }}
                            </span>
                        </div>
                        
                        <div class="product-price mb-4">
                            <span v-if="product.discountPrice > 0" class="original-price">{{ formatCurrency(product.price) }}</span>
                            <span class="current-price">{{ formatCurrency(product.discountPrice > 0 ? product.discountPrice : product.price) }}</span>
                        </div>
                        
                        <div class="product-stock mb-4">
                            <div v-if="product.availableStock > 0" class="text-success">
                                <i class="check circle icon"></i> {{ product.availableStock }} accounts available
                            </div>
                            <div v-else class="text-danger">
                                <i class="times circle icon"></i> Out of stock
                            </div>
                        </div>
                        
                        <div class="product-actions mb-4">
                            <div class="quantity-selector mb-3">
                                <label for="quantity">Quantity:</label>
                                <div class="input-group" style="width: 150px;">
                                    <div class="input-group-prepend">
                                        <button class="btn btn-outline-secondary" type="button" @click="decreaseQuantity" :disabled="quantity <= 1">
                                            <i class="minus icon"></i>
                                        </button>
                                    </div>
                                    <input type="number" id="quantity" class="form-control text-center" v-model.number="quantity" min="1" :max="product.availableStock" :disabled="product.availableStock <= 0">
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-secondary" type="button" @click="increaseQuantity" :disabled="quantity >= product.availableStock">
                                            <i class="plus icon"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <button class="btn btn-primary btn-lg mr-2" @click="addToCart" :disabled="product.availableStock <= 0">
                                <i class="shopping cart icon"></i> Add to Cart
                            </button>
                            
                            <button class="btn btn-success btn-lg" @click="buyNow" :disabled="product.availableStock <= 0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="17.5" height="17.5" fill="currentColor" class="bi bi-credit-card-fill" viewBox="0 0 16 16">
  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0zm0 3v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zm3 2h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1"/>
</svg> Buy Now
                            </button>
                        </div>
                    </div>
                </div>
                
                <hr class="my-4">
                
                <!-- Product Info Tabs -->
                <ul class="nav nav-tabs" id="productTabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <a class="nav-link active" id="description-tab" data-toggle="tab" href="#description" role="tab" aria-controls="description" aria-selected="true">Description</a>
                    </li>
                    <li class="nav-item" role="presentation">
                        <a class="nav-link" id="reviews-tab" data-toggle="tab" href="#reviews" role="tab" aria-controls="reviews" aria-selected="false">Reviews ({{ reviews.length }})</a>
                    </li>
                </ul>
                
                <div class="tab-content p-4" id="productTabsContent">
                    <!-- Description Tab -->
                    <div class="tab-pane fade show active" id="description" role="tabpanel" aria-labelledby="description-tab">
                        <div class="product-description">
                            <h4>Details</h4>
                            <p>{{ product.description }}</p>
                        </div>
                    </div>
                    
                    <!-- Reviews Tab -->
                    <div class="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
                        <div class="product-reviews">
                            <h4>Customer Reviews</h4>
                            
                            <div v-if="loadingReviews" class="text-center py-3">
                                <div class="ui active centered inline loader"></div>
                                <p class="mt-2">Loading reviews...</p>
                            </div>
                            
                            <div v-else-if="reviews.length === 0" class="text-center py-3">
                                <p>No reviews for this product yet.</p>
                            </div>
                            
                            <div v-else>
                                <div v-for="review in reviews" :key="review._id" class="review-item mb-4">
                                    <div class="d-flex align-items-center mb-2">
                                        <div class="review-avatar mr-3">
                                            <i class="large user circle icon"></i>
                                        </div>
                                        <div>
                                            <h5 class="mb-0">{{ review.user.fullName || review.user.username }}</h5>
                                            <div class="review-date text-muted small">
                                                <i class="calendar alternate outline icon"></i> {{ formatDate(review.createdAt) }}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="review-rating mb-2">
                                        <i v-for="i in 5" :key="i" class="star icon" :class="{ 'text-warning': i <= review.rating, 'text-muted': i > review.rating }"></i>
                                    </div>
                                    
                                    <div class="review-content">
                                        <p>{{ review.comment }}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <hr>
                            
                            <!-- Review Form -->
                            <div v-if="isAuthenticated">
                                <h5>Submit your review</h5>
                                <form @submit.prevent="submitReview">
                                    <div class="form-group">
                                        <label>Rating:</label>
                                        <div class="rating-selector mb-2">
                                            <i 
                                                v-for="i in 5" 
                                                :key="i" 
                                                class="star icon" 
                                                :class="{ 'text-warning': i <= newReview.rating }"
                                                @click="newReview.rating = i"
                                                style="cursor: pointer;"
                                            ></i>
                                        </div>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="reviewComment">Comment:</label>
                                        <textarea 
                                            id="reviewComment" 
                                            class="form-control" 
                                            rows="3" 
                                            v-model="newReview.comment"
                                            :class="{ 'is-invalid': reviewSubmitted && !newReview.comment }"
                                            required
                                        ></textarea>
                                        <div v-if="reviewSubmitted && !newReview.comment" class="invalid-feedback">
                                            Please enter a comment.
                                        </div>
                                    </div>
                                    
                                    <button type="submit" class="btn btn-primary" :disabled="submittingReview">
                                        <span v-if="submittingReview">
                                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Sending...
                                        </span>
                                        <span v-else>
                                            <i class="paper plane icon"></i> Submit Review
                                        </span>
                                    </button>
                                </form>
                            </div>
                            
                            <div v-else class="alert alert-info mt-3">
                                <i class="info circle icon"></i> Please <router-link to="/login">log in</router-link> to leave a review.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Related Products -->
            <div v-if="relatedProducts.length > 0" class="related-products mt-5">
                <h3 class="mb-4">Related Products</h3>
                
                <div class="row">
                    <div v-for="product in relatedProducts" :key="product._id" class="col-md-3 mb-4">
                        <product-card :product="product"></product-card>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import api from '@/utils/api';
import ProductCard from '@/components/common/ProductCard.vue';
import { formatCurrency, formatDate, formatImageUrl } from '@/utils/helpers';

export default {
    name: 'ProductDetail',
    components: {
        ProductCard
    },
    data() {
        return {
            product: {},
            relatedProducts: [],
            reviews: [],
            loading: true,
            loadingReviews: true,
            error: null,
            quantity: 1,
            newReview: {
                rating: 5,
                comment: ''
            },
            reviewSubmitted: false,
            submittingReview: false
        }
    },
    computed: {
        ...mapGetters({
            isAuthenticated: 'auth/isAuthenticated'
        }),
        productId() {
            return this.$route.params.id;
        }
    },
    methods: {
        ...mapActions({
            addToCartAction: 'cart/addToCart'
        }),
        formatCurrency,
        formatDate,
        formatImageUrl,
        async fetchProduct() {
            try {
                this.loading = true;
                this.error = null;
                
                const response = await api.get(`/products/${this.productId}`);
                
                if (response.data.success) {
                    this.product = response.data.product;
                    this.fetchRelatedProducts();
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                this.error = error.response?.data?.message || 'Unable to load product details';
            } finally {
                this.loading = false;
            }
        },
        async fetchReviews() {
            try {
                this.loadingReviews = true;
                
                const response = await api.get(`/reviews/product/${this.productId}`);
                
                if (response.data.success) {
                    this.reviews = response.data.reviews;
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                this.loadingReviews = false;
            }
        },
        async fetchRelatedProducts() {
            try {
                if (!this.product.category) return;
                
                const response = await api.get(`/products?category=${this.product.category}&limit=4`);
                
                if (response.data.success) {
                    // Filter out the current product
                    this.relatedProducts = response.data.products.filter(p => p._id !== this.productId).slice(0, 4);
                }
            } catch (error) {
                console.error('Error fetching related products:', error);
            }
        },
        async submitReview() {
            this.reviewSubmitted = true;
            
            if (!this.newReview.rating || !this.newReview.comment) {
                return;
            }
            
            try {
                this.submittingReview = true;
                
                const response = await api.post('/reviews', {
                    product: this.productId,
                    rating: this.newReview.rating,
                    comment: this.newReview.comment
                });
                
                if (response.data.success) {
                    this.$flash.success('Your review has been successfully submitted!');
                    
                    // Reset form
                    this.newReview = {
                        rating: 5,
                        comment: ''
                    };
                    this.reviewSubmitted = false;
                    
                    // Reload reviews
                    this.fetchReviews();
                }
            } catch (error) {
                console.error('Error submitting review:', error);
                this.$flash.error(error.response?.data?.message || 'Unable to submit review');
            } finally {
                this.submittingReview = false;
            }
        },
        increaseQuantity() {
            if (this.quantity < this.product.availableStock) {
                this.quantity++;
            }
        },
        decreaseQuantity() {
            if (this.quantity > 1) {
                this.quantity--;
            }
        },
        addToCart() {
            if (this.product.availableStock <= 0) {
                return;
            }
            
            this.addToCartAction({
                product: this.product,
                quantity: this.quantity
            });
            
            this.$flash.success(`Added ${this.quantity} account(s) of ${this.product.title} to the cart!`);
        },
        buyNow() {
            this.addToCart();
            this.$router.push('/cart');
        }
    },
    created() {
        this.fetchProduct();
        this.fetchReviews();
    },
    mounted() {
        // Handle tabs (if using standard Bootstrap)
        if (typeof window !== 'undefined' && window.jQuery) {
            window.jQuery('#productTabs a').on('click', function (e) {
                e.preventDefault();
                window.jQuery(this).tab('show');
            });
        }
    },
    watch: {
        productId(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.fetchProduct();
                this.fetchReviews();
            }
        }
    }
}
</script>

<style scoped>
.product-detail {
    padding-bottom: 40px;
}

.page-content {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.05);
    padding: 20px;
}

.product-title {
    font-size: 2rem;
    color: #333;
}

.product-price {
    display: flex;
    flex-direction: column;
}

.original-price {
    text-decoration: line-through;
    color: #777;
    font-size: 1rem;
}

.current-price {
    font-weight: bold;
    color: #e74c3c;
    font-size: 1.8rem;
}

.review-item {
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
}

.review-item:last-child {
    border-bottom: none;
}

.review-avatar i {
    color: #ccc;
}

.review-rating i {
    font-size: 1.2rem;
}

.rating-selector i {
    font-size: 1.5rem;
    cursor: pointer;
}

.rating-selector i:hover {
    color: #f1c40f;
}

.review-content p {
    font-size: 1.1rem;
}

.btn-primary {
    background-color: #3498db;
    border-color: #3498db;
}

.btn-primary:hover {
    background-color: #2980b9;
    border-color: #2980b9;
}

.btn-outline-secondary {
    border-color: #ccc;
    color: #333;
}

.btn-outline-secondary:hover {
    background-color: #f8f9fa;
    border-color: #ccc;
    color: #333;
}

.btn-success {
    background-color: #2ecc71;
    border-color: #2ecc71;
}

.btn-success:hover {
    background-color: #27ae60;
    border-color: #27ae60;
}

.quantity-selector {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
}

.quantity-selector label {
    margin-bottom: 0;
}

.quantity-selector input {
    max-width: 60px;
    text-align: center;
}

.related-products h3 {
    font-size: 1.8rem;
    color: #333;
}

.related-products .product-card {
    transition: transform 0.3s, box-shadow 0.3s;
}

.related-products .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.related-products .card-img-top {
    height: 180px;
    object-fit: cover;
}

.related-products .card-title {
    color: #333;
    transition: color 0.3s;
}

.related-products a:hover .card-title {
    color: #3498db;
}

.related-products .product-price {
    display: flex;
    flex-direction: column;
}

.related-products .original-price {
    text-decoration: line-through;
    color: #777;
    font-size: 0.9rem;
}

.related-products .current-price {
    font-weight: bold;
    color: #e74c3c;
    font-size: 1.1rem;
}

.related-products .btn-outline-primary {
    border-color: #3498db;
    color: #3498db;
}

.related-products .btn-outline-primary:hover {
    background-color: #3498db;
    color: white;
}

.related-products .btn-primary {
    background-color: #3498db;
    border-color: #3498db;
}

.related-products .btn-primary:hover {
    background-color: #2980b9;
    border-color: #2980b9;
}

.related-products .card {
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
}

.related-products .card:hover {
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transform: translateY(-2px);
}

.bi-credit-card-fill {
    margin-right: 5px;
    margin-bottom: 3px;
}

</style>