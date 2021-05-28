<script lang="ts">
  import Head from '$lib/components/Head.svelte';
  import Template from './_template.svelte';
</script>

<Head emoji="📘" subtitle="loading..." />

<Template>
  <div slot="header" class="p-4 text-white card bg-gradient-primary">test event</div>
  <div slot="buttons" class="flex space-x-4">
    <button class="w-full p-3 button shade rounded-xl">Login</button>
    <button class="w-full p-3 button gradient rounded-xl">Join as Guest</button>
  </div>
  <div slot="calendar" class="bg-green-400 flex-1" />
</Template>
