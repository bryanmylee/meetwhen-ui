<script>
  import Nav from '@/components/Nav.svelte';
</script>

<Nav />
<main>
  <slot />
</main>

<style>
  main {
    margin-top: var(--nav-height);
  }
</style>