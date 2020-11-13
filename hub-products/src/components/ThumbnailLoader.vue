<template>
    <div>
        <img :src="imageSrc" ref="image" :style="{
            'max-width': '100%',
            'width': width
        }" v-if="imageSrc">
        <template v-else>
            <b-icon icon="image-outline">
            </b-icon>
        </template>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                imageSrc: null,
            }
        },
        props: {
            item: {
                type: Object,
                default: null,
            },
            size: {
                default: 'thumbnail'
            },
            width: {
                default: "100px",
            },
            asset: {
                type: Object,
                default: null,
            }
        },
        methods: {
            load(url) { //_.debounce(function () {
              const img = new Image()
              img.src = url
              this.imageSrc = url
            }
        },
        mounted() {
            let asset;

            if (this.asset) {
                asset = this.asset;
                if (asset.thumbnail) {
                  return asset.thumbnail
                }
            } else if (this.item.assets) {
                asset = _.find(this.item.assets.data, asset => {
                    return asset.primary;
                });
            }
            if (asset) {
                let thumbnail = _.find(asset.transforms.data, transform => {
                    return transform.handle == this.size;
                });

                if (!thumbnail) {
                    thumbnail = asset.transforms.data[0];
                }

                this.load(thumbnail.url);
            }
        }
    }
</script>
