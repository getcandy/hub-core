
<template>
    <div>
        <div class="columns">
            <div class="column">
                <b-field v-for="attribute in attributes" :label="attribute.name.en" :key="attribute.handle">
                    <b-input
                        v-if="(['text', 'number', 'textarea']).includes(attribute.type)"
                        :value="get(attribute.handle, 'default')"
                        @input="set(attribute.handle, $event, 'default')"
                        :required="attribute.required"
                        :type="attribute.type"
                    ></b-input>
                    <b-autocomplete
                        v-model="attributeData[attribute.handle][defaultChannel][defaultLanguage]"
                        :data="attribute.lookups"
                        :open-on-focus="true"
                        v-if="attribute.type == 'select'"
                    >
                    </b-autocomplete>
                    <b-switch
                        v-model="attributeData[attribute.handle][defaultChannel][defaultLanguage]"
                        v-if="attribute.type == 'toggle'"
                    >
                    </b-switch>
                    <rich-text v-model="attributeData[attribute.handle][defaultChannel][defaultLanguage]" v-if="attribute.type == 'richtext'" />
                </b-field>
            </div>
            <div class="column" v-if="translating">
            </div>
        </div>
        <div class="row">
            <div class="col-xs-12 form-group" :class="{
                'col-md-6': translating,
                'col-md-12': !translating,
            }">
                <v-card flat>
                    <v-card-text>
                        <v-form ref="form">
                            <div v-for="attribute in attributes" :key="attribute.handle">
                                <!-- <v-autocomplete
                                    :items="convertLookups(attribute.lookups)"
                                    outlined
                                    :label="attribute.name.en"
                                    v-model="attributeData[attribute.handle][defaultChannel][defaultLanguage]"
                                    v-if="attribute.type == 'select'"
                                ></v-autocomplete>
                                <v-textarea
                                    outlined
                                    :label="attribute.name.en"
                                    :value="get(attribute.handle, 'default')"
                                    @input="set(attribute.handle, $event, 'default')"
                                    v-if="attribute.type == 'textarea'"
                                ></v-textarea> -->
                            </div>
                        </v-form>
                    </v-card-text>
                </v-card>
            </div>
        </div>
        <!-- <div class="row" v-if="defaultChannel">
            <div class="col-xs-12">

                <hr>
                <div class="row">
                    <div class="col-xs-12 form-group" :class="{ 'col-md-6': translating }">
                        <div class="form-group" v-for="attribute in attributes" :key="attribute.handle">

                            <label :for="attribute.handle">
                                {{ attribute.name|t }} <span class="text-danger" v-if="attribute.required">*</span>
                            </label><br>

                            <span class="text-danger" v-if="getError(attribute.handle)">
                                <strong>{{ getError(attribute.handle) }}</strong>
                            </span>


                            <candy-date-picker
                                v-if="attribute.type == 'date'"
                                :value="get(attribute.handle, 'default')"
                                @input="set(attribute.handle, $event, 'default')"
                            >
                            </candy-date-picker>
                            <candy-select v-if="attribute.type == 'select'"
                                        :id="'default-'+ attribute.id"
                                        v-model="attributeData[attribute.handle][defaultChannel][defaultLanguage]"
                                        :options="attribute.lookups" :required="attribute.required">
                            </candy-select>
                            <candy-textarea v-if="attribute.type == 'textarea' || attribute.type == 'richtext'"
                                :richtext="attribute.type == 'richtext'"
                                :id="'default-'+ attribute.id"
                                :value="get(attribute.handle, 'default')"
                                @input="set(attribute.handle, $event, 'default')"
                                :required="attribute.required">
                            </candy-textarea>

                            <candy-taggable :options="defaultTags" :value="['foo', 'bar']"
                                @input="set(attribute.handle, $event, 'default')" v-if="attribute.type == 'multiselect'"></candy-taggable>

                            <div v-if="attribute.type == 'toggle'">
                                <candy-toggle :id="'default-'+ attribute.id"
                                              :value="get(attribute.handle, 'default')"
                                                @input="set(attribute.handle, $event, 'default')"
                                              :required="attribute.required">
                                </candy-toggle>
                            </div>



                            <div v-else-if="attribute.type == 'date'">



                            </div>
                            <div v-else-if="attribute.type == 'time'">



                            </div>
                            <div v-else-if="attribute.type == 'radio'">

                                <candy-radio :id="'default-'+ attribute.id"
                                             v-model="attributeData[attribute.handle]"
                                             :options="attribute.lookups" :required="attribute.required">
                                </candy-radio>
                                <span class="text-danger"
                                      v-if="getError(getValue(attribute.handle))"
                                      v-text="getError(getValue(attribute.handle))">
                                </span>

                            </div>
                            <div v-else-if="attribute.type == 'toggle'">

                                <candy-toggle :id="'default-'+ attribute.id"
                                              v-model="attributeData[attribute.handle]"
                                              :required="attribute.required">
                                </candy-toggle>
                                <span class="text-danger"
                                      v-if="getError(getValue(attribute.handle))"
                                      v-text="getError(getValue(attribute.handle))">
                                </span>

                            </div>

                        </div>

                    </div>
                    <div class="col-xs-12 col-md-6" v-if="translating">
                        <div class="form-group" v-for="attribute in attributes" :key="attribute.handle">

                            <candy-checkbox v-show="attribute.translatable && !isDefault"
                                            :id="attribute.handle"
                                            @change="useDefault"
                                            :class="{ attributecheckbox: true }"
                                            :checked="(get(attribute.handle) === null)"
                                            :originalValue="get(attribute.handle)">
                                Use Default
                            </candy-checkbox>
                            <label v-show="isDefault">&nbsp;</label>

                            <candy-input v-if="attribute.translatable && attribute.type === 'text'"
                                        :value="get(attribute.handle)"
                                        @input="set(attribute.handle, $event)"
                                        :required="attribute.required"
                                        :placeholder="(get(attribute.handle) === null ? get(attribute.handle, 'default') : '')"
                                        :disabled="(get(attribute.handle) === null || isDefault)">
                            </candy-input>
                            <candy-textarea v-if="attribute.translatable && attribute.type === 'textarea' || attribute.type == 'richtext'"
                                            :value="get(attribute.handle)"
                                            :richtext="attribute.type == 'richtext'"
                                            @input="set(attribute.handle, $event)"
                                            :required="attribute.required"
                                            :placeholder="(get(attribute.handle) === null ? get(attribute.handle, 'default') : '')"
                                            :disabled="(get(attribute.handle) === null || isDefault)">
                            </candy-textarea>
                            <candy-select v-if="attribute.translatable && attribute.type === 'select'"
                                        :value="get(attribute.handle)"
                                        @input="set(attribute.handle, $event)"
                                        :required="attribute.required"
                                        :placeholder="(get(attribute.handle) === null ? get(attribute.handle, 'default') : '')"
                                        :disabled="(get(attribute.handle) === null || isDefault)"
                                        :options="attribute.lookups">
                            </candy-select>

                            <span class="text-danger"
                                  v-if="hasError(attribute.handle)"
                                  v-text="getError(attribute.handle)">
                            </span>

                        </div>
                    </div>
                </div>

            </div>
        </div> -->
    </div>
</template>

<script>
    // import { TiptapVuetify, Heading, Bold, Italic, Strike, Underline, Code, Paragraph, BulletList, OrderedList, ListItem, Link, Blockquote, HardBreak, HorizontalRule, History } from 'tiptap-vuetify'

    export default {
        // components: {
        //     TiptapVuetify,
        // },
        data() {
            return {
                defaultLanguage: 'en',
                defaultChannel: 'webstore',
                translateLanguage: 'en',
                translateChannel: 'webstore',
                isDefault: true,
                originalData: [],
                // extensions: [
                //     History,
                //     Blockquote,
                //     Link,
                //     Underline,
                //     Strike,
                //     Italic,
                //     ListItem,
                //     BulletList,
                //     OrderedList,
                //     [Heading, {
                //         options: {
                //         levels: [1, 2, 3]
                //         }
                //     }],
                //     Bold,
                //     Code,
                //     HorizontalRule,
                //     Paragraph,
                //     HardBreak
                // ],
            }
        },
        props: {
            translating: false,
            request: {
                type: Object
            },
            channels: {
                type: Array,
                default() {
                    return [];
                }
            },
            languages: {
                type : Array
            },
            attributes: {
                type: Array
            },
            attributeData: {
                type: Object
            }
        },
        watch: {
            translateChannel: function(){
                this.isDefault = (this.defaultChannel === this.translateChannel && this.defaultLanguage === this.translateLanguage);
            },
            translateLanguage: function(){
                this.isDefault = (this.defaultChannel === this.translateChannel && this.defaultLanguage === this.translateLanguage);
            }
        },
        methods: {
            convertLookups(lookups) {
                return _.map(lookups, (lookup) => {
                    return {
                        text: lookup.label,
                        value: lookup.value,
                    }
                });
            },
            getError (mapping) {
                let messageArr = _.get(this.errors, this.attributeMap(mapping));
                return _.head(messageArr);
            },
            hasError (mapping) {
                return _.has(this.errors, this.attributeMap(mapping));
            },
            attributeMap(mapping) {
                return 'attribute_data\.'+mapping+'\.'+this.defaultChannel+'\.'+this.defaultLanguage;
            },
            useDefault (obj) {
                if (obj.checked) {
                    this.set(obj.id, null);
                } else {
                    this.set(obj.id, this.get(obj.id, 'original'));
                }
            },
            get (handle, type) {
                var channel = '';
                var language = '';
                var source = {};

                if (type === 'default') {
                    channel = this.defaultChannel;
                    language = this.defaultLanguage;
                    source = this.attributeData;
                } else if (type === 'original') {
                    channel = this.translateChannel;
                    language = this.translateLanguage;
                    source = this.originalData;
                } else {
                    channel = this.translateChannel;
                    language = this.translateLanguage;
                    source = this.attributeData;
                }

                return _.get(source, handle+'.'+channel+'.'+language);
            },
            set(handle, value, type) {

                var channel = '';
                var language = '';

                if (type === 'default') {
                    channel = this.defaultChannel;
                    language = this.defaultLanguage;
                } else {
                    channel = this.translateChannel;
                    language = this.translateLanguage;
                }

                if (!this.attributeData[handle]) {
                    this.$set(this.attributeData, handle, {});
                }
                if (!this.attributeData[handle][channel]) {
                    this.$set(this.attributeData[handle], channel, {});
                }
                this.$set(this.attributeData[handle][channel], language, value);
            }
        },
        computed: {
            errors() {
                return this.request.errors;
            }
        },
        created: function() {
            // Non Reactive Data
            this.originalData = JSON.parse(JSON.stringify(this.attributeData));
        }
    }
</script>
