<template>
    <div class="product-list">
        <div class="container">
            <h1 class="mb-4">Product Store</h1>
            
            <div class="row">
                <!-- Sidebar: Filter Section -->
                <div class="col-md-3 mb-4">
                    <div class="page-content">
                        <h5 class="mb-3">Categories</h5>
                        <div class="list-group mb-4">
                            <!-- Filter link for all categories -->
                            <a 
                                href="#" 
                                class="list-group-item list-group-item-action"
                                :class="{ 'active': !selectedCategory }"
                                @click.prevent="selectCategory(null)"
                            >
                                All
                            </a>
                            <!-- Filter links for each category -->
                            <a 
                                href="#" 
                                class="list-group-item list-group-item-action"
                                v-for="category in categories" 
                                :key="category"
                                :class="{ 'active': selectedCategory === category }"
                                @click.prevent="selectCategory(category)"
                            >
                                {{ category }}
                            </a>
                        </div>
                        
                        <h5 class="mb-3">Search</h5>
                        <div class="input-group mb-4">
                            <input 
                                type="text" 
                                class="form-control" 
                                placeholder="Product name..." 
                                v-model="searchQuery"
                                @keyup.enter="searchProducts"
                            >
                            <div class="input-group-append">
                                <button class="btn btn-outline-primary" type="button" @click="searchProducts">
                                    <i class="search icon"></i>
                                </button>
                            </div>
                        </div>
                        
                        <h5 class="mb-3">Price</h5>
                        <div class="form-group mb-4">
                            <!-- Price filter options -->
                            <div class="custom-control custom-radio">
                                <input type="radio" id="priceAll" name="price" class="custom-control-input" v-model="priceRange" value="all" @change="applyPriceFilter">
                                <label class="custom-control-label" for="priceAll">All</label>
                            </div>
                            <div class="custom-control custom-radio">
                                <input type="radio" id="price1" name="price" class="custom-control-input" v-model="priceRange" value="0-100000" @change="applyPriceFilter">
                                <label class="custom-control-label" for="price1">Under 100,000 VND</label>
                            </div>
                            <div class="custom-control custom-radio">
                                <input type="radio" id="price2" name="price" class="custom-control-input" v-model="priceRange" value="100000-300000" @change="applyPriceFilter">
                                <label class="custom-control-label" for="price2">100,000 VND - 300,000 VND</label>
                            </div>
                            <div class="custom-control custom-radio">
                                <input type="radio" id="price3" name="price" class="custom-control-input" v-model="priceRange" value="300000-500000" @change="applyPriceFilter">
                                <label class="custom-control-label" for="price3">300,000 VND - 500,000 VND</label>
                            </div>
                            <div class="custom-control custom-radio">
                                <input type="radio" id="price4" name="price" class="custom-control-input" v-model="priceRange" value="500000+" @change="applyPriceFilter">
                                <label class="custom-control-label" for="price4">Over 500,000 VND</label>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary btn-block" @click="applyFilters">
                            <i class="filter icon"></i> Filter
                        </button>
                    </div>
                </div>
                
                <!-- Product List Section -->
                <div class="col-md-9">
                    <div class="page-content">
                        <!-- Sorting and Results Display -->
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <p class="mb-0">Displaying {{ products.length }} products ({{ totalProducts }} total)</p>
                            <div class="form-inline">
                                <label class="mr-2" for="sortBy">Sort by:</label>
                                <select class="form-control" id="sortBy" v-model="sortBy" @change="applySorting">
                                    <option value="createdAt_desc">Newest</option>
                                    <option value="price_asc">Price low to high</option>
                                    <option value="price_desc">Price high to low</option>
                                    <option value="title_asc">Name A-Z</option>
                                    <option value="title_desc">Name Z-A</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Loading indicator -->
                        <div v-if="loading" class="text-center py-5">
                            <div class="ui active centered inline loader"></div>
                            <p class="mt-3">Loading products...</p>
                        </div>
                        
                        <!-- No results found -->
                        <div v-else-if="products.length === 0" class="text-center py-5">
                            <i class="huge search icon text-muted"></i>
                            <h3 class="mt-3">No results found</h3>
                            <p class="text-muted">Please try with different keywords or filters</p>
                            <button class="btn btn-outline-primary mt-3" @click="resetFilters">
                                <i class="undo icon"></i> Reset filters
                            </button>
                        </div>
                        
                        <!-- Product List -->
                        <div v-else class="row">
                            <div 
                                v-for="product in products" 
                                :key="product._id" 
                                class="col-md-4 mb-4"
                            >
                                <product-card :product="product"></product-card>
                            </div>
                        </div>
                        
                        <!-- Pagination -->
                        <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
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
            </div>
        </div>
    </div>
</template>

<script>
import ProductCard from '@/components/common/ProductCard.vue';
import api from '@/utils/api';
import { formatImageUrl } from '@/utils/helpers';

export default {
    name: 'ProductList',
    components: {
        ProductCard
    },
    data() {
        return {
            products: [],
            loading: true,
            error: null,
            searchQuery: '',
            selectedCategory: null,
            priceRange: 'all',
            sortBy: 'createdAt_desc',
            currentPage: 1,
            totalPages: 1,
            totalProducts: 0,
            itemsPerPage: 9,
            categories: ['Entertainment', 'Education', 'Gaming', 'Tools', 'Other']
        }
    },
    methods: {
        formatImageUrl,

        applyPriceFilter() {
            this.currentPage = 1;
            this.fetchProducts();
        },

        async fetchProducts() {
            try {
                this.loading = true;
                
                // Xây dựng URL với các tham số
                let url = `/products?pageNumber=${this.currentPage}&limit=${this.itemsPerPage}`;
                
                if (this.searchQuery) {
                    url += `&keyword=${this.searchQuery}`;
                }
                
                if (this.selectedCategory) {
                    url += `&category=${this.selectedCategory}`;
                }
                
                // Thêm tham số giá
                if (this.priceRange !== 'all') {
                    const [min, max] = this.priceRange.split('-');
                    
                    if (max) {
                        url += `&minPrice=${min}&maxPrice=${max}`;
                    } else {
                        // Xử lý trường hợp "500000+"
                        url += `&minPrice=${min.replace('+', '')}`;
                    }
                }
                
                // Thêm tham số sắp xếp
                if (this.sortBy) {
                    url += `&sortBy=${this.sortBy}`;
                }
                
                const response = await api.get(url);
                
                if (response.data.success) {
                    this.products = response.data.products;
                    this.currentPage = response.data.page;
                    this.totalPages = response.data.pages;
                    this.totalProducts = response.data.total;
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                this.error = error.response?.data?.message || 'Could not load the product list';
                this.$toast.error(this.error);
            } finally {
                this.loading = false;
            }
        },
        
        changePage(page) {
            if (page < 1 || page > this.totalPages) {
                return;
            }
            this.currentPage = page;
            this.fetchProducts();
            // Scroll to top
            window.scrollTo(0, 0);
        },
        
        searchProducts() {
            this.currentPage = 1;
            this.fetchProducts();
        },
        
        selectCategory(category) {
            this.selectedCategory = category;
            this.currentPage = 1;
            this.fetchProducts();
        },
        
        applyFilters() {
            this.currentPage = 1;
            this.fetchProducts();
        },
        
        applySorting() {
            this.currentPage = 1;
            this.fetchProducts();
        },
        
        resetFilters() {
            this.selectedCategory = null;
            this.searchQuery = '';
            this.priceRange = 'all';
            this.sortBy = 'createdAt_desc';
            this.currentPage = 1;
            this.fetchProducts();
        }
    },
    created() {
        // Kiểm tra query params
        const { category, search, page } = this.$route.query;
        
        if (category && this.categories.includes(category)) {
            this.selectedCategory = category;
        }
        
        if (search) {
            this.searchQuery = search;
        }
        
        if (page) {
            this.currentPage = parseInt(page);
        }
        
        // Fetch sản phẩm
        this.fetchProducts();
    }
}
</script>

<style scoped>
.product-list {
    padding-bottom: 40px;
}

.page-content {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.05);
    padding: 20px;
    margin-bottom: 20px;
}

.list-group-item.active {
    background-color: #3498db;
    border-color: #3498db;
}

.custom-control {
    margin-bottom: 8px;
}

.pagination .page-item.active .page-link {
    background-color: #3498db;
    border-color: #3498db;
    color: white;
}

.pagination .page-link {
    color: #3498db;
}

.pagination .page-link:hover {
    color: #2980b9;
}
</style>