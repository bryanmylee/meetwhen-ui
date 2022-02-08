import type { SvelteComponent } from 'svelte';

export type NavItem = {
	preventDismiss?: true;
} & NavItemLabel &
	NavItemType;

type NavItemLabel =
	| {
			display: 'label';
			label: string;
	  }
	| {
			display: 'component';
			component: typeof SvelteComponent;
			props?: Record<string, unknown>;
	  };

type NavItemType =
	| {
			type: 'link';
			href: string;
	  }
	| {
			type: 'button';
			action: () => void;
	  };
