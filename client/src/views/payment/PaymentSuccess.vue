<template>
    <div class="payment-success">
        <div class="container">
            <div v-if="loading" class="text-center py-5">
                <div class="ui active centered inline loader"></div>
                <p class="mt-3">Processing payment...</p>
            </div>
            
            <div v-else class="page-content text-center py-5">
                <div v-if="error" class="alert alert-danger mb-4">
                    {{ error }}
                </div>
                
                <div v-else>
                    <div class="success-icon mb-4">
                        <i class="massive check circle icon text-success"></i>
                    </div>
                    
                    <h2 class="mb-3">Payment Successful!</h2>
                    <p class="lead mb-4">Thank you for shopping with MEVN Shop</p>
                    
                    <div class="order-details text-left mx-auto mb-4" style="max-width: 500px;">
                        <h4 class="mb-3">Order Information</h4>
                        
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between mb-2">
                                    <strong>Order ID:</strong>
                                    <span>{{ order._id }}</span>
                                </div>
                                
                                <div class="d-flex justify-content-between mb-2">
                                    <strong>Order Date:</strong>
                                    <span>{{ formatDate(order.createdAt) }}</span>
                                </div>
                                
                                <div class="d-flex justify-content-between mb-2">
                                    <strong>Payment Method:</strong>
                                    <span>{{ getPaymentMethodText(order.paymentMethod) }}</span>
                                </div>
                                
                                <div class="d-flex justify-content-between mb-2">
                                    <strong>Status:</strong>
                                    <span class="badge badge-success">{{ getOrderStatusText(order.status) }}</span>
                                </div>
                                
                                <div class="d-flex justify-content-between mb-2">
                                    <strong>Payment Status:</strong>
                                    <span class="badge badge-success">{{ getPaymentStatusText(order.paymentStatus) }}</span>
                                </div>
                                
                                <div class="d-flex justify-content-between">
                                    <strong>Total Amount:</strong>
                                    <span class="h5 mb-0">{{ formatCurrency(order.finalAmount) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Purchased account details -->
                    <div v-if="showAccounts" class="account-details text-left mx-auto mb-4" style="max-width: 500px;">
                        <h4 class="mb-3">Purchased Accounts</h4>
                        
                        <div v-for="(item, index) in order.orderItems" :key="index" class="card mb-3">
                            <div class="card-header">
                                <strong>{{ item.product.title }}</strong>
                            </div>
                            <div class="card-body">
                                <div v-for="(account, accIndex) in item.accounts" :key="accIndex" class="mb-3">
                                    <h5 class="mb-2">Account #{{ accIndex + 1 }}</h5>
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
                    
                    <div class="alert alert-info mb-4">
                        <i class="info circle icon"></i> Account information has been sent to your email.
                    </div>
                    
                    <div class="mt-4">
                        <router-link to="/orders" class="btn btn-primary mr-3">
                            <i class="list icon"></i> View My Orders
                        </router-link>
                        <router-link to="/products" class="btn btn-outline-primary">
                            <i class="shopping bag icon"></i> Continue Shopping
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import api from '@/utils/api';
import { formatCurrency, formatDate, getOrderStatusText, getPaymentMethodText } from '@/utils/helpers';

export default {
    name: 'PaymentSuccess',
    data() {
        return {
            loading: true,
            error: null,
            order: {},
            hidePassword: true,
            showAccounts: false
        }
    },
    computed: {
        ...mapGetters({
            isAuthenticated: 'auth/isAuthenticated'
        }),
        orderId() {
            return this.$route.query.orderId;
        }
    },
    methods: {
        formatCurrency,
        formatDate,
        getOrderStatusText,
        getPaymentMethodText,
        getPaymentStatusText(status) {
            const statusMap = {
                'pending': 'Pending Payment',
                'completed': 'Paid'
            };
            return statusMap[status] || status;
        },
        copyToClipboard(text) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    this.$flash.success('Copied to clipboard');
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    this.$flash.error('Could not copy. Please try again.');
                });
        },
        async fetchOrder() {
            try {
                this.loading = true;
                this.error = null;
                
                // Check for orderId
                if (!this.orderId) {
                    this.error = 'Order not found';
                    return;
                }
                
                // // Update payment status (only when coming from Stripe)
                // if (this.$route.query.payment === 'success') {
                //     await api.get(`/payments/confirm/${this.orderId}`);
                // }
                
                // Fetch order details
                const response = await api.get(`/orders/${this.orderId}`);
                
                if (response.data.success) {
                    this.order = response.data.order;
                    
                    // Only show account details if the order is completed
                    this.showAccounts = this.order.status === 'completed';
                }
            } catch (error) {
                console.error('Error fetching order:', error);
                this.error = error.response?.data?.message || 'Could not fetch order information';
            } finally {
                this.loading = false;
            }
        }
    },
    created() {
        if (!this.isAuthenticated) {
            this.$router.push('/login');
            return;
        }
        
        this.fetchOrder();
    }
}
</script>

<style scoped>
.payment-success {
    padding: 40px 0;
}

.success-icon i {
    color: #2ecc71;
}

.order-details {
    text-align: left;
}
</style>
