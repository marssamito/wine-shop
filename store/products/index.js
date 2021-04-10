const state = () => ({
  products: {},
})

const mutations = {
  FETCH_PRODUCTS(state, products) {
    state.products = products
  },
}

const actions = {
  async fetchproducts(store) {
    const res = await this.$axios.get('wine-shop.json')
    store.commit('FETCH_PRODUCTS', res.data)
  },
}

export default {
  state,
  mutations,
  actions,
}
