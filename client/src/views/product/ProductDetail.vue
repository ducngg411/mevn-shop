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

                        <div class="product-meta mb-5">
                            <span class="product-rating ml-3 mr-3">
                                <i v-for="i in 5" :key="i" class="star icon" :class="{ 'text-warning': i <= averageRating }"></i>
                                <span class="rating-count" v-if="reviews.length > 0">({{ reviews.length }} reviews)</span>
                            </span>
                            <span class="product-sold-count" v-if="product.sold">
                                <i class="shopping bag icon"></i> {{ product.sold }} sold
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
                    this.$toast.success('Your review has been successfully submitted!');
                    
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
                this.$toast.error(error.response?.data?.message || 'Unable to submit review');
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
            
            this.$toast.success(`Added ${this.quantity} account(s) of ${this.product.title} to the cart!`);
        },
        buyNow() {
            this.addToCart();
            this.$router.push('/cart');
        },
        averageRating() {
        try {
            if (this.product.rating) {
                return parseFloat(this.product.rating);
            }
            
            if (this.reviews && this.reviews.length > 0) {
                const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
                return Math.round((totalRating / this.reviews.length) * 10) / 10;
            }
            
            return 0;
        } catch (error) {
            console.error('Error calculating rating:', error);
            return 0;
        }
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
    padding-bottom: 4rem;
}

.breadcrumb {
    background: transparent;
    padding: 1rem 0;
}

.breadcrumb-item + .breadcrumb-item::before {
    content: "›";
    font-size: 1.2rem;
}

.breadcrumb-item a {
    color: #4361ee;
    font-weight: 500;
}

.product-image {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.product-image img {
    width: 100%;
    transition: transform 0.5s;
}

.product-image:hover img {
    transform: scale(1.05);
}

.product-title {
    font-size: 2.2rem;
    font-weight: 800;
    margin-bottom: 1rem;
    color: #2d3748;
}

.product-meta {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
}

.badge-primary {
    background-color: #4361ee;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    border-radius: 20px;
}

.product-price {
    margin-bottom: 2rem;
}

.original-price {
    text-decoration: line-through;
    color: #6c757d;
    font-size: 1.1rem;
    display: block;
}

.current-price {
    font-weight: 800;
    color: #f72585;
    font-size: 2rem;
}

.product-stock {
    margin-bottom: 2rem;
    font-size: 1rem;
}

.text-success {
    font-weight: 600;
}

.quantity-selector {
    margin-bottom: 2rem;
}

.quantity-selector label {
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.input-group {
    width: 150px;
    border-radius: 8px;
    overflow: hidden;
}

.btn-lg {
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 8px;
}

.btn-success {
    background: linear-gradient(135deg, #4cc9f0, #4361ee);
    border: none;
    transition: all 0.3s;
}

.btn-success:hover {
    background: linear-gradient(135deg, #3db8df, #3a56d4);
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(76, 201, 240, 0.3);
}

.nav-tabs {
    border-bottom: 2px solid #e9ecef;
    margin-bottom: 2rem;
}

.nav-tabs .nav-link {
    border: none;
    padding: 1rem 2rem;
    font-weight: 600;
    color: #6c757d;
    position: relative;
}

.nav-tabs .nav-link.active {
    color: #4361ee;
    background: transparent;
}

.nav-tabs .nav-link:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 3px;
    background-color: #4361ee;
    opacity: 0;
    transition: opacity 0.3s;
}

.nav-tabs .nav-link.active:after {
    opacity: 1;
}

.tab-content {
    padding: 2rem;
    background: white;
    border-radius: 0 0 12px 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.product-description h4,
.product-reviews h4 {
    margin-bottom: 1.5rem;
    color: #2d3748;
}

.review-item {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    box-shadow: 0 5px 15px rgba(0,0,0,0.03);
    transition: transform 0.3s;
}

.review-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.review-avatar i {
    font-size: 2.5rem;
    color: #6c757d;
}

.review-author h5 {
    font-size: 1.1rem;
    margin-bottom: 0.2rem;
}

.review-date {
    font-size: 0.85rem;
}

.star.icon {
    color: #ccc;
    font-size: 1.2rem;
}

.star.icon.text-warning {
    color: #ffc107;
}

.rating-selector i {
    font-size: 2rem;
    cursor: pointer;
    margin-right: 0.5rem;
}

.rating-selector i:hover {
    transform: scale(1.2);
}

.related-products {
    padding: 3rem 0;
}

.related-products h3 {
    font-weight: 800;
    margin-bottom: 2rem;
    font-size: 1.8rem;
    position: relative;
}

.related-products h3:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 50px;
    height: 4px;
    background: #4361ee;
    border-radius: 2px;
}


</style>