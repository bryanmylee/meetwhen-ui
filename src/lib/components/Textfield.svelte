<script lang="ts">
  import { focusOnMount as focus } from '$lib/utils/use-focus-on-mount';

  export let id: string;
  $: if (id === undefined) {
    id = placeholder;
  }
  export let value = '';
  export let placeholder = '';
  export let required = false;
  export let password = false;
  export let focusOnMount = false;

  let className = '';
  export { className as class };
</script>

<div class="textfield {className}">
  {#if password}
    <input
      {id}
      type="password"
      bind:value
      {required}
      use:focus={focusOnMount}
      class:filled={value !== ''}
    />
  {:else}
    <input
      {id}
      type="text"
      bind:value
      {required}
      use:focus={focusOnMount}
      class:filled={value !== ''}
    />
  {/if}
  <label for={id}>{placeholder}</label>
</div>
