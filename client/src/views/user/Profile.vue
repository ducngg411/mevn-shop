<template>
	<div class="profile">
		<div class="container">
			<h1 class="mb-4">My Profile</h1>
			
			<div class="row">
				<div class="col-md-3 mb-4">
					<div class="page-content p-0">
						<div class="profile-sidebar">
							<div class="profile-avatar text-center py-4">
								<i class="massive user circle icon text-primary"></i>
								<h5 class="mt-3 mb-0">{{ userData.fullName || 'User' }}</h5>
								<p class="text-muted">{{ userData.email || 'N/A' }}</p>
							</div>
							
							<div class="list-group">
								<router-link to="/profile" class="list-group-item list-group-item-action active">
									<i class="user icon"></i> Personal Information
								</router-link>
								<router-link to="/orders" class="list-group-item list-group-item-action">
									<i class="shopping bag icon"></i> My Orders
								</router-link>
								<router-link to="/change-password" class="list-group-item list-group-item-action">
									<i class="lock icon"></i> Change Password
								</router-link>
								<a href="#" @click.prevent="logout" class="list-group-item list-group-item-action">
									<i class="sign out alternate icon"></i> Logout
								</a>
							</div>
						</div>
					</div>
				</div>
				
				<div class="col-md-9">
					<div class="page-content">
						<h4 class="mb-4">Personal Information</h4>
						
						<div v-if="loading">
							<div class="ui active centered inline loader"></div>
							<p class="text-center">Loading...</p>
						</div>
						
						<div v-else>
							<div v-if="error" class="alert alert-danger">{{ error }}</div>
							
							<form @submit.prevent="updateProfile">
								<div class="form-group">
									<label for="username">Username</label>
									<input 
										type="text" 
										class="form-control" 
										id="username" 
										v-model="userData.username"
										readonly
										disabled
									>
									<small class="form-text text-muted">Username cannot be changed</small>
								</div>
								
								<div class="form-group">
									<label for="email">Email</label>
									<input 
										type="email" 
										class="form-control" 
										id="email" 
										v-model="userData.email"
										:class="{ 'is-invalid': submitted && !validEmail }"
										required
									>
									<div v-if="submitted && !userData.email" class="invalid-feedback">
										Please enter your email
									</div>
									<div v-else-if="submitted && userData.email && !validEmail" class="invalid-feedback">
										Invalid email
									</div>
								</div>
								
								<div class="form-group">
									<label for="fullName">Full Name</label>
									<input 
										type="text" 
										class="form-control" 
										id="fullName" 
										v-model="userData.fullName"
										:class="{ 'is-invalid': submitted && !userData.fullName }"
										required
									>
									<div v-if="submitted && !userData.fullName" class="invalid-feedback">
										Please enter your full name
									</div>
								</div>
								
								<div class="form-group">
									<label for="phone">Phone Number</label>
									<input 
										type="tel" 
										class="form-control" 
										id="phone" 
										v-model="userData.phone"
									>
								</div>
								
								<div class="form-group">
									<label for="address">Address</label>
									<textarea 
										class="form-control" 
										id="address" 
										v-model="userData.address"
										rows="3"
									></textarea>
								</div>
								
								<button type="submit" class="btn btn-primary" :disabled="updating">
									<span v-if="updating">
										<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
										Updating...
									</span>
									<span v-else>
										<i class="save icon"></i> Update
									</span>
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import api from '@/utils/api';

export default {
	name: 'Profile',
	data() {
		return {
			userData: {
				username: '',
				email: '',
				fullName: '',
				phone: '',
				address: ''
			},
			loading: false,
			updating: false,
			error: null,
			submitted: false
		}
	},
	computed: {
		...mapGetters({
			isAuthenticated: 'auth/isAuthenticated',
		}),
		...mapState({
			user: state => state.auth.user
		}),
		validEmail() {
			const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return !this.userData.email || re.test(String(this.userData.email).toLowerCase());
		}
	},
	methods: {
		...mapActions({
			logoutAction: 'auth/logout',
			updateProfileAction: 'auth/updateProfile'
		}),
		logout() {
			this.logoutAction();
			this.$router.push('/login');
		},
		async fetchUserProfile() {
			this.loading = true;
			this.error = null;
			
			try {
				const response = await api.get('/auth/profile');
				
				if (response.data.success) {
					const userData = response.data.user;
					
					this.userData = {
						username: userData.username || '',
						email: userData.email || '',
						fullName: userData.fullName || '',
						phone: userData.phone || '',
						address: userData.address || ''
					};
				}
			} catch (error) {
				console.error('Error fetching user profile:', error);
				this.error = error.response?.data?.message || 'Unable to fetch user information';
			} finally {
				this.loading = false;
			}
		},
		async updateProfile() {
			this.submitted = true;
			
			if (!this.userData.email || !this.userData.fullName || !this.validEmail) {
				return;
			}
			
			this.updating = true;
			this.error = null;
			
			try {
				await this.updateProfileAction({
					email: this.userData.email,
					fullName: this.userData.fullName,
					phone: this.userData.phone,
					address: this.userData.address
				});
				
				this.$toast.success('Profile updated successfully!');
			} catch (error) {
				console.error('Error updating profile:', error);
				this.error = error.response?.data?.message || 'Unable to update profile';
			} finally {
				this.updating = false;
			}
		}
	},
	created() {
		if (!this.isAuthenticated) {
			this.$router.push('/login');
			return;
		}
		
		// If user data is already available in Vuex, use it first
		if (this.user) {
			this.userData = {
				username: this.user.username || '',
				email: this.user.email || '',
				fullName: this.user.fullName || '',
				phone: this.user.phone || '',
				address: this.user.address || ''
			};
		}
		
		// Fetch the latest user profile from the server
		this.fetchUserProfile();
	}
}
</script>

<style scoped>
.profile-sidebar {
	background-color: #fff;
	border-radius: 8px;
	overflow: hidden;
}

.profile-avatar i.icon {
	opacity: 0.3;
}

.list-group-item i.icon {
	margin-right: 8px;
}
</style>
