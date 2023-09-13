<template>
  <section>
    <b-tabs position="is-centered" class="block" v-model="tab">
      <b-tab-item label="Items">
        <ViewOItems :items="order" />
        <div class="prod" v-for="item in order.items" :key="item._id">
          <ViewOProducts :item="item" />
        </div>
      </b-tab-item>
      <b-tab-item label="User">
        {{ info }}
      </b-tab-item>
      <b-tab-item label="Address">
        {{ info.address }}
      </b-tab-item>
    </b-tabs>
    <form @submit.prevent="submit" v-if="order.status === 'pending'">
      <b-button native-type="submit" type="is-primary">Mark as Completed</b-button>
    </form>

  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['user']),
  },
  data() {
    return {
      tab: 0,
      info: [],
      order: [],
      loading: false
    }
  },
  async fetch() {
    this.loading = true
    await this.$axios.get(`/view/orders/${this.$route.params.id}`, {
      headers: {
        authorization: this.user.token,
      },
    }).then((res) => {
      this.info = res.data.data
      this.order = res.data.order
    }).catch((e) => {
      console.error(e)
      this.$buefy.snackbar.open({
        duration: 10000,
        message: 'Error while fetching order'
      });
    }).finally(() => {
      this.loading = false
    });
  },
  methods: {
    async submit() {
      await this.$axios.post('/view/order/complete', {
        userId: this.info._id,
        orderId: this.order._id
      }, {
        headers: {
          authorization: this.user.token,
        },
      }).then(() => {
        location.reload()
        this.$buefy.snackbar.open({
          duration: 10000,
          message: 'Order marked as fulfilled!'
        });
      }).catch((e) => {
        console.error(e)
        this.$buefy.snackbar.open({
          duration: 10000,
          message: 'Error while fetching order'
        });
      })
    }
  }
}
</script>

<style lang="scss" scoped>

section {
  padding: 1rem;

  display: flex;
  flex-direction: column;
  align-items: center;

  .prod{
    display: flex;
    justify-content: space-between;
  }
}
</style>
