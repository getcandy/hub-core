<template>
  <button @click="$emit('click')" class="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">
    <slot />
  </button>
</template>

<script>
export default {

}
</script>
