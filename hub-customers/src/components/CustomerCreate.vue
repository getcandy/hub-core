
<template>
  <form autocomplete="off" @submit.prevent="save" action="" class="p-3">
    <gc-form-field :label="$t('First name')">
      <gc-input v-model="customer.firstname" />
    </gc-form-field>
    <gc-form-field :label="$t('Last name')">
      <gc-input v-model="customer.lastname" />
    </gc-form-field>
    <gc-form-field :label="$t('Company name')">
      <gc-input v-model="customer.companyName" />
    </gc-form-field>
    <gc-form-field :label="$t('Contact Number')">
      <gc-input v-model="customer.contactNumber" type="tel" />
    </gc-form-field>
    <gc-form-field :label="$t('VAT No.')">
      <gc-input v-model="customer.vatNo" />
    </gc-form-field>
    <gc-form-field v-for="(field, handle) in fields" :key="handle" :label="$t(field.label)">
      <gc-input :type="field.type || 'text'" v-model="customer.fields[handle]" />
    </gc-form-field>
    <gc-button>{{ $t('Create customer') }}</gc-button>
    <!-- <div class="columns">
      <div class="column">
        <b-field :label="$t('First name')">
          <gc-input v-model="customer.firstname" />
        </b-field>
      </div>
      <div class="column">
        <b-field :label="$t('Last name')">
          <gc-input v-model="customer.lastname" />
        </b-field>
      </div>
    </div>
    <b-field :label="$t('Email')" :type="hasFormError('email') ? 'is-danger' : null" :message="getFirstFormError('email')">
      <gc-input v-model="customer.email" />
    </b-field>
    <div class="columns">
      <div class="column">
        <b-field :label="$t('Password')" :type="hasFormError('password') ? 'is-danger' : null" :message="getFirstFormError('password')">
          <gc-input type="password" v-model="customer.password" />
        </b-field>
      </div>
      <div class="column">
        <b-field :label="$t('Password confirmation')">
          <gc-input type="password" v-model="customer.password_confirmation" />
        </b-field>
      </div>
    </div>
    <b-field v-for="(field, handle) in fields" :key="handle" :label="$t(field.label)">
      <gc-input :type="field.type || 'text'" v-model="customer.fields[handle]" />
    </b-field> -->

    <!-- <b-button :loading="processing" type="is-primary" native-type="submit">{{ $t('Create & edit customer') }}</b-button> -->

      <!-- <button class="btn btn-success" @click="create = true"><i class="fa fa-plus fa-first" aria-hidden="true"></i> Add Customer</button>
      <candy-modal title="Create Customer" v-show="create" size="modal-md" @closed="create = false">
          <div slot="body">
              {{ request.getError('email') }}
              <div class="row">
                  <div class="col-md-6">
                      <div class="form-group">
                          <label for="firstnamer">First name</label>
                          <input type="text" class="form-control" id="firstnamer" v-model="customer.firstname" @input="request.clearError('firstname')">
                          <span class="text-danger" v-text="error" v-for="error in request.getError('firstname')" :key="error"></span>
                      </div>
                  </div>
                  <div class="col-md-6">
                      <div class="form-group">
                          <label for="lastname">Last name</label>
                          <input type="text" class="form-control" id="lastname" v-model="customer.lastname" @input="request.clearError('lastname')">
                          <span class="text-danger" v-text="error" v-for="error in request.getError('lastname')" :key="error"></span>
                      </div>
                  </div>
              </div>
              <div class="form-group">
                  <label for="email">Email</label>
                  <input type="text" class="form-control" id="email" v-model="customer.email" @input="request.clearError('email')">
                  <span class="text-danger" v-text="error" v-for="error in request.getError('email')" :key="error"></span>
              </div>
              <div class="row">
                  <div class="col-md-6">
                      <div class="form-group">
                          <label for="password">Password</label>
                          <input type="password" class="form-control" id="password" v-model="customer.password" @input="request.clearError('password')">
                          <span class="text-danger" v-text="error" v-for="error in request.getError('password')" :key="error"></span>
                      </div>
                  </div>
                  <div class="col-md-6">
                      <div class="form-group">
                          <label for="password_confirmation">Password Confirmation</label>
                          <input type="password" class="form-control" id="password_confirmation" v-model="customer.password_confirmation" @input="request.clearError('password')">
                      </div>
                  </div>
              </div>
                  <div class="form-group" v-for="(field, handle) in fields" :key="handle">
                      <label :for="handle">{{ field.label }}</label>
                      <input :id="handle" class="form-control" :type="field.type ? field.type : 'text'" v-model="customer.fields[handle]">
                  </div>
          </div>
          <template slot="footer">
              <button type="button" class="btn btn-primary" @click="save">Save and Continue</button>
          </template>
      </candy-modal> -->
  </form>
</template>

<script>
const each = require('lodash/each')
import HandlesForms from '@getcandy/hub-core/src/mixins/HandlesForms.js'

export default {
  mixins:[
    HandlesForms
  ],
  data() {
    return {
      create: false,
      fields: {},
      processing: false,
      customer: this.baseCustomer()
    }
  },
  mounted () {
    this.$gc.users.fields().then(response => {
      const fields = response.data.data.fields
      this.fields = fields;
      each(fields, (field, handle) => {
        this.$set(this.customer.fields, handle, null)
      })
    })
  },
  methods: {
    save () {
      this.processing = true
      this.setFormErrors({})
      this.$getcandy.on('customers', 'postCustomers',
        this.customer.firstname,
        this.customer.lastname,
        this.customer.contactNumber,
        this.customer.altContactNumber,
        this.customer.companyName,
        this.customer.vatNo,
        JSON.stringify(this.customer.fields)
      ).then((response) => {
        this.$emit('created', response.data.data)
      }).catch(err => {
        this.setFormErrors(
          err.response.data
        )
      }).finally(() => this.processing = false)
      // this.request.send('post', '/users', this.customer)
      // .then(response => {
      //     window.location = route('hub.customers.edit', response.data.id);
      // }).catch(response => {
      //     CandyEvent.$emit('notification', {
      //         level: 'error',
      //         message: 'Missing / Invalid fields'
      //     });
      // });
    },
    baseCustomer () {
      return {
        'firstname' : null,
        'lastname' : null,
        'companyName': null,
        'contactNo': null,
        'altContactNumber': null,
        'vatNo': null,
        'fields' : {},
      }
    }
  }
}
</script>
