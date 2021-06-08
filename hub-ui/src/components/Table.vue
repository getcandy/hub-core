<template>
  <div class="w-full">
    <div class="overflow-y-auto">
      <div class="flex justify-between p-4" v-if="meta && meta.total">
        <span class="text-sm">Showing {{ $format.number(firstItem) }} to {{ $format.number(lastItem) }}</span>
        <span class="text-sm font-bold">Total Results: {{ $format.number(meta.total) }}</span>
      </div>
      <table class="w-full" >
        <thead>
          <tr>
            <th v-if="sortable.handle" class="bg-gray-100 " />
            <th
              v-for="(column, index) in columns"
              :key="index"
              class="text-xs font-medium leading-4 tracking-wider text-left text-gray-600 uppercase bg-gray-100"
              :class="{
                [column.class]: !!column.class,
                'px-4 py-3': !column.sort
              }"
            >
              <template v-if="column.field == 'check'">
                  <input type="checkbox" v-model="checkAllRows" :value="true" @change="toggleRows">
              </template>
              <template v-else>
                <button
                  class="flex items-center justify-between block w-full font-medium leading-4 tracking-wider uppercase truncate focus:outline-none"
                  :class="{
                    'hover:bg-gray-200 cursor-pointer px-4 py-3 ': !!column.sort,
                  }"
                  v-if="column.sort"
                  @click="sort(column.sort)"
                >
                  <span>{{ column.label }}</span> <gc-icon v-if="column.sort" :icon="getSortIcon(column.sort)" size="sm" />
                </button>
                <span class="truncate" v-else>{{ column.label }}</span>
              </template>
            </th>
          </tr>
        </thead>
        <template v-if="state === 'loading'">
          <tfoot>
            <tr class="text-center bg-white">
              <td colspan="50" class="px-6 py-4 text-xs font-medium text-center text-gray-500 uppercase whitespace-no-wrap">
                <span class="flex items-center justify-center mx-auto">
                  <loading-spinner />
                  <span class="ml-2">{{ $t('Loading') }}</span>
                </span>
              </td>
            </tr>
          </tfoot>
        </template>
        <template v-else>
          <slot name="tfoot" />
          <tfoot v-if="(!data || !data.length) && !$slots.tfoot">
            <tr class="text-center bg-white">
              <td colspan="50" class="px-6 py-4 text-xs font-medium text-center text-gray-500 uppercase whitespace-no-wrap">No records</td>
            </tr>
          </tfoot>
          <slot name="tbody" v-bind="data" />
          <tbody v-if="!$slots.tbody" v-sortable="sortable">
            <tr :class="{'bg-white': index % 2 === 0, 'bg-gray-100': index % 2 !== 0}" v-for="(row, index) in data" :key="rowKeyIsIndex ? index : (row.id || index)">
              <td v-if="sortable.handle" :class="sortableHandle" class="w-2 px-4 py-4 cursor-grab">
                <svg width="13px" viewBox="0 0 13 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g fill="#D8D8D8">
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
              <td :class="`${column.class || ''} px-4 py-4 text-sm font-medium text-gray-900`" v-for="(column, colIndex) in columns" :key="colIndex">
                  <template v-if="column.render">
                    {{ column.render(row) }}
                  </template>
                  <template v-if="column.component">
                    <component :is="column.component" :row="row" />
                  </template>
                  <div class="max-w-4xl" :class="column.truncate ? 'truncate' : null" v-else>
                    <slot :name="column.field" v-bind="{ row, index }"></slot>
                  </div>
              </td>
            </tr>
          </tbody>
        </template>
      </table>
    </div>
    <template v-if="state != 'loading' && meta">
      <nav class="flex items-center justify-center px-4 pb-3 border-t border-gray-200 sm:px-0" v-if="meta.links">
        <div class="hidden md:flex">
          <a
            href="#"
            v-for="(link, index) in meta.links"
            :key="index"
            @click.prevent="changePage(link)"
            :class="{
              'text-indigo-600 focus:outline-none focus:text-indigo-800 focus:border-indigo-700 border-indigo-500': link.active,
              'text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-400': !link.active,
            }"
            class="inline-flex items-center px-4 pt-4 -mt-px text-sm font-medium leading-5 transition duration-150 ease-in-out border-t-2 border-transparent focus:outline-none"
            v-html="link.label"
          >
          </a>
        </div>
      </nav>
      <div class="text-xs text-center text-red-600" v-if="meta.large_dataset">
        {{ $t('Pagination has been limited due to the high number of results') }}
      </div>
    </template>
  </div>
</template>

<script>
const each = require('lodash/each')
const debounce = require('lodash/debounce')
const snakeCase = require('lodash/snakeCase')
const queryString = require('query-string');

const states = {
  loading: 'loading',
}

export default {
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    rowKeyIsIndex: {
      type: Boolean,
      default: false,
    },
    sortable: {
      type: Object,
      default() {
        return {
          sort: false,
          disabled: true,
        }
      }
    },
    meta: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      slots: [],
      sortDir: null,
      sortField: null,
      checkAllRows: false
    }
  },
  mounted () {
    each(this.columns, col => {
      const name = col.name || col
      this.slots.push(snakeCase(name))
    })

    this.$emit('init', {
      slots: this.slots
    })
  },
  methods: {
    toggleRows (event) {
      this.$emit('toggleCheck', this.checkAllRows)
      this.checkAllRows = false
    },
    getSortIcon (field) {
      if (this.sortField !== field) {
        return 'arrows-sort'
      }
      if (this.sortDir === 'asc') {
        return 'sort-ascending'
      }
      if (this.sortDir === 'desc') {
        return 'sort-descending'
      }
      return 'arrows-sort'
    },
    sort (field) {
      if (this.sortField === field) {
        // If we're on desc, we're at the end of the cycle so null it out
        if (this.sortDir === 'desc') {
          this.sortDir = null
          this.sortField = null
          this.$emit('sort', {
            field: null,
            direction: null,
          })
          return;
        }
        this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc'
        this.$emit('sort', {
          field,
          direction: this.sortDir,
        })
        return;
      }
      this.$emit('sort', {
        field,
        direction: 'asc',
      })
      this.sortField = field
      this.sortDir = 'asc'
    },
    changePage (link) {
      if (!link.url) {
        return
      }
      this.checkAllRows = false
      const { query } = queryString.parseUrl(link.url)

      if (query.page) {
        this.$emit('changePage', query.page)
      }
    }
  },
  computed: {
    sortableHandle () {
      if (!this.sortable.handle) {
        return null;
      }
      return this.sortable.handle.substring(1)
    },
    firstItem () {
      if (!this.meta || !this.meta.current_page) {
        return;
      }
      if (this.meta.current_page === 1) {
        return 1;
      }
      return parseInt(this.meta.to) - this.data.length
    },
    lastItem () {
      if (!this.meta || !this.meta.to) {
        return;
      }
      return this.meta.to
    },
    state() {
      if (this.loading) {
        return states.loading
      }
    }
  }
}
</script>
