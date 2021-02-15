<template>
  <div>
    <div class="search-table">
      <div class="b-table">
        <table class="table">
          <thead>
            <tr>
              <th />
              <th>{{ $t('Category') }}</th>
              <th>{{ $t('Children') }}</th>
              <th>{{ $t('Products') }}</th>
            </tr>
          </thead>
          <tbody v-sortable="sortableOptions">
            <template v-for="item in nodes">
              <tr :key="item.id">
                <td class="handle" width="10%">
                  <svg width="13px" viewBox="0 0 13 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="Artboard" fill="#D8D8D8">
                        <rect id="Rectangle" x="2" y="2" width="3" height="3" />
                        <rect id="Rectangle-Copy-2" x="2" y="8" width="3" height="3" />
                        <rect id="Rectangle-Copy-4" x="2" y="14" width="3" height="3" />
                        <rect id="Rectangle-Copy-5" x="8" y="14" width="3" height="3" />
                        <rect id="Rectangle-Copy" x="8" y="2" width="3" height="3" />
                        <rect id="Rectangle-Copy-3" x="8" y="8" width="3" height="3" />
                      </g>
                    </g>
                  </svg>
                </td>
                <td>
                  <nuxt-link
                    :to="{
                      name: 'categories.edit.details',
                      params: {
                        id: item.id
                      }
                    }"
                  >
                    {{ attribute(item.attribute_data, 'name') }}
                  </nuxt-link>
                  <!-- <a :href="url(item)">{{ item|attribute('name') }}</a> -->
                </td>
                <td>{{ item.children_count }}</td>
                <td>
                  {{ item.products_count }}
                  <!-- <template v-if="item.products_count">
                              <a href="#" @click.prevent="expand(item.id)" v-if="!isExpanded(item.id)">Expand</a>
                              <a href="#" @click.prevent="collapse(item.id)" v-else>Collapse</a>
                          </template> -->
                </td>
              </tr>
              <!-- <tr v-if="item.products_count && isExpanded(item.id)">
                      <td colspan="4">
                          <div class="overflow">
                              <table class="table product-table">
                              <thead>
                                  <tr>
                                      <th>Product Name</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr v-for="product in item.products.data" :key="product.id">
                                      <td>{{ product|attribute('name') }}</td>
                                  </tr>
                              </tbody>
                          </table>
                          </div>
                      </td>
                  </tr> -->
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'
export default {
  mixins: [
    HasAttributes
  ],
  props: {
    category: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      sortableOptions: {
        onEnd: this.reorder,
        // onStart: this.collapseAll(),
        filter: '.disabled',
        handle: '.handle',
        animation: 150
      }
    }
  },
  computed: {
    nodes () {
      return this.category.children.data
    }
  },
  methods: {
    reorder ({ oldIndex, newIndex }) {
      let action = 'after'

      const movedItem = this.nodes.splice(oldIndex, 1)[0]

      this.nodes.splice(newIndex, 0, movedItem)

      let sibling = this.nodes[newIndex - 1]

      if (!sibling) {
        action = 'before'
        sibling = this.nodes[newIndex + 1]
      }

      this.$gc.categories.reorder(sibling.id, movedItem.id, action).then(() => {
        this.$buefy.toast.open({
          message: 'Categories Reordered',
          type: 'is-success'
        })
      }).catch(() => {
        this.$buefy.toast.open({
          duration: 5000,
          message: 'Unable to reorder categories',
          position: 'is-bottom',
          type: 'is-danger'
        })
      })
    }
  }
}
</script>
