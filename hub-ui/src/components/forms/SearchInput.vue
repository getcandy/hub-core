<template>
  <div v-click-outside="hideResults">
    <div class="relative">
      <div v-if="selectedRow" class="border rounded">
        <span class="py-2 px-3 block">{{ selectedRow[labelField] }}</span>
        <button type="button" class="text-xs text-gray-600 border-t hover:bg-gray-200 block bg-gray-100 w-full" @click="reset">Click to remove</button>
      </div>
      <template v-else>
        <gc-input v-model="searchTerm" @input="search" @focus="shouldShowResults = true" :placeholder="placeholder" />
      </template>

      <div class="absolute mt-1 w-full rounded-md bg-white shadow-lg z-50" v-if="rows.length && shouldShowResults">
        <ul tabindex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-item-3" class="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5">
          <!--
            Select option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.

            Highlighted: "text-white bg-indigo-600", Not Highlighted: "text-gray-900"
          -->
          <li
            role="option"
            class="cursor-default select-none relative py-2 pl-3 pr-9 cursor-pointer"
            :class="{
              'text-white bg-indigo-600': row[valueField] === value,
              'text-gray-900 hover:bg-gray-100': row[valueField] != value,
            }"
            v-for="(row, index) in rows"
            :key="index"
            @click="select(row)"
          >
            <div class="flex space-x-2">
              <slot name="row" v-bind="row"></slot>
            </div>

            <!--
              Checkmark, only display for selected option.

              Highlighted: "text-white", Not Highlighted: "text-indigo-600"
            -->
            <span class="absolute inset-y-0 right-0 flex items-center pr-4" v-if="row[valueField] === value">
              <!-- Heroicon name: check -->
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </span>
          </li>

          <!-- More options... -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
const debounce = require('lodash/debounce')
import ClickOutside from 'vue-click-outside'
export default {
  directives: {
    ClickOutside,
  },
  props: {
    rows: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: 'Start typing to search',
    },
    value: {
      type: null,
      default: null
    },
    labelField: {
      type: String,
      default: 'label',
    },
    valueField: {
      type: String,
      default: 'value',
    }
  },
  data() {
    return {
      searchTerm: null,
      state: 'idle',
      selectedRow: null,
      shouldShowResults: true,
    }
  },
  methods: {
    hideResults () {
      this.shouldShowResults = false
    },
    reset() {
      this.searchTerm = null
      this.selectedRow = null
      this.$emit('reset')
    },
    search: debounce(function () {
      this.$emit('search', this.searchTerm)
    }, 300),
    select (row) {
      this.selectedRow = row
      this.shouldShowResults = false
      this.$emit('input', row[this.valueField])
    }
  }
}
</script>
