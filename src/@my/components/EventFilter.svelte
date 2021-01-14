<script lang="ts">
  import { equals } from '@my/utils/set';

  export let allUsers: string[] = [];
  let allSet: Set<string> = new Set(allUsers);
  $: allUsers = [...allSet];
  $: allUsers && allUsersToSet();
  function allUsersToSet() {
    const newSet = new Set(allUsers);
    if (equals(newSet, allSet)) return;
    allSet = newSet;
  }

  export let selectedUsers: string[] = [];
  let selectedSet: Set<string> = new Set(...selectedUsers);
  $: selectedUsers = [...selectedSet];
  $: selectedUsers && selectedUsersToSet();
  function selectedUsersToSet() {
    const newSet = new Set(selectedUsers);
    if (equals(newSet, selectedSet)) return;
    selectedSet = newSet;
  }

  function toggle(user: string) {
    if (selectedSet.has(user)) {
      selectedSet.delete(user);
    } else {
      selectedSet.add(user);
    }
    selectedSet = selectedSet;
  }
</script>

<div tabindex=0 class="p-4 bg-white card focusable">
  <h2>Find someone</h2>
  {#if allUsers.length === 0}
    Nobody's here yet...
  {:else}
    <div class="flex flex-wrap items-center text-xs space-x-2 cursor-pointer">
      {#each allUsers as user}
        <div
          on:click={() => toggle(user)}
          class={`
            p-2 mt-2 bg-gray-100 rounded-full
            ${selectedSet.has(user)
            ? `
            bg-primary text-white
            hover:bg-primary-lighter shadow-md-primary
            active:bg-primary-darker active:text-white
            ` : `
            hover:bg-gray-50 hover:shadow-md
            active:bg-gray-200
            `}
          `}
          >
          {user}
        </div>
      {/each}
    </div>
  {/if}
</div>

