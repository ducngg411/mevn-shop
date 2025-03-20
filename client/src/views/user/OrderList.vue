<template>
    <div class="order-list">
        <div class="container">
            <h1 class="mb-4">My Orders</h1>
            
            <div class="row">
                <div class="col-md-3 mb-4">
                    <div class="page-content p-0">
                        <div class="profile-sidebar">
                            <div class="profile-avatar text-center py-4">
                                <i class="massive user circle icon text-primary"></i>
                                <h5 class="mt-3 mb-0">{{ user?.fullName || 'User' }}</h5>
                                <p class="text-muted">{{ user?.email || 'N/A' }}</p>
                            </div>
                            
                            <div class="list-group">
                                <router-link to="/profile" class="list-group-item list-group-item-action">
                                    <i class="user icon"></i> Profile Information
                                </router-link>
                                <router-link to="/orders" class="list-group-item list-group-item-action active">
                                    <i class="shopping bag icon"></i> My Orders
                                </router-link>
                                <router-link to="/change-password" class="list-group-item list-group-item-action">
                                    <i class="lock icon"></i> Change Password
                                </router-link>
                                <a href="#" @click.prevent="logout" class="list-group-item list-group-item-action">
                                    <i class="sign out alternate icon"></i> Log Out
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-9">
                    <div class="page-content">
                        <h4 class="mb-4">Order List</h4>
                        
                        <div v-if="loading" class="text-center py-4">
                            <div class="ui active centered inline loader"></div>
                            <p class="mt-3">Loading order list...</p>
                        </div>
                        
                        <div v-else-if="orders.length === 0" class="text-center py-4">
                            <i class="huge shopping bag icon text-muted"></i>
                            <h4 class="mt-3">You have no orders</h4>
                            <p class="mb-4">Start shopping to experience our service</p>
                            <router-link to="/products" class="btn btn-primary">
                                <i class="shopping basket icon"></i> Go to Store
                            </router-link>
                        </div>
                        
                        <div v-else>
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead class="thead-light">
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Order Date</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Payment</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="order in orders" :key="order._id">
                                            <td>
                                                <router-link :to="`/orders/${order._id}`" class="text-primary">
                                                    #{{ order._id.substr(-8).toUpperCase() }}
                                                </router-link>
                                            </td>
                                            <td>{{ formatDate(order.createdAt) }}</td>
                                            <td>{{ formatCurrency(order.finalAmount) }}</td>
                                            <td>
                                                <span 
                                                    class="badge" 
                                                    :class="{
                                                        'badge-success': order.status === 'completed',
                                                        'badge-warning': order.status === 'pending',
                                                        'badge-danger': order.status === 'cancelled'
                                                    }"
                                                >
                                                    {{ getOrderStatusText(order.status) }}
                                                </span>
                                            </td>
                                            <td>
                                                <span 
                                                    class="badge" 
                                                    :class="{
                                                        'badge-success': order.paymentStatus === 'completed',
                                                        'badge-warning': order.paymentStatus === 'pending',
                                                        'badge-danger': order.paymentStatus === 'cancelled'
                                                    }"
                                                >
                                                    {{ getPaymentStatusText(order.paymentStatus) }}
                                                </span>
                                            </td>
                                            <td>
                                                <router-link :to="`/orders/${order._id}`" class="btn btn-sm btn-outline-primary">
                                                    <i class="eye icon"></i> View
                                                </router-link>
                                                <a 
                                                    v-if="order.status === 'pending' && order.paymentStatus === 'pending'"
                                                    href="#" 
                                                    @click.prevent="proceedToPayment(order._id)"
                                                    class="btn btn-sm btn-outline-success ml-1"
                                                >
                                                    <i class="credit card icon"></i> Pay
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import api from '@/utils/api';
import { formatCurrency, formatDate, getOrderStatusText } from '@/utils/helpers';

export default {
    name: 'OrderList',
    data() {
        return {
            orders: [],
            loading: true
        }
    },
    computed: {
        ...mapState({
            user: state => state.auth.user
        }),
        ...mapGetters({
            isAuthenticated: 'auth/isAuthenticated'
        })
    },
    methods: {
        ...mapActions({
            logoutAction: 'auth/logout'
        }),
        formatCurrency,
        formatDate,
        getOrderStatusText,
        getPaymentStatusText(status) {
            const statusMap = {
                'pending': 'Pending Payment',
                'completed': 'Paid'
            };
            return statusMap[status] || status;
        },
        logout() {
            this.logoutAction();
            this.$router.push('/login');
        },
        async fetchOrders() {
            try {
                this.loading = true;
                
                const response = await api.get('/orders/myorders');
                
                if (response.data.success) {
                    this.orders = response.data.orders;
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                this.$flash.error('Unable to load order list');
            } finally {
                this.loading = false;
            }
        },
        async proceedToPayment(orderId) {
            try {
                const response = await api.post('/payments/create-checkout-session', { orderId });
                
                if (response.data.success) {
                    window.location.href = response.data.url;
                }
            } catch (error) {
                console.error('Error creating payment session:', error);
                this.$flash.error('Unable to create payment session. Please try again later.');
            }
        }
    },
    created() {
        if (!this.isAuthenticated) {
            this.$router.push('/login');
            return;
        }
        
        this.fetchOrders();
    }
}
</script>

<style scoped>
.profile-sidebar {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
}

.profile-avatar i.icon {
    opacity: 0.3;
}

.list-group-item i.icon {
    margin-right: 8px;
}

.list-group-item.active {
    background-color: #3498db;
    border-color: #3498db;
}
</style>
