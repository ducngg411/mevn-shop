import axios from 'axios'
import store from '@/store'
import router from '@/router'

const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL || 'http://localhost:5000/api',
    headers: {
    'Content-Type': 'application/json',
    }
})

// Request interceptor
api.interceptors.request.use(
    config => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`
        }
        return config
    },
    error => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            store.dispatch('auth/logout')

            const currentPath = router.currentRoute.fullPath
            if (currentPath !== '/login' && currentPath !== '/register') {
                router.push({
                    path: '/login',
                    query: { redirect: currentPath }
                })
            }
        }
        return Promise.reject(error)
    }
)

export default api