<template>
	<div class="admin-orders">
		<div class="container-fluid">
			<div class="row">
				<!-- Sidebar -->
				<admin-sidebar :active-menu="'orders'"></admin-sidebar>

				<!-- Main content -->
				<main class="col-md-9 ml-sm-auto col-lg-10 px-md-4 py-4">
					<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
						<h1 class="h2">Order Management</h1>
						<div class="btn-toolbar">
							<button class="btn btn-outline-secondary" @click="refreshOrders">
								<i class="sync icon"></i> Refresh
							</button>
						</div>
					</div>

					<!-- Filters and search -->
					<div class="row mb-4">
						<div class="col-md-4 mb-3">
							<div class="input-group">
								<input
									type="text"
									class="form-control"
									placeholder="Search orders..."
									v-model="searchQuery"
									@keyup.enter="searchOrders"
								>
								<div class="input-group-append">
									<button class="btn btn-outline-secondary" type="button" @click="searchOrders">
										<i class="search icon"></i>
									</button>
								</div>
							</div>
						</div>

						<div class="col-md-3 mb-3">
							<select class="form-control" v-model="statusFilter" @change="filterOrders">
								<option value="">All statuses</option>
								<option value="pending">Pending Payment</option>
								<option value="completed">Completed</option>
								<option value="cancelled">Cancelled</option>
							</select>
						</div>

						<div class="col-md-3 mb-3">
							<select class="form-control" v-model="paymentStatusFilter" @change="filterOrders">
								<option value="">All payment statuses</option>
								<option value="pending">Pending Payment</option>
								<option value="completed">Paid</option>
							</select>
						</div>

						<div class="col-md-2 mb-3">
							<select class="form-control" v-model="sortBy" @change="filterOrders">
								<option value="createdAt_desc">Newest</option>
								<option value="createdAt_asc">Oldest</option>
								<option value="finalAmount_desc">Highest Value</option>
								<option value="finalAmount_asc">Lowest Value</option>
							</select>
						</div>
					</div>

					<!-- Date Range Filter -->
					<div class="row mb-4">
						<div class="col-md-4 mb-3">
							<label for="startDate">From date:</label>
							<input
								type="date"
								class="form-control"
								id="startDate"
								v-model="dateRange.start"
								@change="filterOrders"
							>
						</div>

						<div class="col-md-4 mb-3">
							<label for="endDate">To date:</label>
							<input
								type="date"
								class="form-control"
								id="endDate"
								v-model="dateRange.end"
								@change="filterOrders"
							>
						</div>

						<div class="col-md-4 d-flex align-items-end mb-3">
							<button class="btn btn-outline-secondary" @click="resetFilters">
								<i class="undo icon"></i> Reset Filters
							</button>
						</div>
					</div>

					<!-- Orders List -->
					<div class="card">
						<div class="card-body">
							<div v-if="loading" class="text-center py-5">
								<div class="ui active centered inline loader"></div>
								<p class="mt-3">Loading order list...</p>
							</div>

							<div v-else-if="filteredOrders.length === 0" class="text-center py-5">
								<i class="huge search icon text-muted"></i>
								<h4 class="mt-3">No orders found</h4>
								<p class="text-muted mb-4">No orders match the search criteria</p>
								<button class="btn btn-outline-primary" @click="resetFilters">
									<i class="undo icon"></i> Reset Filters
								</button>
							</div>

							<div v-else class="table-responsive">
								<table class="table table-hover">
									<thead class="thead-light">
										<tr>
											<th>
												<div class="custom-control custom-checkbox">
													<input
														type="checkbox"
														class="custom-control-input"
														id="selectAll"
														v-model="selectAll"
														@change="toggleSelectAll"
													>
													<label class="custom-control-label" for="selectAll"></label>
												</div>
											</th>
											<th>Order ID</th>
											<th>Customer</th>
											<th>Order Date</th>
											<th>Total Value</th>
											<th>Status</th>
											<th>Payment</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="order in paginatedOrders" :key="order._id">
											<td>
												<div class="custom-control custom-checkbox">
													<input
														type="checkbox"
														class="custom-control-input"
														:id="`order${order._id}`"
														v-model="selectedOrders"
														:value="order._id"
													>
													<label class="custom-control-label" :for="`order${order._id}`"></label>
												</div>
											</td>
											<td>
												<a href="#" @click.prevent="viewOrderDetail(order)" class="text-primary">
													#{{ order._id.substr(-8).toUpperCase() }}
												</a>
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
											<td>
												<div class="btn-group">
													<button
														class="btn btn-sm btn-outline-primary"
														@click="viewOrderDetail(order)"
														title="View Details"
													>
														<i class="eye icon"></i>
													</button>
													<button
														class="btn btn-sm btn-outline-success"
														@click="openUpdateStatusModal(order)"
														title="Update Status"
													>
														<i class="edit icon"></i>
													</button>
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>

							<!-- Bulk Actions -->
							<div v-if="selectedOrders.length > 0" class="bulk-actions p-3 bg-light mb-3">
								<div class="d-flex align-items-center">
									<span class="mr-3">Selected {{ selectedOrders.length }} orders</span>
									<button class="btn btn-sm btn-outline-success mr-2" @click="openBulkUpdateStatusModal">
										<i class="edit icon"></i> Update Status
									</button>
									<button class="btn btn-sm btn-secondary" @click="selectedOrders = []">
										<i class="times icon"></i> Deselect
									</button>
								</div>
							</div>

							<!-- Pagination -->
							<div v-if="filteredOrders.length > itemsPerPage" class="d-flex justify-content-between mt-4">
								<div>
									<span>Displaying {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }} / {{ filteredOrders.length }} orders</span>
								</div>
								<ul class="pagination">
									<li class="page-item" :class="{ 'disabled': currentPage === 1 }">
										<a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
											<i class="chevron left icon"></i>
										</a>
									</li>
									<li
										v-for="page in totalPages"
										:key="page"
										class="page-item"
										:class="{ 'active': currentPage === page }"
									>
										<a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
									</li>
									<li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
										<a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
											<i class="chevron right icon"></i>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>

		<!-- Order Detail Modal -->
		<div v-if="showOrderDetailModal" class="modal-overlay">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Order Details #{{ selectedOrder._id && selectedOrder._id.substr(-8).toUpperCase() }}</h5>
						<button type="button" class="close" @click="showOrderDetailModal = false">
							<span>&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<div v-if="orderDetailLoading" class="text-center py-3">
							<div class="ui active centered inline loader"></div>
							<p class="mt-2">Loading information...</p>
						</div>

						<div v-else>
							<!-- Order Information -->
							<div class="row mb-4">
								<div class="col-md-6">
									<h6>Order Information</h6>
									<p><strong>Order ID:</strong> {{ selectedOrder._id }}</p>
									<p><strong>Order Date:</strong> {{ formatDate(selectedOrder.createdAt) }}</p>
									<p>
										<strong>Status:</strong>
										<span
											class="badge"
											:class="{
												'badge-success': selectedOrder.status === 'completed',
												'badge-warning': selectedOrder.status === 'pending',
												'badge-danger': selectedOrder.status === 'cancelled'
											}"
										>
											{{ getOrderStatusText(selectedOrder.status) }}
										</span>
									</p>
									<p>
										<strong>Payment:</strong>
										<span
											class="badge"
											:class="{
												'badge-success': selectedOrder.paymentStatus === 'completed',
												'badge-warning': selectedOrder.paymentStatus === 'pending'
											}"
										>
											{{ getPaymentStatusText(selectedOrder.paymentStatus) }}
										</span>
									</p>
									<p><strong>Payment Method:</strong> {{ getPaymentMethodText(selectedOrder.paymentMethod) }}</p>
								</div>

								<div class="col-md-6">
									<h6>Customer Information</h6>
									<p><strong>Customer Name:</strong> {{ selectedOrder.user && (selectedOrder.user.fullName || selectedOrder.user.username) }}</p>
									<p><strong>Email:</strong> {{ selectedOrder.user && selectedOrder.user.email }}</p>
									<p><strong>Phone Number:</strong> {{ selectedOrder.user && selectedOrder.user.phone || 'N/A' }}</p>
									<p><strong>Address:</strong> {{ selectedOrder.user && selectedOrder.user.address || 'N/A' }}</p>
								</div>
							</div>

							<!-- Order Items -->
							<h6>Purchased Products</h6>
							<div class="table-responsive mb-4">
								<table class="table table-bordered">
									<thead>
										<tr>
											<th>Store</th>
											<th class="text-center">Quantity</th>
											<th class="text-right">Price</th>
											<th class="text-right">Total</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(item, index) in selectedOrder.orderItems" :key="index">
											<td>
												<div class="d-flex align-items-center">
													<img
														:src="item.product.image || 'https://picsum.photos/50/50'"
														:alt="item.product.title"
														class="order-item-image mr-2"
													>
													<div>
														<div class="font-weight-bold">{{ item.product.title }}</div>
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
											<td class="text-right">{{ formatCurrency(selectedOrder.totalAmount) }}</td>
										</tr>
										<tr v-if="selectedOrder.discountAmount > 0">
											<td colspan="3" class="text-right font-weight-bold">Discount:</td>
											<td class="text-right text-danger">-{{ formatCurrency(selectedOrder.discountAmount) }}</td>
										</tr>
										<tr>
											<td colspan="3" class="text-right font-weight-bold">Total:</td>
											<td class="text-right font-weight-bold">{{ formatCurrency(selectedOrder.finalAmount) }}</td>
										</tr>
									</tfoot>
								</table>
							</div>

							<!-- Account Details -->
							<div v-if="selectedOrder.status === 'completed'">
								<h6>Account Details</h6>
								<div class="accordion" id="accountsAccordion">
									<div v-for="(item, itemIndex) in selectedOrder.orderItems" :key="itemIndex" class="card mb-3">
										<div class="card-header" :id="`heading${itemIndex}`">
											<h2 class="mb-0">
												<button
													class="btn btn-link btn-block text-left"
													type="button"
													data-toggle="collapse"
													:data-target="`#collapse${itemIndex}`"
													aria-expanded="false"
													:aria-controls="`collapse${itemIndex}`"
												>
													{{ item.product.title }} ({{ item.quantity }} accounts)
												</button>
											</h2>
										</div>

										<div
											:id="`collapse${itemIndex}`"
											class="collapse"
											:aria-labelledby="`heading${itemIndex}`"
											data-parent="#accountsAccordion"
										>
											<div class="card-body">
												<div v-for="(account, accIndex) in item.accounts" :key="accIndex" class="mb-3">
													<div class="mb-2 pb-2 border-bottom">
														<div class="row">
															<div class="col-md-4">
																<strong>Account:</strong> {{ account.username }}
																<button
																	class="btn btn-sm btn-link p-0 ml-1"
																	@click="copyToClipboard(account.username)"
																	title="Copy"
																>
																	<i class="copy icon"></i>
																</button>
															</div>
															<div class="col-md-4">
																<strong>Password:</strong> {{ account.password }}
																<button
																	class="btn btn-sm btn-link p-0 ml-1"
																	@click="copyToClipboard(account.password)"
																	title="Copy"
																>
																	<i class="copy icon"></i>
																</button>
															</div>
															<div class="col-md-4">
																<span v-if="account.additionalInfo">
																	<strong>Information:</strong> {{ account.additionalInfo }}
																</span>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button
							class="btn btn-primary mr-2"
							@click="openUpdateStatusModal(selectedOrder)"
						>
							<i class="edit icon"></i> Update Status
						</button>
						<button type="button" class="btn btn-secondary" @click="showOrderDetailModal = false">
							Close
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Update Status Modal -->
		<div v-if="showUpdateStatusModal" class="modal-overlay">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Update Order Status</h5>
						<button type="button" class="close" @click="showUpdateStatusModal = false">
							<span>&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<form @submit.prevent="updateStatus">
							<div class="form-group">
								<label for="orderStatus">Order Status</label>
								<select class="form-control" id="orderStatus" v-model="statusUpdate.status">
									<option value="pending">Pending Payment</option>
									<option value="completed">Completed</option>
									<option value="cancelled">Cancelled</option>
								</select>
							</div>

							<div class="form-group">
								<label for="paymentStatus">Payment Status</label>
								<select class="form-control" id="paymentStatus" v-model="statusUpdate.paymentStatus">
									<option value="pending">Pending Payment</option>
									<option value="completed">Paid</option>
								</select>
							</div>

							<div v-if="updateError" class="alert alert-danger">
								{{ updateError }}
							</div>

							<div class="text-right">
								<button type="button" class="btn btn-secondary mr-2" @click="showUpdateStatusModal = false">
									Cancel
								</button>
								<button type="submit" class="btn btn-primary" :disabled="updating">
									<span v-if="updating">
										<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
										Updating...
									</span>
									<span v-else>
										<i class="save icon"></i> Update
									</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>

		<!-- Bulk Update Status Modal -->
		<div v-if="showBulkUpdateStatusModal" class="modal-overlay">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Update Multiple Order Statuses</h5>
						<button type="button" class="close" @click="showBulkUpdateStatusModal = false">
							<span>&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<p>You are updating {{ selectedOrders.length }} orders.</p>

						<form @submit.prevent="bulkUpdateStatus">
							<div class="form-group">
								<label for="bulkOrderStatus">Order Status</label>
								<select class="form-control" id="bulkOrderStatus" v-model="bulkStatusUpdate.status">
									<option value="">Keep unchanged</option>
									<option value="pending">Pending Payment</option>
									<option value="completed">Completed</option>
									<option value="cancelled">Cancelled</option>
								</select>
							</div>

							<div class="form-group">
								<label for="bulkPaymentStatus">Payment Status</label>
								<select class="form-control" id="bulkPaymentStatus" v-model="bulkStatusUpdate.paymentStatus">
									<option value="">Keep unchanged</option>
									<option value="pending">Pending Payment</option>
									<option value="completed">Paid</option>
								</select>
							</div>

							<div v-if="bulkUpdateError" class="alert alert-danger">
								{{ bulkUpdateError }}
							</div>

							<div class="text-right">
								<button type="button" class="btn btn-secondary mr-2" @click="showBulkUpdateStatusModal = false">
									Cancel
								</button>
								<button type="submit" class="btn btn-primary" :disabled="bulkUpdating">
									<span v-if="bulkUpdating">
										<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
										Updating...
									</span>
									<span v-else>
										<i class="save icon"></i> Update All
									</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import api from '@/utils/api';
import { formatCurrency, formatDate, getOrderStatusText, getPaymentMethodText } from '@/utils/helpers';

export default {
	name: 'OrderManagement',
	components: {
		AdminSidebar
	},
	data() {
		return {
			orders: [],
			filteredOrders: [],
			loading: true,

			// Pagination
			currentPage: 1,
			itemsPerPage: 10,

			// Filters
			searchQuery: '',
			statusFilter: '',
			paymentStatusFilter: '',
			sortBy: 'createdAt_desc',
			dateRange: {
				start: '',
				end: ''
			},

			// Selection
			selectedOrders: [],
			selectAll: false,

			// Order Detail Modal
			showOrderDetailModal: false,
			selectedOrder: {},
			orderDetailLoading: false,

			// Update Status Modal
			showUpdateStatusModal: false,
			statusUpdate: {
				status: '',
				paymentStatus: ''
			},
			updating: false,
			updateError: null,

			// Bulk Update Status Modal
			showBulkUpdateStatusModal: false,
			bulkStatusUpdate: {
				status: '',
				paymentStatus: ''
			},
			bulkUpdating: false,
			bulkUpdateError: null
		};
	},
	computed: {
		...mapGetters({
			isAuthenticated: 'auth/isAuthenticated',
			isAdmin: 'auth/isAdmin'
		}),
		totalPages() {
			return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
		},
		paginatedOrders() {
			const start = (this.currentPage - 1) * this.itemsPerPage;
			const end = start + this.itemsPerPage;
			return this.filteredOrders.slice(start, end);
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
		async fetchOrders() {
			try {
				this.loading = true;

				const response = await api.get('/orders');

				if (response.data.success) {
					this.orders = response.data.orders;
					this.applyFilters();
				}
			} catch (error) {
				console.error('Error fetching orders:', error);
				this.$toast.error('Unable to load order list');
			} finally {
				this.loading = false;
			}
		},
		refreshOrders() {
			this.fetchOrders();
		},
		searchOrders() {
			this.currentPage = 1;
			this.applyFilters();
		},
		filterOrders() {
			this.currentPage = 1;
			this.applyFilters();
		},
		applyFilters() {
			// Apply filters and sorting
			let filtered = [...this.orders];

			// Search
			if (this.searchQuery) {
				const query = this.searchQuery.toLowerCase();
				filtered = filtered.filter(o =>
					o._id.toLowerCase().includes(query) ||
					(o.user.fullName && o.user.fullName.toLowerCase().includes(query)) ||
					(o.user.username && o.user.username.toLowerCase().includes(query)) ||
					(o.user.email && o.user.email.toLowerCase().includes(query))
				);
			}

			// Filter by status
			if (this.statusFilter) {
				filtered = filtered.filter(o => o.status === this.statusFilter);
			}

			// Filter by payment status
			if (this.paymentStatusFilter) {
				filtered = filtered.filter(o => o.paymentStatus === this.paymentStatusFilter);
			}

			// Filter by date
			if (this.dateRange.start) {
				const startDate = new Date(this.dateRange.start);
				startDate.setHours(0, 0, 0, 0);
				filtered = filtered.filter(o => new Date(o.createdAt) >= startDate);
			}

			if (this.dateRange.end) {
				const endDate = new Date(this.dateRange.end);
				endDate.setHours(23, 59, 59, 999);
				filtered = filtered.filter(o => new Date(o.createdAt) <= endDate);
			}

			// Sorting
			const [field, direction] = this.sortBy.split('_');

			filtered.sort((a, b) => {
				let valueA = a[field];
				let valueB = b[field];

				// Special handling for date
				if (field === 'createdAt' || field === 'updatedAt') {
					valueA = new Date(valueA).getTime();
					valueB = new Date(valueB).getTime();
				}

				if (direction === 'asc') {
					return valueA - valueB;
				} else {
					return valueB - valueA;
				}
			});

			this.filteredOrders = filtered;
		},
		resetFilters() {
			this.searchQuery = '';
			this.statusFilter = '';
			this.paymentStatusFilter = '';
			this.sortBy = 'createdAt_desc';
			this.dateRange = {
				start: '',
				end: ''
			};
			this.applyFilters();
		},
		changePage(page) {
			if (page < 1 || page > this.totalPages) {
				return;
			}
			this.currentPage = page;
		},
		toggleSelectAll() {
			if (this.selectAll) {
				this.selectedOrders = this.filteredOrders.map(o => o._id);
			} else {
				this.selectedOrders = [];
			}
		},
		copyToClipboard(text) {
			navigator.clipboard.writeText(text).then(() => {
				this.$toast.success('Copied to clipboard');
			}).catch(err => {
				console.error('Unable to copy: ', err);
				this.$toast.error('Unable to copy. Please try again.');
			});
		},
		async viewOrderDetail(order) {
			this.selectedOrder = order;
			this.showOrderDetailModal = true;

			// If the order is already populated, no need to call API
			if (order.orderItems && order.orderItems[0] && order.orderItems[0].accounts) {
				return;
			}

			try {
				this.orderDetailLoading = true;

				const response = await api.get(`/orders/${order._id}`);

				if (response.data.success) {
					this.selectedOrder = response.data.order;
				}
			} catch (error) {
				console.error('Error fetching order details:', error);
				this.$toast.error('Unable to load order detail information');
			} finally {
				this.orderDetailLoading = false;
			}
		},
		openUpdateStatusModal(order) {
			this.statusUpdate = {
				status: order.status,
				paymentStatus: order.paymentStatus
			};
			this.updateError = null;
			this.selectedOrder = order;
			this.showUpdateStatusModal = true;
		},
		openBulkUpdateStatusModal() {
			this.bulkStatusUpdate = {
				status: '',
				paymentStatus: ''
			};
			this.bulkUpdateError = null;
			this.showBulkUpdateStatusModal = true;
		},
		async updateStatus() {
			try {
				this.updating = true;
				this.updateError = null;

				const updateData = {};

				if (this.statusUpdate.status) {
					updateData.status = this.statusUpdate.status;
				}

				if (this.statusUpdate.paymentStatus) {
					updateData.paymentStatus = this.statusUpdate.paymentStatus;
				}

				const response = await api.put(`/orders/${this.selectedOrder._id}/status`, updateData);

				if (response.data.success) {
					this.$toast.success('Order status updated successfully!');
					this.showUpdateStatusModal = false;

					// Update the order in the list
					const index = this.orders.findIndex(o => o._id === this.selectedOrder._id);
					if (index !== -1) {
						this.orders[index] = {
							...this.orders[index],
							...updateData
						};
					}

					// Update the selected order
					this.selectedOrder = {
						...this.selectedOrder,
						...updateData
					};

					// Reapply filters
					this.applyFilters();
				}
			} catch (error) {
				console.error('Error updating order status:', error);
				this.updateError = error.response?.data?.message || 'Unable to update order status';
			} finally {
				this.updating = false;
			}
		},
		async bulkUpdateStatus() {
			try {
				this.bulkUpdating = true;
				this.bulkUpdateError = null;

				const updateData = {};

				if (this.bulkStatusUpdate.status) {
					updateData.status = this.bulkStatusUpdate.status;
				}

				if (this.bulkStatusUpdate.paymentStatus) {
					updateData.paymentStatus = this.bulkStatusUpdate.paymentStatus;
				}

				// If nothing to update
				if (Object.keys(updateData).length === 0) {
					this.bulkUpdateError = 'Please select at least one status to update';
					return;
				}

				// Update each selected order
				for (const orderId of this.selectedOrders) {
					await api.put(`/orders/${orderId}/status`, updateData);
				}

				this.$toast.success(`Updated ${this.selectedOrders.length} orders!`);
				this.showBulkUpdateStatusModal = false;
				this.selectedOrders = [];

				// Reload the order list
				this.fetchOrders();
			} catch (error) {
				console.error('Error bulk updating order status:', error);
				this.bulkUpdateError = error.response?.data?.message || 'Unable to update order status';
			} finally {
				this.bulkUpdating = false;
			}
		}
	},
	created() {
		if (!this.isAuthenticated || !this.isAdmin) {
			this.$router.push('/login');
			return;
		}

		this.fetchOrders();
	},
	watch: {
		orders() {
			this.applyFilters();
		}
	}
};
</script>

<style scoped>
.admin-orders .card {
	border: none;
	border-radius: 12px;
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
	transition: all 0.3s ease;
}

.admin-orders .card-body {
	padding: 1.5rem;
}

.admin-orders .input-group {
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
	border-radius: 8px;
	overflow: hidden;
}

.admin-orders .input-group .form-control {
	border: none;
	padding: 0.75rem 1rem;
}

.admin-orders .input-group-append .btn {
	border: none;
	background-color: #f8f9fa;
	color: #4361ee;
	padding: 0.75rem 1.25rem;
}

.admin-orders select.form-control {
	height: calc(2.5rem + 2px);
	border-radius: 8px;
	border: 1px solid #e2e8f0;
	background-color: #fff;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.admin-orders input[type="date"] {
	border-radius: 8px;
	border: 1px solid #e2e8f0;
	height: calc(2.5rem + 2px);
	padding: 0.75rem 1rem;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.admin-orders .table {
	margin-bottom: 0;
	border-collapse: separate;
	border-spacing: 0 5px;
}

.admin-orders .table thead th {
	background-color: #f8f9fa;
	border: none;
	font-weight: 700;
	text-transform: uppercase;
	font-size: 0.75rem;
	letter-spacing: 1px;
	padding: 12px;
	color: #64748b;
}

.admin-orders .table tbody tr {
	background-color: #fff;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
	border-radius: 8px;
	transition: all 0.3s ease;
}

.admin-orders .table tbody tr:hover {
	transform: translateY(-3px);
	box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.admin-orders .table tbody td {
	padding: 15px 12px;
	vertical-align: middle;
	border-top: none;
}

.admin-orders .table tbody td:first-child {
	border-top-left-radius: 8px;
	border-bottom-left-radius: 8px;
}

.admin-orders .table tbody td:last-child {
	border-top-right-radius: 8px;
	border-bottom-right-radius: 8px;
}

.admin-orders .badge {
	font-size: 0.75rem;
	font-weight: 600;
	padding: 0.4em 0.8em;
	border-radius: 30px;
}

.admin-orders .badge-success {
	background-color: #10b981;
	color: white;
}

.admin-orders .badge-warning {
	background-color: #f59e0b;
	color: white;
}

.admin-orders .badge-danger {
	background-color: #ef4444;
	color: white;
}

.admin-orders .btn-group .btn {
	border-radius: 6px;
	margin: 0 2px;
	transition: all 0.3s ease;
}

.admin-orders .btn-outline-primary {
	border-color: #4361ee;
	color: #4361ee;
}

.admin-orders .btn-outline-success {
	border-color: #10b981;
	color: #10b981;
}

.admin-orders .btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.admin-orders .pagination {
	margin-bottom: 0;
}

.admin-orders .page-link {
	border: none;
	margin: 0 3px;
	border-radius: 6px;
	color: #4361ee;
	transition: all 0.3s ease;
}

.admin-orders .page-item.active .page-link {
	background-color: #4361ee;
	box-shadow: 0 4px 6px rgba(67, 97, 238, 0.3);
	color: white;
}

.admin-orders .order-item-image {
	width: 50px;
	height: 50px;
	object-fit: cover;
	border-radius: 8px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Modal styles */
.modal-overlay {
	background-color: rgba(0, 0, 0, 0.7);
}

.modal-content {
	border: none;
	border-radius: 12px;
	box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
}

.modal-header {
	background-color: #4361ee;
	color: white;
	border-radius: 12px 12px 0 0;
	padding: 1.25rem 1.5rem;
}

.modal-body {
	padding: 1.5rem;
}

.modal-footer {
	padding: 1.25rem 1.5rem;
	border-top: 1px solid #eee;
}

pagination-info {
	font-size: 14px;
}
</style>
