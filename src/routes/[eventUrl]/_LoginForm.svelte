<script>
  import { fade, slide } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  import { TextInput } from '@/components/form';

  // BINDINGS
  // ========
  export let username;
  export let password;

  // PROPS
  // =====
  export let attempted;

  $: formValid = username.trim().length !== 0
      && password.trim().length !== 0;
</script>

<div
  class="card outline padded"
  class:error={attempted && !formValid}
  transition:slide={{duration: 500, easing: cubicOut}}
>
  <!-- Content of div with slide transitions is not masked properly on
  Safari. Therefore, implement a nice fade in after div is fully sized. -->
  <div transition:fade={{duration: 150, delay: 500}}>
    <h3>Log in</h3>
    <TextInput label="Username" bind:value={username} required {attempted} />
    <TextInput label="Password" bind:value={password}
        isPassword required {attempted} />
  </div>
</div>

<style>
  h3 {
    color: var(--text-1);
    margin: 0;
    padding: 0 5px 5px;
    font-weight: 700;
  }
</style>