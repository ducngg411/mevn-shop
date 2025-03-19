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
						
						<!-- User logged in -->
						<li v-else class="nav-item dropdown">
							<a class="nav-link dropdown-toggle" href="#" id="userDropdown" 
							role="button" data-toggle="dropdown" aria-haspopup="true" 
							aria-expanded="false">
								<i class="user circle icon"></i> {{ user ? user.username : 'Account' }}
							</a>
							<div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
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
			appTitle: process.env.VUE_APP_TITLE || 'MEVN Shop'
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
		}
	},
	mounted() {
		// Ensure Bootstrap JS is used for dropdown
		document.querySelectorAll('.dropdown-toggle').forEach(dropdown => {
			dropdown.addEventListener('click', function() {
				this.closest('.dropdown').classList.toggle('show');
				this.nextElementSibling.classList.toggle('show');
			});
		});
		
		// Close dropdown when clicking outside
		window.addEventListener('click', (e) => {
			if (!e.target.matches('.dropdown-toggle')) {
				document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
					menu.classList.remove('show');
					menu.parentElement.classList.remove('show');
				});
			}
		});
	}
}
</script>

<style scoped>
.cart-badge {
	position: absolute;
	top: 0;
	right: 0;
	font-size: 0.6rem;
}

.dropdown-menu.show {
	display: block;
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
</style>
