import watchMedia from 'svelte-media';

const mediaQueries = {
  md: '(min-width: 768px)',
};

export const media = watchMedia(mediaQueries);
