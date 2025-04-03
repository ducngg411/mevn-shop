<template>
    <div class="support">
        <div class="container">
            <h1 class="text-center mb-5">Customer Support</h1>
            
            <div class="row">
                <!-- Contact Information -->
                <div class="col-md-5 mb-4">
                    <div class="page-content">
                        <h3 class="mb-4">Contact Us</h3>
                        <p class="mb-4">Our dedicated support team is ready to assist you with any questions, concerns, or issues you may have.</p>

                        <div class="contact-methods">
                            <div class="contact-item mb-4">
                                <div class="d-flex align-items-center">
                                    <div class="contact-icon phone-icon">
                                        <i class="phone icon"></i>
                                    </div>
                                    <div class="contact-details">
                                        <h5 class="mb-1">Phone Support</h5>
                                        <p class="mb-0">
                                            <a href="tel:0377386704" class="contact-link">0377386704</a>
                                        </p>
                                        <p class="text-muted small">Available 24/7</p>
                                    </div>
                                </div>
                            </div>

                            <div class="contact-item mb-4">
                                <div class="d-flex align-items-center">
                                    <div class="contact-icon facebook-icon">
                                        <i class="facebook f icon"></i>
                                    </div>
                                    <div class="contact-details">
                                        <h5 class="mb-1">Facebook</h5>
                                        <p class="mb-0">
                                            <a href="https://facebook.com/ducngg.411" target="_blank" rel="noopener noreferrer" class="contact-link">@ducngg.411</a>
                                        </p>
                                        <p class="text-muted small">Message us on Facebook</p>
                                    </div>
                                </div>
                            </div>

                            <div class="contact-item mb-4">
                                <div class="d-flex align-items-center">
                                    <div class="contact-icon zalo-icon">
                                        <span class="zalo-icon-wrapper">Z</span>
                                    </div>
                                    <div class="contact-details">
                                        <h5 class="mb-1">Zalo</h5>
                                        <p class="mb-0">
                                            <a href="https://zalo.me/0377386704" target="_blank" rel="noopener noreferrer" class="contact-link">0377386704</a>
                                        </p>
                                        <p class="text-muted small">Quick response during business hours</p>
                                    </div>
                                </div>
                            </div>

                            <div class="contact-item mb-4">
                                <div class="d-flex align-items-center">
                                    <div class="contact-icon telegram-icon">
                                        <i class="telegram plane icon"></i>
                                    </div>
                                    <div class="contact-details">
                                        <h5 class="mb-1">Telegram</h5>
                                        <p class="mb-0">
                                            <a href="https://t.me/ducngg411" target="_blank" rel="noopener noreferrer" class="contact-link">@ducngg411</a>
                                        </p>
                                        <p class="text-muted small">Message us anytime</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="business-hours mt-5">
                            <h4 class="mb-3">Business Hours</h4>
                            <ul class="list-unstyled">
                                <li class="d-flex justify-content-between">
                                    <span>Monday - Friday:</span>
                                    <span>8:00 AM - 8:00 PM</span>
                                </li>
                                <li class="d-flex justify-content-between">
                                    <span>Saturday:</span>
                                    <span>9:00 AM - 5:00 PM</span>
                                </li>
                                <li class="d-flex justify-content-between">
                                    <span>Sunday:</span>
                                    <span>10:00 AM - 3:00 PM</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Contact Form -->
                <div class="col-md-7 mb-4">
                    <div class="page-content">
                        <h3 class="mb-4">Send Us a Message</h3>
                        <p class="mb-4">Have a question, feedback, or need assistance? Fill out the form below and we'll get back to you as soon as possible.</p>

                        <form @submit.prevent="submitForm">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="name">Full Name <span class="text-danger">*</span></label>
                                        <input 
                                            type="text" 
                                            class="form-control" 
                                            id="name" 
                                            v-model="formData.name"
                                            :class="{ 'is-invalid': submitted && !formData.name }"
                                            required
                                        >
                                        <div v-if="submitted && !formData.name" class="invalid-feedback">
                                            Please enter your name
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="email">Email Address <span class="text-danger">*</span></label>
                                        <input 
                                            type="email" 
                                            class="form-control" 
                                            id="email" 
                                            v-model="formData.email"
                                            :class="{ 'is-invalid': submitted && !validEmail }"
                                            required
                                        >
                                        <div v-if="submitted && !formData.email" class="invalid-feedback">
                                            Please enter your email
                                        </div>
                                        <div v-else-if="submitted && formData.email && !validEmail" class="invalid-feedback">
                                            Please enter a valid email
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="subject">Subject <span class="text-danger">*</span></label>
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    id="subject" 
                                    v-model="formData.subject"
                                    :class="{ 'is-invalid': submitted && !formData.subject }"
                                    required
                                >
                                <div v-if="submitted && !formData.subject" class="invalid-feedback">
                                    Please enter a subject
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="message">Message <span class="text-danger">*</span></label>
                                <textarea 
                                    class="form-control" 
                                    id="message" 
                                    rows="5" 
                                    v-model="formData.message"
                                    :class="{ 'is-invalid': submitted && !formData.message }"
                                    required
                                ></textarea>
                                <div v-if="submitted && !formData.message" class="invalid-feedback">
                                    Please enter your message
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="orderNumber">Order Number (Optional)</label>
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    id="orderNumber" 
                                    v-model="formData.orderNumber"
                                    placeholder="If your message is about a specific order"
                                >
                            </div>

                            <div v-if="message" class="alert" :class="`alert-${messageType}`" role="alert">
                                {{ message }}
                            </div>

                            <div class="text-right">
                                <button type="submit" class="btn btn-primary btn-lg" :disabled="sending">
                                    <span v-if="sending">
                                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Sending...
                                    </span>
                                    <span v-else>
                                        <i class="paper plane icon"></i> Send Message
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- FAQ Section -->
                    <div class="page-content mt-4">
                        <h3 class="mb-4">Frequently Asked Questions</h3>
                        
                        <div class="accordion" id="faqAccordion">
                            <div class="card mb-3">
                                <div class="card-header" id="faqHeading1">
                                    <h5 class="mb-0">
                                        <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#faqCollapse1" aria-expanded="false" aria-controls="faqCollapse1">
                                            How do I get my account details after purchase?
                                        </button>
                                    </h5>
                                </div>
                                <div id="faqCollapse1" class="collapse" aria-labelledby="faqHeading1" data-parent="#faqAccordion">
                                    <div class="card-body">
                                        After completing your purchase, account details will be displayed on your order confirmation page. They will also be sent to your registered email address. You can view the account details anytime by logging into your account and viewing the order details.
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card mb-3">
                                <div class="card-header" id="faqHeading2">
                                    <h5 class="mb-0">
                                        <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#faqCollapse2" aria-expanded="false" aria-controls="faqCollapse2">
                                            What if the account does not work?
                                        </button>
                                    </h5>
                                </div>
                                <div id="faqCollapse2" class="collapse" aria-labelledby="faqHeading2" data-parent="#faqAccordion">
                                    <div class="card-body">
                                        All accounts are verified before delivery. However, if you encounter any issues, please contact our support team immediately through any of the contact methods listed above or fill out the support form. We guarantee a replacement or refund within 24 hours.
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card mb-3">
                                <div class="card-header" id="faqHeading3">
                                    <h5 class="mb-0">
                                        <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#faqCollapse3" aria-expanded="false" aria-controls="faqCollapse3">
                                            How long do accounts last?
                                        </button>
                                    </h5>
                                </div>
                                <div id="faqCollapse3" class="collapse" aria-labelledby="faqHeading3" data-parent="#faqAccordion">
                                    <div class="card-body">
                                        The duration of each account is specified in the product description. Some accounts are lifetime with no expiration, while others may have specific durations (1 month, 6 months, 1 year, etc.). Please check the product details for specific information.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import api from '@/utils/api';

export default {
    name: 'Support',
    data() {
        return {
            formData: {
                name: '',
                email: '',
                subject: '',
                message: '',
                orderNumber: '',
            },
            submitted: false,
            sending: false,
            message: '',
            messageType: 'info'
        }
    },
    computed: {
        ...mapState({
            user: state => state.auth.user
        }),
        ...mapGetters({
            isAuthenticated: 'auth/isAuthenticated'
        }),
        validEmail() {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return !this.formData.email || re.test(String(this.formData.email).toLowerCase());
        }
    },
    methods: {
        async submitForm() {
            this.submitted = true;
            
            if (!this.formData.name || !this.formData.email || !this.formData.subject || 
                !this.formData.message || !this.validEmail) {
                return;
            }
            
            this.sending = true;
            this.message = '';
            
            try {
                // Send the form data to the backend
                const response = await api.post('/support/contact', this.formData);
                
                if (response.data.success) {
                    this.messageType = 'success';
                    this.message = response.data.message || 'Thank you for your message! We will get back to you soon.';
                    
                    // Reset form
                    this.formData = {
                        name: '',
                        email: '',
                        subject: '',
                        message: '',
                        orderNumber: ''
                    };
                    this.submitted = false;
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                this.messageType = 'danger';
                this.message = error.response?.data?.message || 'Unable to send message. Please try again later.';
            } finally {
                this.sending = false;
            }
        }
    },
    created() {
        // Pre-fill form with user data if logged in
        if (this.user) {
            this.formData.name = this.user.fullName || '';
            this.formData.email = this.user.email || '';
        }
    }
}
</script>

<style scoped>
.support {
    padding-bottom: 4rem;
}

.page-content {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0,0,0,0.08);
    padding: 25px;
    transition: transform 0.3s, box-shadow 0.3s;
}

.page-content:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}

.contact-item {
    padding: 15px;
    border-radius: 8px;
    transition: all 0.3s;
}

.contact-item:hover {
    background-color: #f8f9fa;
    transform: translateX(5px);
}

.contact-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    color: white;
    font-size: 1.5rem;
}

.phone-icon {
    background: linear-gradient(135deg, #2ecc71, #1abc9c);
}

.facebook-icon {
    background: linear-gradient(135deg, #3b5998, #2d4373);
}

.zalo-icon {
    background: linear-gradient(135deg, #0068ff, #0180ff);
}

.telegram-icon {
    background: linear-gradient(135deg, #0088cc, #0072a9);
}

.zalo-icon-wrapper {
    font-weight: bold;
    font-size: 1.6rem;
}

.contact-details h5 {
    color: #333;
    font-weight: 600;
}

.contact-link {
    color: #4361ee;
    font-weight: 500;
    transition: all 0.3s;
}

.contact-link:hover {
    color: #3a56d4;
    text-decoration: none;
    transform: translateX(3px);
}

.business-hours li {
    padding: 8px 0;
    border-bottom: 1px dashed #eee;
}

.business-hours li:last-child {
    border-bottom: none;
}

/* Form styles */
.form-group {
    margin-bottom: 20px;
}

.form-control {
    border-radius: 8px;
    padding: 10px 15px;
    border: 1px solid #ddd;
    transition: all 0.3s;
}

.form-control:focus {
    border-color: #4361ee;
    box-shadow: 0 0 0 0.2rem rgba(67, 97, 238, 0.25);
}

.btn-primary {
    background-color: #4361ee;
    border-color: #4361ee;
    padding: 10px 25px;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s;
}

.btn-primary:hover {
    background-color: #3a56d4;
    border-color: #3a56d4;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3);
}

/* FAQ Accordion styles */
.accordion .card {
    border: none;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 15px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.accordion .card-header {
    background-color: #f8f9fa;
    border-bottom: none;
    padding: 0;
}

.accordion .btn-link {
    color: #333;
    font-weight: 600;
    text-decoration: none;
    padding: 15px;
    position: relative;
    transition: all 0.3s;
}

.accordion .btn-link:hover {
    color: #4361ee;
}

.accordion .btn-link:focus {
    box-shadow: none;
}

.accordion .btn-link::after {
    content: '\f078';
    font-family: 'Icons';
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    transition: transform 0.3s;
}

.accordion .btn-link[aria-expanded="true"]::after {
    transform: translateY(-50%) rotate(180deg);
}

.accordion .card-body {
    padding: 20px;
    color: #666;
    line-height: 1.6;
}
</style>