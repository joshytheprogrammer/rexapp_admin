<template>
  <section>
    <!-- :paginated="isPaginated" -->
    <b-table
      :loading="loading"
      :data="data"
      :paginated="isPaginated"
      :per-page="perPage"
      :current-page.sync="currentPage"
      :pagination-simple="isPaginationSimple"
      :pagination-position="paginationPosition"
      :default-sort-direction="defaultSortDirection"
      :pagination-rounded="isPaginationRounded"
      :sort-icon="sortIcon"
      :sort-icon-size="sortIconSize"
      default-sort="name"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
      sticky-header="true"
      height="580px"
      :page-input="hasInput"
      :pagination-order="paginationOrder"
      :page-input-position="inputPosition"
      :debounce-page-input="inputDebounce">

      <b-table-column field="_id" label="Order ID" searchable v-slot="props">
        {{ props.row._id }}
      </b-table-column>

      <b-table-column field="orderDate" label="Order Date" sortable v-slot="props">
        {{ new Date(props.row.orderDate).toLocaleString() }}
      </b-table-column>

      <b-table-column field="status" label="Status" sortable centered v-slot="props">
        {{ props.row.status }}
      </b-table-column>

      <b-table-column field="actions" label="Actions" centered v-slot="props">
        <div class="actions">
          <span><NuxtLink :to="'/view/orders/'+props.row._id">View</NuxtLink></span>
        </div>
      </b-table-column>

    </b-table>
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
      data: [],
      loading: false,
      isPaginated: true,
      isPaginationSimple: false,
      isPaginationRounded: false,
      paginationPosition: 'bottom',
      defaultSortDirection: 'asc',
      sortIcon: 'arrow-up',
      sortIconSize: 'is-small',
      currentPage: 1,
      perPage: 12,
      hasInput: false,
      paginationOrder: '',
      inputPosition: '',
      inputDebounce: ''
    }
  },
  async fetch() {
    this.loading = true
    await this.$axios.get('view/orders/', {
      headers: {
        authorization: this.user.token,
      },
    }).then((res) => {
      this.data = res.data.orders
      this.sortData();
    }).catch((e) => {
      console.error(e)
      this.$buefy.snackbar.open({
        duration: 10000,
        message: 'Error while fetching orders'
      });
    }).finally(() => {
      this.loading = false
    });
  },
  methods: {
    sortData() {
      this.data.sort((a, b) => {
        if (a.orderDate > b.orderDate) return -1; // Compare dates in descending order
        if (a.orderDate < b.orderDate) return 1;

        return 0;
      });
    }
  }
}
</script>

<style lang="scss" scoped>

section {
  padding: 1rem;
}
.table {
  tr td img {
    object-fit: contain;
    width: 100%;
    max-width: 100px;
    max-height: 100px
  }
}
</style>
