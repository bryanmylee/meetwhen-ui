<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import LinkPreview from './LinkPreview.svelte';

	const linkPreviews = [
		{
			url: 'https://svelte.dev/tutorial/basics',
			title: 'Introduction / Basics • Svelte Tutorial',
			description: 'Introduction / Basics',
			mediaType: 'website',
			contentType: 'text/html',
			images: ['https://svelte.dev/images/twitter-thumbnail.jpg'],
			videos: [],
			favicons: ['https://svelte.dev/favicon.png'],
		},
		{
			url: 'https://github.com/',
			title: 'GitHub: Where the world builds software',
			siteName: 'GitHub',
			description:
				'GitHub is where over 73 million developers shape the future of software, together. Contribute to the open source community, manage your Git repositories, review code like a pro, track bugs and features, power your CI/CD and DevOps workflows, and secure code before you commit it.',
			mediaType: 'object',
			contentType: 'text/html',
			images: [
				'https://github.githubassets.com/images/modules/site/social-cards/github-social.png',
			],
			videos: [],
			favicons: ['https://github.githubassets.com/favicons/favicon.svg'],
		},
		{
			url: 'https://developer.mozilla.org/en-US/',
			title: 'MDN Web Docs',
			description:
				'The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.',
			mediaType: 'website',
			contentType: 'text/html',
			images: ['https://developer.mozilla.org/mdn-social-share.0ca9dbda.png'],
			videos: [],
			favicons: [
				'https://developer.mozilla.org/favicon-48x48.97046865.png',
				'https://developer.mozilla.org/apple-touch-icon.0ea0fa02.png',
			],
		},
	];
</script>

<Meta title="Page/Meeting/LinkPreview" component={LinkPreview} argTypes={{}} />

<Template let:args>
	<div class="flex gap-4 flex-wrap">
		{#each linkPreviews as preview}
			<LinkPreview
				{...preview}
				link={preview.url}
				favicon={preview.favicons[0]}
				{...args}
			/>
		{/each}
	</div>
</Template>

<Story name="Simple link preview" source />
