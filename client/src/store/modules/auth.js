import api from '@/utils/api'

const state = {
	user: JSON.parse(localStorage.getItem('user')) || null,
	loading: false,
	error: null
}

const getters = {
	isAuthenticated: state => !!state.user,
	isAdmin: state => state.user && state.user.role === 'admin',
	authError: state => state.error,
	authLoading: state => state.loading
}

const actions = {
	async register({ commit }, userData) {
		try {
			commit('setLoading', true)
			commit('clearError')
			
			const response = await api.post('/auth/register', userData)
			
			if (response.data.success) {
				commit('setUser', response.data.user)
				localStorage.setItem('user', JSON.stringify(response.data.user))
			}
			
			return response.data
		} catch (error) {
			commit('setError', error.response?.data?.message || 'Registration failed')
			throw error
		} finally {
			commit('setLoading', false)
		}
	},
	
	async login({ commit }, userData) {
		try {
			commit('setLoading', true)
			commit('clearError')
			
			const response = await api.post('/auth/login', userData)
			
			if (response.data.success) {
				commit('setUser', response.data.user)
				localStorage.setItem('user', JSON.stringify(response.data.user))
			}
			
			return response.data
		} catch (error) {
			commit('setError', error.response?.data?.message || 'Login failed')
			throw error
		} finally {
			commit('setLoading', false)
		}
	},
	
	logout({ commit }) {
		commit('clearUser')
		localStorage.removeItem('user')
	},
	
	async getProfile({ commit }) {
		try {
			commit('setLoading', true)
			
			const response = await api.get('/auth/profile')
			
			return response.data
		} catch (error) {
			commit('setError', error.response?.data?.message || 'Unable to fetch user information')
			throw error
		} finally {
			commit('setLoading', false)
		}
	},
	
	async updateProfile({ commit }, userData) {
		try {
			commit('setLoading', true)
			
			const response = await api.put('/auth/profile', userData)
			
			if (response.data.success) {
				commit('setUser', response.data.user)
				localStorage.setItem('user', JSON.stringify(response.data.user))
			}
			
			return response.data
		} catch (error) {
			commit('setError', error.response?.data?.message || 'Update failed')
			throw error
		} finally {
			commit('setLoading', false)
		}
	}
}

const mutations = {
	setUser(state, user) {
		state.user = user
	},
	clearUser(state) {
		state.user = null
	},
	setLoading(state, status) {
		state.loading = status
	},
	setError(state, error) {
		state.error = error
	},
	clearError(state) {
		state.error = null
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
