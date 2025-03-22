<template>
	<div class="login">
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-md-6">
					<div class="page-content">
						<h1 class="text-center mb-4">Login</h1>

						<!-- Display error message if there's an authentication error -->
						<div v-if="error" class="alert alert-danger" role="alert">
							{{ error }}
						</div>

						<!-- Login form -->
						<form @submit.prevent="login">
							<!-- Username input -->
							<div class="form-group">
								<label for="username">Username</label>
								<input 
									type="text" 
									class="form-control" 
									id="username" 
									v-model="username"
									:class="{ 'is-invalid': submitted && !username }"
									required
								>
								<div v-if="submitted && !username" class="invalid-feedback">
									Please enter your username
								</div>
							</div>

							<!-- Password input -->
							<div class="form-group">
								<label for="password">Password</label>
								<input 
									type="password" 
									class="form-control" 
									id="password" 
									v-model="password"
									:class="{ 'is-invalid': submitted && !password }"
									required
								>
								<div v-if="submitted && !password" class="invalid-feedback">
									Please enter your password
								</div>
							</div>

							<!-- Remember me checkbox -->
							<div class="form-group form-check">
								<input type="checkbox" class="form-check-input" id="rememberMe" v-model="rememberMe">
								<label class="form-check-label" for="rememberMe">Remember me</label>
							</div>

							<!-- Submit button with loading spinner -->
							<button type="submit" class="btn btn-primary btn-block" :disabled="loading">
								<span v-if="loading">
									<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
									Processing...
								</span>
								<span v-else>Login</span>
							</button>
						</form>

						<!-- Links to register and reset password -->
						<div class="text-center mt-4">
							<p>No account? <router-link to="/register">Sign up</router-link></p>
							<p><router-link to="/forgot-password">Forgot password?</router-link></p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
	name: 'Login',
	data() {
		return {
			// Form data
			username: '',
			password: '',
			rememberMe: false,
			submitted: false
		};
	},
	computed: {
		// Getters from Vuex
		...mapGetters({
			loading: 'auth/authLoading',
			error: 'auth/authError'
		}),
		// Redirect after login, default to home
		redirect() {
			return this.$route.query.redirect || '/';
		}
	},
	methods: {
		// Actions from Vuex
		...mapActions({
			loginAction: 'auth/login'
		}),
		// Handle login form submission
		async login() {
			this.submitted = true;

			// Validate if username and password are filled
			if (!this.username || !this.password) {
				return;
			}

			try {
				// Perform login action
				await this.loginAction({
					username: this.username,
					password: this.password
				});

				// Success message and redirect to the desired route
				this.$toast.success('Login successful!');
				this.$router.push(this.redirect);
			} catch (error) {
				console.error('Login error:', error);
			}
		},
	}
};
</script>

<style scoped>
.login {
	padding: 40px 0;
}

.page-content {
	background-color: #fff;
	border-radius: 8px;
	box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
	padding: 30px;
}

.form-group {
	margin-bottom: 20px;
}

.spinner-border {
	margin-right: 8px;
}
</style>
