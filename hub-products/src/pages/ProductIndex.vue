<template>
  <div>
    <toolbar heading="Products">
      <template v-slot:search>
        <b-input icon="search-line" v-model="searchTerm" placeholder="Search Products"></b-input>
      </template>
        <!--
        <b-field>
          <p class="control">
            <b-button class="icon-only">
              <b-icon icon="equalizer-line" />
            </b-button>
          </p>
        </b-field>
        -->
          <gc-button @click="showCreatePanel = true" >
            {{ $t('Create product') }}
          </gc-button>
    </toolbar>
    <quick-view-panel heading="Create a product" :open="showCreatePanel" @close="showCreatePanel = false">
      <div class="p-6">
        <product-create :locale="locale" />
      </div>
    </quick-view-panel>
    <product-table :search-term="searchTerm" />

  </div>
</template>

<script>
import ProductTable from '../components/ProductTable.vue'
import ProductCreate from '../components/ProductCreate.vue'
export default {
  components: {
    ProductTable,
    ProductCreate
  },
  head () {
    return {
      title: this.$t('Products'),
    }
  },
  computed: {
    locale () {
      return this.$store.state.core.locale
    }
  },
  data () {
    return {
      showCreatePanel: false,
      searchTerm: null,
      families: []
    }
  },
  async mounted () {
    const response = await this.$gc.products.families.get({
      per_page: 200
    })

    const query = this.$route.query;
    this.searchTerm = query.keywords || null
    this.families = response.data.data
  }
}
</script>
