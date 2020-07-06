<script>
  import TextInput from '../TextInput.svelte';
  import DropdownArrow from './DropdownArrow.svelte';

  // BINDINGS
  // ========
  export let value;

  // PROPS
  // =====
  export let label;
  export let style;
</script>

<div {style}>
  <TextInput bind:value={value} {label} />
  <DropdownArrow/>
</div>

<style>
  div {
    display: grid;
    grid-template-columns: auto 3rem;
    grid-auto-rows: min-content;
  }
</style>