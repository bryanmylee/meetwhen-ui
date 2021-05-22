<script lang="ts">
  export let id = '';
  export let value = '';
  export let placeholder = '';
  export let required = false;
  export let password = false;

  let className = '';
  export { className as class };
</script>

<div class="textfield {className}">
  {#if password}
    <input {id} type="password" bind:value {required} class:filled={value !== ''} />
  {:else}
    <input {id} type="text" bind:value {required} class:filled={value !== ''} />
  {/if}
  <label for={id}>{placeholder}</label>
</div>
