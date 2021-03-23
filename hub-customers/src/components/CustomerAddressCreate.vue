<template>
  <form action="" @submit.prevent="save">
    <div class="columns">
      <div class="column">
        <b-field :label="$t('First name')">
          <gc-input v-model="model.firstname" required />
        </b-field>
      </div>
      <div class="column">
        <b-field :label="$t('Last name')">
          <gc-input v-model="model.lastname" required />
        </b-field>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <b-field :label="$t('Address Line 1')">
          <gc-input v-model="model.address" required />
        </b-field>
      </div>
      <div class="column">
        <b-field :label="$t('Address Line 2')">
          <gc-input v-model="model.address_two" />
        </b-field>
      </div>
      <div class="column">
        <b-field :label="$t('Address Line 3')">
          <gc-input v-model="model.address_three" />
        </b-field>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <b-field :label="$t('City')">
          <gc-input v-model="model.city" required />
        </b-field>
      </div>
      <div class="column">
        <b-field :label="$t('State')">
          <gc-input v-model="model.state" />
        </b-field>
      </div>
      <div class="column">
        <b-field :label="$t('County')">
          <gc-input v-model="model.county" />
        </b-field>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <b-field :label="$t('Zip')">
          <gc-input v-model="model.zip" />
        </b-field>
      </div>
      <div class="column">
        <b-field :label="$t('Country')">
          <gc-input v-model="model.country" />
        </b-field>
      </div>
    </div>

    <b-field :label="$t('Type')">
      <b-select v-model="type">
        <option value="shipping">{{ $t('Shipping') }}</option>
        <option value="billing">{{ $t('Billing') }}</option>
      </b-select>
    </b-field>

    <b-button :loading="processing" :disabled="processing" native-type="submit" type="is-primary">{{ $t('Add address') }}</b-button>

    <!--<div class="row">
      <div class="col-md-6">
            <div class="form-group">
                <label>Type</label>
                <select class="form-control" v-model="type">
                    <option value="shipping">Shipping</option>
                    <option value="billing">Billing</option>
                </select>
            </div>
        </div>
    </div> -->
  </form>
</template>

<script>
  const merge = require('lodash/merge')

  export default {
    props: {
      defaults: {
        type: Object,
        default: () => {}
      },
      userId: {
        type: String,
        required: true
      },
      creating: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        model: {},
        processing: false,
        type: 'shipping'
      }
    },
    mounted () {
      this.model = this.baseModel
    },
    computed: {
      baseModel () {
        return merge({
          firstname: '',
          lastname: '',
          address: '',
          address_two: '',
          address_three: '',
          city: '',
          county: '',
          state: '',
          zip: '',
          country: '',
          shipping: true,
          billing: false,
        }, this.defaults)
      }
    },
    methods: {
      resetModel() {
        this.model = this.baseModel;
      },
      save () {
        this.model.shipping = this.type === 'shipping'
        this.model.billing = this.type === 'billing'
        this.model.user_id = this.userId

        if (this.creating) {
          this.$gc.addresses.create(this.model).then((response) => {
            this.$buefy.toast.open({
              message: this.$t('Address added'),
              position: 'is-bottom',
              type: 'is-success'
            })
            this.$emit('created', response.data.data)
          }).catch(err => {
          }).finally(() => this.processing = false)
        } else {
          this.$gc.addresses.update(this.model.id, this.model).then((response) => {
            this.$buefy.toast.open({
              message: this.$t('Address updated'),
              position: 'is-bottom',
              type: 'is-success'
            })
            this.$emit('updated', response.data.data)
          }).finally(() => this.processing = false)
        }
        this.resetModel();
      }
    }
  }
</script>
