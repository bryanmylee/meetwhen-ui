<script lang="ts">
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import LongTouchProvider from './LongTouchProvider.svelte';
	import { Button } from '$lib/input';
</script>

<Meta
	title="Utility/LongTouchProvider"
	component={LongTouchProvider}
	argTypes={{
		onTouchStart: { action: 'onTouchStart' },
		onTouchMove: { action: 'onTouchMove' },
		onTouchEnd: { action: 'onTouchEnd' },
		onLongTouchStart: { action: 'onLongTouchStart' },
		onLongTouchMove: { action: 'onLongTouchMove' },
		onLongTouchEnd: { action: 'onLongTouchEnd' },
	}}
/>

<Template let:args>
	<LongTouchProvider
		{...args}
		on:touchstart={args.onTouchStart}
		on:touchmove={args.onTouchMove}
		on:touchend={args.onTouchEnd}
		on:longtouchstart={args.onLongTouchStart}
		on:longtouchmove={args.onLongTouchMove}
		on:longtouchend={args.onLongTouchEnd}
	>
		<Button class="select-none">Touch me on a touchscreen</Button>
	</LongTouchProvider>
</Template>

<Story name="Sample button" source />
