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
  import '$lib/dark-mode';
  import '$lib/screen-height';
  import { primaryCssVars } from '$lib/colors';
  import { queryClient } from '$lib/gql';
  import { activeMeeting } from '$lib/app-state';
  import PageTransition from '$lib/components/PageTransition.svelte';
  import Nav from '$lib/components/Nav/Nav.svelte';
  import type { Load } from '@sveltejs/kit';

  export let key: string;
</script>

<div class="contents" style={$primaryCssVars}>
  <main class="mt-14">
    <PageTransition {key}>
      <slot />
    </PageTransition>
  </main>

  <Nav {key} />
</div>
