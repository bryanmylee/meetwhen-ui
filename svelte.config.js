const sveltePreprocess = require('svelte-preprocess');

const preprocessOptions = {
  postcss: {
    plugins: [
      require('postcss-import')(),
      require('postcss-nested')(),
    ]
  },
};

const getPreprocess = (dev) => [
  sveltePreprocess({
    sourceMap: dev,
    ...preprocessOptions
  }),
];

module.exports = {
  preprocess: getPreprocess(false),
  getPreprocess,
};
