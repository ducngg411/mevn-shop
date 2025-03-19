const state = {
    cartItems: JSON.parse(localStorage.getItem('cartItems')) || []
}

const getters = {
    cartItems: state => state.cartItems,
    cartCount: state => state.cartItems.reduce((count, item) => count + item.quantity, 0),
    cartTotal: state => state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
}

const actions = {
    addToCart({ commit, state }, { product, quantity = 1 }) {
        const existingItem = state.cartItems.find(item => item.product === product._id)

        if (existingItem) {
            commit('updateCartItemQuantity', {
                product: existingItem.product,
                quantity: existingItem.quantity + quantity
            })
        } else {
            commit('addToCart', {
                product: product._id,
                title: product.title,
                price: product.discountPrice > 0 ? product.discountPrice : product.price,
                image: product.image,
                quantity
            })
        }

        // Save to localStorage
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },

    updateCartItemQuantity({ commit, state }, { product, quantity }) {
        commit('updateCartItemQuantity', { product, quantity })
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },

    removeFromCart({ commit, state }, product) {
        commit('removeFromCart', product)
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },

    clearCart({ commit }) {
        commit('clearCart')
        localStorage.removeItem('cartItems')
    }
}

const mutations = {
    addToCart(state, item) {
        state.cartItems.push(item)
    },

    updateCartItemQuantity(state, { product, quantity }) {
        const item = state.cartItems.find(item => item.product === product)

        if (item) {
            if (quantity <= 0) {
                // Remove item if quantity <= 0
                state.cartItems = state.cartItems.filter(i => i.product !== product)
            } else {
                item.quantity = quantity
            }
        }
    },

    removeFromCart(state, product) {
        state.cartItems = state.cartItems.filter(item => item.product !== product)
    },

    clearCart(state) {
        state.cartItems = []
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
