<script lang="ts" context="module">
  import { get } from "svelte/store";
  import { event } from "@/state/event";
  import type Common from "@sapper/common";

  export const preload: Common.Preload = async function (this, page, session) {
    const $event = get(event);
    if (!$event.pending && $event.data == null) {
      this.redirect(301, "/");
    }
  };
</script>

<script lang="ts">
  import { goto } from "@sapper/app";
  import Loader from "@/components/Loader.svelte";
  import EventPage from "./[eventUrl]/_found.svelte";

  $: if (!$event.pending && $event.data) {
    goto($event.data.eventUrl, {
      replaceState: true,
    });
  }
</script>

<svelte:head>
  <title>meetwhen.io ⏳ creating...</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div
  class="relative flex flex-col h-screen max-w-lg p-6 pt-20 mx-auto space-y-4"
>
  <EventPage {...$event.data} />
</div>

<div
  class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50"
>
  <Loader class="w-16 h-16 text-primary" />
</div>
