<template>
  <section>
    <b-collapse
      class="card"
      animation="slide"
      aria-id="contentIdForA11y3">

      <template #trigger="props">
        <div
          class="card-header"
          role="button"
          aria-controls="contentIdForA11y3"
          :aria-expanded="props.open">
          <p class="card-header-title">
            {{ product.name }} ({{ item.quantity }}) [{{ formatPrice(product.price?.min) }} - {{ formatPrice(product.price?.max) }}]
          </p>
          <a class="card-header-icon">
            <b-icon
              :icon="props.open ? 'menu-down' : 'menu-up'">
            </b-icon>
          </a>
        </div>
      </template>

      <div class="card-content">
        <div class="content">
          <p>{{ product.description }}</p>
          <p> <b>Manufaturer:</b> {{ product.manufacturer }}</p>
          <p> <b>Part Number:</b> {{ product.partNumber }}</p>
          <p> <b>Specification:</b> {{ product.specification }}</p>
        </div>
      </div>
      <footer class="card-footer">
        <a :href="'https://rexapp.netlify.app/shop/'+product.slug" class="card-footer-item" target="_blank">View</a>
      </footer>
    </b-collapse>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['user']),
  },
  props: ['item'],
  data() {
    return {
      product: {}
    }
  },
  async fetch() {
    await this.$axios.get(`/view/products/byId/${this.item.partId}`, {
      headers: {
        authorization: this.user.token,
      },
    }).then((res) => {
      this.product = res.data.product
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
    formatPrice(price) {
      // const NGN_SYMBOL = "₦";
      const formatter = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      });
      return formatter.format(price);
    }
  }

}
</script>

<style lang="scss" scoped>
section {
  padding: 1rem;
}
</style>
