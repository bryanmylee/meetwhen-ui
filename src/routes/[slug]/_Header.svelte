<script lang="ts">
  import { guestUser, modalState } from './_state/page';
  import type { ModalState } from './_state/page';

  export let name = '';

  const statesWithTextfield: ModalState[] = ['add-auth', 'add-guest'];
</script>

{#if !statesWithTextfield.includes($modalState)}
  <div class="p-4 text-white card bg-gradient-primary">
    <p class="text-lg font-medium">
      {name}&nbsp;
    </p>
    {#if $guestUser !== null}
      <p class="text-xs italic text-white">
        Logged in as guest <strong>{$guestUser.name}</strong>
      </p>
    {/if}
  </div>
{/if}
