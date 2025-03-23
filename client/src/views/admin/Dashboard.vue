<template>
	<div class="admin-dashboard">
		<div class="container-fluid">
			<div class="row">
				<!-- Sidebar -->
				<admin-sidebar :active-menu="'dashboard'"></admin-sidebar>
				
				<!-- Main content -->
				<main class="col-md-9 ml-sm-auto col-lg-10 px-md-4 py-4">
					<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
						<h1 class="h2">Dashboard</h1>
						<div class="btn-toolbar mb-2 mb-md-0">
							<div class="btn-group mr-2">
								<button type="button" class="btn btn-sm btn-outline-secondary">
									<i class="calendar icon"></i> Today
								</button>
								<button type="button" class="btn btn-sm btn-outline-secondary">
									<i class="calendar icon"></i> This Week
								</button>
								<button type="button" class="btn btn-sm btn-outline-secondary">
									<i class="calendar icon"></i> This Month
								</button>
							</div>
							<button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
								<i class="download icon"></i> Export Report
							</button>
						</div>
					</div>
					
					<!-- Stats Cards -->
					<div class="row mb-4">
						<div class="col-md-3 mb-4">
							<div class="card text-white bg-primary">
								<div class="card-body">
									<div class="d-flex justify-content-between align-items-center">
										<div>
											<h5 class="card-title">Total Orders</h5>
											<h2 class="display-4">{{ stats.totalOrders }}</h2>
										</div>
										<i class="massive shopping bag icon"></i>
									</div>
									<p class="card-text">
										<i class="arrow up icon" v-if="stats.orderGrowth > 0"></i>
										<i class="arrow down icon" v-else-if="stats.orderGrowth < 0"></i>
										<span>{{ Math.abs(stats.orderGrowth) }}% compared to last month</span>
									</p>
								</div>
							</div>
						</div>
						
						<div class="col-md-3 mb-4">
							<div class="card text-white bg-success">
								<div class="card-body">
									<div class="d-flex justify-content-between align-items-center">
										<div>
											<h5 class="card-title">Revenue</h5>
											<h2 class="display-4">{{ formatCurrency(stats.totalRevenue) }}</h2>
										</div>
										<i class="massive money bill alternate icon"></i>
									</div>
									<p class="card-text">
										<i class="arrow up icon" v-if="stats.revenueGrowth > 0"></i>
										<i class="arrow down icon" v-else-if="stats.revenueGrowth < 0"></i>
										<span>{{ Math.abs(stats.revenueGrowth) }}% compared to last month</span>
									</p>
								</div>
							</div>
						</div>
						
						<div class="col-md-3 mb-4">
							<div class="card text-white bg-info">
								<div class="card-body">
									<div class="d-flex justify-content-between align-items-center">
										<div>
											<h5 class="card-title">Store</h5>
											<h2 class="display-4">{{ stats.totalProducts }}</h2>
										</div>
										<i class="massive store icon"></i>
									</div>
									<p class="card-text">
										<span>{{ stats.availableAccounts }} available accounts remaining</span>
									</p>
								</div>
							</div>
						</div>
						
						<div class="col-md-3 mb-4">
							<div class="card text-white bg-warning">
								<div class="card-body">
									<div class="d-flex justify-content-between align-items-center">
										<div>
											<h5 class="card-title">Users</h5>
											<h2 class="display-4">{{ stats.totalUsers }}</h2>
										</div>
										<i class="massive users icon"></i>
									</div>
									<p class="card-text">
										<i class="arrow up icon" v-if="stats.userGrowth > 0"></i>
										<i class="arrow down icon" v-else-if="stats.userGrowth < 0"></i>
										<span>{{ Math.abs(stats.userGrowth) }}% compared to last month</span>
									</p>
								</div>
							</div>
						</div>
					</div>
					
					<div class="row mb-4">
						<!-- Recent Orders -->
						<div class="col-md-8 mb-4">
							<div class="card">
								<div class="card-header">
									<h5 class="card-title mb-0">Recent Orders</h5>
								</div>
								<div class="card-body">
									<div v-if="loadingOrders" class="text-center py-3">
										<div class="ui active centered inline loader"></div>
										<p class="mt-2">Loading data...</p>
									</div>
									
									<div v-else-if="recentOrders.length === 0" class="text-center py-3">
										<p>No orders yet.</p>
									</div>
									
									<div v-else class="table-responsive">
										<table class="table table-hover">
											<thead>
												<tr>
													<th>Order ID</th>
													<th>Customer</th>
													<th>Order Date</th>
													<th>Total Amount</th>
													<th>Status</th>
													<th>Payment</th>
												</tr>
											</thead>
											<tbody>
												<tr v-for="order in recentOrders" :key="order._id">
													<td>
														<router-link :to="`/admin/orders/${order._id}`" class="text-primary">
															#{{ order._id.substr(-8).toUpperCase() }}
														</router-link>
													</td>
													<td>{{ order.user.fullName || order.user.username }}</td>
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
																'badge-warning': order.paymentStatus === 'pending'
															}"
														>
															{{ getPaymentStatusText(order.paymentStatus) }}
														</span>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
									
									<div class="text-center mt-3">
										<router-link to="/admin/orders" class="btn btn-outline-primary btn-sm">
											View All Orders
										</router-link>
									</div>
								</div>
							</div>
						</div>
						
						<!-- Low Stock Products -->
						<div class="col-md-4 mb-4">
							<div class="card">
								<div class="card-header">
									<h5 class="card-title mb-0">Low Stock Products</h5>
								</div>
								<div class="card-body">
									<div v-if="loadingProducts" class="text-center py-3">
										<div class="ui active centered inline loader"></div>
										<p class="mt-2">Loading data...</p>
									</div>
									
									<div v-else-if="lowStockProducts.length === 0" class="text-center py-3">
										<p>No low stock products.</p>
									</div>
									
									<div v-else>
										<div v-for="product in lowStockProducts" :key="product._id" class="mb-3 pb-2 border-bottom">
											<div class="d-flex align-items-center">
												<img :src="formatImageUrl(product.image)" :alt="product.title" class="mr-2" width="40" height="40" style="object-fit: cover;">
												<div>
													<h6 class="mb-0">
														<router-link :to="`/admin/products/${product._id}`" class="text-primary">
															{{ product.title }}
														</router-link>
													</h6>
													<div class="text-danger small">
														<i class="exclamation triangle icon"></i> Only {{ product.availableStock }} accounts left
													</div>
												</div>
											</div>
										</div>
										
										<div class="text-center mt-3">
											<router-link to="/admin/products" class="btn btn-outline-primary btn-sm">
												Manage Products
											</router-link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import api from '@/utils/api';
import { formatCurrency, formatDate, formatImageUrl, getOrderStatusText } from '@/utils/helpers';

export default {
	name: 'AdminDashboard',
	components: {
		AdminSidebar
	},
	data() {
		return {
			stats: {
				totalOrders: 0,
				orderGrowth: 0,
				totalRevenue: 0,
				revenueGrowth: 0,
				totalProducts: 0,
				availableAccounts: 0,
				totalUsers: 0,
				userGrowth: 0
			},
			recentOrders: [],
			lowStockProducts: [],
			loadingStats: true,
			loadingOrders: true,
			loadingProducts: true
		};
	},
	computed: {
		...mapGetters({
			isAuthenticated: 'auth/isAuthenticated',
			isAdmin: 'auth/isAdmin'
		})
	},
	methods: {
		formatCurrency,
		formatDate,
		getOrderStatusText,
		formatImageUrl,
		getPaymentStatusText(status) {
			const statusMap = {
				'pending': 'Awaiting Payment',
				'completed': 'Paid'
			};
			return statusMap[status] || status;
		},
		async fetchStats() {
			try {
				this.loadingStats = true;
				
				// In a real environment, you need an API to fetch the stats
				// Here, we use mock data
				this.stats = {
					totalOrders: 156,
					orderGrowth: 12.5,
					totalRevenue: 15800000,
					revenueGrowth: 8.3,
					totalProducts: 42,
					availableAccounts: 357,
					totalUsers: 89,
					userGrowth: 5.2
				};
			} catch (error) {
				console.error('Error fetching stats:', error);
			} finally {
				this.loadingStats = false;
			}
		},
		async fetchRecentOrders() {
			try {
				this.loadingOrders = true;
				
				const response = await api.get('/orders?limit=5');
				
				if (response.data.success) {
					this.recentOrders = response.data.orders.slice(0, 5);
				}
			} catch (error) {
				console.error('Error fetching recent orders:', error);
			} finally {
				this.loadingOrders = false;
			}
		},
		async fetchLowStockProducts() {
			try {
				this.loadingProducts = true;
				
				const response = await api.get('/products');
				
				if (response.data.success) {
					// Filter products with low stock
					this.lowStockProducts = response.data.products
						.filter(p => p.availableStock < 5)
						.slice(0, 5);
				}
			} catch (error) {
				console.error('Error fetching low stock products:', error);
			} finally {
				this.loadingProducts = false;
			}
		}
	},
	created() {
		if (!this.isAuthenticated || !this.isAdmin) {
			this.$router.push('/login');
			return;
		}
		
		this.fetchStats();
		this.fetchRecentOrders();
		this.fetchLowStockProducts();
	}
};
</script>

<style scoped>
.admin-dashboard i.massive {
	font-size: 2rem;
	opacity: 0.5;
}

.card-body i.massive {
	position: absolute;
	right: 10px;
	top: 10px;
}
</style>
