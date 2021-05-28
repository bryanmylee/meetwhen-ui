<script lang="ts">
  import Head from '$lib/components/Head.svelte';
  import Buttons from './_Buttons.svelte';
  import Calendar from './_Calendar.svelte';
  import Header from './_Header.svelte';
  import Template from './_Template.svelte';
</script>

<Head emoji="📘" subtitle="loading..." />

<Template>
  <svelte:fragment slot="header">
    <Header />
  </svelte:fragment>
  <svelte:fragment slot="buttons">
    <Buttons />
  </svelte:fragment>
  <svelte:fragment slot="calendar">
    <Calendar />
  </svelte:fragment>
</Template>
