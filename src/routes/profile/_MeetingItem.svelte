<script lang="ts">
  import { isDark } from '$lib/app-state';

  import type { ShallowMeeting } from '$lib/gql/types';
  import { getCssVars, getColorSet } from '$lib/utils/stores/colors-store';

  export let meeting: ShallowMeeting;

  $: colorVars = getCssVars('primary', getColorSet(meeting.color, $isDark));
</script>

<li style={colorVars}>
  <a
    href="/{meeting.slug}"
    class="block relative button cursor-pointer rounded-lg overflow-hidden shade"
  >
    <div class="absolute left-0 w-2 h-full bg-primary" />
    <div class="flex p-2 space-x-2 ml-2 items-center font-medium">
      <div>
        {meeting.name}&nbsp;
      </div>
    </div>
  </a>
</li>
