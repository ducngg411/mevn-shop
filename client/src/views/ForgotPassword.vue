<template>
    <div class="forgot-password">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="page-content">
                        <h1 class="text-center mb-4">Forgot Password</h1>

                        <div v-if="message" class="alert" :class="`alert-${messageType}`" role="alert">
                            {{ message }}
                        </div>

                        <div v-if="mailSent">
                            <div class="text-center mb-4">
                                <i class="huge envelope icon text-primary"></i>
                                <h4 class="mt-3">Reset Email Sent</h4>
                                <p>We've sent password reset instructions to your email. Please check your inbox.</p>
                                <p class="small text-muted mt-3">If you don't see the email, check your spam folder.</p>
                            </div>
                            <div class="text-center mt-4">
                                <router-link to="/login" class="btn btn-primary">
                                    <i class="sign in alternate icon"></i> Back to Login
                                </router-link>
                            </div>
                        </div>

                        <form v-else @submit.prevent="sendResetLink">
                            <p class="mb-4">Enter your email address below and we'll send you a link to reset your password.</p>
                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input 
                                    type="email" 
                                    class="form-control" 
                                    id="email" 
                                    v-model="email" 
                                    :class="{ 'is-invalid': submitted && !validEmail }"
                                    required
                                    placeholder="Enter your email address"
                                >
                                <div v-if="submitted && !email" class="invalid-feedback">
                                    Please enter your email address
                                </div>
                                <div v-else-if="submitted && email && !validEmail" class="invalid-feedback">
                                    Please enter a valid email address
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
                                <span v-if="loading">
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Sending...
                                </span>
                                <span v-else>
                                    <i class="paper plane icon"></i> Send Reset Link
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
    name: 'ForgotPassword',
    data() {
        return {
            email: '',
            loading: false,
            submitted: false,
            mailSent: false,
            message: '',
            messageType: 'info'
        };
    },
    computed: {
        validEmail() {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return !this.email || re.test(String(this.email).toLowerCase());
        }
    },
    methods: {
        async sendResetLink() {
            this.submitted = true;
            
            if (!this.email || !this.validEmail) {
                return;
            }
            
            try {
                this.loading = true;
                this.message = '';
                
                const response = await api.post('/auth/forgot-password', { email: this.email });
                
                if (response.data.success) {
                    this.mailSent = true;
                    this.messageType = 'success';
                    this.message = 'Password reset instructions have been sent to your email.';
                }
            } catch (error) {
                console.error('Error sending reset link:', error);
                this.messageType = 'danger';
                this.message = error.response?.data?.message || 'Unable to send reset link. Please try again later.';
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<style scoped>
.forgot-password {
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