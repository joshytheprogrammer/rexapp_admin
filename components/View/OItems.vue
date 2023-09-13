<template>
  <div>
    <b-field grouped group-multiline>
      <div class="control">
        <b-taglist attached>
          <b-tag size="is-medium" type="is-dark">Status</b-tag>
          <b-tag size="is-medium" type="is-info">{{items.status}}</b-tag>
        </b-taglist>
      </div>

      <div class="control">
        <b-taglist attached>
          <b-tag size="is-medium" type="is-dark">ID</b-tag>
          <b-tag size="is-medium" type="is-info">{{items._id}}</b-tag>
        </b-taglist>
      </div>

      <div class="control">
        <b-taglist attached>
          <b-tag size="is-medium" type="is-dark">Date</b-tag>
          <b-tag size="is-medium" type="is-info">{{new Date(items.orderDate).toLocaleString() }}</b-tag>
        </b-taglist>
      </div>
    </b-field>
  </div>
</template>

<script>
  export default {
    props: ['items']
  }
</script>

<style lang="scss" scoped>
div {

  .list {
    display: flex;
    justify-content: center;
  }
}
</style>
