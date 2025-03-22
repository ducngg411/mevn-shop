<template>
    <div class="change-password">
        <div class="container">
            <div class="row">
                <div class="col-md-3 mb-4">
                    <div class="page-content p-0">
                        <div class="profile-sidebar">
                            <div class="profile-avatar text-center py-4">
                                <i class="massive user circle icon text-primary"></i>
                                <h5 class="mt-3 mb-0">{{ user?.fullName || user?.username || 'User' }}</h5>
                                <p class="text-muted">{{ user?.email || 'N/A' }}</p>
                            </div>
                            
                            <div class="list-group">
                                <router-link to="/profile" class="list-group-item list-group-item-action">
                                    <i class="user icon"></i> Profile Information
                                </router-link>
                                <router-link to="/orders" class="list-group-item list-group-item-action">
                                    <i class="shopping bag icon"></i> My Orders
                                </router-link>
                                <router-link to="/change-password" class="list-group-item list-group-item-action active">
                                    <i class="lock icon"></i> Change Password
                                </router-link>
                                <a href="#" @click.prevent="logout" class="list-group-item list-group-item-action">
                                    <i class="sign out alternate icon"></i> Log Out
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-9">
                    <div class="page-content">
                        <h4 class="mb-4">Change Password</h4>
                        
                        <div v-if="message" class="alert" :class="`alert-${messageType}`" role="alert">
                            {{ message }}
                        </div>
                        
                        <form @submit.prevent="changePassword">
                            <div class="form-group">
                                <label for="currentPassword">Current Password</label>
                                <input 
                                    type="password" 
                                    class="form-control" 
                                    id="currentPassword" 
                                    v-model="passwordData.currentPassword" 
                                    :class="{ 'is-invalid': submitted && !passwordData.currentPassword }"
                                    required
                                >
                                <div v-if="submitted && !passwordData.currentPassword" class="invalid-feedback">
                                    Please enter your current password
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="newPassword">New Password</label>
                                <input 
                                    type="password" 
                                    class="form-control" 
                                    id="newPassword" 
                                    v-model="passwordData.newPassword" 
                                    :class="{ 'is-invalid': submitted && !isValidPassword }"
                                    required
                                >
                                <div v-if="submitted && !passwordData.newPassword" class="invalid-feedback">
                                    Please enter a new password
                                </div>
                                <div v-else-if="submitted && passwordData.newPassword && !isValidPassword" class="invalid-feedback">
                                    Password must be at least 6 characters
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="confirmNewPassword">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    class="form-control" 
                                    id="confirmNewPassword" 
                                    v-model="passwordData.confirmNewPassword" 
                                    :class="{ 'is-invalid': submitted && !isValidConfirmPassword }"
                                    required
                                >
                                <div v-if="submitted && !passwordData.confirmNewPassword" class="invalid-feedback">
                                    Please confirm your new password
                                </div>
                                <div v-else-if="submitted && passwordData.confirmNewPassword && !isValidConfirmPassword" class="invalid-feedback">
                                    Passwords do not match
                                </div>
                            </div>
                            
                            <button type="submit" class="btn btn-primary" :disabled="loading">
                                <span v-if="loading">
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Updating...
                                </span>
                                <span v-else>
                                    <i class="save icon"></i> Update Password
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import api from '@/utils/api';

export default {
    name: 'ChangePassword',
    data() {
        return {
            passwordData: {
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            },
            submitted: false,
            loading: false,
            message: '',
            messageType: 'info'
        };
    },
    computed: {
        ...mapState({
            user: state => state.auth.user
        }),
        ...mapGetters({
            isAuthenticated: 'auth/isAuthenticated'
        }),
        isValidPassword() {
            return !this.passwordData.newPassword || this.passwordData.newPassword.length >= 6;
        },
        isValidConfirmPassword() {
            return !this.passwordData.confirmNewPassword || 
                   this.passwordData.confirmNewPassword === this.passwordData.newPassword;
        }
    },
    methods: {
        ...mapActions({
            logoutAction: 'auth/logout'
        }),
        logout() {
            this.logoutAction();
            this.$router.push('/login');
        },
        async changePassword() {
            this.submitted = true;
            
            if (!this.passwordData.currentPassword || 
                !this.passwordData.newPassword || 
                !this.passwordData.confirmNewPassword ||
                !this.isValidPassword ||
                !this.isValidConfirmPassword) {
                return;
            }
            
            try {
                this.loading = true;
                this.message = '';
                
                const response = await api.put('/auth/change-password', {
                    currentPassword: this.passwordData.currentPassword,
                    newPassword: this.passwordData.newPassword
                });
                
                if (response.data.success) {
                    this.messageType = 'success';
                    this.message = 'Password has been successfully updated.';
                    
                    // Reset form
                    this.passwordData = {
                        currentPassword: '',
                        newPassword: '',
                        confirmNewPassword: ''
                    };
                    this.submitted = false;
                }
            } catch (error) {
                console.error('Error changing password:', error);
                this.messageType = 'danger';
                this.message = error.response?.data?.message || 'Unable to change password. Please try again.';
            } finally {
                this.loading = false;
            }
        }
    },
    created() {
        if (!this.isAuthenticated) {
            this.$router.push('/login');
        }
    }
};
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

.list-group-item.active {
    background-color: #3498db;
    border-color: #3498db;
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