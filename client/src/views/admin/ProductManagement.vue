<template>
	<div class="admin-products">
		<div class="container-fluid">
			<div class="row">
				<!-- Sidebar -->
				<admin-sidebar :active-menu="'products'"></admin-sidebar>
				
				<!-- Main content -->
				<main class="col-md-9 ml-sm-auto col-lg-10 px-md-4 py-4">
					<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
						<h1 class="h2">Manage Store</h1>
						<button class="btn btn-primary" @click="openProductModal()">
							<i class="plus icon"></i> Add New Store
						</button>
					</div>
					
					<!-- Filters and search -->
					<div class="row mb-4">
						<div class="col-md-4 mb-3">
							<div class="input-group">
								<input 
									type="text" 
									class="form-control" 
									placeholder="Search stores..." 
									v-model="searchQuery"
									@keyup.enter="searchProducts"
								>
								<div class="input-group-append">
									<button class="btn btn-outline-secondary" type="button" @click="searchProducts">
										<i class="search icon"></i>
									</button>
								</div>
							</div>
						</div>
						
						<div class="col-md-3 mb-3">
							<select class="form-control" v-model="categoryFilter" @change="filterProducts">
								<option value="">All Categories</option>
								<option v-for="category in categories" :key="category" :value="category">
									{{ category }}
								</option>
							</select>
						</div>
						
						<div class="col-md-3 mb-3">
							<select class="form-control" v-model="statusFilter" @change="filterProducts">
								<option value="">All Statuses</option>
								<option value="inStock">In Stock</option>
								<option value="outOfStock">Out of Stock</option>
							</select>
						</div>
						
						<div class="col-md-2 mb-3">
							<select class="form-control" v-model="sortBy" @change="filterProducts">
								<option value="createdAt_desc">Newest</option>
								<option value="createdAt_asc">Oldest</option>
								<option value="title_asc">Title A-Z</option>
								<option value="title_desc">Title Z-A</option>
								<option value="price_asc">Price Low to High</option>
								<option value="price_desc">Price High to Low</option>
							</select>
						</div>
					</div>
					
					<!-- Products List -->
					<div class="card">
						<div class="card-body">
							<div v-if="loading" class="text-center py-5">
								<div class="ui active centered inline loader"></div>
								<p class="mt-3">Loading product list...</p>
							</div>
							
							<div v-else-if="filteredProducts.length === 0" class="text-center py-5">
								<i class="huge search icon text-muted"></i>
								<h4 class="mt-3">No products found</h4>
								<p class="text-muted mb-4">No products match the search criteria</p>
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
											<th>Store</th>
											<th>Category</th>
											<th>Price</th>
											<th>Discount Price</th>
											<th>Account</th>
											<th>Created At</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="product in paginatedProducts" :key="product._id">
											<td>
												<div class="custom-control custom-checkbox">
													<input 
														type="checkbox" 
														class="custom-control-input" 
														:id="`product${product._id}`"
														v-model="selectedProducts"
														:value="product._id"
													>
													<label class="custom-control-label" :for="`product${product._id}`"></label>
												</div>
											</td>
											<td>
												<div class="d-flex align-items-center">
													<img 
														:src="product.image || 'https://picsum.photos/50/50'" 
														:alt="product.title" 
														class="product-thumbnail mr-2"
													>
													<div>
														<div class="font-weight-bold">{{ product.title }}</div>
														<div class="small text-muted">ID: {{ product._id }}</div>
													</div>
												</div>
											</td>
											<td>{{ product.category }}</td>
											<td>{{ formatCurrency(product.price) }}</td>
											<td>
												<span v-if="product.discountPrice > 0">
													{{ formatCurrency(product.discountPrice) }}
												</span>
												<span v-else class="text-muted">-</span>
											</td>
											<td>
												<span 
													class="badge" 
													:class="{
														'badge-success': product.availableStock > 10,
														'badge-warning': product.availableStock > 0 && product.availableStock <= 10,
														'badge-danger': product.availableStock === 0
													}"
												>
													{{ product.availableStock }} / {{ product.stock }}
												</span>
											</td>
											<td>{{ formatDate(product.createdAt) }}</td>
											<td>
												<div class="btn-group">
													<button 
														class="btn btn-sm btn-outline-primary" 
														@click="openProductModal(product)"
														title="Edit"
													>
														<i class="edit icon"></i>
													</button>
													<button 
														class="btn btn-sm btn-outline-info" 
														@click="manageAccounts(product._id)"
														title="Manage Accounts"
													>
														<i class="key icon"></i>
													</button>
													<button 
														class="btn btn-sm btn-outline-danger" 
														@click="confirmDeleteProduct(product)"
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
							<div v-if="selectedProducts.length > 0" class="bulk-actions p-3 bg-light mb-3">
								<div class="d-flex align-items-center">
									<span class="mr-3">Selected {{ selectedProducts.length }} products</span>
									<button class="btn btn-sm btn-danger mr-2" @click="confirmDeleteSelected">
										<i class="trash icon"></i> Delete Selected
									</button>
									<button class="btn btn-sm btn-secondary" @click="selectedProducts = []">
										<i class="times icon"></i> Deselect
									</button>
								</div>
							</div>
							
							<!-- Pagination -->
							<div v-if="filteredProducts.length > itemsPerPage" class="d-flex justify-content-center mt-4">
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
		
		<!-- Product Modal -->
		<div v-if="showProductModal" class="modal-overlay">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">{{ editMode ? 'Edit Store' : 'Add New Store' }}</h5>
						<button type="button" class="close" @click="showProductModal = false">
							<span>&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<form @submit.prevent="saveProduct">
						<!-- Product Form -->
						<div class="form-group">
							<label for="productTitle">Store Name <span class="text-danger">*</span></label>
							<input 
								type="text" 
								class="form-control" 
								id="productTitle" 
								v-model="productForm.title"
								:class="{ 'is-invalid': submitted && !productForm.title }"
								required
							>
							<div v-if="submitted && !productForm.title" class="invalid-feedback">
								Please enter a store name
							</div>
						</div>

						<div class="form-group">
							<label for="productCategory">Category <span class="text-danger">*</span></label>
							<select 
								class="form-control" 
								id="productCategory" 
								v-model="productForm.category"
								:class="{ 'is-invalid': submitted && !productForm.category }"
								required
							>
								<option value="">Select Category</option>
								<option v-for="category in categories" :key="category" :value="category">
									{{ category }}
								</option>
							</select>
							<div v-if="submitted && !productForm.category" class="invalid-feedback">
								Please select a category
							</div>
						</div>

						<div class="form-group">
							<label for="productPrice">Price <span class="text-danger">*</span></label>
							<div class="input-group">
								<input 
									type="number" 
									class="form-control" 
									id="productPrice" 
									v-model.number="productForm.price"
									:class="{ 'is-invalid': submitted && !isValidPrice }"
									required
									min="0"
								>
								<div class="input-group-append">
									<span class="input-group-text">VND</span>
								</div>
							</div>
							<div v-if="submitted && !productForm.price" class="invalid-feedback">
								Please enter a price
							</div>
							<div v-else-if="submitted && productForm.price <= 0" class="invalid-feedback">
								Price must be greater than 0
							</div>
						</div>

						<div class="form-group">
							<label for="productDiscountPrice">Discount Price</label>
							<div class="input-group">
								<input 
									type="number" 
									class="form-control" 
									id="productDiscountPrice" 
									v-model.number="productForm.discountPrice"
									:class="{ 'is-invalid': submitted && !isValidDiscountPrice }"
									min="0"
								>
								<div class="input-group-append">
									<span class="input-group-text">VND</span>
								</div>
							</div>
							<div v-if="submitted && productForm.discountPrice > productForm.price" class="invalid-feedback">
								Discount price must be less than or equal to the original price
							</div>
							<small class="form-text text-muted">Leave blank if there is no discount</small>
						</div>

						<div class="form-group">
							<label for="productImage">Image</label>
							<div class="custom-file">
								<input 
									type="file" 
									class="custom-file-input" 
									id="productImage" 
									@change="handleImageUpload"
									accept="image/*"
								>
								<label class="custom-file-label" for="productImage">
									{{ imageFileName || 'Select an image file' }}
								</label>
							</div>
							<small class="form-text text-muted">Max size: 5MB. Format: JPG, PNG, GIF</small>
						</div>

						<div v-if="productForm.image || imagePreview" class="mb-3">
							<img 
								:src="imagePreview || productForm.image" 
								alt="Product Preview" 
								class="img-thumbnail mt-2" 
								style="max-height: 200px;"
							>
							<button 
								type="button" 
								class="btn btn-sm btn-outline-danger mt-2"
								@click="removeImage"
							>
								Delete Image
							</button>
						</div>

						<div class="form-group">
							<label for="productDescription">Description <span class="text-danger">*</span></label>
							<textarea 
								class="form-control" 
								id="productDescription" 
								rows="4" 
								v-model="productForm.description"
								:class="{ 'is-invalid': submitted && !productForm.description }"
								required
							></textarea>
							<div v-if="submitted && !productForm.description" class="invalid-feedback">
								Please enter a description
							</div>
						</div>

						<div v-if="error" class="alert alert-danger">
							{{ error }}
						</div>

						<div class="text-right">
							<button type="button" class="btn btn-secondary mr-2" @click="showProductModal = false">
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

	<!-- Delete Confirmation Modal -->
	<div v-if="showDeleteModal" class="modal-overlay">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Delete Confirmation</h5>
					<button type="button" class="close" @click="showDeleteModal = false">
						<span>&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<p v-if="selectedProducts.length > 0">
						Are you sure you want to delete the {{ selectedProducts.length }} selected stores?
					</p>
					<p v-else>
						Are you sure you want to delete the store <strong>{{ productToDelete.title }}</strong>?
					</p>
					<p class="text-danger">Note: This action is irreversible and will delete the associated accounts as well.</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
						Cancel
					</button>
					<button type="button" class="btn btn-danger" @click="deleteProducts" :disabled="deleting">
						<span v-if="deleting">
							<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
							Deleting...
						</span>
						<span v-else>
							<i class="trash icon"></i> Confirm Delete
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
	name: 'ProductManagement',
	components: {
		AdminSidebar
	},
	data() {
		return {
			products: [],
			filteredProducts: [],
			loading: true,
			error: null,
			
			// Pagination
			currentPage: 1,
			itemsPerPage: 10,
			
			// Filters
			searchQuery: '',
			categoryFilter: '',
			statusFilter: '',
			sortBy: 'createdAt_desc',
			categories: ['Entertainment', 'Education', 'Games', 'Tools', 'Others'],
			
			// Selection
			selectedProducts: [],
			selectAll: false,
			
			// Product Modal
			showProductModal: false,
			editMode: false,
			productForm: {
				title: '',
				category: '',
				price: '',
				discountPrice: '',
				image: '',
				description: ''
			},
			imageFile: null,
			imageFileName: '',
			imagePreview: null,
			submitted: false,
			saving: false,
			
			// Delete Modal
			showDeleteModal: false,
			productToDelete: {},
			deleting: false
		};
	},
	computed: {
		...mapGetters({
			isAuthenticated: 'auth/isAuthenticated',
			isAdmin: 'auth/isAdmin'
		}),
		totalPages() {
			return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
		},
		paginatedProducts() {
			const start = (this.currentPage - 1) * this.itemsPerPage;
			const end = start + this.itemsPerPage;
			return this.filteredProducts.slice(start, end);
		},
		isValidPrice() {
			return this.productForm.price && this.productForm.price > 0;
		},
		isValidDiscountPrice() {
			return !this.productForm.discountPrice || 
				   (this.productForm.discountPrice >= 0 && 
					this.productForm.discountPrice <= this.productForm.price);
		}
	},
	methods: {
		formatCurrency,
		formatDate,
		async fetchProducts() {
			try {
				this.loading = true;
				
				const response = await api.get('/products');
				
				if (response.data.success) {
					this.products = response.data.products;
					this.applyFilters();
				}
			} catch (error) {
				console.error('Error fetching products:', error);
				this.$flash.error('Unable to load product list');
			} finally {
				this.loading = false;
			}
		},
		searchProducts() {
			this.currentPage = 1;
			this.applyFilters();
		},
		filterProducts() {
			this.currentPage = 1;
			this.applyFilters();
		},
		applyFilters() {
			// Apply filters and sorting
			let filtered = [...this.products];
			
			// Search
			if (this.searchQuery) {
				const query = this.searchQuery.toLowerCase();
				filtered = filtered.filter(p => 
					p.title.toLowerCase().includes(query) || 
					p.description.toLowerCase().includes(query) ||
					p._id.toLowerCase().includes(query)
				);
			}
			
			// Category Filter
			if (this.categoryFilter) {
				filtered = filtered.filter(p => p.category === this.categoryFilter);
			}
			
			// Status Filter
			if (this.statusFilter === 'inStock') {
				filtered = filtered.filter(p => p.availableStock > 0);
			} else if (this.statusFilter === 'outOfStock') {
				filtered = filtered.filter(p => p.availableStock === 0);
			}
			
			// Sorting
			const [field, direction] = this.sortBy.split('_');
			
			filtered.sort((a, b) => {
				let valueA, valueB;
				
				if (field === 'price') {
					valueA = a.discountPrice > 0 ? a.discountPrice : a.price;
					valueB = b.discountPrice > 0 ? b.discountPrice : b.price;
				} else {
					valueA = a[field];
					valueB = b[field];
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
			
			this.filteredProducts = filtered;
		},
		resetFilters() {
			this.searchQuery = '';
			this.categoryFilter = '';
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
				this.selectedProducts = this.filteredProducts.map(p => p._id);
			} else {
				this.selectedProducts = [];
			}
		},
		openProductModal(product = null) {
			this.editMode = !!product;
			
			if (product) {
				// Editing an existing product
				this.productForm = {
					title: product.title,
					category: product.category,
					price: product.price,
					discountPrice: product.discountPrice || '',
					image: product.image || '',
					description: product.description
				};
				this.imageFileName = '';
				this.imagePreview = null;
			} else {
				// Adding a new product
				this.productForm = {
					title: '',
					category: '',
					price: '',
					discountPrice: '',
					image: '',
					description: ''
				};
				this.imageFileName = '';
				this.imagePreview = null;
			}
			
			this.productToEdit = product;
			this.submitted = false;
			this.error = null;
			this.showProductModal = true;
		},
		handleImageUpload(event) {
			const file = event.target.files[0];
			if (!file) return;
			
			// Check file format
			const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
			if (!allowedTypes.includes(file.type)) {
				this.$flash.error('Unsupported file format. Please select JPG, PNG, or GIF.');
				event.target.value = '';
				return;
			}
			
			// Check file size (max 5MB)
			const maxSize = 5 * 1024 * 1024; // 5MB
			if (file.size > maxSize) {
				this.$flash.error('File size is too large. Max size is 5MB.');
				event.target.value = '';
				return;
			}
			
			this.imageFile = file;
			this.imageFileName = file.name;
			
			// Create preview
			const reader = new FileReader();
			reader.onload = (e) => {
				this.imagePreview = e.target.result;
			};
			reader.readAsDataURL(file);
		},
		removeImage() {
			this.imageFile = null;
			this.imageFileName = '';
			this.imagePreview = null;
			this.productForm.image = '';
		},
		async uploadImage() {
			if (!this.imageFile) return null;
			
			const formData = new FormData();
			formData.append('image', this.imageFile);
			
			try {
				const response = await api.post('/products/upload', formData, {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				});
				
				if (response.data.success) {
					return response.data.imageUrl;
				}
				
				return null;
			} catch (error) {
				console.error('Error uploading image:', error);
				throw new Error('Unable to upload image');
			}
		},
		async saveProduct() {
			this.submitted = true;
			
			if (!this.productForm.title || !this.productForm.category || !this.isValidPrice || 
				!this.isValidDiscountPrice || !this.productForm.description) {
				return;
			}
			
			try {
				this.saving = true;
				this.error = null;
				
				// Upload image if present
				let imageUrl = this.productForm.image;
				if (this.imageFile) {
					imageUrl = await this.uploadImage();
					if (!imageUrl) {
						throw new Error('Unable to upload image');
					}
				}
				
				const productData = {
					title: this.productForm.title,
					category: this.productForm.category,
					price: parseFloat(this.productForm.price),
					discountPrice: this.productForm.discountPrice ? parseFloat(this.productForm.discountPrice) : 0,
					image: imageUrl,
					description: this.productForm.description
				};
				
				let response;
				
				if (this.editMode) {
					// Update existing product
					response = await api.put(`/products/${this.productToEdit._id}`, productData);
				} else {
					// Add new product
					response = await api.post('/products', productData);
				}
				
				if (response.data.success) {
					this.showProductModal = false;
					this.$flash.success(this.editMode ? 'Store updated successfully!' : 'Store added successfully!');
					
					// Reload product list
					this.fetchProducts();
				}
			} catch (error) {
				console.error('Error saving product:', error);
				this.error = error.response?.data?.message || 'Unable to save store. Please try again later.';
			} finally {
				this.saving = false;
			}
		},
		confirmDeleteProduct(product) {
			this.productToDelete = product;
			this.selectedProducts = [];
			this.showDeleteModal = true;
		},
		confirmDeleteSelected() {
			this.productToDelete = {};
			this.showDeleteModal = true;
		},
		async deleteProducts() {
			try {
				this.deleting = true;
				
				if (this.selectedProducts.length > 0) {
					// Delete multiple products
					// Note: Backend should have a delete API for multiple products
					for (const productId of this.selectedProducts) {
						await api.delete(`/products/${productId}`);
					}
					
					this.$flash.success(`Deleted ${this.selectedProducts.length} stores!`);
					this.selectedProducts = [];
				} else {
					// Delete a single product
					await api.delete(`/products/${this.productToDelete._id}`);
					this.$flash.success('Store deleted successfully!');
				}
				
				this.showDeleteModal = false;
				
				// Reload product list
				this.fetchProducts();
			} catch (error) {
				console.error('Error deleting products:', error);
				this.$flash.error(error.response?.data?.message || 'Unable to delete store. Please try again later.');
			} finally {
				this.deleting = false;
			}
		},
		manageAccounts(productId) {
			this.$router.push(`/admin/accounts?product=${productId}`);
		}
	},
	created() {
		if (!this.isAuthenticated || !this.isAdmin) {
			this.$router.push('/login');
			return;
		}
		
		this.fetchProducts();
	},
	watch: {
		products() {
			this.applyFilters();
		}
	}
};
</script>

<style scoped>
.product-thumbnail {
	width: 40px;
	height: 40px;
	object-fit: cover;
	border-radius: 4px;
}

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
</style>
		
