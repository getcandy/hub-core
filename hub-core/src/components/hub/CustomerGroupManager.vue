<template>
  <div class="search-table">
    <div class="b-table">
      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th>{{ $t('Group') }}</th>
            <th v-for="col in cols" :key="col">
              {{ $t(col.charAt(0).toUpperCase() + col.slice(1)) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="group in groups" :key="group.id">
            <td>{{ group.name }}</td>
            <td v-for="col in cols" :key="col">
              <gc-toggle v-model="group[col]" :true-value="group[col] === true ? true : 1" :false-value="group[col] === false ? false : 0" @input="$emit('change', groups)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    groups: {
      type: Array,
      default () {
        return []
      }
    },
    cols: {
      type: Array,
      default () {
        return [
          'visible',
          'purchasable'
        ]
      }
    }
  },
  mounted () {

  }
}
</script>
