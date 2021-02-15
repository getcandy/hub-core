<template>
  <div class="card">
    <div class="card-content">
      <search-table :limit="10" search-placeholder="Search Categories" type="category">
        <template slot-scope="props">
          <b-table-column field="thumbnail">
            <thumbnail-loader :asset="props.row.assets.data[0]" />
          </b-table-column>
          <b-table-column field="name" :label="$t('Name')">
            <nuxt-link
              :to="{
                name: 'products.view',
                params: {
                  id: props.row.id
                }
              }"
            >
              {{ attribute(props.row.attribute_data, 'name') }}
            </nuxt-link>
          </b-table-column>
          <b-table-column field="actions">
            <b-button type="primary">
              <b-icon icon="add-box-line" />
            </b-button>
          </b-table-column>
        </template>
      </search-table>
    </div>
  </div>
</template>

<script>
import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'

export default {
  mixins: [
    HasAttributes
  ],
  computed: {
    categories () {
      return this.$store.state.categories.items
    }
  },
  mounted () {
    if (!this.categories) {
      this.$gc.categories.tree().then((response) => {
        this.$store.commit('categories/setItems', response.data.data)
      })
    }
  }
}
</script>

<style scoped>
.search-table {
  max-height: 200px;
  overflow-y: auto;
}
</style>
