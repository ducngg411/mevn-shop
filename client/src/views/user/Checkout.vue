<template>
    <div class="checkout">
        <div class="container">
            <h1 class="mb-4">Checkout</h1>
            
            <!-- Check login -->
            <div v-if="!isAuthenticated" class="page-content mb-4 text-center">
                <i class="huge lock icon text-muted"></i>
                <h3 class="mt-3">Please log in to continue</h3>
                <p class="mb-4">You need to log in to proceed with the payment</p>
                <router-link :to="{ path: '/login', query: { redirect: '/checkout' } }" class="btn btn-primary">
                    <i class="sign in alternate icon"></i> Login
                </router-link>
            </div>
            
            <!-- Check empty cart -->
            <div v-else-if="cartItems.length === 0" class="page-content mb-4 text-center">
                <i class="huge shopping cart icon text-muted"></i>
                <h3 class="mt-3">Your cart is empty</h3>
                <p class="mb-4">You need to add items to your cart before proceeding to checkout</p>
                <router-link to="/products" class="btn btn-primary">
                    <i class="shopping bag icon"></i> Go to store
                </router-link>
            </div>
            
            <!-- Checkout form -->
            <div v-else class="row">
                <!-- Customer information -->
                <div class="col-md-8">
                    <div class="page-content mb-4">
                        <h4 class="mb-3">Payment Information</h4>
                        
                        <form @submit.prevent="placeOrder">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="fullName">Full Name</label>
                                        <input 
                                            type="text" 
                                            id="fullName" 
                                            class="form-control" 
                                            v-model="orderData.fullName"
                                            :class="{ 'is-invalid': submitted && !orderData.fullName }"
                                            required
                                        >
                                        <div v-if="submitted && !orderData.fullName" class="invalid-feedback">
                                            Please enter your full name
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="email">Email</label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            class="form-control" 
                                            v-model="orderData.email"
                                            :class="{ 'is-invalid': submitted && !validEmail }"
                                            required
                                        >
                                        <div v-if="submitted && !orderData.email" class="invalid-feedback">
                                            Please enter your email
                                        </div>
                                        <div v-else-if="submitted && orderData.email && !validEmail" class="invalid-feedback">
                                            Invalid email address
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="phone">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            id="phone" 
                                            class="form-control" 
                                            v-model="orderData.phone"
                                            :class="{ 'is-invalid': submitted && !orderData.phone }"
                                            required
                                        >
                                        <div v-if="submitted && !orderData.phone" class="invalid-feedback">
                                            Please enter your phone number
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="address">Address</label>
                                        <input 
                                            type="text" 
                                            id="address" 
                                            class="form-control" 
                                            v-model="orderData.address"
                                            :class="{ 'is-invalid': submitted && !orderData.address }"
                                            required
                                        >
                                        <div v-if="submitted && !orderData.address" class="invalid-feedback">
                                            Please enter your address
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="note">Note (Optional)</label>
                                <textarea 
                                    id="note" 
                                    class="form-control" 
                                    rows="3" 
                                    v-model="orderData.note"
                                ></textarea>
                            </div>
                            
                            <h4 class="mb-3 mt-4">Payment Methods</h4>
                            
                            <div class="payment-methods">
                                <div class="form-check mb-3">
                                    <input 
                                        class="form-check-input" 
                                        type="radio" 
                                        name="paymentMethod" 
                                        id="creditCard" 
                                        value="Credit Card" 
                                        v-model="orderData.paymentMethod"
                                        checked
                                    >
                                    <label class="form-check-label" for="creditCard">
                                        <img class="credit_card_modify" src="/img/Mastercard-va-visa+(1).jpg.png" alt=""> Credit/Debit Card
                                    </label>
                                </div>
                                
                                <!-- <div class="form-check mb-3">
                                    <input 
                                        class="form-check-input" 
                                        type="radio" 
                                        name="paymentMethod" 
                                        id="bankTransfer" 
                                        value="Bank Transfer" 
                                        v-model="orderData.paymentMethod"
                                    >
                                    <label class="form-check-label" for="bankTransfer">
                                        <i class="university icon"></i> Bank Transfer
                                    </label>
                                </div> -->
                            </div>
                            
                            <div class="mt-4">
                                <button type="submit" class="btn btn-success btn-lg" :disabled="placing">
                                    <span v-if="placing">
                                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Processing...
                                    </span>
                                    <span v-else>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-credit-card-fill" viewBox="0 0 16 16">
  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0zm0 3v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zm3 2h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1"/>
</svg> Place Order
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                
                <!-- Order summary -->
                <div class="col-md-4">
                    <div class="page-content mb-4">
                        <h4 class="mb-3">Your Order</h4>
                        
                        <div class="order-items mb-3">
                            <div v-for="(item, index) in cartItems" :key="index" class="order-item mb-2 pb-2 border-bottom">
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <span class="font-weight-bold">{{ item.title }}</span>
                                        <div class="text-muted small">{{ item.quantity }} x {{ formatCurrency(item.price) }}</div>
                                    </div>
                                    <div class="item-subtotal">
                                        {{ formatCurrency(item.price * item.quantity) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="order-summary">
                            <div class="d-flex justify-content-between mb-2">
                                <span>Subtotal:</span>
                                <span>{{ formatCurrency(cartTotal) }}</span>
                            </div>
                            
                            <div v-if="voucher" class="d-flex justify-content-between mb-2">
                                <span>Discount ({{ voucher.code }}):</span>
                                <span class="text-danger">-{{ formatCurrency(discountAmount) }}</span>
                            </div>
                            
                            <hr>
                            
                            <div class="d-flex justify-content-between mb-2">
                                <span class="font-weight-bold">Total:</span>
                                <span class="font-weight-bold h5 mb-0">{{ formatCurrency(finalTotal) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import { formatCurrency } from '@/utils/helpers';
import api from '@/utils/api';

export default {
    name: 'Checkout',
    data() {
        return {
            orderData: {
                fullName: '',
                email: '',
                phone: '',
                address: '',
                note: '',
                paymentMethod: 'Credit Card'
            },
            voucher: null,
            discountAmount: 0,
            submitted: false,
            placing: false
        }
    },
    computed: {
        ...mapGetters({
            isAuthenticated: 'auth/isAuthenticated',
            cartItems: 'cart/cartItems',
            cartTotal: 'cart/cartTotal'
        }),
        ...mapState({
            user: state => state.auth.user
        }),
        validEmail() {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return !this.orderData.email || re.test(String(this.orderData.email).toLowerCase());
        },
        finalTotal() {
            return Math.max(0, this.cartTotal - this.discountAmount);
        }
    },
    methods: {
        ...mapActions({
            clearCartAction: 'cart/clearCart'
        }),
        formatCurrency,
        async placeOrder() {
            this.submitted = true;
            
            if (!this.orderData.fullName || !this.orderData.email || !this.orderData.phone || 
                !this.orderData.address || !this.validEmail) {
                return;
            }
            
            try {
                this.placing = true;
                
                // Prepare order data
                const orderItems = this.cartItems.map(item => ({
                    product: item.product,
                    quantity: item.quantity
                }));
                
                const orderData = {
                    orderItems,
                    paymentMethod: this.orderData.paymentMethod,
                    ...(this.voucher && { voucher: this.voucher.code })
                };
                
                // Call API to create order
                const response = await api.post('/orders', orderData);
                
                if (response.data.success) {
                    const orderId = response.data.order._id;
                    
                    // Handle payment based on selected method
                    if (this.orderData.paymentMethod === 'Credit Card') {
                        // Create Stripe payment session
                        const paymentResponse = await api.post('/payments/create-checkout-session', { 
                            orderId 
                        });
                        
                        if (paymentResponse.data.success) {
                            // Redirect to Stripe payment page
                            window.location.href = paymentResponse.data.url;
                            return;
                        }
                    } else {
                        // Handle other payment methods
                        this.clearCartAction();
                        localStorage.removeItem('checkoutVoucher');
                        
                        // Redirect to order success page
                        this.$router.push(`/order/${orderId}/success`);
                    }
                }
            } catch (error) {
                console.error('Error placing order:', error);
                this.$flash.error(error.response?.data?.message || 'Unable to place order. Please try again later.');
            } finally {
                this.placing = false;
            }
        }
    },
    created() {
        if (!this.isAuthenticated) {
            this.$router.push({ path: '/login', query: { redirect: '/checkout' } });
            return;
        }
        
        if (this.cartItems.length === 0) {
            this.$router.push('/cart');
            return;
        }
        
        // Pre-fill user information
        if (this.user) {
            this.orderData.fullName = this.user.fullName || '';
            this.orderData.email = this.user.email || '';
            this.orderData.phone = this.user.phone || '';
            this.orderData.address = this.user.address || '';
        }
        
        // Get voucher info if available
        const savedVoucher = localStorage.getItem('checkoutVoucher');
        if (savedVoucher) {
            try {
                const voucherData = JSON.parse(savedVoucher);
                this.voucher = { code: voucherData.code };
                this.discountAmount = voucherData.discountAmount;
            } catch (error) {
                console.error('Error parsing saved voucher:', error);
            }
        }
    }
}
</script>

<style scoped>
.checkout {
    padding-bottom: 40px;
}

.order-item:last-child {
    border-bottom: none !important;
}

.payment-methods .form-check-label {
    display: flex;
    align-items: center;
}

.payment-methods .form-check-label i {
    margin-right: 10px;
    color: #3498db;
}

.bi-credit-card-fill {
    margin-right: 5px;
    margin-bottom: 3px;
}

.credit_card_modify {
    width: 45px;
    height: 25px;
    border-radius: 4px;
    margin-right: 4px;
}
</style>
