<template>
	<nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
		<div class="sidebar-sticky pt-3">
			<div class="text-center mb-4">
				<h5 class="mb-0">MEVN Shop</h5>
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
						<i class="store icon"></i>
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
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	z-index: 100;
	padding: 48px 0 0;
	box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}

.sidebar-sticky {
	position: relative;
	top: 0;
	height: calc(100vh - 48px);
	padding-top: .5rem;
	overflow-x: hidden;
	overflow-y: auto;
}

.sidebar .nav-link {
	font-weight: 500;
	color: #333;
	padding: .75rem 1rem;
}

.sidebar .nav-link i {
	margin-right: 10px;
}

.sidebar .nav-link.active {
	color: #007bff;
}

.sidebar-heading {
	font-size: .75rem;
	text-transform: uppercase;
}

@media (max-width: 767.98px) {
	.sidebar {
		position: static;
		height: auto;
		padding-top: 0;
	}
}
</style>
