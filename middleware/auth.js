export default async function ({ store, redirect }) {
  await store.dispatch('loadUserFromLocalStorage')
  // If the user is not authenticated
  if (!store.getters.isLoggedIn) {
    return redirect('/login')
  }
}
