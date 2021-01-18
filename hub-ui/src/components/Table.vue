<template>
  <div class="w-full">
    <div class="overflow-y-scroll">
    <table class="w-full" >
      <thead>
        <tr>
          <th v-if="sortable.handle" />
          <th v-for="(column, index) in columns" :key="index" class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-600 uppercase bg-gray-100">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <template v-if="state === 'loading'">
        <tfoot>
          <tr class="text-center bg-white">
            <td colspan="50" class="px-6 py-4 text-xs font-medium text-center text-gray-500 uppercase whitespace-no-wrap">
              <span class="flex items-center justify-center mx-auto">
                <gc-icon icon="rotate-clockwise" spin/>
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
          <tr :class="{'bg-white': index % 2 === 0, 'bg-gray-100': index % 2 !== 0}" v-for="(row, index) in data" :key="index">
            <td v-if="sortable.handle" :class="sortableHandle" class="w-2 px-6 py-4 cursor-grab">
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
            <td class="px-6 py-4 text-sm font-medium text-gray-900 whitespace-no-wrap" v-for="(column, colIndex) in columns" :key="colIndex">
                <template v-if="column.render">
                  {{ column.render(row) }}
                </template>
                <template v-if="column.component">
                  <component :is="column.component" :row="row" />
                </template>
                <slot :name="column.field" v-bind="{ row, index }" v-else></slot>
            </td>
          </tr>
        </tbody>
      </template>
    </table>
    </div>
    <template v-if="state != 'loading'">
      <nav class="flex items-center justify-center px-4 pb-3 border-t border-gray-200 sm:px-0" v-if="meta && meta.links">
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
      slots: []
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
    changePage (link) {
      if (!link.url) {
        return
      }
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
    state() {
      if (this.loading) {
        return states.loading
      }
    }
  }
}
</script>
