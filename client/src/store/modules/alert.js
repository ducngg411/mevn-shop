const state = {
	type: null,
	message: null,
	show: false
}

const getters = {
	alertType: state => state.type,
	alertMessage: state => state.message,
	alertShow: state => state.show
}

const actions = {
	setAlert({ commit }, { type, message }) {
		commit('showAlert', { type, message })
	},
	
	clearAlert({ commit }) {
		commit('hideAlert')
	}
}

const mutations = {
	showAlert(state, { type, message }) {
		state.type = type
		state.message = message
		state.show = true
	},
	
	hideAlert(state) {
		state.show = false
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
