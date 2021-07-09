<script lang="ts" context="module">
  export const load: Load = ({ fetch, page }) => {
    queryClient.fetch = fetch;
    queryClient.endpoint = '/api/graphql';
    activeMeeting.set(null);
    return {
      props: {
        key: page.path,
      },
    };
  };
</script>

<script lang="ts">
  import '../app.postcss';
  import { useScreenHeight } from '$lib/utils/screen-height';
  import { queryClient } from '$lib/gql';
  import { primaryColorCssVars, activeMeeting, APP_ROOT_ID } from '$lib/app-state';
  import PageTransition from '$lib/components/PageTransition.svelte';
  import Nav from '$lib/components/Nav/Nav.svelte';
  import type { Load } from '@sveltejs/kit';
  import { onMount } from 'svelte';

  export let key: string;
  onMount(() => {
    useScreenHeight();
  });
</script>

<div id={APP_ROOT_ID} class="contents" style={$primaryColorCssVars}>
  <Nav {key} />
  <main class="mt-14">
    <PageTransition {key}>
      <slot />
    </PageTransition>
  </main>
</div>
