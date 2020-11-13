<template>
  <div class="search-table">
    <div class="b-table">
      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th>{{ $t('Path') }}</th>
            <th>{{ $t('Slug') }}</th>
            <th>{{ $t('Locale') }}</th>
            <th>{{ $t('Default') }}</th>
            <th>{{ $t('Redirect') }}</th>
            <th></th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <td>
              <b-input v-model="newRoute.path" placeholder="/" />
            </td>
            <td>
              <form-field required :instructions="$t('The main slug for the route')">
                <b-input v-model="newRoute.slug" required />
              </form-field>
            </td>
            <td>
              <b-select v-model="newRoute.locale" :placeholder="$t('Select a language')">
                <option v-for="lang in languages" :value="lang.lang" :key="lang.id">{{ lang.name }} ({{ lang.lang }})</option>
              </b-select>
            </td>
            <td><b-switch v-model="newRoute.default"/></td>
            <td><b-switch v-model="newRoute.redirect" /></td>
            <td>
              <b-button @click="add" class="is-small" type="is-primary" icon-right="add-line"/>
            </td>
          </tr>
        </tfoot>
        <tbody>
          <tr v-for="(route, routeIndex) in routes" :key="route.id">
            <td>
              <b-field :message="$t('Path is used to determine nested routes (optional)')" >
                <b-input v-model="route.path"  @input="update(route)" placeholder="/" />
              </b-field>
            </td>
            <td>
              <form-field required :instructions="$t('The main slug for the route')">
                <b-input v-model="route.slug" @input="update(route)" />
              </form-field>
            </td>
            <td>
              <b-select v-model="route.locale"  @input="update(route)" :placeholder="$t('Select a language')">
                <option v-for="lang in languages" :value="lang.lang" :key="lang.id">{{ lang.name }} ({{ lang.lang }})</option>
              </b-select>
            </td>
            <td><b-switch @input="setDefault(routes, routeIndex)" v-model="route.default" :disabled="routes.length == 1"></b-switch></td>
            <td><b-switch v-model="route.redirect" @input="update(route)" :disabled="route.default"></b-switch></td>
            <td>
              <b-button @click="remove(routeIndex)" :disabled="routes.length == 1" class="is-small" type="is-danger" icon-right="delete-bin-line"/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import { filter, each, first, debounce } from 'lodash'
  import HubPage from '@getcandy/hub-core/src/mixins/HubPage'
  import HandlesForms from '@getcandy/hub-core/src/mixins/HandlesForms.js'

  export default {
    props: {
      routes: {
        type: Array,
        default: () => []
      },
      errors: {
        type: Object,
        default: () => {}
      }
    },
    mixins: [
      HubPage,
      HandlesForms
    ],
    data () {
      return {
        newRoute: {},
      }
    },
    mounted () {
      this.formErrors = this.errors
      this.newRoute = this.baseRoute()
    },
    methods: {
      baseRoute () {
        return {
          path: null,
          slug: null,
          locale: first(this.languages).lang,
          default: false,
        }
      },
      setDefault(items, index) {
        each(items, (item, itemIndex) => {
          if (itemIndex != index) {
            item.default = false
          } else {
            item.redirect = false
          }
        })
        this.update(items[index])
      },
      update: debounce(function (route) {
        this.$emit('updated', route)
      }, 300),
      add () {
        this.$emit('added', this.newRoute)
        this.newRoute = this.baseRoute()
      },
      async remove(index) {
        this.$emit('deleted', index)
      }
    }
  }
</script>

