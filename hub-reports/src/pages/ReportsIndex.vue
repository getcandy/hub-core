<template>
  <div>
    <toolbar heading="Report exports" />
    <gc-table
      :loading="$fetchState.pending"
      :columns="[
        {label: 'Report', field: 'report'},
        {label: 'Filename', field: 'filename'},
        {label: 'Download', field: 'download'},
      ]"
      @changePage="changePage"
      :data="reports"
      :meta="meta"
    >
      <template v-slot:report="{ row }">
        {{ row.report }}
      </template>
      <template v-slot:filename="{ row }">
        {{ row.filename }}
      </template>
      <template v-slot:download="{ row }">
        <div v-if="!row.completed_at" class="flex items-center text-gray-600">
          <loading-spinner /> <span class="ml-2 text-sm">Report processing</span>
        </div>
        <gc-button v-else @click="download(row)">Download</gc-button>
      </template>
    </gc-table>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Report Exports'
  },
  data () {
    return {
      reports: [],
      meta: {}
    }
  },
  async fetch () {
    const { query } = this.$route
    const { data } = await this.$axios.get('reports/exports', {
      params: query
    })
    this.reports = data.data
    this.meta = data.meta
  },
  watch: {
    '$route.query': '$fetch',
  },
  methods: {
    changePage (page) {
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          page
        }
      })
    },
    download (row) {
      const csv = "data:text/csv;charset=utf-8," + atob(row.content);
      var encodedUri = encodeURI(csv);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", row.filename);
      document.body.appendChild(link); // Required for FF

      link.click();
    }
  }
}
</script>
