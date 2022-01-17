<div tabindex={0} class="help-message">
	<p><strong>Cursor keys</strong> to navigate.</p>
	<p><strong>Space</strong> to toggle.</p>
	<p>Hold <strong>Shift</strong> to select multiple.</p>
	<p>Hold <strong>Ctrl + Shift</strong> to unselect multiple.</p>
	<p><strong>Tab</strong> to continue.</p>
</div>

<style lang="postcss">
	.help-message {
		@apply focus focus-only absolute left-2 top-2 w-fit z-[100];
		@apply p-2 rounded-lg shadow-lg text-xs;
		@apply bg-shade-50;
	}
</style>
