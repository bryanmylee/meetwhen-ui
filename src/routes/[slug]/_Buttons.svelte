<script lang="ts" context="module">
	export interface ButtonsEvent {
		join: never;
		edit: never;
		leave: never;
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { pageState, isUserJoined } from './_state/page';
	import { session } from '$app/stores';
	import LoadingButton from '$lib/components/Loading/LoadingButton.svelte';

	const dispatch = createEventDispatcher<ButtonsEvent>();
</script>

<div class="space-y-4">
	{#if $pageState === 'leaving'}
		<div class="p-4 card">
			<h3 class="font-medium text-center">Are you sure?</h3>
			{#if $session.user.guestOf !== null}
				<p class="text-sm text-center text-red-400">Your guest account will be deleted</p>
			{/if}
		</div>
	{/if}
	<div class="flex space-x-4">
		{#if $pageState === 'none'}
			{#if $session.user === null}
				<button
					type="button"
					on:click={() => ($pageState = 'joining')}
					class="w-full py-3 rounded-full button primary"
				>
					Join
				</button>
			{:else if $session.user !== null}
				{#if $isUserJoined}
					<button
						type="button"
						on:click={() => ($pageState = 'leaving')}
						class="w-full py-3 rounded-full button shade"
					>
						Leave
					</button>
					<button
						type="button"
						on:click={() => ($pageState = 'editing')}
						class="w-full py-3 rounded-full button primary"
					>
						Edit
					</button>
				{:else}
					<button
						type="button"
						on:click={() => ($pageState = 'joining')}
						class="w-full py-3 rounded-full button primary"
					>
						Join
					</button>
				{/if}
			{/if}
		{:else if $pageState === 'editing'}
			<LoadingButton
				type="button"
				on:click={() => ($pageState = 'none')}
				class="w-full py-3 rounded-full button shade"
			>
				Cancel
			</LoadingButton>
			<LoadingButton
				type="button"
				isPrimary
				on:click={() => dispatch('edit')}
				class="w-full py-3 rounded-full button primary"
			>
				Confirm
			</LoadingButton>
		{:else if $pageState === 'joining'}
			<LoadingButton
				type="button"
				on:click={() => ($pageState = 'none')}
				class="w-full py-3 rounded-full button shade"
			>
				Cancel
			</LoadingButton>
			<LoadingButton
				type="button"
				isPrimary
				on:click={() => dispatch('join')}
				class="w-full p-3 rounded-full button primary"
			>
				Continue
			</LoadingButton>
		{:else if $pageState === 'leaving'}
			<LoadingButton
				type="button"
				on:click={() => ($pageState = 'none')}
				class="w-full p-3 rounded-full button shade"
			>
				Cancel
			</LoadingButton>
			<LoadingButton
				type="button"
				isPrimary
				on:click={() => dispatch('leave')}
				class="w-full p-3 rounded-full button primary"
			>
				Confirm
			</LoadingButton>
		{/if}
	</div>
</div>
