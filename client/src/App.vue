<template>
  <div id="iapp">
    <app-header></app-header>
    <main class="container my-5">
      <flash-message :position="'top-right'"></flash-message>
      <router-view></router-view>
    </main>
    <app-footer></app-footer>
  </div>
</template>


<script>
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
  }
}

</script>

<style lang="scss">
/* App.vue */
// body {
//   margin: 0;
//   padding: 0;
//   font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
//     'Helvetica Neue', Arial, sans-serif;
//   background-color: #f8f9fa;
//   color: #333;
//   font-family: "Montserrat", sans-serif;
//   font-optical-sizing: auto;
// }

body {
  margin: 0;
  padding: 0;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
    'Helvetica Neue', Arial, sans-serif !important;
  background-color: #f8f9fa;
  color: #333;
  line-height: 1.7;
}


#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.page-content {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  padding: 25px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.page-content:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}

.btn-primary {
  background-color: #4361ee;
  border-color: #4361ee;
  padding: 10px 20px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-primary:hover, .btn-primary:focus {
  background-color: #3a56d4;
  border-color: #3a56d4;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3);
}

.card {
  border: none;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: all 0.4s ease;
  border-radius: 12px;
  overflow: hidden;
}

.card:hover {
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
  transform: translateY(-5px);
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  color: #2d3748;
}

.section-title {
  position: relative;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.section-title:after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -10px;
  width: 50px;
  height: 4px;
  background: #4361ee;
  border-radius: 2px;
}

.section-title.text-center:after {
  left: 50%;
  transform: translateX(-50%);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow-y: auto;
  padding: 20px;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease-in-out;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Modal content - nội dung modal */
.modal-dialog {
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
  transform: translateY(0);
  transition: transform 0.3s ease-in-out;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(30px); 
  }
  to { 
    opacity: 1;
    transform: translateY(0); 
  }
}

.modal-lg {
  max-width: 800px;
}

.modal-content {
  border: none;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  background-color: #ffffff;
  overflow: hidden;
}

/* Modal header - tiêu đề modal */
.modal-header {
  background: linear-gradient(135deg, #4361ee, #3a56d4);
  color: white;
  padding: 1.5rem;
  border-bottom: none;
  position: relative;
}

.modal-title {
  font-weight: 700;
  font-size: 1.3rem;
  margin-bottom: 0;
}

/* Nút đóng modal */
.modal-header .close {
  padding: 0;
  margin: 0;
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
  width: 32px;
  height: 32px;
  // background-color: rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: all 0.2s ease;
  color: white;
  border: none;
}

.modal-header .close:hover {
  background-color: rgba(255, 255, 255, 0.3);
  opacity: 1;
  transform: rotate(90deg);
}

.modal-header .close span {
  font-size: 1.75rem;
  line-height: 1;
  display: block;
  font-weight: 300;
}

/* Modal body - phần nội dung chính */
.modal-body {
  padding: 1.75rem;
  max-height: 70vh;
  overflow-y: auto;
  background-color: #f8fafc;
}

/* Thanh cuộn trong modal */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Modal footer - phần chân modal */
.modal-footer {
  padding: 1.25rem 1.75rem;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

/* Nút trong modal */
.modal-content .btn {
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.modal-content .btn-primary {
  background: linear-gradient(135deg, #4361ee, #3a56d4);
  border: none;
  box-shadow: 0 4px 6px -1px rgba(67, 97, 238, 0.4);
}

.modal-content .btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px -3px rgba(67, 97, 238, 0.5);
}

.modal-content .btn-secondary {
  background-color: #f1f5f9;
  color: #475569;
  border: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.modal-content .btn-secondary:hover {
  background-color: #e2e8f0;
  transform: translateY(-2px);
}

.modal-content .btn-danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border: none;
  box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.4);
}

.modal-content .btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px -3px rgba(239, 68, 68, 0.5);
}

.modal-body .form-group {
  margin-bottom: 1.5rem;
}

.modal-body label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
  font-size: 0.9rem;
}

.modal-body .form-control {
  border-radius: 8px;
  // padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.modal-body .form-control:focus {
  border-color: #4361ee;
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
  background-color: #fff;
}

.modal-body .form-control.is-invalid {
  border-color: #ef4444;
  background-image: none;
}

.modal-body .invalid-feedback {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

/* Custom checkbox trong modal */
.modal-body .custom-control-input:checked ~ .custom-control-label::before {
  background-color: #4361ee;
  border-color: #4361ee;
}

.modal-body .custom-control-label::before {
  border-radius: 6px;
  border: 2px solid #cbd5e1;
}

/* Thông báo lỗi trong modal */
.modal-body .alert {
  border-radius: 8px;
  padding: 1rem;
}

.modal-body .alert-danger {
  background-color: #fef2f2;
  border-color: #fee2e2;
  color: #b91c1c;
}

/* Animation cho modal khi đóng */
.closing {
  animation: fadeOut 0.3s ease forwards;
}

.closing .modal-dialog {
  animation: slideOut 0.3s ease forwards;
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slideOut {
  from { 
    opacity: 1;
    transform: translateY(0); 
  }
  to { 
    opacity: 0;
    transform: translateY(30px); 
  }
}
</style>