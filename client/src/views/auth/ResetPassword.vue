<template>
    <div class="reset-password">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="page-content">
                        <h1 class="text-center mb-4">Reset Password</h1>

                        <div v-if="message" class="alert" :class="`alert-${messageType}`" role="alert">
                            {{ message }}
                        </div>

                        <div v-if="passwordReset">
                            <div class="text-center mb-4">
                                <i class="huge check circle icon text-success"></i>
                                <h4 class="mt-3">Password Reset Successful</h4>
                                <p>Your password has been successfully reset. You can now log in with your new password.</p>
                            </div>
                            <div class="text-center mt-4">
                                <router-link to="/login" class="btn btn-primary">
                                    <i class="sign in alternate icon"></i> Login
                                </router-link>
                            </div>
                        </div>

                        <form v-else @submit.prevent="resetPassword">
                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input 
                                    type="email" 
                                    class="form-control" 
                                    id="email" 
                                    v-model="email" 
                                    :class="{ 'is-invalid': submitted && !validEmail }"
                                    required
                                    :readonly="queryEmail"
                                >
                                <div v-if="submitted && !email" class="invalid-feedback">
                                    Please enter your email address
                                </div>
                                <div v-else-if="submitted && email && !validEmail" class="invalid-feedback">
                                    Please enter a valid email address
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="resetToken">Reset Code</label>
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    id="resetToken" 
                                    v-model="token" 
                                    :class="{ 'is-invalid': submitted && !token }"
                                    required
                                    :readonly="queryToken"
                                    placeholder="Enter the code sent to your email"
                                >
                                <div v-if="submitted && !token" class="invalid-feedback">
                                    Please enter the reset code
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="newPassword">New Password</label>
                                <input 
                                    type="password" 
                                    class="form-control" 
                                    id="newPassword" 
                                    v-model="newPassword" 
                                    :class="{ 'is-invalid': submitted && !isValidPassword }"
                                    required
                                    placeholder="Create a new password"
                                >
                                <div v-if="submitted && !newPassword" class="invalid-feedback">
                                    Please enter a new password
                                </div>
                                <div v-else-if="submitted && newPassword && !isValidPassword" class="invalid-feedback">
                                    Password must be at least 6 characters
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="confirmPassword">Confirm Password</label>
                                <input 
                                    type="password" 
                                    class="form-control" 
                                    id="confirmPassword" 
                                    v-model="confirmPassword" 
                                    :class="{ 'is-invalid': submitted && !isValidConfirmPassword }"
                                    required
                                    placeholder="Confirm your new password"
                                >
                                <div v-if="submitted && !confirmPassword" class="invalid-feedback">
                                    Please confirm your password
                                </div>
                                <div v-else-if="submitted && confirmPassword && !isValidConfirmPassword" class="invalid-feedback">
                                    Passwords do not match
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
                                <span v-if="loading">
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Processing...
                                </span>
                                <span v-else>
                                    <i class="lock icon"></i> Reset Password
                                </span>
                            </button>

                            <div class="text-center mt-4">
                                <p>Remember your password? <router-link to="/login">Login</router-link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/utils/api';

export default {
    name: 'ResetPassword',
    data() {
        return {
            email: '',
            token: '',
            newPassword: '',
            confirmPassword: '',
            loading: false,
            submitted: false,
            passwordReset: false,
            message: '',
            messageType: 'info',
            queryEmail: false,
            queryToken: false
        };
    },
    computed: {
        validEmail() {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return !this.email || re.test(String(this.email).toLowerCase());
        },
        isValidPassword() {
            return !this.newPassword || this.newPassword.length >= 6;
        },
        isValidConfirmPassword() {
            return !this.confirmPassword || this.confirmPassword === this.newPassword;
        }
    },
    methods: {
        async resetPassword() {
            this.submitted = true;
            
            if (!this.email || !this.token || !this.newPassword || !this.confirmPassword || 
                !this.validEmail || !this.isValidPassword || !this.isValidConfirmPassword) {
                return;
            }
            
            try {
                this.loading = true;
                this.message = '';
                
                const response = await api.post('/auth/reset-password', {
                    email: this.email,
                    token: this.token,
                    newPassword: this.newPassword
                });
                
                if (response.data.success) {
                    this.passwordReset = true;
                    this.messageType = 'success';
                    this.message = 'Your password has been successfully reset.';
                }
            } catch (error) {
                console.error('Error resetting password:', error);
                this.messageType = 'danger';
                this.message = error.response?.data?.message || 'Unable to reset password. The token may be invalid or expired.';
            } finally {
                this.loading = false;
            }
        }
    },
    created() {
        // Check for token and email in URL params
        const { token, email } = this.$route.query;
        
        if (token) {
            this.token = token;
            this.queryToken = true;
        }
        
        if (email) {
            this.email = email;
            this.queryEmail = true;
        }
    }
};
</script>

<style scoped>
.reset-password {
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

i.huge.icon {
    font-size: 4rem;
    opacity: 0.7;
}
</style>