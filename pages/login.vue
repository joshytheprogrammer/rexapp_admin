<template>
  <div class="login is-text-primary">
    <h1 class="subtitle is-size-3">Login</h1>
    <form @submit.prevent="login">
      <b-field label="Email">
        <b-input type="email" maxlength="30" :disabled="loading" v-model="user.email" required></b-input>
      </b-field>

      <b-field label="Password">
        <b-input type="password" :disabled="loading" v-model="user.password" required password-reveal></b-input>
      </b-field>

      <b-button class="has-background-primary" native-type="submit" type="is-link" :loading="loading">Submit</b-button>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  layout: "none",
  data() {
    return {
      user: {
        email: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    ...mapActions(['setUser']),
    async login() {
      this.loading = true;

      try {
        const response = await this.$axios.post('/auth/login', this.user);

        this.setUser(response.data)
        this.loading = false;
      } catch (error) {
        console.error(error);
        this.$buefy.toast.open({
          duration: 5000,
          message: `Something went wrong - ${error.message}`,
          type: 'is-danger'
        })

        // Reset loading state on error
        this.loading = false;
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.login {
  padding: 1rem;
  margin: 1rem auto;

  width: 400px;

  display: block;

  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(2px);

  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media screen and (max-width: $medium) {
    max-width: 90%;
  }
}
</style>
