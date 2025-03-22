<template>
	<div class="register">
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-md-8">
					<div class="page-content">
						<h1 class="text-center mb-4">Register Account</h1>

						<!-- Show error message if any -->
						<div v-if="error" class="alert alert-danger" role="alert">
							{{ error }}
						</div>

						<!-- Registration form -->
						<form @submit.prevent="register">
							<!-- Username input -->
							<div class="row">
								<div class="col-md-6">
									<div class="form-group">
										<label for="username">Username <span class="text-danger">*</span></label>
										<input 
											type="text" 
											class="form-control" 
											id="username" 
											v-model="username"
											:class="{ 'is-invalid': submitted && !username }"
											required
										>
										<div v-if="submitted && !username" class="invalid-feedback">
											Please enter a username
										</div>
									</div>
								</div>

								<!-- Email input -->
								<div class="col-md-6">
									<div class="form-group">
										<label for="email">Email <span class="text-danger">*</span></label>
										<input 
											type="email" 
											class="form-control" 
											id="email" 
											v-model="email"
											:class="{ 'is-invalid': submitted && !validEmail }"
											required
										>
										<div v-if="submitted && !email" class="invalid-feedback">
											Please enter an email
										</div>
										<div v-else-if="submitted && email && !validEmail" class="invalid-feedback">
											Invalid email
										</div>
									</div>
								</div>
							</div>

							<!-- Password input -->
							<div class="row">
								<div class="col-md-6">
									<div class="form-group">
										<label for="password">Password <span class="text-danger">*</span></label>
										<input 
											type="password" 
											class="form-control" 
											id="password" 
											v-model="password"
											:class="{ 'is-invalid': submitted && !validPassword }"
											required
										>
										<div v-if="submitted && !password" class="invalid-feedback">
											Please enter a password
										</div>
										<div v-else-if="submitted && password && !validPassword" class="invalid-feedback">
											Password must be at least 6 characters
										</div>
									</div>
								</div>

								<!-- Confirm password input -->
								<div class="col-md-6">
									<div class="form-group">
										<label for="confirmPassword">Confirm Password <span class="text-danger">*</span></label>
										<input 
											type="password" 
											class="form-control" 
											id="confirmPassword" 
											v-model="confirmPassword"
											:class="{ 'is-invalid': submitted && !validConfirmPassword }"
											required
										>
										<div v-if="submitted && !confirmPassword" class="invalid-feedback">
											Please confirm your password
										</div>
										<div v-else-if="submitted && confirmPassword && !validConfirmPassword" class="invalid-feedback">
											Passwords do not match
										</div>
									</div>
								</div>
							</div>

							<!-- Full name input -->
							<div class="form-group">
								<label for="fullName">Full Name <span class="text-danger">*</span></label>
								<input 
									type="text" 
									class="form-control" 
									id="fullName" 
									v-model="fullName"
									:class="{ 'is-invalid': submitted && !fullName }"
									required
								>
								<div v-if="submitted && !fullName" class="invalid-feedback">
									Please enter your full name
								</div>
							</div>

							<!-- Phone and Address input -->
							<div class="row">
								<div class="col-md-6">
									<div class="form-group">
										<label for="phone">Phone Number</label>
										<input 
											type="tel" 
											class="form-control" 
											id="phone" 
											v-model="phone"
										>
									</div>
								</div>

								<div class="col-md-6">
									<div class="form-group">
										<label for="address">Address</label>
										<input 
											type="text" 
											class="form-control" 
											id="address" 
											v-model="address"
										>
									</div>
								</div>
							</div>

							<!-- Terms agreement -->
							<div class="form-group form-check">
								<input 
									type="checkbox" 
									class="form-check-input" 
									id="agreeTerms"
									v-model="agreeTerms"
									:class="{ 'is-invalid': submitted && !agreeTerms }"
									required
								>
								<label class="form-check-label" for="agreeTerms">
									I agree to the <a href="#" @click.prevent="showTerms">Terms of Use</a> and <a href="#" @click.prevent="showPolicy">Privacy Policy</a>
								</label>
								<div v-if="submitted && !agreeTerms" class="invalid-feedback">
									You must agree to the terms to proceed
								</div>
							</div>

							<!-- Submit button with loading indicator -->
							<button type="submit" class="btn btn-primary btn-block" :disabled="loading">
								<span v-if="loading">
									<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
									Processing...
								</span>
								<span v-else>Register</span>
							</button>
						</form>

						<!-- Link to login if already have an account -->
						<div class="text-center mt-4">
							<p>Already have an account? <router-link to="/login">Login</router-link></p>
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
	name: 'Register',
	data() {
		return {
			// Form data
			username: '',
			email: '',
			password: '',
			confirmPassword: '',
			fullName: '',
			phone: '',
			address: '',
			agreeTerms: false,
			submitted: false
		};
	},
	computed: {
		// Getters from Vuex for loading and error state
		...mapGetters({
			loading: 'auth/authLoading',
			error: 'auth/authError'
		}),
		// Validation methods for email, password, and confirm password
		validEmail() {
			const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return !this.email || re.test(String(this.email).toLowerCase());
		},
		validPassword() {
			return !this.password || this.password.length >= 6;
		},
		validConfirmPassword() {
			return !this.confirmPassword || this.confirmPassword === this.password;
		}
	},
	methods: {
		// Actions from Vuex
		...mapActions({
			registerAction: 'auth/register'
		}),
		// Registration handler
		async register() {
			this.submitted = true;

			// Validate the form fields before submitting
			if (!this.username || !this.email || !this.password || !this.confirmPassword || 
				!this.fullName || !this.agreeTerms || !this.validEmail || 
				!this.validPassword || !this.validConfirmPassword) {
				return;
			}

			try {
				// Perform registration
				await this.registerAction({
					username: this.username,
					email: this.email,
					password: this.password,
					fullName: this.fullName,
					phone: this.phone,
					address: this.address
				});

				// Success message and redirect to home
				this.$toast.success('Registration successful!');
				this.$router.push('/');
			} catch (error) {
				console.error('Register error:', error);
			}
		},
		// Terms and Policy links
		showTerms() {
			this.$toast.info('Terms of Use are being updated');
		},
		showPolicy() {
			this.$toast.info('Privacy Policy is being updated');
		}
	}
};
</script>

<style scoped>
.register {
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
