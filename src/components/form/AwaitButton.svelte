<script>
  import Button from './Button.svelte';

  // PROPS
  // =====
  export let outline = false;
  export let alt = false;
  export let onClick;
  export let style = '';

  // STATE
  // =====
  let disabled = false;
  async function handleClick() {
    disabled = true;
    await onClick();
    disabled = false;
  }
</script>

<Button
  {style}
  {outline}
  {alt}
  {disabled}
  on:click={handleClick}
>
  <slot/>
</Button>