<script>
  import { isLoggedIn } from '$lib/app-state';
  $: label = $isLoggedIn ? 'Continue' : 'Continue as Guest';
</script>

<section class="flex space-x-4">
  <button type="submit" class="w-full p-3 button gradient card">{label}</button>
</section>
