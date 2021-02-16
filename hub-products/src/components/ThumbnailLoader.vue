<template>
  <div>
    <img
      v-if="imageSrc"
      ref="image"
      :src="imageSrc"
      :style="{
        'max-width': '100%',
        'width': width
      }"
    >
    <template v-else>
      <b-icon icon="image-outline" />
    </template>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: null
    },
    size: {
      default: 'thumbnail',
      type: String
    },
    width: {
      default: '100px',
      type: String
    },
    asset: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      imageSrc: null
    }
  },
  mounted () {
    let asset

    if (this.asset) {
      asset = this.asset
      if (asset.thumbnail) {
        return asset.thumbnail
      }
    } else if (this.item.assets) {
      asset = _.find(this.item.assets.data, (asset) => {
        return asset.primary
      })
    }
    if (asset) {
      let thumbnail = _.find(asset.transforms.data, (transform) => {
        return transform.handle == this.size
      })

      if (!thumbnail) {
        thumbnail = asset.transforms.data[0]
      }

      this.load(thumbnail.url)
    }
  },
  methods: {
    load (url) { // _.debounce(function () {
      const img = new Image()
      img.src = url
      this.imageSrc = url
    }
  }
}
</script>
