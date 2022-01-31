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
	import type { OAuthProviderType } from '$lib/auth/providers';

	const dispatch = createEventDispatcher<OAuthLoginButtonsEvent>();
</script>

<div>
	<button
		on:click={() => dispatch('click', { providerType: 'google' })}
		class="google"
	>
		<GoogleIcon class="wh-6" />
		<span>Sign in with Google</span>
	</button>
	<button
		on:click={() => dispatch('click', { providerType: 'apple' })}
		class="apple"
	>
		<AppleIcon class="wh-6" />
		<span>Sign in with Apple</span>
	</button>
	<button
		on:click={() => dispatch('click', { providerType: 'twitter' })}
		aria-label="Sign in with Twitter"
		class="twitter"
	>
		<TwitterIcon class="wh-6" />
		<span>Sign in with Twitter</span>
	</button>
	<button
		on:click={() => dispatch('click', { providerType: 'github' })}
		aria-label="Sign in with Github"
		class="github"
	>
		<GithubIcon class="wh-6" />
		<span>Sign in with Github</span>
	</button>
</div>

<style lang="postcss">
	div {
		@apply flex gap-4;
		@apply md:flex-col;
	}

	button {
		@apply h-10 rounded-lg p-4 w-full;
		@apply flex justify-center items-center gap-2;
		@apply text-label;
		@apply focus ring-offset-2 gdark:ring-offset-neutral-800;
		& > span {
			@apply whitespace-nowrap sr-only md:not-sr-only;
		}

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
			& > span {
				@apply text-white;
			}
		}
		&.twitter {
			@apply bg-[#1DA1F2] text-white;
			& > span {
				@apply text-white;
			}
		}
		&.github {
			@apply bg-black text-white;
			& > span {
				@apply text-white;
			}
		}
	}
</style>
