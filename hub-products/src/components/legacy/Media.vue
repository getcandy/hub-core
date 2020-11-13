<template>
  <div>
    <div class="columns">
      <div class="column">
        <b-field>
          <b-radio-button v-model="filter" :native-value="null">All</b-radio-button>
          <b-radio-button v-model="filter" native-value="images">Images</b-radio-button>
          <b-radio-button v-model="filter" native-value="files">Files</b-radio-button>
          <b-radio-button v-model="filter" native-value="videos">Videos</b-radio-button>
        </b-field>
      </div>
      <div class="column">
        <b-field class="file">
          <b-upload @input="upload" multiple v-model="assetsToUpload">
            <a class="button is-primary">
              <b-icon icon="upload-line"></b-icon>
              <span>Click to upload</span>
            </a>
          </b-upload>
        </b-field>
      </div>
      <div class="column">
        <b-field class="file">
          <b-button @click="urlUploadModalOpen = true">Upload by URL</b-button>
          <b-modal :active.sync="urlUploadModalOpen"
            trap-focus
            aria-role="dialog"
            aria-modal
          >
            <div class="card">
              <div class="card-footer">
                <div class="card-content">
                  <div class="columns">
                    <div class="column">
                      <b-field label="Source">
                        <b-select v-model="assetUrlType">
                          <option v-for="type in mimeTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
                        </b-select>
                      </b-field>
                    </div>
                    <div class="column is-four-fifths">
                      <b-field label="URL">
                        <b-input />
                      </b-field>
                    </div>
                    <div class="column">
                      <b-button>Upload</b-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </b-modal>
        </b-field>
      </div>
    </div>
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th></th>
          <th>
            <b-tooltip label="Set the main image for this product"
              position="is-bottom">
              Primary <b-icon icon="information-line" size="is-small">
            </b-icon>
            </b-tooltip>
          </th>
          <th></th>
          <th>Title/Alt Tag</th>
          <th>Description</th>
          <th>Tags</th>
          <th>File Type</th>
          <th></th>
        </tr>
      </thead>
      <tfoot v-if="!getFilteredResults.length">
        <tr>
          <td colspan="42">
            No assets found
          </td>
        </tr>
      </tfoot>
      <tbody v-sortable="sortableOptions">
        <tr v-for="(asset, index) in getFilteredResults" :key="asset.id">
            <td class="handle">
              <svg width="13px" viewBox="0 0 13 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="Artboard" fill="#D8D8D8">
                      <rect id="Rectangle" x="2" y="2" width="3" height="3"></rect>
                      <rect id="Rectangle-Copy-2" x="2" y="8" width="3" height="3"></rect>
                      <rect id="Rectangle-Copy-4" x="2" y="14" width="3" height="3"></rect>
                      <rect id="Rectangle-Copy-5" x="8" y="14" width="3" height="3"></rect>
                      <rect id="Rectangle-Copy" x="8" y="2" width="3" height="3"></rect>
                      <rect id="Rectangle-Copy-3" x="8" y="8" width="3" height="3"></rect>
                  </g>
                </g>
              </svg>
            </td>
            <td>
              <div class="field">
                <b-switch v-model="asset.primary" v-if="getThumbnail(asset)" @click="setPrimary(asset)" />
              </div>
            </td>
            <td>
              <thumbnail-loader width="50px" :asset="asset"></thumbnail-loader>
            </td>
            <td>
              <b-input v-model="asset.title" @blur="save"></b-input>
            </td>
            <td>
              <b-input v-model="asset.caption" @blur="save"></b-input>
            </td>
            <td>
              <b-taginput
                @blur="save"
                :data="defaultTags"
                v-model="asset.tags"
                ellipsis
                icon="label"
                placeholder="Asset tags">
            </b-taginput>
            </td>
            <td><span v-if="asset.extension">.{{ asset.extension }}</span><span v-else>-</span></td>
            <td align="right">
              <b-button class="btn btn-sm btn-default btn-action" :href="asset.url" target="_blank">
                <b-icon icon="download-line" size="is-small" />
              </b-button>
              <b-button icon color="red" @click="showDeleteModal(index)">
                <b-icon icon="delete-bin-line" size="is-small" />
              </b-button>
            </td>
        </tr>
      </tbody>
    </table>

                    <!-- File icons sourced from Flaticon, we'd need to purchase these or mention the author if we want to use them for free.-->

        <!-- <div class="sub-nav media-upload"> -->
            <!-- <button type="button" class="btn btn-primary btn-full" @click="openUrlModal">Add by URL</button> -->
            <!-- <candy-alert :shown="true" level="danger" v-for="(file, index) in failedUploads" :key="index">
                <strong>{{ file.filename }}</strong> <br>
                <ul class="list-unstyled">
                    <li v-for="error in file.errors">
                       {{ error }}
                    </li>
                </ul>
            </candy-alert> -->

            <!-- <dropzone id="variant-media-upload"
                ref="mediaDropzone"
                :url="dropzoneUrl"
                v-on:vdropzone-success="uploadSuccess"
                v-on:vdropzone-sending="appendParams"
                v-bind:dropzone-options="dzOptions"
                v-bind:use-custom-dropzone-options="true"
                v-on:vdropzone-error="uploadError"
                :maxFileSizeInMB="50"
            >
                <div class="dz-default dz-message media-box">
                    <i class="fa fa-upload icon" aria-hidden="true"></i>
                    <p>Drop files here or click to upload</p>
                </div>
                <input type="hidden" name="_token" :value="token">
            </dropzone> -->
        <!-- </div> -->
        <!-- <candy-modal title="Add media by URL" v-show="urlUploadModalOpen" @closed="closeUrlModal">
            <div slot="body">
                <div class="row">
                    <div class="col-xs-12 col-sm-3">
                        <div class="form-group">
                            <label>Type</label>
                            <candy-select ref="urlTypeDropdown" :options="mimeTypes" v-model="urlUpload.type"></candy-select>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-9">
                        <div class="form-group">
                            <label for="urlUpload">Enter the URL to the asset.</label>
                            <input type="text" id="urlUpload" class="form-control" v-model="urlUpload.url" @blur="detectAssetUrlType()">
                        </div>
                        <span class="text-danger" v-if="request.getError('url')" v-text="request.getError('url')"></span>
                    </div>
                </div>
            </div>
            <template slot="footer">
                <button type="button" class="btn btn-primary" @click="uploadUrlMedia" :disabled="processingAssetUrl">
                    <template v-if="!processingAssetUrl">Add media</template>
                    <template v-else>Processing</template>
                </button>
            </template>
        </candy-modal> -->
        <b-modal :active.sync="deleteModalOpen"
          trap-focus
          aria-role="dialog"
          aria-modal
        >
          <div class="card">
            <div class="card-content">
              This action cannot be undone
            </div>
            <div class="card-footer">
              <div class="card-content">
                <b-button type="is-danger" @click="deleteAsset">Delete</b-button>
              </div>
            </div>
          </div>
        </b-modal>
        <!-- <v-dialog
        v-model="deleteModalOpen"
        @click:outside="closeDeleteModal"
        width="500"
        >
            <v-card>
                <v-card-title class="headline">Are you sure?</v-card-title>
                <v-card-text>
                    This action cannot be undone
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                <v-btn
                    color="danger"
                    text
                    @click="deleteAsset"
                >
                    Delete Asset
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog> -->
    </div>

</template>

<script>
    import Dropzone from 'vue2-dropzone'
    import ThumbnailLoader from '../ThumbnailLoader.vue';
    export default {
        data() {
            return {
                deleteModalOpen: false,

                assetToDelete: {},
                filter: null,
                processingAssetUrl: false,
                failedUploads: [],
                assetUrlType: 'external',
                defaultTags: [],
                urlUpload: {
                    type: 'youtube',
                    url: ''
                },
                sortableOptions: {
                    onEnd: this.reorder,
                    filter: '.disabled',
                    handle: '.handle',
                    animation: 150
                },
                mimeTypes: [
                    {label: 'YouTube', value: 'youtube'},
                    {label: 'Vimeo', value: 'vimeo'},
                    {label: 'URL', value: 'external'},
                ],
                urlUploadModalOpen: false,
                assets: [],
                assetsToUpload: [],
                dzOptions: {
                    headers: {
                        'X-CANDY-HUB' : true,
                    }
                }
            }
        },
        mounted() {
            this.parent.assets.data.forEach(asset => {
                if (asset.tags.data) {
                    asset.tags = asset.tags.data;
                    delete asset.tags.data;
                } else {
                    asset.tags = [];
                }
                this.assets.push(asset);
            });
            this.urlUpload.type = this.mimeTypes[0].value;

            // CandyEvent.$on('variant_asset_uploaded', event => {
            //     this.assets.push(event.asset);
            // });

            // Dispatcher.add('save-media', this);

            // apiRequest.send('GET', '/tags').then(response => {
            //     response.data.forEach(tag => {
            //         this.defaultTags.push(tag);
            //     });
            // });
        },
        computed: {
            /**
             * Gets filtered results for the assets
             * @param  {string} type
             * @return {Object}
             */
            getFilteredResults() {
                if (this.filter) {
                    return this.assets.filter(asset => {
                        if (this.filter == 'images') {
                            return asset.kind == 'image';
                        } else if (this.filter == 'videos') {
                            return asset.external && asset.kind != 'image';
                        } else {
                            return asset.kind != 'image' && !asset.external;
                        }
                    });
                }
                return this.assets;
            },
        },
        props: {
            assetable: {
                type: String
            },
            parent: {
                type: Object
            },
            token: {
                type: String,
                default: null
            }
        },
        methods: {
            save() {
                const formData = new FormData;
                formData.append('assets', this.assets);
                this.$gc.assets.put({
                    assets: this.assets,
                }).then(response => {
                  this.$buefy.toast.open({
                    message: 'Assets Saved',
                    position: 'is-bottom',
                    type: 'is-success'
                  })
                    // (response);
                    // this.assets.push(response.data.data);
                });
                // this.request.send('put', '/assets', {'assets' : this.assets})
                //     .then(response => {
                //         CandyEvent.$emit('notification', {
                //             level: 'success'
                //         });
                //     });
            },
            getThumbnail(asset) {
                if (asset.thumbnail) {
                    return asset.thumbnail;
                }
                if (!asset.transforms || !asset.transforms.data.length) {
                    return false;
                }
                return _.first(asset.transforms.data).url;
            },
            uploadUrlMedia() {
                this.processingAssetUrl = true;
                // this.request.send('post', 'assets', {
                //     'url': this.urlUpload.url,
                //     'parent_id' : this.parent.id,
                //     'parent' : this.assetable,
                //     'mime_type': this.urlUpload.type
                // }).then(response => {
                //     this.processingAssetUrl = false;
                //     this.assets.push(response.data);
                //     CandyEvent.$emit('media_asset_uploaded', {
                //         asset: response.data
                //     });
                //     this.urlUpload = {};
                //     this.urlUploadModalOpen = false;
                // }).catch(response => {
                //     this.processingAssetUrl = false;
                // });
            },
            deleteAsset(event) {
                this.$gc.assets.delete(this.assetToDelete.id).then(response => {
                    this.assets.splice(this.deletedIndex, 1);
                    this.assetToDelete = {};
                    this.deletedIndex = null;
                    this.deleteModalOpen = false;
                });
            },
            reorder ({oldIndex, newIndex}) {
                const movedItem = this.assets.splice(oldIndex, 1)[0];
                this.assets.splice(newIndex, 0, movedItem);
                let pos = 1;
                this.save();
                this.assets.forEach(asset => {
                    asset.position = pos;
                    pos++;
                });
            },
            setPrimary(newPrimary) {
                this.assets.forEach(asset => {
                    if (asset.id == newPrimary.id) {
                        asset.primary = 1;
                    } else {
                        asset.primary = 0;
                    }
                });
                this.save();
            },
            getUrl(asset) {
                if (asset.kind == 'youtube') {
                    return 'https://youtube.com/embed/' + asset.url;
                } else if (asset.kind == 'vimeo') {
                    return "https://player.vimeo.com/video/" + asset.url;
                }
                return asset.url;
            },
            /**
             * Shows the delete modal for an asset
             * @param  int index
             * @return void
             */
            showDeleteModal(index) {
                this.deletedIndex = index;
                this.assetToDelete  = this.assets[index];
                this.deleteModalOpen = true;
            },
            openUrlModal() {
                this.urlUploadModalOpen = true;
            },
            closeUrlModal() {
                this.urlUploadModalOpen = false;
            },
            closeDeleteModal() {
                this.deleteModalOpen = false;
            },
            getIcon(type) {
                return '/candy-hub/icons/file-types/' + type + '.svg';
            },
            detectAssetUrlType() {
                // First clear any errors
                // this.request.clearError('url')

                let value = this.urlUpload.url;

                if (value.match(/youtube\.com/)) {
                    this.urlUpload.type = 'youtube';
                } else if (value.match(/vimeo\.com/)) {
                    this.urlUpload.type = 'youtube';
                } else {
                    this.urlUpload.type = 'external';
                }

                // Refresh selectpicker
                this.$refs.urlTypeDropdown.refresh();
            },

            /**
             * Dropzone event Methods
             */
            upload(files, response) {

                files.forEach(file => {
                    let formData = new FormData;
                    formData.append('file', file);
                    formData.append('parent_id', this.parent.id);
                    formData.append('parent', this.assetable);
                    this.$gc.assets.upload(formData, {
                        includes: 'transforms',
                    }).then(response => {
                        this.assets.push(response.data.data);
                    });
                })

                this.assetsToUpload = [];
            },
            appendParams(file, xhr, formData) {
                formData.append('parent', this.assetable);
                formData.append('parent_id', this.parent.id);
            },
            uploadError(file, response) {
                this.$refs.mediaDropzone.removeFile(file);
                this.failedUploads.push({
                    filename: file.name,
                    errors: response.file ? response.file : [response]
                });
            }
        },
        components: {
            ThumbnailLoader
        }
    }
</script>

