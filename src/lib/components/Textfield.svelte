<script lang="ts">
  export let id = '';
  export let value = '';
  export let placeholder = '';
  export let required = false;

  let className = '';
  export { className as class };
</script>

<div class={className}>
  <input {id} type="text" bind:value {required} class:filled={value !== ''} />
  <label for={id}>{placeholder}</label>
</div>

<style lang="postcss">
  div {
    @apply relative inline-block;
    & > input[type='text'] {
      @apply relative w-full p-4 pt-6 rounded-xl bg-gray-100 focusable;
      &:focus,
      &.filled {
        & + label {
          @apply text-xs -top-5 text-primary;
        }
      }
    }
    & > label {
      @apply absolute -top-2 left-0 mt-7 mb-5 mx-4 transition-all pointer-events-none;
    }
  }
</style>
