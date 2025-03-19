<template>
    <div class="payment-cancel">
        <div class="container">
            <div class="page-content text-center py-5">
                <div class="cancel-icon mb-4">
                    <i class="massive times circle icon text-danger"></i>
                </div>
                
                <h2 class="mb-3">Payment Cancelled</h2>
                <p class="lead mb-4">Your payment was not completed</p>
                
                <div class="alert alert-warning mb-4">
                    <i class="exclamation triangle icon"></i> Your order will be held for <strong>15 minutes</strong>. After this time, the order will be automatically cancelled.
                </div>
                
                <div class="mt-4">
                    <router-link :to="`/order/${orderId}`" class="btn btn-primary mr-3">
                        <i class="credit card icon"></i> Try Payment Again
                    </router-link>
                    <router-link to="/orders" class="btn btn-outline-secondary">
                        <i class="list icon"></i> View My Orders
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'PaymentCancel',
    computed: {
        ...mapGetters({
            isAuthenticated: 'auth/isAuthenticated'
        }),
        orderId() {
            return this.$route.query.orderId;
        }
    },
    created() {
        if (!this.isAuthenticated) {
            this.$router.push('/login');
            return;
        }
        
        if (!this.orderId) {
            this.$router.push('/orders');
        }
    }
}
</script>

<style scoped>
.payment-cancel {
    padding: 40px 0;
}

.cancel-icon i {
    color: #e74c3c;
}
</style>
