<template>
  <div>
    <div class="p-4 text-right">
      <gc-button @click="createPanelVisible = true">Add route</gc-button>
    </div>
    <gc-table
      :data="routes"
      :columns="[
        {label: $t('Path'), field: 'path'},
        {label: $t('Slug'), field: 'slug'},
        {label: $t('Locale'), field: 'locale'},
        {label: $t('Default'), field: 'default'},
        {label: $t('Redirect'), field: 'redirect'},
        {label: null, field: 'actions'},
      ]"
    >
      <template v-slot:path="{ row }">
        <gc-input v-model="row.path"  @input="update(row)" placeholder="/" />
      </template>
      <template v-slot:slug="{ row }">
        <gc-input v-model="row.slug"  @input="update(row)" />
      </template>
      <template v-slot:locale="{ row }">
        <gc-select-input v-model="row.locale"  @input="update(row)" :placeholder="$t('Select a language')">
          <option v-for="lang in languages" :value="lang.lang" :key="lang.id">{{ lang.name }} ({{ lang.lang }})</option>
        </gc-select-input>
      </template>
      <template v-slot:default="{ row, index }">
        <gc-toggle @input="setDefault(routes, index)" v-model="row.default" :disabled="routes.length == 1" />
      </template>
      <template v-slot:redirect="{ row }">
        <gc-toggle v-model="row.redirect" :disabled="routes.length == 1" @input="update(row)" />
      </template>
      <template v-slot:actions="{ index }">
        <gc-button @click="remove(index)" :disabled="routes.length == 1" theme="danger" size="x-small">
          {{ $t('Remove') }}
        </gc-button>
      </template>
    </gc-table>
    <quick-view-panel heading="Create Route" :open="createPanelVisible" @close="createPanelVisible = false">
      <div class="p-4">
        <form-field label="Path">
          <gc-input v-model="newRoute.path" placeholder="/" />
        </form-field>
        <form-field required label="Slug" :instructions="$t('The main slug for the route')">
          <gc-input v-model="newRoute.slug" required />
        </form-field>
        <form-field required label="Slug">
          <gc-select-input v-model="newRoute.locale" :placeholder="$t('Select a language')">
            <option v-for="lang in languages" :value="lang.lang" :key="lang.id">{{ lang.name }} ({{ lang.lang }})</option>
          </gc-select-input>
        </form-field>
        <form-field label="Default">
          <gc-toggle v-model="newRoute.default" />
        </form-field>
        <form-field label="Redirect">
          <gc-toggle v-model="newRoute.redirect" />
        </form-field>
        <gc-button @click="add">Create Route</gc-button>
      </div>
    </quick-view-panel>
  </div>
</template>

<script>
  const each = require('lodash/each')
  const first = require('lodash/first')
  const debounce = require('lodash/debounce')

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
        createPanelVisible: false
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
        this.createPanelVisible = false
      },
      async remove(index) {
        this.$emit('deleted', index)
      }
    }
  }
</script>

