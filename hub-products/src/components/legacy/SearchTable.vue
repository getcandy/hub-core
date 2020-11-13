<template>
    <div>
        <!-- <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" :class="{'active' : isActive('all')}">
                <a href="#records" aria-controls="all-products" role="tab" data-toggle="tab" @click="reset()">
                    All Records
                </a>
            </li>
            <li role="presentation" v-for="(search, index) in savedSearches" :key="search.id" :class="{'active' : isActive(search)}">
                <a href="#records"  role="tab" data-toggle="tab" @click="applySavedSearch(search)">
                    {{ search.name }} <i class="fa fa-times" aria-hidden="true" @click="deleteSaved(index)"></i>
                </a>
            </li>
        </ul> -->
        <div class="row">
            <!-- <candy-exporter /> -->
            <!-- <candy-importer /> -->
        </div>
        <div class="d-flex ">
            <v-text-field @keyup="search" outlined v-model="term" placeholder="Search"></v-text-field>
            <v-btn large color="primary" type="button" class="ml-8 " @click="saveSearch()">
                <i class="fa fa-floppy-o fa-first" aria-hidden="true"></i> Save Search
            </v-btn>
        </div>
        <v-card :loading="!loaded">
            <candy-table :empty="loaded && (rows.length <= 0)">
                <template slot="cols">
                    <slot name="cols"></slot>
                </template>
                <template slot="foot" v-if="!loaded">
                    <tr>
                        <td colspan="25">
                            <div class="loading">
                                <span><i class="fa fa-sync fa-spin"></i></span>
                            </div>
                        </td>
                    </tr>
                </template>
                <template v-if="loaded">
                    <slot v-bind:default="rows"></slot>
                </template>
            </candy-table>
        </v-card>
        <div class="alert alert-danger" v-if="errors.length">
            <p v-for="error in errors" :key="error">{{ error }}</p>
        </div>
        <template v-if="loaded && rows.length">
            <div class="text-center">
                <v-pagination
                    v-model="page"
                    :length="perPage"
                    @input="changePage"
                ></v-pagination>
                <!-- <candy-table-paginate :total="totalPages" :current="page" @change="changePage"></candy-table-paginate> -->
            </div>
        </template>
    </div>
</template>

<script>
    const _ = require('lodash')

    import CandyTable from './Table.vue';
    // import CandyExporter from './Exporter';
    // import CandyImporter from './Importer';

    export default {
        components: {
            CandyTable,
            // CandyImporter,
            // CandyExporter
        },
        props: {
            type: {
                type: String,
                default: 'product',
            },
            export: {
                type: String,
                default: 'products',
            },
            includes: {
                type: String,
                default: null,
            },
            perPage: {
                type: Number,
                default: 20,
            },
        },
        data() {
            return {
                loaded: false,
                term: null,
                page: 1,
                totalPages: 1,
                errors: [],
                totalResults: 1,
                savedSearches: [],
                rows: [],
                meta: {},
            }
        },
        mounted() {
            this.search();
            const apiRequest = this.$nuxt.context.app.$axios;
            apiRequest.get(`/saved-searches/${this.type}`)
            .then(response => {
                this.savedSearches = response.data.data;
            });
        },
        methods: {
            search: _.debounce(function (){
                this.refresh();
            }, 500),
            refresh() {
                this.loaded = false;
                this.errors = [];

                const apiRequest = this.$nuxt.context.app.$axios;

                apiRequest.get('search', {
                    params: {
                        search_type: this.type,
                        page: this.page,
                        per_page: this.perPage,
                        keywords: this.term,
                        include: this.includes,
                    }
                }).then(response => {
                    this.rows = response.data.data;
                    this.meta = response.data.meta;
                    this.totalPages = this.meta.pagination.data.total_pages;
                    this.page = this.meta.pagination.data.current_page;
                    this.totalResults = this.meta.pagination.data.total;
                    this.loaded = true;
                }).catch(error => {
                    // if (error.response.data.error) {
                    //     this.errors.push(error.response.data.error.message);
                    // }
                    this.loaded = true;
                });
            },
            changePage(page) {
                this.page = page;
                this.refresh();
            },
            reset() {
                this.term = null;
                this.refresh();
            },
            deleteSaved(index) {
                let search = this.savedSearches[index];
                this.savedSearches.splice(index, 1);

                const apiRequest = this.$nuxt.context.app.$axios;

                apiRequest.delete('saved-searches/' + search.id);

                if (this.keywords == search.payload.keywords) {
                    this.keywords = '';
                }
            },
            saveSearch() {
                const apiRequest = this.$nuxt.context.app.$axios;

                apiRequest.post('/saved-searches', {
                    type: this.type,
                    name: this.term,
                    keywords: this.term
                }).then(response => {
                    this.savedSearches.push(response.data);
                });
            },
            applySavedSearch(search) {
                if (search.payload.keywords) {
                    this.term = search.payload.keywords;
                }
                this.refresh();
            },
            isActive(terms) {
                if (terms == 'all' && !this.terms) {
                    return true;
                } else if (terms.payload && this.terms == terms.payload.keywords) {
                    return true;
                }
                return false;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .loading {
        margin:2em 0;
        span {
            margin:0;
        }
        i {
            font-size:1.5em;
            display:inline-block;
        }
    }
</style>
