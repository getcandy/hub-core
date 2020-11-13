<template>
  <v-layout>
    <v-flex>
      <ProductEdit />
    </v-flex>
  </v-layout>
</template>


<script>
import ProductCard from './ProductCard.vue'
import ProductEdit from './legacy/ProductEdit.vue'

export default {
  components: {
    ProductCard,
    ProductEdit
  },
  async asyncData(context) {
    const product = await context.app.$gc.products.find(
       context.route.params.id,
       {
           full_response: true,
       }
    );
    return {
        product: product.data.data
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
