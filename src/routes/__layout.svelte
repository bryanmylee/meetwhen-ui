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
  import { isLoadingApi, primaryColorCssVars, activeMeeting, APP_ROOT_ID } from '$lib/app-state';
  import PageTransition from '$lib/components/PageTransition.svelte';
  import Nav from '$lib/components/Nav/Nav.svelte';
  import type { Load } from '@sveltejs/kit';
  import { onMount, setContext } from 'svelte';
  import { IS_LOADING_KEY } from '$lib/components/LoadingButton.svelte';

  export let key: string;
  onMount(() => {
    useScreenHeight();
  });

  setContext(IS_LOADING_KEY, isLoadingApi);
</script>

<div id={APP_ROOT_ID} class="contents" style={$primaryColorCssVars}>
  <main class="mt-14">
    <PageTransition {key}>
      <slot />
    </PageTransition>
  </main>

  <Nav {key} />
</div>
