<template>
  <div>
    <div class="search-table">
      <div class="b-table">
        <table class="table">
          <thead>
            <tr>
              <th>Product name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in value" :key="product.id">
              <td>
                <nuxt-link
                  :to="{
                    name: 'products.view',
                    params: {
                      id: product.id
                    }
                  }"
                >
                  {{ attribute(product.attribute_data, 'name') }}
                </nuxt-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes.js'

export default {
  mixins: [
    HasAttributes
  ],
  props: {
    value: {
      type: Array,
      required: true
    }
  }
}
</script>
