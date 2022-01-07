<script lang="ts">
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import { Button, Textfield } from '.';
</script>

<Meta title="Input" />

<Story name="Sample form">
	<h1 class="text-xl font-bold">Sample form</h1>
	<form class="flex flex-col gap-4 mt-4 w-80">
		<Textfield label="Username" required />
		<Textfield label="Password" password />
		<Textfield label="Date of birth" disabled />
		<div class="flex gap-4">
			<Button>Log In</Button>
			<Button color="gray">Cancel</Button>
			<Button color="gray" disabled>Revoke</Button>
		</div>
		<div class="flex gap-4">
			<Button variant="outlined">Log In</Button>
			<Button variant="outlined" color="gray">Cancel</Button>
			<Button variant="outlined" color="gray" disabled>Revoke</Button>
		</div>
	</form>
</Story>
