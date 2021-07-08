<script lang="ts">
  import { focusOnMount as focus } from '$lib/utils/actions/use-focus-on-mount';

  export let id: string = undefined;
  export let password = false;

  export let value = '';
  export let placeholder = '';
  export let error = '';

  export let required = false;
  export let disabled = false;
  export let touched = false;
  export let focusOnMount = false;

  let className = '';
  export { className as class };

  const getIdFromTitle = (title: string) => title.toLowerCase().replace(/\s/g, '-');
  $: resolvedId = id ?? getIdFromTitle(placeholder);

  $: attrs = {
    id: resolvedId,
    type: password ? 'password' : 'text',
  };
</script>

<div class="textfield {className}">
  <input
    {...attrs}
    bind:value
    {required}
    {disabled}
    use:focus={focusOnMount}
    class:filled={value !== ''}
    class:error={error !== '' || (required && touched)}
  />
  <label for={resolvedId}>{placeholder}</label>
  {#if error !== ''}
    <span for={resolvedId}>{error}</span>
  {/if}
</div>
