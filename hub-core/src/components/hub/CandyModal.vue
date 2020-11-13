<template>
  <div>
    <b-modal
      :active="show"
      trap-focus
      aria-role="dialog" class="is-medium"
      aria-modal
      @close="$emit('close')"
    >
      <div class="modal-container">
        <div class="modal-heading" v-if="heading">
          {{ heading }}
        </div>
        <div class="modal-body">
          <slot />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
  export default {
    props: {
      heading: {
        type: String,
        default: false
      },
      show: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~bulma/sass/utilities/_all";

  .modal-heading {
    font-size: $size-large;
    padding-bottom:10px;
    margin-bottom:20px;
    border-bottom: 1px solid #f5f5f5;
  }
  .modal-container {
    max-width: 500px;
    background-color: white;
    padding: 40px;
    border-radius: 4px;
    margin: 0 auto;
  }
</style>
