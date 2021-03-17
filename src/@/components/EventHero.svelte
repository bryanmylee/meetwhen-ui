<script lang="ts">
  import { ShareIcon } from "svelte-feather-icons";
  import { auth } from "@/state/auth";
  import ShareModal from "@/components/ShareModal.svelte";

  export let eventName = "";

  let showModal = false;
</script>

<div
  class="flex items-center p-4 text-center text-white bg-gradient-primary card"
>
  <div class="flex-1">
    <p>
      &nbsp;{eventName}
    </p>
    {#if $auth.data}
      <p class="text-xs italic">
        Logged in as {$auth.data.username}
      </p>
    {/if}
  </div>
  <button
    class="-m-2 rounded-full button icon"
    on:click="{() => (showModal = true)}"
  >
    <ShareIcon class="p-2.5" />
  </button>
</div>

{#if showModal}
  <ShareModal on:dismiss="{() => (showModal = false)}" />
{/if}
