<template>
    <div>
        <!-- On: "bg-indigo-600", Off: "bg-gray-200" -->
        <span @click="handleClick" role="checkbox" tabindex="0" aria-checked="false"
            :class="{
                'bg-green-500': this.value,
                'bg-gray-200': !this.value,
                'opacity-50': this.disabled,
            }"
            class="relative flex-shrink-0 inline-block h-6 transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer w-11 focus:outline-none focus:shadow-outline"
        >
            <!-- On: "translate-x-5", Off: "translate-x-0" -->
            <span aria-hidden="true"
                :class="{
                    'translate-x-5': this.value,
                    'translate-x-0': !this.value
                }"
                class="inline-block w-5 h-5 transition duration-200 ease-in-out transform bg-white rounded-full shadow"></span>
        </span>
    </div>
</template>

<script>
export default {
    props: {
      value: {
        type: String|Number,
        default: null
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    methods: {
        handleClick () {
          if (this.disabled) {
            return
          }
          this.$emit('input', !this.value)
          this.$emit('click')
        }
    }
}
</script>
