<template>
	<div class="admin-accounts">
		<div class="container-fluid">
			<div class="row">
				<!-- Sidebar -->
				<admin-sidebar :active-menu="'accounts'"></admin-sidebar>

				<!-- Main content -->
				<main class="col-md-9 ml-sm-auto col-lg-10 px-md-4 py-4">
					<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
						<h1 class="h2">Account Management</h1>
						<div class="btn-toolbar">
							<button class="btn btn-primary mr-2" @click="openAccountModal()">
								<i class="plus icon"></i> Add New Account
							</button>
							<button class="btn btn-success" @click="openBulkImportModal()">
								<i class="upload icon"></i> Bulk Account Import
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
									placeholder="Search accounts..."
									v-model="searchQuery"
									@keyup.enter="searchAccounts"
								/>
								<div class="input-group-append">
									<button class="btn btn-outline-secondary" type="button" @click="searchAccounts">
										<i class="search icon"></i>
									</button>
								</div>
							</div>
						</div>

						<div class="col-md-3 mb-3">
							<select class="form-control" v-model="productFilter" @change="filterAccounts">
								<option value="">All Products</option>
								<option v-for="product in products" :key="product._id" :value="product._id">
									{{ product.title }}
								</option>
							</select>
						</div>

						<div class="col-md-3 mb-3">
							<select class="form-control" v-model="statusFilter" @change="filterAccounts">
								<option value="">All Status</option>
								<option value="available">Available</option>
								<option value="sold">Sold</option>
							</select>
						</div>

						<div class="col-md-2 mb-3">
							<select class="form-control" v-model="sortBy" @change="filterAccounts">
								<option value="createdAt_desc">Newest</option>
								<option value="createdAt_asc">Oldest</option>
								<option value="username_asc">Username A-Z</option>
								<option value="username_desc">Username Z-A</option>
							</select>
						</div>
					</div>

					<!-- Accounts List -->
					<div class="card">
						<div class="card-body">
							<div v-if="loading" class="text-center py-5">
								<div class="ui active centered inline loader"></div>
								<p class="mt-3">Loading account list...</p>
							</div>

							<div v-else-if="filteredAccounts.length === 0" class="text-center py-5">
								<i class="huge search icon text-muted"></i>
								<h4 class="mt-3">No accounts found</h4>
								<p class="text-muted mb-4">No accounts match the search criteria</p>
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
													/>
													<label class="custom-control-label" for="selectAll"></label>
												</div>
											</th>
											<th>ID</th>
											<th>Product</th>
											<th>Username</th>
											<th>Password</th>
											<th>Status</th>
											<th>Orders</th>
											<th>Creation Date</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="account in paginatedAccounts" :key="account._id">
											<td>
												<div class="custom-control custom-checkbox">
													<input
														type="checkbox"
														class="custom-control-input"
														:id="`account${account._id}`"
														v-model="selectedAccounts"
														:value="account._id"
													/>
													<label class="custom-control-label" :for="`account${account._id}`"></label>
												</div>
											</td>
											<td>{{ account._id }}</td>
											<td>{{ getProductTitle(account.product) }}</td>
											<td>{{ account.username }}</td>
											<td>
												<div class="password-field">
													<span v-if="showPassword[account._id]">{{ account.password }}</span>
													<span v-else>•••••••••••</span>
													<button
														class="btn btn-sm btn-link p-0 ml-2"
														@click="togglePasswordVisibility(account._id)"
													>
														<i :class="showPassword[account._id] ? 'eye slash icon' : 'eye icon'"></i>
													</button>
													<button
														class="btn btn-sm btn-link p-0 ml-1"
														@click="copyToClipboard(account.password)"
														title="Copy password"
													>
														<i class="copy icon"></i>
													</button>
												</div>
											</td>
											<td>
												<span
													class="badge"
													:class="{
														'badge-success': account.status === 'available',
														'badge-secondary': account.status === 'sold'
													}"
												>
													{{ account.status === 'available' ? 'Available' : 'Sold' }}
												</span>
											</td>
											<td>
												<router-link
													v-if="account.order"
													:to="`/admin/orders/${account.order}`"
													class="text-primary"
												>
													{{ account.order }}
												</router-link>
												<span v-else class="text-muted">-</span>
											</td>
											<td>{{ formatDate(account.createdAt) }}</td>
											<td>
												<div class="btn-group">
													<button
														class="btn btn-sm btn-outline-primary"
														@click="openAccountModal(account)"
														title="Edit"
													>
														<i class="edit icon"></i>
													</button>
													<button
														class="btn btn-sm btn-outline-danger"
														@click="confirmDeleteAccount(account)"
														title="Delete"
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
							<div v-if="selectedAccounts.length > 0" class="bulk-actions p-3 bg-light mb-3">
								<div class="d-flex align-items-center">
									<span class="mr-3">Selected {{ selectedAccounts.length }} accounts</span>
									<button class="btn btn-sm btn-danger mr-2" @click="confirmDeleteSelected">
										<i class="trash icon"></i> Delete Selected
									</button>
									<button class="btn btn-sm btn-secondary" @click="selectedAccounts = []">
										<i class="times icon"></i> Deselect
									</button>
								</div>
							</div>

							<!-- Pagination -->
							<div v-if="filteredAccounts.length > itemsPerPage" class="d-flex justify-content-center mt-4">
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

		<!-- Account Modal -->
		<div v-if="showAccountModal" class="modal-overlay">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">{{ editMode ? 'Edit Account' : 'Add New Account' }}</h5>
						<button type="button" class="close" @click="showAccountModal = false">
							<span>&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<form @submit.prevent="saveAccount">
							<div class="form-group">
								<label for="productSelect">Product <span class="text-danger">*</span></label>
								<select
									class="form-control"
									id="productSelect"
									v-model="accountForm.product"
									:class="{ 'is-invalid': submitted && !accountForm.product }"
									required
									:disabled="editMode"
								>
									<option value="">Select Product</option>
									<option v-for="product in products" :key="product._id" :value="product._id">
										{{ product.title }}
									</option>
								</select>
								<div v-if="submitted && !accountForm.product" class="invalid-feedback">
									Please select a product
								</div>
							</div>

							<div class="form-group">
								<label for="accountUsername">Username <span class="text-danger">*</span></label>
								<input
									type="text"
									class="form-control"
									id="accountUsername"
									v-model="accountForm.username"
									:class="{ 'is-invalid': submitted && !accountForm.username }"
									required
								/>
								<div v-if="submitted && !accountForm.username" class="invalid-feedback">
									Please enter a username
								</div>
							</div>

							<div class="form-group">
								<label for="accountPassword">Password <span class="text-danger">*</span></label>
								<input
									type="text"
									class="form-control"
									id="accountPassword"
									v-model="accountForm.password"
									:class="{ 'is-invalid': submitted && !accountForm.password }"
									required
								/>
								<div v-if="submitted && !accountForm.password" class="invalid-feedback">
									Please enter a password
								</div>
							</div>

							<div class="form-group">
								<label for="accountInfo">Additional Info</label>
								<textarea
									class="form-control"
									id="accountInfo"
									rows="3"
									v-model="accountForm.additionalInfo"
								></textarea>
								<small class="form-text text-muted">Additional information about the account (if any)</small>
							</div>

							<div class="form-group">
								<label for="accountStatus">Status</label>
								<select class="form-control" id="accountStatus" v-model="accountForm.status">
									<option value="available">Available</option>
									<option value="sold">Sold</option>
								</select>
							</div>

							<div v-if="error" class="alert alert-danger">
								{{ error }}
							</div>

							<div class="text-right">
								<button type="button" class="btn btn-secondary mr-2" @click="showAccountModal = false">
									Cancel
								</button>
								<button type="submit" class="btn btn-primary" :disabled="saving">
									<span v-if="saving">
										<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
										Saving...
									</span>
									<span v-else>
										<i class="save icon"></i> {{ editMode ? 'Update' : 'Add New' }}
									</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>

		<!-- Bulk Import Modal -->
		<div v-if="showBulkImportModal" class="modal-overlay">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Bulk Account Import</h5>
						<button type="button" class="close" @click="showBulkImportModal = false">
							<span>&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<form @submit.prevent="saveBulkAccounts">
							<div class="form-group">
								<label for="bulkProductSelect">Product <span class="text-danger">*</span></label>
								<select
									class="form-control"
									id="bulkProductSelect"
									v-model="bulkImport.product"
									:class="{ 'is-invalid': bulkSubmitted && !bulkImport.product }"
									required
								>
									<option value="">Select Product</option>
									<option v-for="product in products" :key="product._id" :value="product._id">
										{{ product.title }}
									</option>
								</select>
								<div v-if="bulkSubmitted && !bulkImport.product" class="invalid-feedback">
									Please select a product
								</div>
							</div>

							<div class="form-group">
								<label for="bulkAccounts">Account List <span class="text-danger">*</span></label>
								<textarea
									class="form-control"
									id="bulkAccounts"
									rows="10"
									v-model="bulkImport.accountsText"
									:class="{ 'is-invalid': bulkSubmitted && !bulkImport.accountsText }"
									placeholder="Each account on a new line, format: username|password|additional info (if any)"
									required
								></textarea>
								<div v-if="bulkSubmitted && !bulkImport.accountsText" class="invalid-feedback">
									Please enter the account list
								</div>
								<small class="form-text text-muted">
									Example: netflix_user1|password123|Expiration: 1 year
								</small>
							</div>

							<div v-if="bulkError" class="alert alert-danger">
								{{ bulkError }}
							</div>

							<div v-if="bulkSuccess" class="alert alert-success">
								{{ bulkSuccess }}
							</div>

							<div class="text-right">
								<button type="button" class="btn btn-secondary mr-2" @click="showBulkImportModal = false">
									Cancel
								</button>
								<button type="submit" class="btn btn-primary" :disabled="bulkSaving">
									<span v-if="bulkSaving">
										<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
										Importing...
									</span>
									<span v-else>
										<i class="upload icon"></i> Import Accounts
									</span>
								</button>
							</div>
						</form>
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
						<p v-if="selectedAccounts.length > 0">
							Are you sure you want to delete {{ selectedAccounts.length }} selected accounts?
						</p>
						<p v-else>
							Are you sure you want to delete the account <strong>{{ accountToDelete.username }}</strong>?
						</p>
						<p class="text-danger">Warning: This action cannot be undone.</p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
							Cancel
						</button>
						<button type="button" class="btn btn-danger" @click="deleteAccounts" :disabled="deleting">
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
import { mapGetters } from 'vuex';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import api from '@/utils/api';
import { formatDate } from '@/utils/helpers';

export default {
	name: 'AccountManagement',
	components: {
		AdminSidebar
	},
	data() {
		return {
			accounts: [],
			filteredAccounts: [],
			products: [],
			productMap: {},
			loading: true,
			error: null,

			// Pagination
			currentPage: 1,
			itemsPerPage: 10,

			// Filters
			searchQuery: '',
			productFilter: '',
			statusFilter: '',
			sortBy: 'createdAt_desc',

			// Password visibility
			showPassword: {},

			// Selection
			selectedAccounts: [],
			selectAll: false,

			// Account Modal
			showAccountModal: false,
			editMode: false,
			accountForm: {
				product: '',
				username: '',
				password: '',
				additionalInfo: '',
				status: 'available'
			},
			submitted: false,
			saving: false,

			// Bulk Import Modal
			showBulkImportModal: false,
			bulkImport: {
				product: '',
				accountsText: ''
			},
			bulkSubmitted: false,
			bulkSaving: false,
			bulkError: null,
			bulkSuccess: null,

			// Delete Modal
			showDeleteModal: false,
			accountToDelete: {},
			deleting: false
		};
	},
	computed: {
		...mapGetters({
			isAuthenticated: 'auth/isAuthenticated',
			isAdmin: 'auth/isAdmin'
		}),
		totalPages() {
			return Math.ceil(this.filteredAccounts.length / this.itemsPerPage);
		},
		paginatedAccounts() {
			const start = (this.currentPage - 1) * this.itemsPerPage;
			const end = start + this.itemsPerPage;
			return this.filteredAccounts.slice(start, end);
		}
	},
	methods: {
		formatDate,
		getProductTitle(productId) {
			return this.productMap[productId] || productId;
		},
		async fetchProducts() {
			try {
				const response = await api.get('/products');

				if (response.data.success) {
					this.products = response.data.products;

					// Create a product map for displaying titles
					this.productMap = {};
					this.products.forEach(p => {
						this.productMap[p._id] = p.title;
					});
				}
			} catch (error) {
				console.error('Error fetching products:', error);
				this.$toast.error('Unable to load product list');
			}
		},
		async fetchAccounts() {
			try {
				this.loading = true;

				// If there's a product filter in query param
				if (this.$route.query.product) {
					this.productFilter = this.$route.query.product;
					const response = await api.get(`/accounts/product/${this.productFilter}`);

					if (response.data.success) {
						this.accounts = response.data.accounts;
					}
				} else {
					// Get all accounts (note: backend should support pagination)
					const response = await api.get('/accounts');

					if (response.data.success) {
						this.accounts = response.data.accounts;
					}
				}

				this.applyFilters();
			} catch (error) {
				console.error('Error fetching accounts:', error);
				this.$toast.error('Unable to load account list');
			} finally {
				this.loading = false;
			}
		},
		searchAccounts() {
			this.currentPage = 1;
			this.applyFilters();
		},
		filterAccounts() {
			this.currentPage = 1;
			this.applyFilters();
		},
		applyFilters() {
			// Apply filters and sorting
			let filtered = [...this.accounts];

			// Search
			if (this.searchQuery) {
				const query = this.searchQuery.toLowerCase();
				filtered = filtered.filter(a =>
					a.username.toLowerCase().includes(query) ||
					a._id.toLowerCase().includes(query) ||
					(a.additionalInfo && a.additionalInfo.toLowerCase().includes(query))
				);
			}

			// Filter by product
			if (this.productFilter) {
				filtered = filtered.filter(a => a.product === this.productFilter);
			}

			// Filter by status
			if (this.statusFilter) {
				filtered = filtered.filter(a => a.status === this.statusFilter);
			}

			// Sorting
			const [field, direction] = this.sortBy.split('_');

			filtered.sort((a, b) => {
				let valueA = a[field];
				let valueB = b[field];

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

			this.filteredAccounts = filtered;
		},
		resetFilters() {
			this.searchQuery = '';
			this.productFilter = '';
			this.statusFilter = '';
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
				this.selectedAccounts = this.filteredAccounts.map(a => a._id);
			} else {
				this.selectedAccounts = [];
			}
		},
		togglePasswordVisibility(accountId) {
			this.$set(this.showPassword, accountId, !this.showPassword[accountId]);
		},
		copyToClipboard(text) {
			navigator.clipboard.writeText(text).then(() => {
				this.$toast.success('Copied to clipboard');
			}).catch(err => {
				console.error('Cannot copy: ', err);
				this.$toast.error('Unable to copy. Please try again.');
			});
		},
		openAccountModal(account = null) {
			this.editMode = !!account;

			if (account) {
				// Edit existing account
				this.accountForm = {
					product: account.product,
					username: account.username,
					password: account.password,
					additionalInfo: account.additionalInfo || '',
					status: account.status
				};
			} else {
				// Add new account
				this.accountForm = {
					product: this.productFilter || '',
					username: '',
					password: '',
					additionalInfo: '',
					status: 'available'
				};
			}

			this.accountToEdit = account;
			this.submitted = false;
			this.error = null;
			this.showAccountModal = true;
		},
		openBulkImportModal() {
			this.bulkImport = {
				product: this.productFilter || '',
				accountsText: ''
			};
			this.bulkSubmitted = false;
			this.bulkError = null;
			this.bulkSuccess = null;
			this.showBulkImportModal = true;
		},
		async saveAccount() {
			this.submitted = true;

			if (!this.accountForm.product || !this.accountForm.username || !this.accountForm.password) {
				return;
			}

			try {
				this.saving = true;
				this.error = null;

				const accountData = {
					product: this.accountForm.product,
					username: this.accountForm.username,
					password: this.accountForm.password,
					additionalInfo: this.accountForm.additionalInfo,
					status: this.accountForm.status
				};

				let response;

				if (this.editMode) {
					// Update account
					response = await api.put(`/accounts/${this.accountToEdit._id}`, accountData);
				} else {
					// Add new account
					response = await api.post('/accounts', accountData);
				}

				if (response.data.success) {
					this.showAccountModal = false;
					this.$toast.success(this.editMode ? 'Account updated successfully!' : 'New account added successfully!');

					// Reload account list
					this.fetchAccounts();
				}
			} catch (error) {
				console.error('Error saving account:', error);
				this.error = error.response?.data?.message || 'Unable to save account. Please try again later.';
			} finally {
				this.saving = false;
			}
		},
		async saveBulkAccounts() {
			this.bulkSubmitted = true;

			if (!this.bulkImport.product || !this.bulkImport.accountsText) {
				return;
			}

			try {
				this.bulkSaving = true;
				this.bulkError = null;
				this.bulkSuccess = null;

				// Process text into account objects
				const lines = this.bulkImport.accountsText.split('\n').filter(line => line.trim());
				const accounts = [];

				for (const line of lines) {
					const parts = line.split('|');

					if (parts.length < 2) {
						this.bulkError = `Invalid format: ${line}`;
						return;
					}

					accounts.push({
						username: parts[0].trim(),
						password: parts[1].trim(),
						additionalInfo: parts[2] ? parts[2].trim() : ''
					});
				}

				const response = await api.post('/accounts/bulk', {
					product: this.bulkImport.product,
					accounts
				});

				if (response.data.success) {
					this.bulkSuccess = `Successfully added ${response.data.count} accounts!`;
					this.bulkImport.accountsText = '';
					this.bulkSubmitted = false;

					// Reload account list
					this.fetchAccounts();
				}
			} catch (error) {
				console.error('Error bulk importing accounts:', error);
				this.bulkError = error.response?.data?.message || 'Unable to import accounts. Please try again later.';
			} finally {
				this.bulkSaving = false;
			}
		},
		confirmDeleteAccount(account) {
			this.accountToDelete = account;
			this.selectedAccounts = [];
			this.showDeleteModal = true;
		},
		confirmDeleteSelected() {
			this.accountToDelete = {};
			this.showDeleteModal = true;
		},
		async deleteAccounts() {
			try {
				this.deleting = true;

				if (this.selectedAccounts.length > 0) {
					// Delete multiple accounts
					for (const accountId of this.selectedAccounts) {
						await api.delete(`/accounts/${accountId}`);
					}

					this.$toast.success(`Successfully deleted ${this.selectedAccounts.length} accounts!`);
					this.selectedAccounts = [];
				} else {
					// Delete one account
					await api.delete(`/accounts/${this.accountToDelete._id}`);
					this.$toast.success('Account deleted successfully!');
				}

				this.showDeleteModal = false;

				// Reload account list
				this.fetchAccounts();
			} catch (error) {
				console.error('Error deleting accounts:', error);
				this.$toast.error(error.response?.data?.message || 'Unable to delete accounts. Please try again later.');
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

		this.fetchProducts().then(() => {
			this.fetchAccounts();
		});
	},
	watch: {
		accounts() {
			this.applyFilters();
		}
	}
};
</script>

<style scoped>
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
	max-width: 500px;
	margin: 0 auto;
}

.modal-lg {
	max-width: 800px;
}

.bulk-actions {
	position: sticky;
	bottom: 0;
	background-color: #f8f9fa;
	border-top: 1px solid #ddd;
	border-radius: 0 0 0.25rem 0.25rem;
}

.password-field {
	display: flex;
	align-items: center;
}
</style>
