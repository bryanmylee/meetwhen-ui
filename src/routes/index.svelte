<script lang="ts">
  import Head from '$lib/components/Head.svelte';
  import Header from './_Header.svelte';
  import NewEvent from './_NewEvent.svelte';
  import FindEvent from './_FindEvent.svelte';
</script>

<Head />

<div class="max-w-lg p-6 mx-auto space-y-4">
  <Header />
  <NewEvent />
  <FindEvent />
</div>
