<script lang="ts">
  import { getContext } from 'svelte';
  import LoadingTextfield from '$lib/components/Loading/LoadingTextfield.svelte';
  import type { AuthModalState } from './state';

  const state = getContext<AuthModalState>('state');
  const { name, password } = state;
</script>

<LoadingTextfield
  bind:value={$name.value}
  error={$name.error}
  placeholder="Username"
  required
  focusOnMount
  class="block"
/>
<LoadingTextfield
  bind:value={$password.value}
  error={$password.error}
  placeholder="Password"
  required
  password
  class="block"
/>
