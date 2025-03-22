<template>
	<header>
		<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
			<div class="container">
				<router-link class="navbar-brand" to="/">
					{{ appTitle }}
				</router-link>
				
				<button class="navbar-toggler" type="button" data-toggle="collapse" 
						data-target="#navbarMain" aria-controls="navbarMain" 
						aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				
				<div class="collapse navbar-collapse" id="navbarMain">
					<ul class="navbar-nav mr-auto">
						<li class="nav-item">
							<router-link class="nav-link" to="/" exact>Home</router-link>
						</li>
						<li class="nav-item">
							<router-link class="nav-link" to="/products">Store</router-link>
						</li>
						<li class="nav-item">
							<router-link class="nav-link" to="/about">About</router-link>
						</li>
					</ul>
					
					<ul class="navbar-nav ml-auto">
						<!-- Cart -->
						<li class="nav-item">
							<router-link class="nav-link position-relative" to="/cart">
								<i class="shopping cart icon"></i> Cart
								<span v-if="cartCount > 0" class="badge badge-danger badge-pill cart-badge">
									{{ cartCount }}
								</span>
							</router-link>
						</li>
						
						<!-- User not logged in -->
						<template v-if="!isAuthenticated">
							<li class="nav-item">
								<router-link class="nav-link" to="/login">
									<i class="sign in alternate icon"></i> Login
								</router-link>
							</li>
							<li class="nav-item">
								<router-link class="nav-link" to="/register">
									<i class="user plus icon"></i> Register
								</router-link>
							</li>
						</template>
						
						<!-- User logged in - Vue managed dropdown -->
						<li v-else class="nav-item dropdown" ref="userDropdownContainer">
							<a class="nav-link dropdown-toggle" href="#" id="userDropdown" 
							   @click.prevent="toggleDropdown">
								<i class="user circle icon"></i> {{ user ? user.username : 'Account' }}
							</a>
							<div class="dropdown-menu dropdown-menu-right" :class="{'show': dropdownVisible}">
								<router-link class="dropdown-item" to="/profile" @click="closeDropdown">
									<i class="id card icon"></i> Profile
								</router-link>
								<router-link class="dropdown-item" to="/orders" @click="closeDropdown">
									<i class="shopping bag icon"></i> My Orders
								</router-link>
								
								<!-- Admin Menu -->
								<template v-if="isAdmin">
									<div class="dropdown-divider"></div>
									<router-link class="dropdown-item" to="/admin" @click="closeDropdown">
										<i class="dashboard icon"></i> Admin Dashboard
									</router-link>
								</template>
								
								<div class="dropdown-divider"></div>
								<a class="dropdown-item" href="#" @click.prevent="logout">
									<i class="sign out alternate icon"></i> Logout
								</a>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	</header>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
	name: 'AppHeader',
	data() {
		return {
			appTitle: process.env.VUE_APP_TITLE || 'MEVN Shop',
			dropdownVisible: false
		}
	},
	computed: {
		...mapState({
			user: state => state.auth.user
		}),
		...mapGetters({
			isAuthenticated: 'auth/isAuthenticated',
			isAdmin: 'auth/isAdmin',
			cartCount: 'cart/cartCount'
		})
	},
	methods: {
		...mapActions({
			logoutAction: 'auth/logout'
		}),
		logout() {
			this.logoutAction();
			this.closeDropdown();
			this.$router.push('/login');
		},
		toggleDropdown() {
			this.dropdownVisible = !this.dropdownVisible;
		},
		closeDropdown() {
			this.dropdownVisible = false;
		},
		handleClickOutside(event) {
			// Kiểm tra nếu click bên ngoài dropdown
			const container = this.$refs.userDropdownContainer;
			if (container && !container.contains(event.target)) {
				this.closeDropdown();
			}
		}
	},
	mounted() {
		// Thêm event listener để bắt sự kiện click ngoài dropdown
		document.addEventListener('click', this.handleClickOutside);
	},
	beforeDestroy() {
		// Dọn dẹp event listener khi component bị hủy
		document.removeEventListener('click', this.handleClickOutside);
	},
	watch: {
		// Theo dõi thay đổi route để đóng dropdown khi chuyển trang
		$route() {
			this.closeDropdown();
		}
	}
}
</script>

<style scoped>

header {
	position: sticky;
}

.cart-badge {
	position: absolute;
	top: 0;
	right: 0;
	font-size: 0.6rem;
}

.dropdown-menu.show {
	display: block;
	z-index: 1050;
	
}

.navbar-dark .navbar-nav .nav-link {
	color: rgba(255, 255, 255, 0.8);
}

.navbar-dark .navbar-nav .nav-link:hover,
.navbar-dark .navbar-nav .nav-link:focus {
	color: rgba(255, 255, 255, 1);
}

.dropdown-item {
	padding: 0.5rem 1.5rem;
	
}

.dropdown-item i {
	margin-right: 8px;
}

/* Thêm các style để đảm bảo dropdown hoạt động đúng */
.nav-item.dropdown {
	position: relative;
}

.dropdown-menu {
	position: absolute;
	right: 0;
	left: auto;
	top: 100%;
	z-index: 1050;
	min-width: 10rem;
	margin-top: 0.125rem;
}
</style>