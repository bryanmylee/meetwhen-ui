<script lang="ts">
  import type { ShallowMeeting } from '$lib/gql/types';

  export let meeting: ShallowMeeting;
</script>

<li>
  <a
    href={`/${meeting.slug}`}
    class="block p-3 rounded-xl text-white bg-gradient-primary bg-animate-slow hover:bg-primary-lighter hover:shadow-md-primary"
  >
    <h2 class="font-medium text-lg">
      {meeting.name}
    </h2>
  </a>
</li>
