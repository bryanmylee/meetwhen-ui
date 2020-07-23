module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  plugins: [
    'svelte3',
  ],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    indent: [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    quotes: [
      'error',
      'single',
    ],
    semi: [
      'error',
      'always',
    ],
    'import/no-extraneous-dependencies': ['off'],
    'import/prefer-default-export': ['off'],
    'no-plusplus': ['off'],
    'object-curly-newline': ['off'],
    'no-restricted-syntax': ['off'],
    'no-continue': ['off'],
    'no-use-before-define': ['off'],
    'no-return-assign': ['off'],
    'no-param-reassign': ['off'],
    'no-extra-parens': [
      'error',
      'all',
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['./'],
      },
    },
  },
};
