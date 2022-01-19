<script lang="ts" context="module">
	export interface OAuthLoginButtonsEvent {
		click: {
			providerType: OAuthProviderType;
		};
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { AppleIcon, GoogleIcon, GithubIcon, TwitterIcon } from '$lib/icons';
	import type { OAuthProviderType } from '../providers';

	const dispatch = createEventDispatcher<OAuthLoginButtonsEvent>();
</script>

<div class="grid grid-cols-4 gap-4">
	<button
		on:click={() => dispatch('click', { providerType: 'google' })}
		aria-label="Sign in with Google"
		class="google"
	>
		<GoogleIcon />
	</button>
	<button
		on:click={() => dispatch('click', { providerType: 'apple' })}
		aria-label="Sign in with Apple"
		class="apple"
	>
		<AppleIcon />
	</button>
	<button
		on:click={() => dispatch('click', { providerType: 'twitter' })}
		aria-label="Sign in with Twitter"
		class="twitter"
	>
		<TwitterIcon />
	</button>
	<button
		on:click={() => dispatch('click', { providerType: 'github' })}
		aria-label="Sign in with Github"
		class="github"
	>
		<GithubIcon />
	</button>
</div>

<style lang="postcss">
	button {
		@apply h-10 rounded-lg p-2;
		@apply flex justify-start items-center gap-2;
		@apply text-sm font-semibold;
		@apply focus ring-offset-2 gdark:ring-offset-neutral-800;
		&:not(:active):hover {
			@apply opacity-80;
		}
		&:active {
			@apply opacity-50;
		}

		&.google {
			@apply bg-neutral-100 gdark:bg-neutral-700;
		}

		&.apple {
			@apply bg-black text-white;
		}

		&.twitter {
			@apply bg-[#1DA1F2] text-white;
		}

		&.github {
			@apply bg-black text-white;
		}
	}
</style>
