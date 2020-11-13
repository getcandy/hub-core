<template>
  <div>
    <toolbar :heading="item.name" :thumbnail="item.thumbnail">
      <div class="flex">
        <div>
          <button @click="showRestoreConfirm = true"  class="inline-flex justify-center w-full rounded-md border border-green-300 px-4 py-2 bg-white text-base leading-6 font-medium text-green-600 shadow-sm hover:text-green-500 focus:outline-none focus:border-blue-300 focus:shadow-outline transition ease-in-out duration-150 sm:text-sm sm:leading-5">
            {{ $t('Restore') }}
          </button>
        </div>
        <div class="ml-2">
          <button @click="showDeleteConfirm = true" class="inline-flex justify-center w-full rounded-md border border-red-300 px-4 py-2 bg-white text-base leading-6 font-medium text-red-600 shadow-sm hover:text-red-500 focus:outline-none focus:border-blue-300 focus:shadow-outline transition ease-in-out duration-150 sm:text-sm sm:leading-5">
            {{ $t('Delete') }}
          </button>
        </div>
      </div>
    </toolbar>
    <component :is="`${type}Type`" :item="item" :attribute-groups="attributeGroups" :model="item.recyclable" />

    <simple-modal heading="Permanent delete" :open="showDeleteConfirm" @confirmed="deleteRecord" @close="showDeleteConfirm = false">
      {{ $t('This action cannot be undone. The record will no longer exist in the database and will not be restorable.') }}
    </simple-modal>

    <simple-modal heading="Restore" :open="showRestoreConfirm" @confirmed="restoreRecord" @close="showRestoreConfirm = false">
      {{ $t('Are you sure you want to restore this product?') }}
    </simple-modal>

    <!-- <div v-for="(data, handle) in recyclable.attribute_data" :key="handle">
      <strong>{{ handle }}</strong><br>
      <span v-html="attribute(recyclable.attribute_data, handle)" />
      <hr>
    </div> -->
  </div>
</template>

<script>
import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'
import ProductType from './types/ProductType.vue'

export default {
  components: {
    ProductType
  },
  mixins: [
    HasAttributes
  ],
  data () {
    return {
      showDeleteConfirm: false,
      showRestoreConfirm: false
    }
  },
  async asyncData ({ app, params, query }) {

    let includes = [];

    if (query.type == 'Product') {
      includes = [
        'recyclable.variants'
      ]
    }
    const response = await app.$gc.recycleBin.find(params.id, {
      full_response: true,
      includes: includes
    })

    const attributeGroupResponse = await app.$gc.attributeGroups.get({
      all_records: true,
      include: 'attributes'
    })

    return {
      item: response.data.data,
      attributeGroups: attributeGroupResponse.data.data,
      type: query.type,
      recyclable: response.data.data.recyclable
    }
  },
  methods: {
    restoreRecord () {
      this.$gc.recycleBin.restore(this.item.id).then((response) => {
        this.$router.push({
          name: 'recycle-bin'
        })
        this.$notify.queue('success', this.$t('Product restored'))
      })
    },
    deleteRecord () {
      this.$gc.recycleBin.delete(this.item.id).then((response) => {
        this.$router.push({
          name: 'recycle-bin'
        })
        this.$notify.queue('success', this.$t('Product deleted'))
      })
    }
  }
}
</script>
