<template>
    <div class="relative rounded-md shadow-sm">
        <gc-icon :icon="icon" v-if="icon" class="absolute mt-3 ml-3 text-gray-500" size="sm" />
        <input
            :value="value"
            @input="$emit('input', $event.target.value)"
            @blur="$emit('blur', $event.target.value)"
            @focus="$emit('focus', $event.target.value)"
            ref="input"
            :disabled="disabled"
            :class="{
                'pr-12': $slots.suffix,
                'pl-8': $slots.prefix || icon
            }"
            class="block w-full form-input sm:text-sm sm:leading-5 disabled:bg-gray-100"
            :type="type"
            :autocomplete="autocomplete"
            :name="name"
            :placeholder="placeholder"
            :required="required"
            :max="max"
            :step="step"
        />
        <slot name="suffix" />
    </div>
</template>

<script>
export default {
    props: {
        value: {
            default: null
        },
        type: {
            type: String,
            default: 'text'
        },
        autocomplete: {
          type: String,
          default: "off",
        },
        name: {
          type: String,
          default: null
        },
        icon: {
          type: String,
          default: null
        },
        disabled: {
          type: Boolean,
          default: false
        },
        placeholder: {
            type: String,
            default: null
        },
        required: {
          type: Boolean,
          default: false,
        },
        step: {
          type: String,
          default: null,
        },
        max: {
          type: Number|String,
          default: null
        }
    }
}
</script>
