<template>
  <div>
    <toolbar heading="Product Families" />
    <gc-table
      :columns="tableColumns"
      :data="families"
    >
      <template v-slot:name="{ row }">
        <nuxt-link
          :to="{
            name: 'product-families.edit',
            params: {
              id: row.id
            }
          }"
        >
          {{ row.name }}
        </nuxt-link>
      </template>
    </gc-table>
  </div>
</template>

<script>
import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'

export default {
  mixins: [
    HasAttributes
  ],
  data () {
    return {
      searchTerm: null,
      page: 1,
      perPage: 30,
      total: 0,
      families: []
    }
  },
  computed: {
    locale () {
      return this.$store.state.core.locale
    }
  },
  computed: {
    tableColumns () {
      return [
        { label: this.$t('Name'), field: 'name' }
      ]
    }
  },
  async mounted () {
    const query = this.$route.query
    this.page = parseInt(query.page || 1)
    this.searchTerm = query.keywords || null
    this.fetch()
  },
  methods: {
    changePage (val) {
      this.page = val
      this.fetch()
    },
    async fetch () {
      const response = await this.$gc.products.families.get({
        page: this.page,
        per_page: this.perPage
      })
      const { data } = response
      const meta = data.meta
      const pagination = meta
      this.total = pagination.total
      this.families = data.data
      this.$router.push({
        path: this.$route.path,
        query: {
          keywords: this.searchTerm,
          page: this.page
        }
      })
    }
  },
  head () {
    return {
      title: this.$t('Product Families')
    }
  }
}
</script>
