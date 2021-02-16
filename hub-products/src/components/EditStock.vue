<template>
  <div>
    <template v-if="variants.length == 1">
      <span v-if="!editing">
        <a
          href="#"
          data-toggle="tooltip"
          title="Edit"
          class="editable-stock"
          :class="{
            'text-red-600': variants[0].inventory <= 5,
            'text-orange-500': variants[0].inventory <= 20,
            'text-green-500': variants[0].inventory > 20,
          }"
          @click.prevent="enableEditing"
        >
          {{ $format.number(variants[0].inventory) }}
        </a>
      </span>
      <div v-else>
        <b-input v-model="variants[0].inventory" v-focus @blur="save" />
      </div>
    </template>
    <template v-else>
      <b-button @click="editing = true">
        {{ $t('Edit') }}
      </b-button>
      <quick-view-panel :heading="$t('Edit stock levels')" :open="editing" @close="editing = false">
        <div class="p-6">
          <form action="" @submit.prevent="editing = false">
            <form-field v-for="variant in variants" :key="variant.id" :label="variant.sku" class="form-group">
              <b-input v-model="variant.inventory" />
            </form-field>
            <button type="submit" class="justify-center rounded-md bg-purple-600 hover:bg-purple-700  px-4 py-2 text-base leading-6 font-medium text-white shadow-sm focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5">
              {{ $t('Update stock') }}
            </button>
          </form>
        </div>
      </quick-view-panel>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      editing: false,
      variants: [],
      stock: 0
    }
  },
  computed: {
    stockLevel () {
      if (this.variants.length === 1) {
        return this.variants[0].inventory
      }
      return 'Multiple'
    }
  },
  mounted () {
    this.variants = this.product.variants.data
    this.stock = this.stockLevel
  },
  methods: {
    enableEditing () {
      this.editing = true
    },
    save () {
      this.editing = false
      this.variants.forEach((variant) => {
        this.$gc.products.variants.updateInventory(variant.id, variant)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .editable-stock {
        padding:2px 4px;
        position: relative;
        border:1px dashed transparent;
        &:hover {
            text-decoration: none;
            background-color:#f5f5f5;
            border-color: #BEBEBE;
        }
    }
</style>
