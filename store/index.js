export const state = () => ({
  user: null
})

export const mutations = {
  RESET_STORE: (state) => {
    Object.assign(state, { user: null })
  },

  SET_AUTH_USER: (state, { authUser }) => {
    state.user = {
      uid: authUser.userId,
      token: authUser.token
    }
  }
}

export const actions = {
  async loadUserFromLocalStorage({ commit }) {
    const authUser = JSON.parse(localStorage.getItem('user'));

    if (authUser) {
      commit('SET_AUTH_USER', { authUser });
    }
  },

  async setUser({ commit }, authUser) {
    localStorage.setItem('user', JSON.stringify(authUser));
    commit('SET_AUTH_USER', { authUser });
    this.$router.push('/');
  },

  async logout({ commit }) {
    localStorage.removeItem('user'); // Remove the user item from local storage
    commit('RESET_STORE');
  },
}

export const getters = {
  isLoggedIn: (state) => {
    return !!state.user?.uid;
  }
}
