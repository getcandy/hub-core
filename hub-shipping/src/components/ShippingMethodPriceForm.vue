<template>
  <form action="" class="text-sm" v-if="price">
    <fieldset class="px-3">
      <div class="mt-4">
        <header class="mb-1 font-bold text-gray-700 text-sm">
          <label>{{ $t('Rate') }}</label>
        </header>
        <div>
         <price-field v-model="price.rate" />
        </div>
      </div>
      <div class="mt-4">
        <header class="mb-1 font-bold text-gray-700 text-sm">
          <label>{{ $t('Min. Basket') }}</label>
          <p class="text-gray-600 leading-tight text-xs font-normal">{{ $t('The minimum basket subtotal to qualify for this rate') }}</p>
        </header>
        <div>
          <price-field v-model="price.min_basket" />
        </div>
      </div>
      <div class="mt-4">
        <header class="mb-1 font-bold text-gray-700 text-sm">
          <label>{{ $t('Currency') }}</label>
        </header>
        <div>
          <select-input :placeholder="$t('Select a currency')" v-model="price.currency.data">
            <option
                v-for="option in currencies"
                :value="option"
                :key="option.id">
                {{ option.name }}
            </option>
          </select-input>
        </div>
      </div>
      <div class="flex mt-4">
        <div class="w-1/2 pr-1">
          <header class="mb-1 font-bold text-gray-700 text-sm">
            <label>{{ $t('Min Height') }}</label>
          </header>
          <div>
          <grouped-input v-model="price.min_height">
            <select v-model="price.height_unit" aria-label="Min Height" class="form-select h-full py-0 pl-6 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm sm:leading-5">
              <option value="cm">cm</option>
              <option value="mm">mm</option>
              <option value="in">in</option>
            </select>
          </grouped-input>
          </div>
        </div>
        <div class="w-1/2 pl-1">
          <header class="mb-1 font-bold text-gray-700 text-sm">
            <label>{{ $t('Min Width') }}</label>
          </header>
          <div>
          <grouped-input v-model="price.min_width">
            <select v-model="price.width_unit" aria-label="Min Height" class="form-select h-full py-0 pl-6 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm sm:leading-5">
              <option value="cm">cm</option>
              <option value="mm">mm</option>
              <option value="in">in</option>
            </select>
          </grouped-input>
          </div>
        </div>
      </div>
      <div class="flex mt-4">
        <div class="w-1/2 pr-1">
          <header class="mb-1 font-bold text-gray-700 text-sm">
            <label>{{ $t('Min Depth') }}</label>
          </header>
          <div>
          <grouped-input v-model="price.min_depth">
            <select v-model="price.depth_unit" aria-label="Min Height" class="form-select h-full py-0 pl-6 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm sm:leading-5">
              <option value="cm">cm</option>
              <option value="mm">mm</option>
              <option value="in">in</option>
            </select>
          </grouped-input>
          </div>
        </div>
        <div class="w-1/2 pl-1">
          <header class="mb-1 font-bold text-gray-700 text-sm">
            <label>{{ $t('Min Weight') }}</label>
          </header>
          <div>
          <grouped-input v-model="price.min_weight">
            <select v-model="price.weight_unit" aria-label="Min Weight" class="form-select h-full py-0 pl-6 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm sm:leading-5">
              <option value="lb">lb</option>
              <option value="oz">oz</option>
              <option value="kg">kg</option>
              <option value="g">g</option>
            </select>
          </grouped-input>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <header class="mb-1 font-bold text-gray-700 text-sm">
          <label>{{ $t('Min Volume') }}</label>
        </header>
        <div>
          <grouped-input v-model="price.min_volume">
          <select v-model="price.volume_unit" aria-label="Min Volume" class="form-select h-full py-0 pl-6 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm sm:leading-5">
              <option value="l">l</option>
              <option value="ml">ml</option>
          </select>
          </grouped-input>
        </div>
      </div>
    </fieldset>

      <h3 class="mx-3 text-sm uppercase font-bold text-gray-600 mt-4 mb-2">{{ $t('Customer Groups') }}</h3>
      <customer-group-manager :groups="price.customer_groups.data" :cols="['visible']"/>

    <div class="px-3 border-t mt-2 pt-4">
      <gc-button type="submit">
        {{ $t('Save price') }}
      </gc-button>
    </div>
  </form>

</template>

<script>
  import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'
  import HasCurrencies from '@getcandy/hub-core/src/mixins/HasCurrencies.js'

  export default {
    mixins: [
      NormalizesObjects,
      HasCurrencies
    ],
    props: {
      existing: {
        type: Object,
        default() {
          return {
            rate: '',
            min_basket: ''
          }
        }
      }
    },
    data () {
      return {
        price: null
      }
    },
    mounted () {
      this.price = this.normalize(this.existing)
    }
  }
</script>
