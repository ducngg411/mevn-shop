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
						
						<!-- User logged in - Bootstrap dropdown -->
						<li v-else class="nav-item dropdown">
							<a class="nav-link dropdown-toggle" href="#" id="userDropdown" 
							role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								<i class="user circle icon"></i> {{ user ? user.username : 'Account' }}
							</a>
							<div class="dropdown-menu dropdown-menu-right">
								<router-link class="dropdown-item" to="/profile">
									<i class="id card icon"></i> Profile
								</router-link>
								<router-link class="dropdown-item" to="/orders">
									<i class="shopping bag icon"></i> My Orders
								</router-link>
								
								<!-- Admin Menu -->
								<template v-if="isAdmin">
									<div class="dropdown-divider"></div>
									<router-link class="dropdown-item" to="/admin">
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
			this.$router.push('/login');
		}
	}
}
</script>

<style scoped>
/* header {
	position: sticky;
	top: 0;
	z-index: 1030;
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

.navbar-nav {
	position: relative;
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
	box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
	border: 1px solid rgba(0, 0, 0, 0.15);
	background-color: #fff;
} */

/* AppHeader.vue */
header {
	position: sticky;
	top: 0;
	z-index: 1030;
	box-shadow: 0 2px 15px rgba(0,0,0,0.08);
}

.navbar-dark.bg-primary {
	background: linear-gradient(135deg, #4361ee, #3a0ca3) !important;
	padding: 12px 0;
}

.navbar-brand {
	font-size: 1.5rem;
	font-weight: 800;
	letter-spacing: 1px;
}

.cart-badge {
	position: absolute;
	top: -5px;
	right: -5px;
	font-size: 0.65rem;
	padding: 0.25rem 0.5rem;
	border-radius: 50%;
	background-color: #f72585;
	border: 2px solid white;
	box-shadow: 0 2px 5px rgba(0,0,0,0.2);
	animation: pulse 1.5s infinite;
}

@keyframes pulse {
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.1);
	}
	100% {
		transform: scale(1);
	}
}

.navbar-nav .nav-link {
	font-weight: 600;
	padding: 0.5rem 1rem;
	position: relative;
	transition: all 0.3s;
}

.navbar-dark .navbar-nav .nav-link {
	color: rgba(255, 255, 255, 0.9);
}

.navbar-dark .navbar-nav .nav-link:hover,
.navbar-dark .navbar-nav .nav-link:focus {
	color: rgba(255, 255, 255, 1);
}

.navbar-nav .nav-link:after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	right: 50%;
	height: 3px;
	background-color: white;
	transition: all 0.3s;
	opacity: 0;
}

.navbar-nav .nav-link:hover:after {
	left: 15%;
	right: 15%;
	opacity: 1;
}

.dropdown-menu {
	border: none;
	border-radius: 8px;
	box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.dropdown-item {
	padding: 0.7rem 1.5rem;
	font-weight: 500;
	transition: background-color 0.3s, color 0.3s;
}

.dropdown-item:hover {
	background-color: #f5f7ff;
	color: #4361ee;
}

.dropdown-item i {
	margin-right: 10px;
	transition: transform 0.3s;
}

.dropdown-item:hover i {
	transform: translateX(3px);
	color: #4361ee;
}

</style>