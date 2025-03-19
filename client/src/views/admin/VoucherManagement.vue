<template>
	<div class="admin-vouchers">
		<div class="container-fluid">
			<div class="row">
				<!-- Sidebar -->
				<admin-sidebar :active-menu="'vouchers'"></admin-sidebar>

				<!-- Main content -->
				<main class="col-md-9 ml-sm-auto col-lg-10 px-md-4 py-4">
					<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
						<h1 class="h2">Voucher Management</h1>
						<button class="btn btn-primary" @click="openVoucherModal()">
							<i class="plus icon"></i> Add New Voucher
						</button>
					</div>

					<!-- Filters and search -->
					<div class="row mb-4">
						<div class="col-md-6 mb-3">
							<div class="input-group">
								<input
									type="text"
									class="form-control"
									placeholder="Search vouchers..."
									v-model="searchQuery"
									@keyup.enter="searchVouchers"
								>
								<div class="input-group-append">
									<button class="btn btn-outline-secondary" type="button" @click="searchVouchers">
										<i class="search icon"></i>
									</button>
								</div>
							</div>
						</div>

						<div class="col-md-3 mb-3">
							<select class="form-control" v-model="statusFilter" @change="filterVouchers">
								<option value="">All statuses</option>
								<option value="active">Active</option>
								<option value="inactive">Inactive</option>
								<option value="expired">Expired</option>
							</select>
						</div>

						<div class="col-md-3 mb-3">
							<select class="form-control" v-model="sortBy" @change="filterVouchers">
								<option value="createdAt_desc">Newest</option>
								<option value="createdAt_asc">Oldest</option>
								<option value="code_asc">Code A-Z</option>
								<option value="code_desc">Code Z-A</option>
								<option value="endDate_asc">Soonest Expiry Date</option>
							</select>
						</div>
					</div>

					<!-- Vouchers List -->
					<div class="card">
						<div class="card-body">
							<div v-if="loading" class="text-center py-5">
								<div class="ui active centered inline loader"></div>
								<p class="mt-3">Loading voucher list...</p>
							</div>

							<div v-else-if="filteredVouchers.length === 0" class="text-center py-5">
								<i class="huge ticket alternate icon text-muted"></i>
								<h4 class="mt-3">No vouchers found</h4>
								<p class="text-muted mb-4">You have not created any vouchers or no vouchers match the search criteria</p>
								<button v-if="searchQuery || statusFilter" class="btn btn-outline-primary" @click="resetFilters">
									<i class="undo icon"></i> Reset Filters
								</button>
								<button v-else class="btn btn-primary" @click="openVoucherModal()">
									<i class="plus icon"></i> Add New Voucher
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
											<th>Voucher Code</th>
											<th>Type</th>
											<th>Value</th>
											<th>Minimum Order Value</th>
											<th>Expiration</th>
											<th>Status</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="voucher in paginatedVouchers" :key="voucher._id">
											<td>
												<div class="custom-control custom-checkbox">
													<input
														type="checkbox"
														class="custom-control-input"
														:id="`voucher${voucher._id}`"
														v-model="selectedVouchers"
														:value="voucher._id"
													>
													<label class="custom-control-label" :for="`voucher${voucher._id}`"></label>
												</div>
											</td>
											<td>
												<div class="font-weight-bold">{{ voucher.code }}</div>
												<div class="small text-muted">ID: {{ voucher._id }}</div>
											</td>
											<td>
												<span v-if="voucher.discountType === 'percentage'">
													Percentage
												</span>
												<span v-else>
													Fixed Amount
												</span>
											</td>
											<td>
												<span v-if="voucher.discountType === 'percentage'">
													{{ voucher.discountValue }}%
													<span v-if="voucher.maxDiscountAmount > 0" class="text-muted d-block small">
														(Max {{ formatCurrency(voucher.maxDiscountAmount) }})
													</span>
												</span>
												<span v-else>
													{{ formatCurrency(voucher.discountValue) }}
												</span>
											</td>
											<td>
												<span v-if="voucher.minOrderValue > 0">
													{{ formatCurrency(voucher.minOrderValue) }}
												</span>
												<span v-else class="text-muted">-</span>
											</td>
											<td>
												<div>
													<span class="text-muted">From:</span> {{ formatDate(voucher.startDate) }}
												</div>
												<div>
													<span class="text-muted">To:</span> {{ formatDate(voucher.endDate) }}
												</div>
											</td>
											<td>
												<span
													class="badge"
													:class="{
														'badge-success': isVoucherActive(voucher),
														'badge-danger': isVoucherExpired(voucher),
														'badge-secondary': !voucher.isActive && !isVoucherExpired(voucher)
													}"
												>
													{{ getVoucherStatusText(voucher) }}
												</span>
											</td>
											<td>
												<div class="btn-group">
													<button
														class="btn btn-sm btn-outline-primary"
														@click="openVoucherModal(voucher)"
														title="Edit"
													>
														<i class="edit icon"></i>
													</button>
													<button
														class="btn btn-sm btn-outline-danger"
														@click="confirmDeleteVoucher(voucher)"
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
							<div v-if="selectedVouchers.length > 0" class="bulk-actions p-3 bg-light mb-3">
								<div class="d-flex align-items-center">
									<span class="mr-3">Selected {{ selectedVouchers.length }} vouchers</span>
									<button class="btn btn-sm btn-success mr-2" @click="toggleSelectedVouchersStatus(true)">
										<i class="check icon"></i> Activate
									</button>
									<button class="btn btn-sm btn-warning mr-2" @click="toggleSelectedVouchersStatus(false)">
										<i class="ban icon"></i> Deactivate
									</button>
									<button class="btn btn-sm btn-danger mr-2" @click="confirmDeleteSelected">
										<i class="trash icon"></i> Delete Selected
									</button>
									<button class="btn btn-sm btn-secondary" @click="selectedVouchers = []">
										<i class="times icon"></i> Deselect
									</button>
								</div>
							</div>

							<!-- Pagination -->
							<div v-if="filteredVouchers.length > itemsPerPage" class="d-flex justify-content-center mt-4">
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

		<!-- Voucher Modal -->
		<div v-if="showVoucherModal" class="modal-overlay">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">{{ editMode ? 'Edit Voucher' : 'Add New Voucher' }}</h5>
						<button type="button" class="close" @click="showVoucherModal = false">
							<span>&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<form @submit.prevent="saveVoucher">
							<div class="form-group">
								<label for="voucherCode">Voucher Code <span class="text-danger">*</span></label>
								<input
									type="text"
									class="form-control"
									id="voucherCode"
									v-model="voucherForm.code"
									:class="{ 'is-invalid': submitted && !voucherForm.code }"
									required
									:disabled="editMode"
								>
								<div v-if="submitted && !voucherForm.code" class="invalid-feedback">
									Please enter a voucher code
								</div>
								<small v-if="!editMode" class="form-text text-muted">
									The voucher code must be unique, e.g., SUMMER2023, WELCOME10, ...
								</small>
							</div>

							<div class="form-group">
								<label for="discountType">Discount Type <span class="text-danger">*</span></label>
								<select
									class="form-control"
									id="discountType"
									v-model="voucherForm.discountType"
									:class="{ 'is-invalid': submitted && !voucherForm.discountType }"
									required
								>
									<option value="">Select Discount Type</option>
									<option value="percentage">Percentage (%)</option>
									<option value="fixed">Fixed Amount</option>
								</select>
								<div v-if="submitted && !voucherForm.discountType" class="invalid-feedback">
									Please select a discount type
								</div>
							</div>

							<div class="form-group">
								<label for="discountValue">Discount Value <span class="text-danger">*</span></label>
								<div class="input-group">
									<input
										type="number"
										class="form-control"
										id="discountValue"
										v-model.number="voucherForm.discountValue"
										:class="{ 'is-invalid': submitted && !isValidDiscountValue }"
										required
										min="0"
										step="0.01"
									>
									<div class="input-group-append">
										<span class="input-group-text">{{ voucherForm.discountType === 'percentage' ? '%' : 'VND' }}</span>
									</div>
								</div>
								<div v-if="submitted && !voucherForm.discountValue" class="invalid-feedback">
									Please enter a discount value
								</div>
								<div v-else-if="submitted && voucherForm.discountValue <= 0" class="invalid-feedback">
									Discount value must be greater than 0
								</div>
								<div v-else-if="submitted && voucherForm.discountType === 'percentage' && voucherForm.discountValue > 100" class="invalid-feedback">
									Percentage value cannot exceed 100%
								</div>
							</div>

							<div v-if="voucherForm.discountType === 'percentage'" class="form-group">
								<label for="maxDiscountAmount">Maximum Discount</label>
								<div class="input-group">
									<input
										type="number"
										class="form-control"
										id="maxDiscountAmount"
										v-model.number="voucherForm.maxDiscountAmount"
										min="0"
									>
									<div class="input-group-append">
										<span class="input-group-text">VND</span>
									</div>
								</div>
								<small class="form-text text-muted">Leave empty or 0 if not limited</small>
							</div>

							<div class="form-group">
								<label for="minOrderValue">Minimum Order Value</label>
								<div class="input-group">
									<input
										type="number"
										class="form-control"
										id="minOrderValue"
										v-model.number="voucherForm.minOrderValue"
										min="0"
									>
									<div class="input-group-append">
										<span class="input-group-text">VND</span>
									</div>
								</div>
								<small class="form-text text-muted">Leave empty or 0 if no minimum value</small>
							</div>

							<div class="row">
								<div class="col-md-6">
									<div class="form-group">
										<label for="startDate">Start Date <span class="text-danger">*</span></label>
										<input
											type="datetime-local"
											class="form-control"
											id="startDate"
											v-model="voucherForm.startDate"
											:class="{ 'is-invalid': submitted && !voucherForm.startDate }"
											required
										>
										<div v-if="submitted && !voucherForm.startDate" class="invalid-feedback">
											Please select a start date
										</div>
									</div>
								</div>

								<div class="col-md-6">
									<div class="form-group">
										<label for="endDate">End Date <span class="text-danger">*</span></label>
										<input
											type="datetime-local"
											class="form-control"
											id="endDate"
											v-model="voucherForm.endDate"
											:class="{ 'is-invalid': submitted && !isValidDateRange }"
											required
										>
										<div v-if="submitted && !voucherForm.endDate" class="invalid-feedback">
											Please select an end date
										</div>
										<div v-else-if="submitted && !isValidDateRange" class="invalid-feedback">
											End date must be after the start date
										</div>
									</div>
								</div>
							</div>

							<div class="form-group">
								<div class="custom-control custom-switch">
									<input
										type="checkbox"
										class="custom-control-input"
										id="isActive"
										v-model="voucherForm.isActive"
									>
									<label class="custom-control-label" for="isActive">Activate Voucher</label>
								</div>
							</div>

							<div v-if="error" class="alert alert-danger">
								{{ error }}
							</div>

							<div class="text-right">
								<button type="button" class="btn btn-secondary mr-2" @click="showVoucherModal = false">
									Cancel
								</button>
								<button type="submit" class="btn btn-primary" :disabled="saving">
									<span v-if="saving">
										<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
										Saving...
									</span>
									<span v-else>
										<i class="save icon"></i> {{ editMode ? 'Update' : 'Add' }}
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
						<p v-if="selectedVouchers.length > 0">
							Are you sure you want to delete {{ selectedVouchers.length }} selected vouchers?
						</p>
						<p v-else>
							Are you sure you want to delete voucher <strong>{{ voucherToDelete.code }}</strong>?
						</p>
						<p class="text-danger">Note: This action cannot be undone.</p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
							Cancel
						</button>
						<button type="button" class="btn btn-danger" @click="deleteVouchers" :disabled="deleting">
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
import { formatCurrency, formatDate } from '@/utils/helpers';

export default {
	name: 'VoucherManagement',
	components: {
		AdminSidebar
	},
	data() {
		return {
			vouchers: [],
			filteredVouchers: [],
			loading: true,
			error: null,

			// Pagination
			currentPage: 1,
			itemsPerPage: 10,

			// Filters
			searchQuery: '',
			statusFilter: '',
			sortBy: 'createdAt_desc',

			// Selection
			selectedVouchers: [],
			selectAll: false,

			// Voucher Modal
			showVoucherModal: false,
			editMode: false,
			voucherForm: {
				code: '',
				discountType: '',
				discountValue: '',
				maxDiscountAmount: 0,
				minOrderValue: 0,
				startDate: '',
				endDate: '',
				isActive: true
			},
			submitted: false,
			saving: false,

			// Delete Modal
			showDeleteModal: false,
			voucherToDelete: {},
			deleting: false
		};
	},
	computed: {
		...mapGetters({
			isAuthenticated: 'auth/isAuthenticated',
			isAdmin: 'auth/isAdmin'
		}),
		totalPages() {
			return Math.ceil(this.filteredVouchers.length / this.itemsPerPage);
		},
		paginatedVouchers() {
			const start = (this.currentPage - 1) * this.itemsPerPage;
			const end = start + this.itemsPerPage;
			return this.filteredVouchers.slice(start, end);
		},
		isValidDiscountValue() {
			return this.voucherForm.discountValue &&
				this.voucherForm.discountValue > 0 &&
				(this.voucherForm.discountType !== 'percentage' ||
					this.voucherForm.discountValue <= 100);
		},
		isValidDateRange() {
			if (!this.voucherForm.startDate || !this.voucherForm.endDate) return true;

			const startDate = new Date(this.voucherForm.startDate);
			const endDate = new Date(this.voucherForm.endDate);

			return endDate > startDate;
		}
	},
	methods: {
		formatCurrency,
		formatDate,
		isVoucherActive(voucher) {
			if (!voucher.isActive) return false;

			const now = new Date();
			const startDate = new Date(voucher.startDate);
			const endDate = new Date(voucher.endDate);

			return now >= startDate && now <= endDate;
		},
		isVoucherExpired(voucher) {
			const now = new Date();
			const endDate = new Date(voucher.endDate);

			return now > endDate;
		},
		getVoucherStatusText(voucher) {
			if (!voucher.isActive) return 'Inactive';
			if (this.isVoucherExpired(voucher)) return 'Expired';

			const now = new Date();
			const startDate = new Date(voucher.startDate);

			if (now < startDate) return 'Not Started';
			return 'Active';
		},
		async fetchVouchers() {
			try {
				this.loading = true;

				const response = await api.get('/vouchers');

				if (response.data.success) {
					this.vouchers = response.data.vouchers;
					this.applyFilters();
				}
			} catch (error) {
				console.error('Error fetching vouchers:', error);
				this.$flash.error('Unable to load voucher list');
			} finally {
				this.loading = false;
			}
		},
		searchVouchers() {
			this.currentPage = 1;
			this.applyFilters();
		},
		filterVouchers() {
			this.currentPage = 1;
			this.applyFilters();
		},
		applyFilters() {
			// Apply filters and sorting
			let filtered = [...this.vouchers];

			// Search
			if (this.searchQuery) {
				const query = this.searchQuery.toLowerCase();
				filtered = filtered.filter(v =>
					v.code.toLowerCase().includes(query) ||
					v._id.toLowerCase().includes(query)
				);
			}

			// Filter by status
			if (this.statusFilter) {
				const now = new Date();

				if (this.statusFilter === 'active') {
					filtered = filtered.filter(v =>
						v.isActive &&
						new Date(v.startDate) <= now &&
						new Date(v.endDate) >= now
					);
				} else if (this.statusFilter === 'inactive') {
					filtered = filtered.filter(v => !v.isActive);
				} else if (this.statusFilter === 'expired') {
					filtered = filtered.filter(v => new Date(v.endDate) < now);
				}
			}

			// Sorting
			const [field, direction] = this.sortBy.split('_');

			filtered.sort((a, b) => {
				let valueA = a[field];
				let valueB = b[field];

				// Special handling for dates
				if (field === 'startDate' || field === 'endDate' || field === 'createdAt') {
					valueA = new Date(valueA).getTime();
					valueB = new Date(valueB).getTime();
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

			this.filteredVouchers = filtered;
		},
		resetFilters() {
			this.searchQuery = '';
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
				this.selectedVouchers = this.filteredVouchers.map(v => v._id);
			} else {
				this.selectedVouchers = [];
			}
		},
		openVoucherModal(voucher = null) {
			this.editMode = !!voucher;

			if (voucher) {
				// Edit existing voucher
				const startDate = new Date(voucher.startDate);
				const endDate = new Date(voucher.endDate);

				this.voucherForm = {
					code: voucher.code,
					discountType: voucher.discountType,
					discountValue: voucher.discountValue,
					maxDiscountAmount: voucher.maxDiscountAmount || 0,
					minOrderValue: voucher.minOrderValue || 0,
					startDate: this.formatDateTimeForInput(startDate),
					endDate: this.formatDateTimeForInput(endDate),
					isActive: voucher.isActive
				};
			} else {
				// Add new voucher
				const now = new Date();
				const oneMonthLater = new Date();
				oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

				this.voucherForm = {
					code: '',
					discountType: 'percentage',
					discountValue: '',
					maxDiscountAmount: 0,
					minOrderValue: 0,
					startDate: this.formatDateTimeForInput(now),
					endDate: this.formatDateTimeForInput(oneMonthLater),
					isActive: true
				};
			}

			this.voucherToEdit = voucher;
			this.submitted = false;
			this.error = null;
			this.showVoucherModal = true;
		},
		formatDateTimeForInput(date) {
			// Format date to YYYY-MM-DDThh:mm
			return date.toISOString().slice(0, 16);
		},
		async saveVoucher() {
			this.submitted = true;

			if (!this.voucherForm.code || !this.voucherForm.discountType ||
				!this.isValidDiscountValue || !this.voucherForm.startDate ||
				!this.voucherForm.endDate || !this.isValidDateRange) {
				return;
			}

			try {
				this.saving = true;
				this.error = null;

				const voucherData = {
					code: this.voucherForm.code,
					discountType: this.voucherForm.discountType,
					discountValue: parseFloat(this.voucherForm.discountValue),
					maxDiscountAmount: parseFloat(this.voucherForm.maxDiscountAmount) || 0,
					minOrderValue: parseFloat(this.voucherForm.minOrderValue) || 0,
					startDate: new Date(this.voucherForm.startDate).toISOString(),
					endDate: new Date(this.voucherForm.endDate).toISOString(),
					isActive: this.voucherForm.isActive
				};

				let response;

				if (this.editMode) {
					// Update voucher
					response = await api.put(`/vouchers/${this.voucherToEdit._id}`, voucherData);
				} else {
					// Add new voucher
					response = await api.post('/vouchers', voucherData);
				}

				if (response.data.success) {
					this.showVoucherModal = false;
					this.$flash.success(this.editMode ? 'Voucher updated successfully!' : 'New voucher added successfully!');

					// Reload voucher list
					this.fetchVouchers();
				}
			} catch (error) {
				console.error('Error saving voucher:', error);
				this.error = error.response?.data?.message || 'Unable to save voucher. Please try again later.';
			} finally {
				this.saving = false;
			}
		},
		confirmDeleteVoucher(voucher) {
			this.voucherToDelete = voucher;
			this.selectedVouchers = [];
			this.showDeleteModal = true;
		},
		confirmDeleteSelected() {
			this.voucherToDelete = {};
			this.showDeleteModal = true;
		},
		async deleteVouchers() {
			try {
				this.deleting = true;

				if (this.selectedVouchers.length > 0) {
					// Delete multiple vouchers
					// Note: Backend API should support bulk deletion
					for (const voucherId of this.selectedVouchers) {
						await api.delete(`/vouchers/${voucherId}`);
					}

					this.$flash.success(`Deleted ${this.selectedVouchers.length} vouchers!`);
					this.selectedVouchers = [];
				} else {
					// Delete single voucher
					await api.delete(`/vouchers/${this.voucherToDelete._id}`);
					this.$flash.success('Voucher deleted successfully!');
				}

				this.showDeleteModal = false;

				// Reload voucher list
				this.fetchVouchers();
			} catch (error) {
				console.error('Error deleting vouchers:', error);
				this.$flash.error(error.response?.data?.message || 'Unable to delete voucher. Please try again later.');
			} finally {
				this.deleting = false;
			}
		},
		async toggleSelectedVouchersStatus(isActive) {
			try {
				for (const voucherId of this.selectedVouchers) {
					const voucher = this.vouchers.find(v => v._id === voucherId);

					if (voucher) {
						await api.put(`/vouchers/${voucherId}`, {
							...voucher,
							isActive
						});
					}
				}

				this.$flash.success(`Successfully ${isActive ? 'activated' : 'deactivated'} ${this.selectedVouchers.length} vouchers!`);
				this.selectedVouchers = [];

				// Reload voucher list
				this.fetchVouchers();
			} catch (error) {
				console.error('Error updating vouchers status:', error);
				this.$flash.error(error.response?.data?.message || 'Unable to update voucher status. Please try again later.');
			}
		}
	},
	created() {
		if (!this.isAuthenticated || !this.isAdmin) {
			this.$router.push('/login');
			return;
		}

		this.fetchVouchers();
	},
	watch: {
		vouchers() {
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

.bulk-actions {
	position: sticky;
	bottom: 0;
	background-color: #f8f9fa;
	border-top: 1px solid #ddd;
	border-radius: 0 0 0.25rem 0.25rem;
}
</style>
