<template>
  <div>
    <toolbar :heading="$t('Collections')">
    </toolbar>
    <gc-table
      :data="collections"
      :columns="[
        {label: '', field: 'thumbnail'},
        {label: $t('Name'), field: 'name'}
      ]"
    >
      <template v-slot:thumbnail="{ row }">
        <nuxt-link :to="{
            name: 'collections.edit.details',
            params: {
                id: row.id
            }
          }">
          <thumbnail-loader width="30px" :asset="row.assets.data[0]"></thumbnail-loader>
        </nuxt-link>
      </template>
      <template v-slot:name="{ row }">
        <nuxt-link :to="{
          name: 'collections.edit.details',
          params: {
              id: row.id
          }
        }">
          {{ attribute(row.attribute_data, 'name') }}
        </nuxt-link>
      </template>
    </gc-table>
      <!-- <div class="search-table"> -->
        <!-- <b-table
          :data="collections"
          :total="total"
          :per-page="perPage"
          :striped="true"
          backend-sorting
          paginated
          backend-pagination
          @page-change="changePage"
        >
          <template slot-scope="props">
            <b-table-column field="thumbnail" label="">
              <nuxt-link :to="{
                name: 'collections.edit.details',
                params: {
                    id: props.row.id
                }
              }">
                <thumbnail-loader width="30px" :item="props.row"></thumbnail-loader>
              </nuxt-link>
            </b-table-column>
            <b-table-column field="name" :label="$t('Name')">
              <nuxt-link :to="{
                name: 'collections.edit.details',
                params: {
                    id: props.row.id
                }
              }">
              {{ attribute(props.row.attribute_data, 'name') }}
              </nuxt-link>
            </b-table-column>
          </template>
        </b-table> -->
      <!-- </div> -->

  </div>
</template>

<script>
  import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'

  export default {
    mixins: [
      HasAttributes
    ],
    data() {
      return {
        loading: true,
        perPage: 30,
        page: 1,
        total: 0,
        collections: []
      }
    },
    mounted() {
      this.loadData()
    },
    methods: {
      changePage(page) {
        this.page = page
        this.loadData()
      },
      loadData() {
        this.$getcandy.on('collections', 'getCollections', 
          'assets.transforms',
          this.perPage,
          true,
          this.sort,
          this.page
        ).then(response => {
          const { data, meta } = response.data
          this.collections = data
          this.loading = false;
          this.total = meta.total
          this.perPage = meta.per_page
          this.page = meta.current_page;
        })
      }
    }
  }
</script>
