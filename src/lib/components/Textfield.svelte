<script lang="ts">
  import { focusOnMount as focus } from '$lib/utils/actions/use-focus-on-mount';

  export let id: string = undefined;
  export let password = false;

  export let placeholder = '';
  export let value = '';
  export let error = '';

  export let required = false;
  export let touched = false;
  export let focusOnMount = false;

  const getIdFromTitle = (title: string) => title.toLowerCase().replace(/\s/g, '-');
  $: resolvedId = id ?? getIdFromTitle(placeholder);

  $: attrs = {
    id: resolvedId,
    type: password ? 'password' : 'text',
  };

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
    class:error={error !== '' || (required && touched)}
  />
  <label for={resolvedId}>{placeholder}</label>
  {#if error !== ''}
    <span for={resolvedId}>{error}</span>
  {/if}
</div>
