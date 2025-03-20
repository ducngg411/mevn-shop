<template>
    <div class="cart">
        <div class="container">
            <h1 class="mb-4">Shopping Cart</h1>
            
            <div v-if="cartItems.length === 0" class="empty-cart text-center py-5 mb-4 page-content">
                <i class="huge shopping cart icon text-muted"></i>
                <h3 class="mt-3">Your cart is empty</h3>
                <p class="text-muted mb-4">You have not added any products to your cart</p>
                <router-link to="/products" class="btn btn-primary">
                    <i class="shopping bag icon"></i> Continue shopping
                </router-link>
            </div>
            
            <div v-else class="row">
                <!-- Product list in the cart -->
                <div class="col-md-8">
                    <div class="page-content mb-4">
                        <h4 class="mb-3">Products in Cart</h4>
                        
                        <div class="cart-items">
                            <div v-for="(item, index) in cartItems" :key="index" class="cart-item mb-3 pb-3 border-bottom">
                                <div class="row align-items-center">
                                    <div class="col-md-2 mb-2 mb-md-0">
                                        <!-- <img :src="item.image || 'https://picsum.photos/100/100'" :alt="item.title" class="img-fluid"> -->
                                        <img :src="formatImageUrl(item.image)" class="img-fluid" :alt="item.title">
                                    </div>
                                    <div class="col-md-4 mb-2 mb-md-0">
                                        <h5 class="mb-1">{{ item.title }}</h5>
                                        <p class="mb-0 text-muted">Price: {{ formatCurrency(item.price) }}</p>
                                    </div>
                                    <div class="col-md-3 mb-2 mb-md-0">
                                        <div class="quantity-selector">
                                            <div class="input-group">
                                                <div class="input-group-prepend">
                                                    <button class="btn btn-outline-secondary" type="button" @click="decreaseQuantity(index)" :disabled="item.quantity <= 1">
                                                        <i class="minus icon"></i>
                                                    </button>
                                                </div>
                                                <input 
                                                    type="number" 
                                                    class="form-control text-center" 
                                                    v-model.number="item.quantity"
                                                    @change="updateQuantity(index, item.quantity)"
                                                    min="1"
                                                >
                                                <div class="input-group-append">
                                                    <button class="btn btn-outline-secondary" type="button" @click="increaseQuantity(index)">
                                                        <i class="plus icon"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-2 mb-2 mb-md-0 text-md-right">
                                        <span class="item-subtotal">{{ formatCurrency(item.price * item.quantity) }}</span>
                                    </div>
                                    <div class="col-md-1 text-right">
                                        <button class="btn btn-sm btn-outline-danger" @click="removeItem(index)">
                                            <i class="trash alternate icon"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="cart-actions d-flex justify-content-between mt-4">
                            <router-link to="/products" class="btn btn-outline-primary">
                                <i class="arrow left icon"></i> Continue shopping
                            </router-link>
                            <button class="btn btn-outline-danger" @click="showClearCartConfirm = true">
                                <i class="trash alternate icon"></i> Clear Cart
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Order Summary -->
                <div class="col-md-4">
                    <div class="page-content mb-4">
                        <h4 class="mb-3">Order Summary</h4>
                        
                        <div class="order-summary">
                            <div class="d-flex justify-content-between mb-2">
                                <span>Subtotal:</span>
                                <span>{{ formatCurrency(cartTotal) }}</span>
                            </div>
                            
                            <!-- Voucher -->
                            <div class="voucher-section mb-3">
                                <div class="input-group">
                                    <input type="text" class="form-control" placeholder="Enter discount code" v-model="voucherCode">
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-primary" type="button" @click="applyVoucher" :disabled="!voucherCode">
                                            <span v-if="checkingVoucher">
                                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            </span>
                                            <span v-else>Apply</span>
                                        </button>
                                    </div>
                                </div>
                                <div v-if="voucher" class="mt-2 text-success">
                                    <i class="check circle icon"></i> Discount code applied: {{ voucher.code }}
                                    <button class="btn btn-sm btn-link text-danger p-0 ml-2" @click="removeVoucher">
                                        <i class="times icon"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div v-if="voucher" class="d-flex justify-content-between mb-2">
                                <span>Discount:</span>
                                <span class="text-danger">-{{ formatCurrency(discountAmount) }}</span>
                            </div>
                            
                            <hr>
                            
                            <div class="d-flex justify-content-between mb-4">
                                <span class="font-weight-bold">Total:</span>
                                <span class="font-weight-bold h5 mb-0">{{ formatCurrency(finalTotal) }}</span>
                            </div>
                            
                            <button 
                                class="btn btn-success btn-block" 
                                @click="proceedToCheckout"
                                :disabled="cartItems.length === 0"
                            >
                                <!-- <i class="credit card icon"></i>  -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-credit-card icon" viewBox="0 0 16 16">
  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
  <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
</svg>
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Confirm Clear Cart Modal -->
        <div v-if="showClearCartConfirm" class="confirm-modal">
            <div class="confirm-modal-overlay" @click="showClearCartConfirm = false"></div>
            <div class="confirm-modal-content card">
                <div class="card-header">
                    <h5 class="mb-0">Confirmation</h5>
                </div>
                <div class="card-body">
                    <p>Are you sure you want to clear all items from your cart?</p>
                </div>
                <div class="card-footer d-flex justify-content-end">
                    <button class="btn btn-secondary mr-2" @click="showClearCartConfirm = false">Cancel</button>
                    <button class="btn btn-danger" @click="clearCart">Clear Cart</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { formatCurrency, formatImageUrl } from '@/utils/helpers';
import api from '@/utils/api';

export default {
    name: 'Cart',
    data() {
        return {
            showClearCartConfirm: false,
            voucherCode: '',
            voucher: null,
            discountAmount: 0,
            checkingVoucher: false
        }
    },
    computed: {
        ...mapGetters({
            cartItems: 'cart/cartItems',
            cartTotal: 'cart/cartTotal',
            isAuthenticated: 'auth/isAuthenticated'
        }),
        finalTotal() {
            return Math.max(0, this.cartTotal - this.discountAmount);
        }
    },
    methods: {
        ...mapActions({
            updateCartItemQuantity: 'cart/updateCartItemQuantity',
            removeFromCart: 'cart/removeFromCart',
            clearCartAction: 'cart/clearCart'
        }),
        formatCurrency,
        formatImageUrl,
        increaseQuantity(index) {
            const item = this.cartItems[index];
            this.updateCartItemQuantity({
                product: item.product,
                quantity: item.quantity + 1
            });
        },
        decreaseQuantity(index) {
            const item = this.cartItems[index];
            if (item.quantity > 1) {
                this.updateCartItemQuantity({
                    product: item.product,
                    quantity: item.quantity - 1
                });
            }
        },
        updateQuantity(index, quantity) {
            const item = this.cartItems[index];
            // Ensure quantity is not less than 1
            const newQuantity = Math.max(1, parseInt(quantity) || 1);
            
            this.updateCartItemQuantity({
                product: item.product,
                quantity: newQuantity
            });
        },
        removeItem(index) {
            const item = this.cartItems[index];
            this.removeFromCart(item.product);
            this.$flash.success('Product removed from cart');
        },
        clearCart() {
            this.clearCartAction();
            this.showClearCartConfirm = false;
            this.voucher = null;
            this.discountAmount = 0;
            this.voucherCode = '';
            this.$flash.success('All items cleared from cart');
        },
        async applyVoucher() {
            if (!this.voucherCode) return;
            
            try {
                this.checkingVoucher = true;
                
                const response = await api.post('/vouchers/validate', {
                    code: this.voucherCode,
                    totalAmount: this.cartTotal
                });
                
                if (response.data.success) {
                    this.voucher = response.data.voucher;
                    this.discountAmount = response.data.discountAmount;
                    this.$flash.success('Discount code applied successfully!');
                }
            } catch (error) {
                console.error('Error applying voucher:', error);
                this.$flash.error(error.response?.data?.message || 'Unable to apply discount code');
            } finally {
                this.checkingVoucher = false;
            }
        },
        removeVoucher() {
            this.voucher = null;
            this.discountAmount = 0;
            this.voucherCode = '';
            this.$flash.info('Discount code removed');
        },
        proceedToCheckout() {
            if (!this.isAuthenticated) {
                this.$router.push({ path: '/login', query: { redirect: '/checkout' } });
                return;
            }
            
            if (this.cartItems.length === 0) {
                this.$flash.error('Your cart is empty, cannot proceed to checkout');
                return;
            }
            
            // Save voucher information in localStorage
            if (this.voucher) {
                localStorage.setItem('checkoutVoucher', JSON.stringify({
                    code: this.voucher.code,
                    discountAmount: this.discountAmount
                }));
            } else {
                localStorage.removeItem('checkoutVoucher');
            }
            
            this.$router.push('/checkout');
        }
    },
    created() {
        // Restore voucher information if any (when returning from checkout page)
        const savedVoucher = localStorage.getItem('checkoutVoucher');
        if (savedVoucher) {
            try {
                const voucherData = JSON.parse(savedVoucher);
                this.voucherCode = voucherData.code;
                this.applyVoucher();
            } catch (error) {
                console.error('Error parsing saved voucher:', error);
            }
        }
    }
}
</script>

<style scoped>
.cart-item {
    position: relative;
}

.cart-item:last-child {
    border-bottom: none !important;
}

.quantity-selector input {
    max-width: 60px;
}

.item-subtotal {
    font-weight: bold;
    color: #333;
}

.confirm-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.confirm-modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
}

.confirm-modal-content {
    width: 400px;
    max-width: 90%;
    z-index: 1;
}

.bi-credit-card {
    margin-right: 5px;
    margin-bottom: 2px;
}

@media (max-width: 767px) {
    .cart-item {
        padding-bottom: 15px;
    }
}
</style>
