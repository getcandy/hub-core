<template>
  <div>
    {{ record.versionable_type }}
  </div>
</template>

<script>
export default {
  name: 'VersionRecord',
  props: {
    record: {
      type: Object,
      required: true
    }
  }
}
</script>
