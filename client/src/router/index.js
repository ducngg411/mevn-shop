import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/user/Profile.vue'),
    meta: { requiresAuth: true }
  },
  // Products Routes
  {
    path: '/products',
    name: 'ProductList',
    component: () => import('../views/product/ProductList.vue')
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: () => import('../views/product/ProductDetail.vue')
  },
  // Cart & Checkout Routes
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/user/Cart.vue')
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/user/Checkout.vue'),
    meta: { requiresAuth: true }
  },
  // Order Routes
  {
    path: '/orders',
    name: 'OrderList',
    component: () => import('../views/user/OrderList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders/:id',
    name: 'OrderDetail',
    component: () => import('../views/user/OrderDetail.vue'),
    meta: { requiresAuth: true }
  },
  // Payment Routes
  {
    path: '/payment/success',
    name: 'PaymentSuccess',
    component: () => import('../views/payment/PaymentSuccess.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/payment/cancel',
    name: 'PaymentCancel',
    component: () => import('../views/payment/PaymentCancel.vue'),
    meta: { requiresAuth: true }
  },
  // 404 Route
  {
    path: '*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  },
  // Admin Routes
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/products',
    name: 'AdminProducts',
    component: () => import('../views/admin/ProductManagement.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/accounts',
    name: 'AdminAccounts',
    component: () => import('../views/admin/AccountManagement.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: () => import('../views/admin/OrderManagement.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/vouchers',
    name: 'AdminVouchers',
    component: () => import('../views/admin/VoucherManagement.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  // {
  //   path: '/admin/users',
  //   name: 'AdminUsers',
  //   component: () => import('../views/admin/UserManagement.vue'),
  //   meta: { requiresAuth: true, requiresAdmin: true }
  // }
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPassword.vue')
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/auth/ResetPassword.vue')
  },

  {
    path: '/change-password',
    name: 'ChangePassword',
    component: () => import('../views/auth/ChangePassword.vue')
  },

  {
    path: '/support',
    name: 'Support',
    component: () => import('../views/Support.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const isAdmin = store.getters['auth/isAdmin']
  
  
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } 
  
  else if (to.matched.some(record => record.meta.requiresAdmin) && !isAdmin) {
    next({ name: 'Home' })
  }
  
  else if (to.matched.some(record => record.meta.guestOnly) && isAuthenticated) {
    next({ name: 'Home' })
  }
  else {
    next()
  }
})

export default router