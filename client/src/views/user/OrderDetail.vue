<template>
    <div class="order-detail">
        <div class="container">
            <!-- Breadcrumb -->
            <nav aria-label="breadcrumb" class="mb-4">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
                    <li class="breadcrumb-item"><router-link to="/orders">My Orders</router-link></li>
                    <li class="breadcrumb-item active" aria-current="page">
                        Order Details #{{ orderId && orderId.substr(-8).toUpperCase() }}
                    </li>
                </ol>
            </nav>
            
            <div v-if="loading" class="text-center py-5">
                <div class="ui active centered inline loader"></div>
                <p class="mt-3">Loading order information...</p>
            </div>
            
            <div v-else-if="error" class="alert alert-danger">
                {{ error }}
            </div>
            
            <div v-else>
                <div class="row">
                    <div class="col-md-8">
                        <!-- Order Information -->
                        <div class="page-content mb-4">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <h3>Order Details</h3>
                                <div>
                                    <span 
                                        class="badge mr-2" 
                                        :class="{
                                            'badge-success': order.status === 'completed',
                                            'badge-warning': order.status === 'pending',
                                            'badge-danger': order.status === 'cancelled'
                                        }"
                                    >
                                        {{ getOrderStatusText(order.status) }}
                                    </span>
                                    <!-- <span 
                                        class="badge" 
                                        :class="{
                                            'badge-success': order.paymentStatus === 'completed',
                                            'badge-warning': order.paymentStatus === 'pending',
                                            'badge-danger': order.paymentStatus === 'cancelled'
                                        }"
                                    >
                                        {{ getPaymentStatusText(order.paymentStatus) }}
                                    </span> -->
                                </div>
                            </div>
                            
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <h5>Order Information</h5>
                                    <p><strong>Order ID:</strong> #{{ order._id }}</p>
                                    <p><strong>Order Date:</strong> {{ formatDate(order.createdAt) }}</p>
                                    <p><strong>Payment Method:</strong> {{ getPaymentMethodText(order.paymentMethod) }}</p>
                                </div>
                                
                                <div class="col-md-6">
                                    <h5>Buyer Information</h5>
                                    <p><strong>Recipient Name:</strong> {{ order.user.fullName }}</p>
                                    <p><strong>Email:</strong> {{ order.user.email }}</p>
                                </div>
                            </div>
                            
                            <!-- Product List -->
                            <h5 class="mb-3">Purchased Products</h5>
                            
                            <div class="table-responsive">
                                <table class="table">
                                    <thead class="thead-light">
                                        <tr>
                                            <th>Product</th>
                                            <th class="text-center">Quantity</th>
                                            <th class="text-right">Price</th>
                                            <th class="text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in order.orderItems" :key="index">
                                            <td>
                                                <div class="d-flex">
                                                    <img 
                                                        :src="formatImageUrl(item.product.image)" 
                                                        :alt="item.product.title" 
                                                        class="order-item-image mr-2 border"
                                                    >
                                                    <div>
                                                        <div class="font-weight-bold">
                                                            <router-link :to="`/products/${item.product._id}`">{{ item.product.title }}</router-link>
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="text-center">{{ item.quantity }}</td>
                                            <td class="text-right">{{ formatCurrency(item.price) }}</td>
                                            <td class="text-right">{{ formatCurrency(item.price * item.quantity) }}</td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="3" class="text-right font-weight-bold">Subtotal:</td>
                                            <td class="text-right">{{ formatCurrency(order.totalAmount) }}</td>
                                        </tr>
                                        <tr v-if="order.discountAmount > 0">
                                            <td colspan="3" class="text-right font-weight-bold">Discount:</td>
                                            <td class="text-right text-danger">-{{ formatCurrency(order.discountAmount) }}</td>
                                        </tr>
                                        <tr>
                                            <td colspan="3" class="text-right font-weight-bold">Total:</td>
                                            <td class="text-right font-weight-bold">{{ formatCurrency(order.finalAmount) }}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            
                            <!-- Actions -->
                            <div class="mt-4 text-right">
                                <button 
                                    v-if="order.status === 'pending' && order.paymentStatus === 'pending'"
                                    class="btn btn-success mr-2" 
                                    @click="proceedToPayment"
                                >
                                    <i class="credit card icon"></i> Pay Now
                                </button>
                                <button 
                                    v-if="order.status === 'pending'"
                                    class="btn btn-danger" 
                                    @click="showCancelConfirm = true"
                                >
                                    <i class="times icon"></i> Cancel Order
                                </button>
                            </div>
                        </div>
                        
                        <!-- Show Accounts if Order is Completed -->
                        <div v-if="showAccounts" class="page-content mb-4">
                            <h4 class="mb-3">Purchased Accounts</h4>
                            
                            <div v-for="(item, index) in order.orderItems" :key="index" class="mb-4">
                                <h5>{{ item.product.title }}</h5>
                                
                                <div v-for="(account, accIndex) in item.accounts" :key="accIndex" class="card mb-3">
                                    <div class="card-body">
                                        <h6 class="mb-3">Account #{{ accIndex + 1 }}</h6>
                                        
                                        <div class="form-group">
                                            <label>Username:</label>
                                            <div class="input-group">
                                                <input type="text" class="form-control" :value="account.username" readonly>
                                                <div class="input-group-append">
                                                    <button class="btn btn-outline-secondary" @click="copyToClipboard(account.username)">
                                                        <i class="copy icon"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="form-group mb-0">
                                            <label>Password:</label>
                                            <div class="input-group">
                                                <input 
                                                    :type="hidePassword ? 'password' : 'text'" 
                                                    class="form-control" 
                                                    :value="account.password" 
                                                    readonly
                                                >
                                                <div class="input-group-append">
                                                    <button class="btn btn-outline-secondary" @click="hidePassword = !hidePassword">
                                                        <i :class="hidePassword ? 'eye icon' : 'eye slash icon'"></i>
                                                    </button>
                                                    <button class="btn btn-outline-secondary" @click="copyToClipboard(account.password)">
                                                        <i class="copy icon"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div v-if="account.additionalInfo" class="mt-2">
                                            <small class="text-muted">{{ account.additionalInfo }}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <!-- Remaining Time (if Order is Pending Payment) -->
                        <div v-if="order.status === 'pending'" class="page-content mb-4">
                            <h5 class="mb-3">Remaining Time</h5>
                            
                            <div v-if="remainingTime > 0" class="countdown text-center py-3">
                                <div class="countdown-timer mb-3">
                                    <span class="countdown-value">{{ formatRemainingTime }}</span>
                                </div>
                                <p class="text-muted mb-0">
                                    The order will be automatically cancelled if not paid within the time frame.
                                </p>
                            </div>
                            
                            <div v-else class="text-center py-3">
                                <p class="text-danger mb-0">
                                    <i class="exclamation triangle icon"></i> The order will be cancelled due to time-out.
                                </p>
                            </div>
                        </div>
                        
                        <!-- Support Information -->
                        <div class="page-content mb-4">
                            <h5 class="mb-3">Support</h5>
                            
                            <p>If you need assistance or have questions about your order, please contact us:</p>
                            
                            <ul class="list-unstyled">
                                <li class="mb-2"><i class="envelope icon"></i> Email: support@mevnshop.vn</li>
                                <li class="mb-2"><i class="phone icon"></i> Hotline: 0123.456.789</li>
                                <li><i class="comment alternate icon"></i><router-link :to="`/support`"> Chat with support</router-link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Confirm Cancel Order Modal -->
        <div v-if="showCancelConfirm" class="confirm-modal">
            <div class="confirm-modal-overlay" @click="showCancelConfirm = false"></div>
            <div class="confirm-modal-content card">
                <div class="card-header">
                    <h5 class="mb-0">Confirm Cancel Order</h5>
                </div>
                <div class="card-body">
                    <p>Are you sure you want to cancel this order?</p>
                    <p class="text-danger mb-0"><strong>Note:</strong> This action cannot be undone.</p>
                </div>
                <div class="card-footer d-flex justify-content-end">
                    <button class="btn btn-secondary mr-2" @click="showCancelConfirm = false">No</button>
                    <button 
                        class="btn btn-danger" 
                        @click="cancelOrder" 
                        :disabled="cancelling"
                    >
                        <span v-if="cancelling">
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Processing...
                        </span>
                        <span v-else>Confirm Cancel</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import api from '@/utils/api';
import { formatCurrency, formatDate, getOrderStatusText, getPaymentMethodText, formatImageUrl } from '@/utils/helpers';
import { RouterLink } from 'vue-router';

export default {
    name: 'OrderDetail',
    data() {
        return {
            order: {},
            loading: true,
            error: null,
            showCancelConfirm: false,
            cancelling: false,
            hidePassword: true,
            remainingTime: 0,
            timer: null
        }
    },
    computed: {
        ...mapGetters({
            isAuthenticated: 'auth/isAuthenticated'
        }),
        orderId() {
            return this.$route.params.id;
        },
        showAccounts() {
            return this.order.status === 'completed';
        },
    formatRemainingTime() {
        if (this.remainingTime <= 0) return '00:00';
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
},
methods: {
    formatCurrency,
    formatDate,
    getOrderStatusText,
    getPaymentMethodText,
    formatImageUrl,
    getPaymentStatusText(status) {
    const statusMap = {
        'pending': 'Awaiting payment',
        'completed': 'Paid'
    };
        return statusMap[status] || status;
    },
    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
        .then(() => {
            this.$toast.success('Copied to clipboard');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            this.$toast.error('Could not copy. Please try again.');
        });
    },
    async fetchOrder() {
        try {
            this.loading = true;
            this.error = null;
            
            const response = await api.get(`/orders/${this.orderId}`);
            
            if (response.data.success) {
            this.order = response.data.order;
            
            // If the order is pending, get the remaining time
            if (this.order.status === 'pending') {
                this.fetchRemainingTime();
            }
        }
    } catch (error) {
        console.error('Error fetching order:', error);
        this.error = error.response?.data?.message || 'Unable to load order information';
    } finally {
        this.loading = false;
        }
    },
    async fetchRemainingTime() {
        try {
            const response = await api.get(`/orders/${this.orderId}/remaining-time`);
            
            if (response.data.success) {
            this.remainingTime = response.data.remainingSeconds;
            
            // Start countdown
            this.startCountdown();
            }
        } catch (error) {
            console.error('Error fetching remaining time:', error);
        }
    },
    startCountdown() {
      // Clear the previous timer if any
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        // If there is remaining time, start countdown
        if (this.remainingTime > 0) {
            this.timer = setInterval(() => {
            this.remainingTime--;
            
            if (this.remainingTime <= 0) {
                clearInterval(this.timer);
                
                // Reload order information after time runs out
                setTimeout(() => {
                this.fetchOrder();
                }, 2000);
            }
            }, 1000);
        }
    },
    async proceedToPayment() {
        try {
            const response = await api.post('/payments/create-checkout-session', { 
            orderId: this.orderId 
            });
            
            if (response.data.success) {
            window.location.href = response.data.url;
            }
        } catch (error) {
            console.error('Error creating payment session:', error);
            this.$toast.error('Unable to create payment session. Please try again later.');
        }
    },
    async cancelOrder() {
        try {
            this.cancelling = true;
            
            const response = await api.put(`/orders/${this.orderId}/status`, {
                status: 'cancelled'
        });
        
        if (response.data.success) {
            this.showCancelConfirm = false;
            this.$toast.success('Order has been successfully canceled');
            
          // Reload order information
            this.fetchOrder();
        }
    } catch (error) {
        console.error('Error cancelling order:', error);
        this.$toast.error(error.response?.data?.message || 'Unable to cancel order. Please try again later.');
        } finally {
            this.cancelling = false;
        }
    }
},
created() {
    if (!this.isAuthenticated) {
        this.$router.push('/login');
        return;
    }
    
    this.fetchOrder();
},
beforeDestroy() {
    // Clean up timer when the component is destroyed
    if (this.timer) {
        clearInterval(this.timer);
        }
    }
}
</script>

<style scoped>
.order-detail {
    padding-bottom: 40px;
}

.order-item-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
}

.countdown-timer {
    font-size: 2rem;
    font-weight: bold;
    color: #e74c3c;
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
</style>
