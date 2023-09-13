<template>
  <b-navbar spaced fixed-top>
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <!-- <img width="36px" src="@/static/uacef_logo.jpg" alt=""> -->
        <span class="title has-text-primary">REXAPP Admin</span>
      </b-navbar-item>
    </template>
    <template #end>
      <b-navbar-item href="/">
        Home
      </b-navbar-item>
      <b-navbar-dropdown label="Create">
        <b-navbar-item href="/create/product">
          Product
        </b-navbar-item>
        <b-navbar-item href="/create/category">
          Category
        </b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-dropdown label="View">
        <!-- <b-navbar-item href="/view/gallery">
          Images
        </b-navbar-item>
        <b-navbar-item href="/view/clips">
          Clips
        </b-navbar-item> -->
        <b-navbar-item href="/view/orders/">
          Orders
        </b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-item href="/#" @click.prevent="logout">
        Logout
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
export default {
  methods: {
    async logout() {
      this.$store.dispatch('logout')
    }
  }
}
</script>
