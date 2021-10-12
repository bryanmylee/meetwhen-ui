<script lang="ts">
	export let isGuestAuth = false;
</script>

{#if isGuestAuth}
	<div class="space-y-2">
		<p class="text-sm">
			Your account will be used for
			<span class="font-bold text-gradient-primary"> this meeting only.</span>
		</p>
		<p class="text-sm">You will not be able to track your other meetings.</p>
	</div>
{:else}
	<div class="space-y-2">
		<p class="text-sm">
			Your account can be used anywhere on
			<span class="font-bold text-gradient-primary"> meetwhen.</span>
		</p>
		<p class="text-sm">Track all your meetings in one place.</p>
	</div>
{/if}
