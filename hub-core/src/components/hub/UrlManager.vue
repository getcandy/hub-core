<template>
  <div>
    <div class="p-4 text-right">
      <gc-button @click="createPanelVisible = true">
        Add route
      </gc-button>
    </div>
    <gc-table
      :data="routes"
      :columns="[
        {label: $t('Slug'), field: 'slug'},
        {label: $t('Language'), field: 'language'},
        {label: $t('Default'), field: 'default'},
        {label: $t('Redirect'), field: 'redirect'},
        {label: null, field: 'actions'},
      ]"
    >
      <template v-slot:path="{ row }">
        <gc-input v-model="row.path" placeholder="/" @input="update(row)" />
      </template>
      <template v-slot:slug="{ row }">
        <gc-input v-model="row.slug" @input="update(row)" />
      </template>
      <template v-slot:language="{ row }">
        <gc-select-input v-model="row.language.data.id" :placeholder="$t('Select a language')" @input="update(row)">
          <option v-for="lang in languages" :key="lang.id" :value="lang.id">
            {{ lang.name }} ({{ lang.code }})
          </option>
        </gc-select-input>
      </template>
      <template v-slot:default="{ row, index }">
        <gc-toggle v-model="row.default" :disabled="routes.length == 1 || row.default" @input="setDefault(routes, index)" />
      </template>
      <template v-slot:redirect="{ row }">
        <gc-toggle v-model="row.redirect" :disabled="routes.length == 1 || row.default" @input="update(row)" />
      </template>
      <template v-slot:actions="{ row, index }">
        <gc-button v-if="routes.length > 1 && !row.default" theme="danger" size="x-small" @click="remove(index)">
          {{ $t('Remove') }}
        </gc-button>
      </template>
    </gc-table>
    <quick-view-panel heading="Create Route" :open="createPanelVisible" @close="createPanelVisible = false">
      <div class="p-4">
        <gc-form-field required label="Slug" :instructions="$t('The main slug for the route')">
          <gc-slug-input v-model="newRoute.slug" required />
        </gc-form-field>
        <gc-form-field required label="Language">
          <gc-select-input v-model="newRoute.language_id" :placeholder="$t('Select a language')">
            <option v-for="lang in languages" :key="lang.id" :value="lang.id">
              {{ lang.name }} ({{ lang.code }})
            </option>
          </gc-select-input>
        </gc-form-field>
        <gc-form-field label="Default">
          <gc-toggle v-model="newRoute.default" />
        </gc-form-field>
        <gc-form-field label="Redirect">
          <gc-toggle v-model="newRoute.redirect" />
        </gc-form-field>
        <gc-button @click="add">
          Create Route
        </gc-button>
      </div>
    </quick-view-panel>
  </div>
</template>

<script>
import HubPage from '@getcandy/hub-core/src/mixins/HubPage'
import HandlesForms from '@getcandy/hub-core/src/mixins/HandlesForms.js'

const each = require('lodash/each')
const find = require('lodash/find')
const debounce = require('lodash/debounce')
const map = require('lodash/map')
const get = require('lodash/get')

export default {
  mixins: [
    HubPage,
    HandlesForms
  ],
  props: {
    elementType: {
      type: String,
      required: true
    },
    elementId: {
      type: String,
      required: true
    },
    routes: {
      type: Array,
      default: () => []
    },
    errors: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      mappedRoutes: [],
      newRoute: {
        slug: null,
        language_id: null,
        redirect: false,
        default: false
      },
      createPanelVisible: false
    }
  },
  computed: {
    defaultLanguage () {
      return find(this.languages, language => language.default)
    }
  },
  mounted () {
    this.formErrors = this.errors

    this.$nextTick(() => {
      this.$set(this.newRoute, 'language_id', this.defaultLanguage.id)
    })
  },
  methods: {
    setDefault (items, index) {
      each(items, (item, itemIndex) => {
        if (itemIndex !== index) {
          item.default = false
        } else {
          item.redirect = false
        }
      })
      this.update(items[index])
    },
    update: debounce(function (route) {
      this.$emit('updated', {
        ...route,
        language_id: route.language.data.id
      })
    }, 300),
    add () {
      this.$emit('created', async () => {
        try {
          const { data } = await this.$getcandy.on(
            'routes',
            'createRoute',
            this.elementType,
            this.elementId,
            this.newRoute.slug,
            this.newRoute.language_id,
            this.newRoute.default ? 1 : 0,
            this.newRoute.redirect ? 1 : 0,
            this.newRoute.description,
            {
              params: {
                include: 'language'
              }
            }
          )
          this.$emit('added', data.data)
          this.newRoute = {
            slug: '',
            language_id: this.defaultLanguage.id,
            default: false,
            redirect: false
          }
          this.createPanelVisible = false
          this.$notify.queue('success', this.$t('Route created'))
        } catch (err) {
          this.$notify.queue('error', this.$t('Unable to save route'))
        }
      })
    },
    remove (index) {
      this.$emit('deleted', index)
    }
  }
}
</script>
