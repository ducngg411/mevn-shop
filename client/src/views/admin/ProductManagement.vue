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
														:src="formatImageUrl(product.image)" 
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
							<div v-if="filteredProducts.length > 0" class="d-flex justify-content-between mt-4">
								<div class="pagination-info">
									<span>Displaying {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }}/{{ filteredProducts.length }} products store</span>
								</div>
								
								<nav aria-label="Product pagination">
									<ul class="pagination">
									<!-- Nút Previous -->
									<li class="page-item" :class="{ 'disabled': currentPage === 1 }">
										<button class="page-link" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
										<i class="chevron left icon"></i>
										</button>
									</li>
									
									<!-- Các số trang -->
									<li v-for="page in totalPages" :key="page" class="page-item" :class="{ 'active': currentPage === page }">
										<button class="page-link" @click="changePage(page)">{{ page }}</button>
									</li>
									
									<!-- Nút Next -->
									<li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
										<button class="page-link" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
										<i class="chevron right icon"></i>
										</button>
									</li>
									</ul>
								</nav>
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
import { formatCurrency, formatDate, formatImageUrl } from '@/utils/helpers';

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

			return Math.max(1, Math.ceil(this.filteredProducts.length / this.itemsPerPage));
		},
		paginatedProducts() {
			const start = (this.currentPage - 1) * this.itemsPerPage;
		const end = start + this.itemsPerPage;
		console.log(`Current page: ${this.currentPage}, showing items from ${start} to ${end-1}`);
		return this.filteredProducts.slice(start, end);
		},
		},
		isValidPrice() {
			return this.productForm.price && this.productForm.price > 0;
		},
		isValidDiscountPrice() {
			return !this.productForm.discountPrice || 
				(this.productForm.discountPrice >= 0 && 
					this.productForm.discountPrice <= this.productForm.price);
		},
		displayedPages() {
			// Logic to show limited page numbers with ellipsis
			const totalVisiblePages = 5;
			if (this.totalPages <= totalVisiblePages) {
				// If we have few pages, show all of them
				return [...Array(this.totalPages).keys()].map(x => x + 1);
			}
			
			// Always show first page, last page, current page, and some neighbors
			let startPage = Math.max(1, this.currentPage - Math.floor(totalVisiblePages / 2));
			let endPage = startPage + totalVisiblePages - 1;
			
			// Adjust if we're near the end
			if (endPage > this.totalPages) {
				endPage = this.totalPages;
				startPage = Math.max(1, endPage - totalVisiblePages + 1);
			}
			
			// Generate the array of pages
			return [...Array(endPage - startPage + 1).keys()].map(x => x + startPage);

	},
	methods: {
		formatCurrency,
		formatDate,
		formatImageUrl,
			async fetchProducts() {
				try {
			this.loading = true;
			
			// Nếu có 30 sản phẩm nhưng API chỉ trả về 10, bạn cần thay đổi limit
			const response = await api.get('/products?limit=100'); // Tăng limit lên
			
			if (response.data.success) {
				console.log("Total products from API:", response.data.products.length);
				this.products = response.data.products;
				this.applyFilters();
			}
		} catch (error) {
			console.error('Error fetching products:', error);
			this.$toast.error('Unable to load product list');
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
				this.$toast.error('Unsupported file format. Please select JPG, PNG, or GIF.');
				event.target.value = '';
				return;
			}
			
			// Check file size (max 5MB)
			const maxSize = 5 * 1024 * 1024; // 5MB
			if (file.size > maxSize) {
				this.$toast.error('File size is too large. Max size is 5MB.');
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
					this.$toast.success(this.editMode ? 'Store updated successfully!' : 'Store added successfully!');
					
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
					
					this.$toast.success(`Deleted ${this.selectedProducts.length} stores!`);
					this.selectedProducts = [];
				} else {
					// Delete a single product
					await api.delete(`/products/${this.productToDelete._id}`);
					this.$toast.success('Store deleted successfully!');
				}
				
				this.showDeleteModal = false;
				
				// Reload product list
				this.fetchProducts();
			} catch (error) {
				console.error('Error deleting products:', error);
				this.$toast.error(error.response?.data?.message || 'Unable to delete store. Please try again later.');
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
.admin-products .card {
    border: none;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    margin-bottom: 1.5rem;
}

.admin-products .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.admin-products .card-body {
    padding: 1.5rem;
}

.admin-products .card-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding: 1.25rem 1.5rem;
    font-weight: 700;
    color: #2d3748;
}

.admin-products .table {
    margin-bottom: 0;
}

.admin-products .table thead th {
    background-color: #f8f9fa;
    border-top: none;
    border-bottom: 2px solid #dee2e6;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.5px;
    padding: 15px 12px;
    color: #4a5568;
}

.admin-products .table-hover tbody tr {
    transition: all 0.3s ease;
}

.admin-products .table-hover tbody tr:hover {
    background-color: rgba(67, 97, 238, 0.03);
}

.admin-products .table td {
    padding: 15px 12px;
    vertical-align: middle;
    border-top: 1px solid #f1f3f5;
}

.admin-products .product-thumbnail {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.admin-products tr:hover .product-thumbnail {
    transform: scale(1.1);
}

.admin-products .btn-group .btn {
    border-radius: 6px;
    margin: 0 2px;
    transition: all 0.3s ease;
}

.admin-products .btn-outline-primary {
    border-color: #4361ee;
    color: #4361ee;
}

.admin-products .btn-outline-info {
    border-color: #3498db;
    color: #3498db;
}

.admin-products .btn-outline-danger {
    border-color: #e74c3c;
    color: #e74c3c;
}

.admin-products .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.admin-products .badge {
    font-size: 0.75rem;
    padding: 0.4em 0.8em;
    border-radius: 30px;
    font-weight: 600;
}

.admin-products .badge-success {
    background-color: #2ecc71;
}

.admin-products .badge-warning {
    background-color: #f39c12;
}

.admin-products .badge-danger {
    background-color: #e74c3c;
}

/* Pagination styles */
.admin-products .pagination {
    margin-bottom: 0;
}

.admin-products .pagination .page-item .page-link {
    color: #4361ee;
    border-radius: 6px;
    margin: 0 3px;
    padding: 0.5rem 0.75rem;
    transition: all 0.3s ease;
}

.admin-products .pagination .page-item.active .page-link {
    background-color: #4361ee;
    border-color: #4361ee;
    color: white;
    box-shadow: 0 4px 10px rgba(67, 97, 238, 0.3);
}

.admin-products .pagination .page-item .page-link:hover {
    background-color: #f0f2ff;
    transform: translateY(-2px);
}

.admin-products .pagination .page-item.disabled .page-link {
    color: #adb5bd;
    pointer-events: none;
}

/* Modal styles */
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
    max-width: 700px;
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

.form-group label {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #2d3748;
}

.form-control {
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    /* padding: 0.75rem 1rem; */
    transition: all 0.3s ease;
}

.form-control:focus {
    border-color: #4361ee;
    box-shadow: 0 0 0 0.2rem rgba(67, 97, 238, 0.25);
}

.admin-products .pagination {
	margin-bottom: 0;
}

.admin-products .page-link {
	border: none;
	margin: 0 3px;
	border-radius: 6px;
	color: #4361ee;
	transition: all 0.3s ease;
}

.admin-products .page-item.active .page-link {
	background-color: #4361ee;
	box-shadow: 0 4px 6px rgba(67, 97, 238, 0.3);
}

.admin-products .order-item-image {
	width: 50px;
	height: 50px;
	object-fit: cover;
	border-radius: 8px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Custom file input */
.custom-file-label {
    border-radius: 8px;
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
}

.custom-file-label::after {
    height: 100%;
    border-radius: 0 8px 8px 0;
    background-color: #f8f9fa;
    color: #4a5568;
}

/* Bulk actions bar */
.bulk-actions {
    background-color: rgba(67, 97, 238, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(67, 97, 238, 0.1);
    padding: 1rem !important;
    margin-top: 1rem;
}

/* Add animation for loading */
.ui.active.loader {
    margin-bottom: 1rem;
}

/* Pagination info text */
.pagination-info {
    color: #212529;
    font-size: 14px;
}

/* Button primary */
.btn-primary {
    background-color: #4361ee;
    border-color: #4361ee;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    background-color: #3a56d4;
    border-color: #3a56d4;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3);
}
</style>
		
