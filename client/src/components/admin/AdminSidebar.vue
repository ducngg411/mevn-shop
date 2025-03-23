<template>
	<nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
		<div class="sidebar-sticky pt-3">
			<div class="text-center mb-4">
				<h5 class="mb-0">LisenceZone</h5>
				<div class="text-muted small">System Administration</div>
			</div>
			
			<ul class="nav flex-column">
				<li class="nav-item">
					<router-link to="/admin" class="nav-link" :class="{ 'active': activeMenu === 'dashboard' }">
						<i class="tachometer alternate icon"></i>
						Dashboard
					</router-link>
				</li>
				<li class="nav-item">
					<router-link to="/admin/orders" class="nav-link" :class="{ 'active': activeMenu === 'orders' }">
						<i class="shopping bag icon"></i>
						Orders
					</router-link>
				</li>
				<li class="nav-item">
					<router-link to="/admin/products" class="nav-link" :class="{ 'active': activeMenu === 'products' }">
						<i class="shop icon"></i>
						Store
					</router-link>
				</li>
				<li class="nav-item">
					<router-link to="/admin/accounts" class="nav-link" :class="{ 'active': activeMenu === 'accounts' }">
						<i class="key icon"></i>
						Accounts
					</router-link>
				</li>
				<li class="nav-item">
					<router-link to="/admin/vouchers" class="nav-link" :class="{ 'active': activeMenu === 'vouchers' }">
						<i class="ticket alternate icon"></i>
						Vouchers
					</router-link>
				</li>
				<li class="nav-item">
					<router-link to="/admin/users" class="nav-link" :class="{ 'active': activeMenu === 'users' }">
						<i class="users icon"></i>
						Users
					</router-link>
				</li>
			</ul>
			
			<h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
				<span>Other Features</span>
			</h6>
			<ul class="nav flex-column mb-2">
				<li class="nav-item">
					<router-link to="/admin/settings" class="nav-link" :class="{ 'active': activeMenu === 'settings' }">
						<i class="cog icon"></i>
						Settings
					</router-link>
				</li>
				<li class="nav-item">
					<a href="#" class="nav-link" @click.prevent="logout">
						<i class="sign out alternate icon"></i>
						Logout
					</a>
				</li>
			</ul>
		</div>
	</nav>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	name: 'AdminSidebar',
	props: {
		activeMenu: {
			type: String,
			default: 'dashboard'
		}
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
};
</script>

<style scoped>
.sidebar {
	background: linear-gradient(180deg, #2c3e50, #1a202c);
	height: 100vh;
	box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
	z-index: 1000;
	transition: all 0.3s ease;
}

.sidebar-sticky {
	padding-top: 1rem;
	height: calc(100vh - 48px);
}

.sidebar .nav-link {
	border-radius: 8px;
	margin: 5px 10px;
	transition: all 0.3s ease;
	font-weight: 600;
	color: rgba(255, 255, 255, 0.8);
	padding: 0.85rem 1rem;
}

.sidebar .nav-link:hover {
	background-color: rgba(255, 255, 255, 0.1);
	color: white;
	transform: translateX(5px);
}

.sidebar .nav-link.active {
	background-color: #4361ee;
	color: white;
	box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
}

.sidebar .nav-link i {
	margin-right: 10px;
	font-size: 1.1rem;
	width: 24px;
	text-align: center;
	transition: all 0.3s ease;
}

.sidebar .nav-link:hover i {
	transform: scale(1.2);
}

/* Sidebar Brand/Logo area */
.sidebar-sticky > div:first-child {
	padding: 1.5rem 1rem;
	background: rgba(0, 0, 0, 0.2);
	margin-bottom: 1.5rem;
	border-radius: 0 0 8px 8px;
}

.sidebar-sticky h5 {
	font-weight: 800;
	letter-spacing: 1px;
	color: white;
	margin-bottom: 5px;
}

.sidebar-sticky .text-muted {
	color: rgba(255, 255, 255, 0.6) !important;
	font-size: 0.9rem;
}

.sidebar-heading {
	font-size: 0.8rem;
	text-transform: uppercase;
	letter-spacing: 1px;
	color: rgba(255, 255, 255, 0.4);
	padding: 0.75rem 1rem;
	margin-top: 1rem;
}
</style>
