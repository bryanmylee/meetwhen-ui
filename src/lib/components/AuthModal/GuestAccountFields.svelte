<script lang="ts">
  import { getContext } from 'svelte';
  import Textfield from '$lib/components/Textfield.svelte';
  import type { AuthModalState } from './state';

  const state = getContext<AuthModalState>('state');
  const { name, password } = state;
</script>

<Textfield
  bind:value={$name.value}
  error={$name.error}
  placeholder="Username"
  required
  focusOnMount
  class="block"
/>
<Textfield
  bind:value={$password.value}
  error={$password.error}
  placeholder="Password"
  required
  password
  class="block"
/>
