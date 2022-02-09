<ul class="menu">
	<slot />
</ul>

<style lang="postcss">
	.menu {
		@apply flex items-center;
	}

	.menu-item {
		@apply w-full flex justify-center items-center p-2 rounded-lg;
		@apply text-center text-label whitespace-nowrap;
		&:hover {
			@apply bg-shade-200;
		}
		&:active {
			@apply bg-shade-300;
		}
	}
</style>
