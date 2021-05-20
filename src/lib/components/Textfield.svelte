<script lang="ts">
  export let id = '';
  export let value = '';
  export let placeholder = '';
  export let required = false;

  let className = '';
  export { className as class };
</script>

<div class="textfield {className}">
  <input {id} type="text" bind:value {required} class:filled={value !== ''} />
  <label for={id}>{placeholder}</label>
</div>
