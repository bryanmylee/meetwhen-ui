<script lang="ts" context="module">
  export const load: Load = async ({ page }) => {
    const { slug } = page.params;
    const meeting = get(newMeeting) ?? (await getMeetingBySlug({ slug }));
    return {
      props: { meeting },
    };
  };
</script>

<script lang="ts">
  import { get } from 'svelte/store';
  import { newMeeting } from '$lib/app-state';
  import { getMeetingBySlug } from '$lib/gql/getMeetingBySlug';
  import type { Load } from '@sveltejs/kit';
  import type { Meeting } from '$lib/gql/types/meeting';

  export let meeting: Meeting;
</script>

<p class="text-white">
  {JSON.stringify(meeting)}
</p>
