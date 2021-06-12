<script>
  import { session } from '$app/stores';

  $: label = $session.user === null ? 'Continue as Guest' : 'Continue';
</script>

<section class="flex space-x-4">
  <button type="submit" class="w-full p-3 rounded-full button gradient card">{label}</button>
</section>
