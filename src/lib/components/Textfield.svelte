<script lang="ts">
  import { focusOnMount as focus } from '$lib/utils/use-focus-on-mount';

  export let id: string = undefined;
  export let password = false;

  export let placeholder = '';
  export let value = '';
  export let error = '';
  export let required = false;
  export let focusOnMount = false;

  let attrs = {};
  $: {
    if (id !== undefined) {
      attrs = { ...attrs, id };
    }
    attrs = { ...attrs, type: password ? 'password' : 'text' };
  }

  let className = '';
  export { className as class };
</script>

<div class="textfield {className}">
  <input
    {...attrs}
    bind:value
    {required}
    use:focus={focusOnMount}
    class:filled={value !== ''}
    class:error={error !== ''}
  />
  <label for={id}>{placeholder}</label>
  {#if error !== ''}
    <span for={id}>{error}</span>
  {/if}
</div>
