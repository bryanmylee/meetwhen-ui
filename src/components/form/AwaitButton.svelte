<script>
  import Button from './Button.svelte';

  // PROPS
  // =====
  export let outline = false;
  export let alt = false;
  export let onClick;

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
  {outline}
  {alt}
  {disabled}
  on:click={handleClick}
>
  <slot/>
</Button>