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
            'text-yellow-500': variants[0].inventory <= 20 && variants[0].inventory > 5,
            'text-green-500': variants[0].inventory > 20,
          }"
          @click.prevent="enableEditing"
        >
          {{ $format.number(variants[0].inventory) }}
        </a>
      </span>
      <div v-else>
        <form @submit.prevent="save">
          <gc-input v-model="variants[0].inventory" v-focus type="number" :min="variants[0].reserved_stock" @blur="save" />
          <span
            class="text-xs uppercase"
            :class="{
              'text-gray-400': !variants[0].reserved_stock,
              'text-blue-600': !!variants[0].reserved_stock
            }"
          >{{ variants[0].reserved_stock }} {{ $t('Reserved') }}</span>
        </form>
      </div>
    </template>
    <template v-else>
      <gc-button size="x-small" theme="gray" @click="editing = true">
        {{ $t('Edit') }}
      </gc-button>
      <quick-view-panel :heading="$t('Edit stock levels')" :open="editing" @close="closePanel">
        <div class="p-4">
          <form action="" @submit.prevent="save">
            <form-field v-for="variant in variants" :key="variant.id" :label="variant.sku" class="pb-4 border-b border-gray-100 form-group">
              <div class="flex items-center justify-between">
                <gc-input v-model="variant.inventory" :min="variant.reserved_stock" type="number" />
                <span
                  class="text-xs uppercase"
                  :class="{
                    'text-gray-400': !variant.reserved_stock,
                    'text-blue-600': !!variant.reserved_stock
                  }"
                >{{ variant.reserved_stock }} {{ $t('Reserved') }}</span>
              </div>
            </form-field>
            <gc-button type="submit" :loading="processing" :disabled="processing">
              {{ $t('Update stock') }}
            </gc-button>
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
      stock: 0,
      processing: false
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
    closePanel () {
      this.editing = false
      this.processing = false
    },
    save () {
      this.editing = false
      this.processing = true
      this.variants.forEach(async (variant) => {
        try {
          await this.$gc.products.variants.updateInventory(variant.id, variant)
        } catch (error) {
          this.$notify.queue('error', this.$t(`Unable to update stock for ${variant.sku}`))
        }
      })
      this.processing = false
      this.$notify.queue('success', this.$t('Stock levels updated'))
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
