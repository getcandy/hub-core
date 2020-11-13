<template>
  <div>
    <template v-if="variants.length == 1">
      <span v-if="!editing">
        <a href="#" data-toggle="tooltip" v-on:click.prevent="enableEditing" title="Edit" class="editable-stock" :class="{
          'text-red-600': variants[0].inventory <= 5,
          'text-orange-500': variants[0].inventory <= 20,
          'text-green-500': variants[0].inventory > 20,
        }">
          {{ $format.number(variants[0].inventory) }}
        </a>
      </span>
      <div v-else>
        <b-input v-focus v-model="variants[0].inventory" @blur="save" />
      </div>
    </template>
    <template v-else>
      <b-button @click="editing = true">{{ $t('Edit') }}</b-button>
      <quick-view-panel :heading="$t('Edit stock levels')" :open="editing" @close="editing = false">
      <div class="p-6">
        <form action="" @submit.prevent="editing = false">
              <form-field :label="variant.sku" v-for="variant in variants" class="form-group" :key="variant.id">
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
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        editing: false,
        variants: [],
        stock: 0,
      }
    },
    methods: {
      enableEditing () {
        this.editing = true
        // (this.$refs.stockInput);
        // this.$refs.input.focus()
      },
      save () {
        this.editing = false

        // var variants = product.variants.data;

        this.variants.forEach((variant, index) => {
          this.$gc.products.variants.updateInventory(variant.id, variant)
            // // Only save if it has changed.
            // if (JSON.stringify(variant) == JSON.stringify(this.editingBackup.variants.data[index])) {
            //     return;
            // }
            // apiRequest.send('put', '/products/variants/' + variant.id + '/inventory', variant)
            //     .then(response => {
            //         CandyEvent.$emit('notification', {
            //             level: 'success',
            //             message: 'Stock Updated'
            //         });
            //     }).catch(response => {
            //         CandyEvent.$emit('notification', {
            //             level: 'error',
            //             message: response.message
            //         });
            //         return false;
            //     });
        });
      }
    },
    mounted() {
      this.variants = this.product.variants.data
      this.stock = this.stockLevel
    },
    computed: {
      stockLevel() {
        if (this.variants.length == 1) {
          return this.variants[0].inventory;
        }
        return 'Multiple';
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
