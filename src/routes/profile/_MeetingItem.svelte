<script lang="ts">
  import { goto } from '$app/navigation';
  import type { ShallowMeeting } from '$lib/gql/types';
  import { onSubmitKey } from '$lib/utils/on-submit-key';
  import { getCssVars, getColorSet } from '$lib/utils/stores/colors-store';

  export let meeting: ShallowMeeting;

  const navigate = () => {
    goto(`/${meeting.slug}`);
  };

  $: colorVars = getCssVars('primary', getColorSet(meeting.color));
</script>

<li tabindex="0" style={colorVars}>
  <a
    href="/{meeting.slug}"
    class="block relative button cursor-pointer rounded-lg overflow-hidden shade"
  >
    <div class="absolute left-0 w-2 h-full bg-primary" />
    <div class="flex p-2 space-x-2 ml-2 items-center font-normal">
      <div>
        {meeting.name}&nbsp;
      </div>
    </div>
  </a>
</li>
