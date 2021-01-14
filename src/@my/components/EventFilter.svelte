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
    focusedIndex = allUsers.indexOf(user);
    selectedSet = selectedSet;
  }

  let focusedIndex = -1;

  function focus() {
    if (focusedIndex !== -1) return;
    focusedIndex = 0;
  }

  function blur() {
    focusedIndex = -1;
  }

  function keydown(event: KeyboardEvent) {
    const { key } = event;
    if (Object.keys(actions).includes(key)) {
      actions[key]();
      event.preventDefault();
    }
  }

  const actions = {
    ArrowUp: () => {
      if (focusedIndex > 0) focusedIndex--;
    },
    ArrowDown: () => {
      if (focusedIndex < allUsers.length - 1) focusedIndex++;
    },
    get ArrowRight() { return this['ArrowDown'] },
    get ArrowLeft() { return this['ArrowUp'] },
    ' ': () => {
      toggle(allUsers[focusedIndex]);
    },
    get Enter() { return this[' '] },
  };
</script>

<div class="p-4 bg-white card">
  <div
    tabindex=0
    on:focus={focus}
    on:blur={blur}
    on:keydown={keydown}
  />
  <h2>Find someone</h2>
  {#if allUsers.length === 0}
    Nobody's here yet...
  {:else}
    <div class="flex flex-wrap items-center text-xs space-x-2 cursor-pointer">
      {#each allUsers as user, i}
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
            ${focusedIndex === i ? 'ring ring-primary' : ''}
          `.replace(/\s\s+/g, ' ')}
          >
          {user}
        </div>
      {/each}
    </div>
  {/if}
</div>

