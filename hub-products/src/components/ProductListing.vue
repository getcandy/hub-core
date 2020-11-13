<template>
  <v-layout>
    <v-flex>
      <h4 class="title is-4">{{ $t('Products') }}</h4>
      <product-table></product-table>

      <!-- <v-data-table
        :headers="headers"
        :items="products"
        :items-per-page="perPage"
        :server-items-length="totalItems"
        :page="page"
        :loading="loading"
        @update:page="(page) => fetch(page)"
        class="elevation-1"
        :show-select="true"
      >
        <template slot="item" slot-scope="props">
          <tr>
            <td>
              <v-checkbox v-model="props.isSelected"></v-checkbox>
            </td>
            <td>
              <nuxt-link :to="{ name: 'products.view', params: { id: props.item.id }}">
                {{ props.item.name }}
              </nuxt-link>
            </td>
          </tr>
        </template>
      </v-data-table> -->
      <!-- <v-simple-table>
        <thead>
          <tr>
            <th class="text-left">Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" :key="item.name">
            <td>{{ item.name }}</td>
          </tr>
        </tbody>
      </v-simple-table> -->
    </v-flex>
  </v-layout>
</template>


<script>
import ProductCard from './ProductCard.vue'
import ProductTable from './legacy/ProductTable.vue'

export default {
  components: {
    ProductCard,
    ProductTable
  },
  data() {
    return {
      page: 1,
      totalPages: 1,
      totalItems: 1,
      perPage: 1,
      products: [],
      loading: true,
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name',
        }
      ]
    }
  },
  watch: {
    page() {
      this.fetch(this.page);
    }
  },
  mounted () {
    this.fetch();
  },
  methods: {
    fetch(page) {
      this.loading = true;
      this.$nuxt.context.app.$gc.products.get({
        page: page
      }).then(response => {
        this.loading = false;
        this.products = response.data.data;
        this.page = response.data.meta.current_page;
        this.totalPages = response.data.meta.last_page;
        this.perPage = response.data.meta.per_page;
        this.totalItems = response.data.meta.total;
      });
    }
  },
}

</script>
