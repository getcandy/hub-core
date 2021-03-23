<template>
  <div>
    <h2 class="subtitle">{{ $t('Routes') }}</h2>
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>{{ $t('Path') }}</th>
          <th>{{ $t('Slug') }}</th>
          <th>{{ $t('Locale') }}</th>
          <th>{{ $t('Default') }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(route, routeIndex) in routes" :key="route.id">
          <td>
            <b-field :message="$t('Path is used to determine nested routes (optional)')" >
              <gc-input v-model="route.path" placeholder="/" />
            </b-field>
          </td>
          <td>
            <b-field :message="$t('The main slug for the route')" >
              <gc-input v-model="route.slug" />
            </b-field>
          </td>
          <td>
            <b-select v-model="route.locale" :placeholder="$t('Select a language')">
              <option v-for="lang in languages" :value="lang.lang" :key="lang.id">{{ lang.name }} ({{ lang.lang }})</option>
            </b-select>
          </td>
          <td><b-switch @input="setDefault(routes, routeIndex)" v-model="route.default" :disabled="routes.length == 1">{{ $t('Default') }}</b-switch></td>
          <td>
            <b-button v-if="route.id" type="is-danger">{{ $t('Delete') }}</b-button>
            <template v-else>
              <b-button @click="cancel(routes, routeIndex)">{{ $t('Cancel') }}</b-button>
              <b-button type="is-primary">{{ $t('Save') }}</b-button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="has-text-centered">
      <b-button @click="add(routes)">{{ $t('Add Route') }}</b-button>
    </div>
    <hr>
    <h2 class="subtitle">{{ $t('Redirects') }}</h2>
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>{{ $t('Path') }}</th>
          <th>{{ $t('Slug') }}</th>
          <th>{{ $t('Locale') }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(route, routeIndex) in redirects" :key="route.id">
          <td>
            <b-field>
              <gc-input v-model="route.path" placeholder="/" />
            </b-field>
          </td>
          <td>
            <b-field>
              <gc-input v-model="route.slug" />
            </b-field>
          </td>
          <td>
            <b-select v-model="route.locale" :placeholder="$t('Select a language')">
              <option v-for="lang in languages" :value="lang.lang" :key="lang.id">{{ lang.name }} ({{ lang.lang }})</option>
            </b-select>
          </td>
          <td>
            <b-button v-if="route.id" type="is-danger">{{ $t('Delete') }}</b-button>
            <template v-else>
              <b-button @click="cancel(redirects, routeIndex)">{{ $t('Cancel') }}</b-button>
              <b-button type="is-primary">{{ $t('Save') }}</b-button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="has-text-centered">
      <b-button @click="add(redirects)">{{ $t('Add Redirect') }}</b-button>
    </div>
  </div>
</template>

<script>
  const filter = require('lodash/filter')
  const each = require('lodash/each')
  const first = require('lodash/first')

  export default {
    layout: 'collection',
    data() {
      return {
        routes: [],
        redirects: [],
      }
    },
    methods: {
      setDefault(items, index) {
        each(items, (item, itemIndex) => {
          if (itemIndex != index) {
            item.default = false
          }
        })
      },
      add(items) {
        items.push({
          path: null,
          slug: null,
          locale: first(this.languages).lang,
          default: false,
        })
      },
      cancel(items, index) {
        items.splice(index, 1)
        if (items.length == 1) {
          first(items).default = true
        }
      }
    },
    mounted() {
      const allRoutes = this.collection.routes.data;
      this.routes = filter(allRoutes, route => !route.redirect) || []
      this.redirects = filter(allRoutes, route => route.redirect) || []
    },
    computed: {
      collection() {
        return JSON.parse(JSON.stringify(this.$store.state.collections.model))
      },
      languages() {
        return this.$store.state.core.languages
      }
    }
  }
</script>

