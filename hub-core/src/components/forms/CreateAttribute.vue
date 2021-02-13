<template>
  <form class="p-6" action="" @submit.prevent="submit">
    <div class="mb-4">
      <gc-form-field :label="$t('Name')" required :error="getFirstFormError('name')">
        <gc-input
          v-model="name"
          :placeholder="$t('The display name of the attribute')"
          required
        />
      </gc-form-field>
    </div>
    <div class="mb-4">
      <gc-form-field :label="$t('Handle')" :instructions="$t('This should be a unique handle to reference your attribute')" required :error="getFirstFormError('handle')">
        <gc-input
          v-model="handle"
          :placeholder="$t('The display name of the attribute')"
        />
      </gc-form-field>
    </div>
    <div class="mb-4">
      <header class="mb-2 text-sm">
        <label class="font-bold text-gray-700 block">{{ $t('Type') }}</label>
      </header>
      <div>
        <gc-select-input v-model="type">
          <option value="text">
            {{ $t('Text') }}
          </option>
          <option value="textarea">
            {{ $t('Textarea') }}
          </option>
          <option value="richtext">
            {{ $t('Richtext') }}
          </option>
          <option value="select">
            {{ $t('Select') }}
          </option>
          <option value="checkbox">
            {{ $t('Checkbox') }}
          </option>
          <option value="date">
            {{ $t('Date') }}
          </option>
          <option value="time">
            {{ $t('Time') }}
          </option>
          <option value="checkbox_group">
            {{ $t('Checkbox Group') }}
          </option>
          <option value="radio_group">
            {{ $t('Radio Group') }}
          </option>
          <option value="toggle">
            {{ $t('Toggle') }}
          </option>
          <option value="multiselect">
            {{ $t('Multiselect') }}
          </option>
        </gc-select-input>
      </div>
    </div>
    <div class="mb-4">
      <header class="mb-2 text-sm">
        <label class="font-bold text-gray-700 block">{{ $t('Attribute Group') }}</label>
      </header>
      <div>
        <gc-select-input v-model="groupId">
          <option v-for="(group, index) in attributeGroups" :key="index" :value="group.id">
            {{ getLocaleValue(group.name) }}
          </option>
        </gc-select-input>
      </div>
    </div>
    <footer>
      <gc-button type="submit">
        {{ $t('Create attribute') }}
      </gc-button>
    </footer>
  </form>
</template>

<script>
import HasLocalisedValues from '@getcandy/hub-core/src/mixins/HasLocalisedValues'
import HandlesForms from '@getcandy/hub-core/src/mixins/HandlesForms'

export default {
  mixins: [
    HasLocalisedValues,
    HandlesForms
  ],
  props: {
    attributeGroups: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      name: null,
      handle: null,
      type: 'text',
      groupId: null
    }
  },
  computed: {
    locale () {
      return this.$store.state.core.locale
    }
  },
  methods: {
    submit () {
      this.$gc.attributes.post({
        name: {
          [this.locale]: this.name
        },
        handle: this.handle,
        type: this.type,
        group_id: this.groupId
      }).then((response) => {
        this.$buefy.toast.open({
          message: this.$t('Attribute Created'),
          position: 'is-bottom',
          type: 'is-success'
        })
        this.$router.push({
          name: 'settings-attributes-id',
          params: {
            id: response.data.data.id
          }
        })
      }).catch((error) => {
        const response = error.response
        if (response.status !== 422) {
          this.$buefy.toast.open({
            duration: 5000,
            message: this.$t('Unable to create attribute'),
            position: 'is-bottom',
            type: 'is-danger'
          })
        } else {
          this.setFormErrors(response.data)
        }
      })
    }
  }
}
</script>
