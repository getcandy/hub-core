<template>
    <div>
        <!-- On: "bg-indigo-600", Off: "bg-gray-200" -->
        <span @click="handleClick" role="checkbox" tabindex="0" aria-checked="false"
            :class="{
                'bg-green-500': this.value,
                'bg-gray-200': !this.value
            }"
            class="relative inline-block flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline"
        >
            <!-- On: "translate-x-5", Off: "translate-x-0" -->
            <span aria-hidden="true"
                :class="{
                    'translate-x-5': this.value,
                    'translate-x-0': !this.value
                }"
                class="inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200"></span>
        </span>
    </div>
</template>

<script>
export default {
    props: ['value'],
    methods: {
        handleClick () {
          this.$emit('input', !this.value)
          this.$emit('click')
        }
    }
}
</script>
