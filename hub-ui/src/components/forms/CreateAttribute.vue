<template>
  <form class="p-6" action="" @submit.prevent="submit">
    <div class="mb-4">
      <header class="mb-1 font-bold text-gray-700 text-sm">
        <label>{{ $t('Name') }}</label>
      </header>
      <div>
        <b-input
          v-model="name"
          :placeholder="$t('The display name of the attribute')"
          required
        >
        </b-input>
      </div>
    </div>
    <div class="mb-4">
      <header class="mb-2 text-sm">
        <label class="font-bold text-gray-700 block">{{ $t('Handle') }}</label>
        <p class="text-gray-600 leading-tight text-xs font-normal">{{ $t('This should be a unique handle to reference your attribute') }}</p>
      </header>
      <div>
        <b-input
          v-model="handle"
          required
        >
        </b-input>
      </div>
      <div class="text-red-500" v-if="hasFormError('handle')">
        {{ getFirstFormError('handle') }}
      </div>
    </div>
    <div class="mb-4">
      <header class="mb-2 text-sm">
        <label class="font-bold text-gray-700 block">{{ $t('Type') }}</label>
      </header>
      <div>
        <select-input v-model="type">
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
        </select-input>
      </div>
    </div>
    <div class="mb-4">
      <header class="mb-2 text-sm">
        <label class="font-bold text-gray-700 block">{{ $t('Attribute Group') }}</label>
      </header>
      <div>
        <select-input v-model="groupId">
          <option v-for="(group, index) in attributeGroups" :value="group.id" :key="index">
            {{ getLocaleValue(group.name) }}
          </option>
        </select-input>
      </div>
    </div>
        <footer>
            <button type="submit" class="justify-center rounded-md bg-purple-600 hover:bg-purple-700  px-4 py-2 text-base leading-6 font-medium text-white shadow-sm focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5">
              {{ $t('Create attribute') }}
            </button>
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
        default() {
          return []
        }
      }
    },
    data() {
      return {
        name: null,
        handle: null,
        type: 'text',
        groupId: null,
      }
    },
    methods: {
      submit(event) {
        this.$gc.attributes.post({
          name: {
            [this.locale] : this.name
          },
          handle: this.handle,
          type: this.type,
          group_id: this.groupId
        }).then(response => {
            this.$buefy.toast.open({
              message: this.$t(`Attribute Created`),
              position: 'is-bottom',
              type: 'is-success'
            })
            this.$router.push({
              name: 'settings-attributes-id',
              params: {
                id: response.data.data.id
              }
            })
        }).catch(error => {
          const response = error.response
          if (response.status != 422) {
            this.$buefy.toast.open({
                duration: 5000,
                message: this.$t(`Unable to create attribute`),
                position: 'is-bottom',
                type: 'is-danger'
            })
          } else {
            this.setFormErrors(response.data)
          }
        })
      }
    },
    computed: {
      locale() {
        return this.$store.state.core.locale
      }
    }
  }
</script>
