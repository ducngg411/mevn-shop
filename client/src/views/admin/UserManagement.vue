<template>
	<div class="admin-users">
		<div class="container-fluid">
			<div class="row">
				<!-- Sidebar -->
				<admin-sidebar :active-menu="'users'"></admin-sidebar>

				<!-- Main content -->
				<main class="col-md-9 ml-sm-auto col-lg-10 px-md-4 py-4">
					<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
						<h1 class="h2">User Management</h1>
						<button class="btn btn-primary" @click="openUserModal()">
							<i class="user plus icon"></i> Add New User
						</button>
					</div>

					<!-- Filters and search -->
					<div class="row mb-4">
						<div class="col-md-6 mb-3">
							<div class="input-group">
								<input
									type="text"
									class="form-control"
									placeholder="Search users..."
									v-model="searchQuery"
									@keyup.enter="searchUsers"
								>
								<div class="input-group-append">
									<button class="btn btn-outline-secondary" type="button" @click="searchUsers">
										<i class="search icon"></i>
									</button>
								</div>
							</div>
						</div>

						<div class="col-md-3 mb-3">
							<select class="form-control" v-model="roleFilter" @change="filterUsers">
								<option value="">All Roles</option>
								<option value="admin">Administrators</option>
								<option value="customer">Customers</option>
							</select>
						</div>

						<div class="col-md-3 mb-3">
							<select class="form-control" v-model="sortBy" @change="filterUsers">
								<option value="createdAt_desc">Newest</option>
								<option value="createdAt_asc">Oldest</option>
								<option value="username_asc">Username A-Z</option>
								<option value="username_desc">Username Z-A</option>
							</select>
						</div>
					</div>

					<!-- Users List -->
					<div class="card">
						<div class="card-body">
							<div v-if="loading" class="text-center py-5">
								<div class="ui active centered inline loader"></div>
								<p class="mt-3">Loading user list...</p>
							</div>

							<div v-else-if="filteredUsers.length === 0" class="text-center py-5">
								<i class="huge users icon text-muted"></i>
								<h4 class="mt-3">No users found</h4>
								<p class="text-muted mb-4">No users match the search criteria</p>
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
											<th>Username</th>
											<th>Full Name</th>
											<th>Email</th>
											<th>Role</th>
											<th>Registered</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="user in paginatedUsers" :key="user._id">
											<td>
												<div class="custom-control custom-checkbox">
													<input
														type="checkbox"
														class="custom-control-input"
														:id="`user${user._id}`"
														v-model="selectedUsers"
														:value="user._id"
														:disabled="user.role === 'admin'"
													>
													<label class="custom-control-label" :for="`user${user._id}`"></label>
												</div>
											</td>
											<td>{{ user.username }}</td>
											<td>{{ user.fullName || 'N/A' }}</td>
											<td>{{ user.email }}</td>
											<td>
												<span
													class="badge"
													:class="{
														'badge-primary': user.role === 'admin',
														'badge-secondary': user.role === 'customer'
													}"
												>
													{{ user.role === 'admin' ? 'Administrator' : 'Customer' }}
												</span>
											</td>
											<td>{{ formatDate(user.createdAt) }}</td>
											<td>
												<div class="btn-group">
                                                    <button
                                                        class="btn btn-sm btn-outline-info"
                                                        @click="fetchUserOrders(user._id)"
                                                        title="View Orders"
                                                    >
                                                        <i class="shopping bag icon"></i>
                                                    </button>
													<button
														class="btn btn-sm btn-outline-primary"
														@click="openUserModal(user)"
														title="Edit"
													>
														<i class="edit icon"></i>
													</button>
													<button
														class="btn btn-sm btn-outline-danger"
														@click="confirmDeleteUser(user)"
														title="Delete"
														:disabled="user.role === 'admin' && user._id !== currentUser._id"
													>
														<i class="trash icon"></i>
													</button>
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>

							<!-- Bulk Actions -->
							<div v-if="selectedUsers.length > 0" class="bulk-actions p-3 bg-light mb-3">
								<div class="d-flex align-items-center">
									<span class="mr-3">Selected {{ selectedUsers.length }} users</span>
									<button class="btn btn-sm btn-danger mr-2" @click="confirmDeleteSelected">
										<i class="trash icon"></i> Delete Selected
									</button>
									<button class="btn btn-sm btn-secondary" @click="selectedUsers = []">
										<i class="times icon"></i> Deselect
									</button>
								</div>
							</div>

							<!-- Pagination -->
							<div v-if="filteredUsers.length > itemsPerPage" class="d-flex justify-content-center mt-4">
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

		<!-- User Modal -->
		<div v-if="showUserModal" class="modal-overlay">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">{{ editMode ? 'Edit User' : 'Add New User' }}</h5>
						<button type="button" class="close" @click="showUserModal = false">
							<span>&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<form @submit.prevent="saveUser">
							<div class="form-group">
								<label for="username">Username <span class="text-danger">*</span></label>
								<input
									type="text"
									class="form-control"
									id="username"
									v-model="userForm.username"
									:class="{ 'is-invalid': submitted && !userForm.username }"
									required
									:disabled="editMode"
								>
								<div v-if="submitted && !userForm.username" class="invalid-feedback">
									Please enter a username
								</div>
							</div>

							<div class="form-group">
								<label for="email">Email <span class="text-danger">*</span></label>
								<input
									type="email"
									class="form-control"
									id="email"
									v-model="userForm.email"
									:class="{ 'is-invalid': submitted && !validEmail }"
									required
								>
								<div v-if="submitted && !userForm.email" class="invalid-feedback">
									Please enter an email
								</div>
								<div v-else-if="submitted && userForm.email && !validEmail" class="invalid-feedback">
									Please enter a valid email
								</div>
							</div>

							<div class="form-group">
								<label for="fullName">Full Name <span class="text-danger">*</span></label>
								<input
									type="text"
									class="form-control"
									id="fullName"
									v-model="userForm.fullName"
									:class="{ 'is-invalid': submitted && !userForm.fullName }"
									required
								>
								<div v-if="submitted && !userForm.fullName" class="invalid-feedback">
									Please enter a full name
								</div>
							</div>

							<div class="row">
								<div class="col-md-6">
									<div class="form-group">
										<label for="phone">Phone Number</label>
										<input
											type="tel"
											class="form-control"
											id="phone"
											v-model="userForm.phone"
										>
									</div>
								</div>
								<div class="col-md-6">
									<div class="form-group">
										<label for="role">Role <span class="text-danger">*</span></label>
										<select
											class="form-control"
											id="role"
											v-model="userForm.role"
											:class="{ 'is-invalid': submitted && !userForm.role }"
											required
										>
											<option value="customer">Customer</option>
											<option value="admin">Administrator</option>
										</select>
										<div v-if="submitted && !userForm.role" class="invalid-feedback">
											Please select a role
										</div>
									</div>
								</div>
							</div>

							<div class="form-group">
								<label for="address">Address</label>
								<textarea
									class="form-control"
									id="address"
									rows="2"
									v-model="userForm.address"
								></textarea>
							</div>

							<div class="form-group">
								<label for="password">
                                {{ editMode ? 'New Password' : 'Password' }} 
                                <span v-if="!editMode" class="text-danger">*</span>
                                </label>
								<input
									type="password"
									class="form-control"
									id="password"
									v-model="userForm.password"
									:class="{ 'is-invalid': submitted && !editMode && !validPassword }"
									:required="!editMode"
								>
								<div v-if="submitted && !editMode && !userForm.password" class="invalid-feedback">
									Please enter a password
								</div>
								<div v-else-if="submitted && userForm.password && !validPassword" class="invalid-feedback">
									Password must be at least 6 characters
								</div>
								<small class="form-text text-muted" v-if="editMode">Leave blank to keep current password</small>
							</div>

							<div v-if="error" class="alert alert-danger">
								{{ error }}
							</div>

							<div class="text-right">
								<button type="button" class="btn btn-secondary mr-2" @click="showUserModal = false">
									Cancel
								</button>
								<button type="submit" class="btn btn-primary" :disabled="saving">
									<span v-if="saving">
										<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
										Saving...
									</span>
									<span v-else>
										<i class="save icon"></i> {{ editMode ? 'Update' : 'Add User' }}
									</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>

        <!-- User Orders Modal -->
        <div v-if="showUserOrdersModal" class="modal-overlay">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ userWithOrdersDisplayed ? `Orders for ${userWithOrdersDisplayed.fullName || userWithOrdersDisplayed.username}` : 'User Orders' }}
                        </h5>
                        <button type="button" class="close" @click="showUserOrdersModal = false">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div v-if="userOrdersLoading" class="text-center py-3">
                            <div class="ui active centered inline loader"></div>
                            <p class="mt-2">Loading orders...</p>
                        </div>
                        
                        <div v-else-if="selectedUserOrders.length === 0" class="text-center py-3">
                            <i class="huge shopping bag icon text-muted"></i>
                            <p class="mt-3">This user has no orders yet.</p>
                        </div>
                        
                        <div v-else>
                            <div class="table-responsive">
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Date</th>
                                            <th>Items</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Payment</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="order in selectedUserOrders" :key="order._id">
                                            <td>{{ order._id.substr(-8).toUpperCase() }}</td>
                                            <td>{{ formatDate(order.createdAt) }}</td>
                                            <td>{{ order.orderItems.length }}</td>
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
                                                <a :href="`/orders/${order._id}`" class="btn btn-sm btn-outline-primary">
                                                    <i class="eye icon"></i> View
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showUserOrdersModal = false">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>

		<!-- Delete Confirmation Modal -->
		<div v-if="showDeleteModal" class="modal-overlay">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Confirm Deletion</h5>
						<button type="button" class="close" @click="showDeleteModal = false">
							<span>&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<p v-if="selectedUsers.length > 0">
							Are you sure you want to delete {{ selectedUsers.length }} selected users?
						</p>
						<p v-else>
							Are you sure you want to delete the user <strong>{{ userToDelete.username }}</strong>?
						</p>
						<p class="text-danger">Note: This action cannot be undone.</p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
							Cancel
						</button>
						<button type="button" class="btn btn-danger" @click="deleteUsers" :disabled="deleting">
							<span v-if="deleting">
								<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
								Deleting...
							</span>
							<span v-else>
								<i class="trash icon"></i> Confirm Deletion
							</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import api from '@/utils/api';
import { formatDate, formatCurrency } from '@/utils/helpers';

export default {
	name: 'UserManagement',
	components: {
		AdminSidebar
	},
	data() {
		return {
			users: [],
			filteredUsers: [],
			loading: true,
			error: null,

			// Pagination
			currentPage: 1,
			itemsPerPage: 10,

			// Filters
			searchQuery: '',
			roleFilter: '',
			sortBy: 'createdAt_desc',

			// Selection
			selectedUsers: [],
			selectAll: false,

			// User Modal
			showUserModal: false,
			editMode: false,
			userForm: {
				username: '',
				email: '',
				fullName: '',
				phone: '',
				address: '',
				role: 'customer',
				password: ''
			},
			submitted: false,
			saving: false,

			// Delete Modal
			showDeleteModal: false,
			userToDelete: {},
			deleting: false,

            // View orders
            showUserOrdersModal: false,
            selectedUserOrders: [],
            userOrdersLoading: false,
            userWithOrdersDisplayed: null
            };
	},
	computed: {
		...mapGetters({
			isAuthenticated: 'auth/isAuthenticated',
			isAdmin: 'auth/isAdmin'
		}),
		...mapState({
			currentUser: state => state.auth.user
		}),
		totalPages() {
			return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
		},
		paginatedUsers() {
			const start = (this.currentPage - 1) * this.itemsPerPage;
			const end = start + this.itemsPerPage;
			return this.filteredUsers.slice(start, end);
		},
		validEmail() {
			const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return !this.userForm.email || re.test(String(this.userForm.email).toLowerCase());
		},
		validPassword() {
			return !this.userForm.password || this.userForm.password.length >= 6;
		}
	},
	methods: {
		formatDate,
        formatCurrency,
		async fetchUsers() {
			try {
				this.loading = true;

				const response = await api.get('/users');

				if (response.data.success) {
					this.users = response.data.users;
					this.applyFilters();
				}
			} catch (error) {
				console.error('Error fetching users:', error);
				this.$toast.error('Unable to load user list');
			} finally {
				this.loading = false;
			}
		},
        async fetchUserOrders(userId) {
            try {
                this.userOrdersLoading = true;
                this.selectedUserOrders = [];
                
                const response = await api.get(`/users/${userId}/orders`);
                
                if (response.data.success) {
                    this.selectedUserOrders = response.data.orders;
                    this.userWithOrdersDisplayed = this.users.find(u => u._id === userId);
                    this.showUserOrdersModal = true;
                    console.log('User orders:', this.selectedUserOrders);
                }
            } catch (error) {
                console.error('Error fetching user orders:', error);
                this.$toast.error('Unable to load user orders');
            } finally {
                this.userOrdersLoading = false;
            }
        },
		searchUsers() {
			this.currentPage = 1;
			this.applyFilters();
		},
		filterUsers() {
			this.currentPage = 1;
			this.applyFilters();
		},
		applyFilters() {
			// Apply filters and sorting
			let filtered = [...this.users];

			// Search
			if (this.searchQuery) {
				const query = this.searchQuery.toLowerCase();
				filtered = filtered.filter(u =>
					u.username.toLowerCase().includes(query) ||
					(u.fullName && u.fullName.toLowerCase().includes(query)) ||
					u.email.toLowerCase().includes(query)
				);
			}

			// Filter by role
			if (this.roleFilter) {
				filtered = filtered.filter(u => u.role === this.roleFilter);
			}

			// Sorting
			const [field, direction] = this.sortBy.split('_');

			filtered.sort((a, b) => {
				let valueA = a[field];
				let valueB = b[field];

				if (field === 'fullName' && (!valueA || !valueB)) {
					valueA = valueA || '';
					valueB = valueB || '';
				}

				if (typeof valueA === 'string') {
					if (direction === 'asc') {
						return valueA.localeCompare(valueB);
					} else {
						return valueB.localeCompare(valueA);
					}
				} else {
					if (direction === 'asc') {
						return valueA - valueB;
					} else {
						return valueB - valueA;
					}
				}
			});

			this.filteredUsers = filtered;
		},
		resetFilters() {
			this.searchQuery = '';
			this.roleFilter = '';
			this.sortBy = 'createdAt_desc';
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
				// Only select non-admin users
				this.selectedUsers = this.filteredUsers
					.filter(u => u.role !== 'admin')
					.map(u => u._id);
			} else {
				this.selectedUsers = [];
			}
		},
		openUserModal(user = null) {
			this.editMode = !!user;

			if (user) {
				// Edit existing user
				this.userForm = {
					username: user.username,
					email: user.email,
					fullName: user.fullName || '',
					phone: user.phone || '',
					address: user.address || '',
					role: user.role,
					password: '' // Clear password field for editing
				};
			} else {
				// Add new user
				this.userForm = {
					username: '',
					email: '',
					fullName: '',
					phone: '',
					address: '',
					role: 'customer',
					password: ''
				};
			}

			this.userToEdit = user;
			this.submitted = false;
			this.error = null;
			this.showUserModal = true;
		},
		async saveUser() {
			this.submitted = true;

			// Validation for adding a new user
			if (!this.editMode && (!this.userForm.username || !this.userForm.email || 
				!this.userForm.fullName || !this.userForm.role || !this.userForm.password)) {
				return;
			}

			// Validation for editing a user
			if (this.editMode && (!this.userForm.email || !this.userForm.fullName || !this.userForm.role)) {
				return;
			}

			// Email validation
			if (!this.validEmail) {
				return;
			}

			// Password validation (if provided)
			if (this.userForm.password && !this.validPassword) {
				return;
			}

			try {
				this.saving = true;
				this.error = null;

				const userData = {
					username: this.userForm.username,
					email: this.userForm.email,
					fullName: this.userForm.fullName,
					phone: this.userForm.phone || '',
					address: this.userForm.address || '',
					role: this.userForm.role
				};

				// Only include password if it's provided
				if (this.userForm.password) {
					userData.password = this.userForm.password;
				}

				let response;

				if (this.editMode) {
					// Update user
					response = await api.put(`/users/${this.userToEdit._id}`, userData);
				} else {
					// Add new user
					response = await api.post('/auth/register', userData);
				}

				if (response.data.success) {
					this.showUserModal = false;
					this.$toast.success(this.editMode ? 'User updated successfully!' : 'New user added successfully!');

					// Reload user list
					this.fetchUsers();
				}
			} catch (error) {
				console.error('Error saving user:', error);
				this.error = error.response?.data?.message || 'Unable to save user. Please try again later.';
			} finally {
				this.saving = false;
			}
		},
        getOrderStatusText(status) {
            const statusMap = {
                'pending': 'Pending',
                'completed': 'Completed',
                'cancelled': 'Cancelled'
            };
            return statusMap[status] || status;
        },
        getPaymentStatusText(status) {
        const statusMap = {
            'pending': 'Pending',
            'completed': 'Completed',
            'cancelled': 'Cancelled'
        };
            return statusMap[status] || status;
        },
		confirmDeleteUser(user) {
			this.userToDelete = user;
			this.selectedUsers = [];
			this.showDeleteModal = true;
		},
		confirmDeleteSelected() {
			this.userToDelete = {};
			this.showDeleteModal = true;
		},
		async deleteUsers() {
			try {
				this.deleting = true;

				if (this.selectedUsers.length > 0) {
					// Delete multiple users
					for (const userId of this.selectedUsers) {
						await api.delete(`/users/${userId}`);
					}

					this.$toast.success(`Successfully deleted ${this.selectedUsers.length} users!`);
					this.selectedUsers = [];
				} else {
					// Delete a single user
					await api.delete(`/users/${this.userToDelete._id}`);
					this.$toast.success('User deleted successfully!');
				}

				this.showDeleteModal = false;

				// Reload user list
				this.fetchUsers();
			} catch (error) {
				console.error('Error deleting users:', error);
				this.$toast.error(error.response?.data?.message || 'Unable to delete users. Please try again later.');
			} finally {
				this.deleting = false;
			}
		}
	},
	created() {
		if (!this.isAuthenticated || !this.isAdmin) {
			this.$router.push('/login');
			return;
		}

		this.fetchUsers();
	},
	watch: {
		users() {
			this.applyFilters();
		}
	}
};
</script>

<style scoped>
.admin-users .card {
	border: none;
	border-radius: 12px;
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
	transition: all 0.3s ease;
}

.admin-users .card-body {
	padding: 1.5rem;
}

.admin-users .input-group {
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
	border-radius: 8px;
	overflow: hidden;
}

.admin-users .input-group .form-control {
	border: none;
	padding: 0.75rem 1rem;
}

.admin-users .input-group-append .btn {
	border: none;
	background-color: #f8f9fa;
	color: #4361ee;
	padding: 0.75rem 1.25rem;
}

.admin-users select.form-control {
	height: calc(2.5rem + 2px);
	border-radius: 8px;
	border: 1px solid #e2e8f0;
	background-color: #fff;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.admin-users .table {
	margin-bottom: 0;
	border-collapse: separate;
	border-spacing: 0 5px;
}

.admin-users .table thead th {
	background-color: #f8f9fa;
	border: none;
	font-weight: 700;
	text-transform: uppercase;
	font-size: 0.75rem;
	letter-spacing: 1px;
	padding: 12px;
	color: #64748b;
}

.admin-users .table tbody tr {
	background-color: #fff;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
	border-radius: 8px;
	transition: all 0.3s ease;
}

.admin-users .table tbody tr:hover {
	transform: translateY(-3px);
	box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.admin-users .table tbody td {
	padding: 15px 12px;
	vertical-align: middle;
	border-top: none;
}

.admin-users .table tbody td:first-child {
	border-top-left-radius: 8px;
	border-bottom-left-radius: 8px;
}

.admin-users .table tbody td:last-child {
	border-top-right-radius: 8px;
	border-bottom-right-radius: 8px;
}

.admin-users .badge {
	font-size: 0.75rem;
	font-weight: 600;
	padding: 0.4em 0.8em;
	border-radius: 30px;
}

.admin-users .badge-primary {
	background-color: #4361ee;
	color: white;
}

.admin-users .badge-secondary {
	background-color: #64748b;
	color: white;
}

.admin-users .btn-group .btn {
	border-radius: 6px;
	margin: 0 2px;
	transition: all 0.3s ease;
}

.admin-users .btn-outline-primary {
	border-color: #4361ee;
	color: #4361ee;
}

.admin-users .btn-outline-danger {
	border-color: #ef4444;
	color: #ef4444;
}

.admin-users .btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.admin-users .pagination {
	margin-bottom: 0;
}

.admin-users .page-link {
	border: none;
	margin: 0 3px;
	border-radius: 6px;
	color: #4361ee;
	transition: all 0.3s ease;
}

.admin-users .page-item.active .page-link {
	background-color: #4361ee;
	box-shadow: 0 4px 6px rgba(67, 97, 238, 0.3);
}

.admin-users .table-bordered {
    border: 1px solid #dee2e6;
}

.admin-users .table-bordered th,
.admin-users .table-bordered td {
    border: 1px solid #dee2e6;
}

.admin-users .modal-lg {
    max-width: 900px;
}

.admin-users .badge-warning {
    background-color: #f39c12;
    color: white;
}

.admin-users .badge-danger {
    background-color: #e74c3c;
    color: white;
}

.admin-users .order-detail {
    cursor: pointer;
}

.admin-users .order-detail:hover {
    background-color: #f8f9fa;
}

/* Bulk actions */
.bulk-actions {
	background-color: rgba(67, 97, 238, 0.05);
	border-radius: 8px;
	border: 1px solid rgba(67, 97, 238, 0.1);
	margin-top: 1rem;
}

/* Modal styling */
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1050;
}

.modal-dialog {
	width: 100%;
	max-width: 600px;
	margin: 0 auto;
}

.modal-content {
	border: none;
	border-radius: 12px;
	box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
	overflow: hidden;
}

.modal-header {
	background-color: #4361ee;
	color: white;
	border-bottom: none;
	padding: 1.25rem 1.5rem;
}

.modal-body {
	padding: 1.5rem;
}

.modal-footer {
	padding: 1.25rem 1.5rem;
	border-top: 1px solid #f1f3f5;
	background-color: #f8f9fa;
}
</style>