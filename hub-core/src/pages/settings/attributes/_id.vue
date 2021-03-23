<template>
  <div>
    <div class="flex px-6 py-3 text-xs font-bold text-orange-600 bg-orange-100 border-b border-orange-300" v-if="attribute.system">
      <i class="mr-2 ri-lock-line" />
      You are trying to edit a system attribute. Saving has been disabled.
    </div>
    <simple-modal heading="Permanent delete" :open="showDeleteConfirm" @confirmed="deleteAttribute" @close="showDeleteConfirm = false">
      {{ $t('Are you sure you want to delete this record? This action cannot be undone.') }}
    </simple-modal>
    <toolbar :heading="$t('Available Attributes')" :subHeading="getLocaleValue(attribute.name)">
      <div class="flex">
        <div>
          <gc-button @click="save" v-if="!attribute.system">
            {{ $t('Save changes') }}
          </gc-button>
        </div>
        <div class="ml-4" v-if="!attribute.system">
          <gc-button @click="showDeleteConfirm = true" theme="danger">
            <gc-icon icon="trash" />
          </gc-button>
        </div>
      </div>
    </toolbar>
    <div class="pb-4 bg-white shadow">
      <div class="px-6">
        <div class="py-4">
          <div>
            <basic-translate v-model="fields" :locked="attribute.system" />
          </div>
        </div>

        <div class="mb-4">
          <header class="mb-2 text-sm">
            <label class="block font-bold text-gray-700">{{ $t('Handle') }}</label>
          </header>
          <div>
            <gc-input v-model="attribute.handle" :disabled="true" />
          </div>
        </div>
        <div class="mb-4">
          <header class="mb-2 text-sm">
            <label class="block font-bold text-gray-700">{{ $t('Type') }}</label>
          </header>
          <div>
            <gc-select-input v-model="attribute.type" :disabled="attribute.system">
              <option value="text">{{ $t('Text') }}</option>
              <option value="textarea">{{ $t('Textarea') }}</option>
              <option value="richtext">{{ $t('Richtext') }}</option>
              <option value="select">{{ $t('Select') }}</option>
              <option value="checkbox">{{ $t('Checkbox') }}</option>
              <option value="date">{{ $t('Date') }}</option>
              <option value="time">{{ $t('Time') }}</option>
              <option value="checkbox_group">{{ $t('Checkbox Group') }}</option>
              <option value="radio_group">{{ $t('Radio Group') }}</option>
              <option value="toggle">{{ $t('Toggle') }}</option>
              <option value="multiselect">{{ $t('Multiselect') }}</option>
            </gc-select-input>
          </div>
        </div>
        <div class="mb-4">
          <header class="mb-2 text-sm">
            <label class="block font-bold text-gray-700">{{ $t('Attribute Group') }}</label>
          </header>
          <div>
            <gc-select-input v-model="groupId" :disabled="attribute.system">
              <option v-for="(group, index) in attributeGroups" :value="group.id" :key="index">
                {{ getLocaleValue(group.name) }}
              </option>
            </gc-select-input>
          </div>
        </div>

        <div class="flex">
          <div class="w-1/3">
            <gc-form-field :label="$t('Searchable')" :instructions="$t('Should this attribute be searchable across GetCandy?')">
              <gc-toggle v-model="attribute.searchable" :disabled="attribute.system" />
            </gc-form-field>
          </div>
          <div class="w-1/3">
            <gc-form-field :label="$t('Filterable')" :instructions="$t('Should this attribute appear in search aggregates?')">
              <gc-toggle v-model="attribute.filterable" :disabled="attribute.system" />
            </gc-form-field>
          </div>
          <div class="w-1/3">
            <gc-form-field :label="$t('Required?')" :instructions="$t('Admins editing products will not be able to leave this blank')">
              <gc-toggle v-model="attribute.required" :disabled="attribute.system" />
            </gc-form-field>
          </div>
        </div>
      </div>

      <div v-if="(['select', 'multiselect']).includes(attribute.type)">
        <header class="flex justify-between px-6 my-4">
          <h3>{{ $t('Lookups') }}</h3>
          <gc-button type="is-primary" @click="addLookup()">{{ $t('Add Lookup') }}</gc-button>
        </header>
        <div class="search-table">
          <gc-table
            :data="attribute.lookups || []"
            :columns="[
              {label: 'Label', field: 'label'},
              {label: 'Value', field: 'value'},
              {label: null, field: 'actions'},
            ]"
          >
            <template v-slot:label="{ row }">
              <gc-input v-model="row.label" />
            </template>
            <template v-slot:value="{ row }">
              <gc-input v-model="row.value" />
            </template>
            <template v-slot:actions="{ index }">
              <gc-button theme="danger" @click="removeLookup(index)">{{ $t('Remove') }}</gc-button>
            </template>
          </gc-table>
          <!-- <b-table searchable paginated :data="">
            <template slot-scope="props">
              <b-table-column field="label" :label="$t('Label')" sortable>
                <gc-input v-model="props.row.label" />
              </b-table-column>
              <b-table-column field="value" :label="$t('Value')" sortable>
                <gc-input v-model="props.row.value" />
              </b-table-column>
              <b-table-column>
                <b-button type="is-danger" @click="removeLookup(props.index)"><i class="ri-delete-bin-line"></i></b-button>
              </b-table-column>
            </template>
            <template slot="top-left">
              <b-button type="is-primary" @click="addLookup()">{{ $t('Add Lookup') }}</b-button>
            </template>
          </b-table> -->
        </div>
      </div>
      </div>
    </div>

  </div>
</template>

<script>
import { get } from 'lodash'

export default {
  layout: 'settings',
  head () {
    return {
      title: this.getLocaleValue(this.attribute.name)
    }
  },
  data () {
    return {
      lookups: [],
      showDeleteConfirm: false
    }
  },
  async asyncData ({ app, params }) {
    const response = await app.$gc.attributes.find(params.id, {
      include: 'group'
    })
    const groups = await app.$gc.attributeGroups.get({
      paginated: false
    })
    return {
      attribute: response.data.data,
      groupId: response.data.data.group.data.id,
      attributeGroups: groups.data.data,
      fields: {
        name: {
          values: response.data.data.name,
          type: 'text'
        }
      }
    }
  },
  methods: {
    getLocaleValue (data) {
      return get(data, this.locale, data.en)
    },
    removeLookup (index) {
      this.attribute.lookups.splice(index, 1)
    },
    addLookup () {
      if (!this.attribute.lookups) {
        this.$set(this.attribute, 'lookups', [])
      }
      this.attribute.lookups.push({
        label: null,
        value: null,
      })
    },
    async deleteAttribute () {
      if (this.attribute.system) {
        this.$notify.queue('error', this.$t('Unable to delete attribute'))
        return;
      }
      try {
        await this.$gc.attributes.delete(this.attribute.id)
        await this.$router.replace({
          name: 'settings-attributes'
        })
        this.$notify.queue('success', this.$t('Attribute deleted'))
      } catch (error) {
        this.$notify.queue('error', this.$t('Unable to delete attribute'))
      }
    },
    async save () {
      try {
        this.attribute.group_id = this.groupId
        await this.$gc.attributes.update(this.attribute.id, this.attribute)
        this.$notify.queue('success', this.$t('Attribute saved'))
      } catch (e) {
        this.$notify.queue('error', this.$t('Unable to save Attribute'))
      }
    }
  },
  computed: {
    locale() {
      return this.$store.state.core.locale
    }
  }
}
</script>

<style scoped>

</style>
