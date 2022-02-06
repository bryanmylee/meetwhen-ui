<script lang="ts">
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import MeetingHeader from './MeetingHeader.svelte';

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

	const lorem20 = `
Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident consequuntur quam error! Cupiditate nihil quas maxime totam ullam accusantium nesciunt.
	`;

	const lorem30 = `
Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, vitae, expedita quibusdam obcaecati fuga aut, provident similique velit dicta laudantium unde deserunt deleniti tempora incidunt ea. Vel ducimus sit sed.
	`;
</script>

<Meta
	title="Page/Meeting/MeetingHeader"
	component={MeetingHeader}
	argTypes={{
		name: { control: 'text' },
		slug: { control: 'text' },
		description: { control: 'text' },
		showMoreDetails: { control: 'boolean' },
	}}
/>

<Template let:args>
	<MeetingHeader name="custom meeting" slug="my_slug" {...args} />
</Template>

<Story name="Example meeting headers" source>
	<div class="flex flex-col gap-4">
		<h1>Short name</h1>
		<MeetingHeader name="first meeting" slug="my_slug" />
		<h1>Long name</h1>
		<MeetingHeader name={lorem20} slug="my_slug" />
		<h1>Short name with description</h1>
		<MeetingHeader name="first meeting" slug="my_slug" description={lorem30} />
		<h1>Long name with description</h1>
		<MeetingHeader name={lorem20} slug="my_slug" description={lorem30} />
		<h1>Short name with links</h1>
		<MeetingHeader name="first meeting" slug="my_slug" links={linkPreviews} />
		<h1>Long name with description and links</h1>
		<MeetingHeader
			name={lorem20}
			slug="my_slug"
			description={lorem30}
			links={linkPreviews}
		/>
	</div>
</Story>

<Story name="Custom" source />

<style lang="postcss">
	h1 {
		@apply text-xl font-bold;
	}
</style>
