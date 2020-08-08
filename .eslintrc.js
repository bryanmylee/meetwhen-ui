module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  plugins: [
    'svelte3',
    'jsdoc',
  ],
  extends: ['airbnb-base'],
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
    'no-mixed-operators': ['off'],
    'no-extra-parens': [
      'error',
      'all',
    ],
    'jsdoc/check-alignment': 'warn',
    'jsdoc/check-param-names': 'warn',
    'jsdoc/check-syntax': 'warn',
    'jsdoc/check-types': 'warn',
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['./'],
      },
    },
  },
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
      rules: {
        // Issues with svelte3 and import plugin
        'import/first': ['off'],
        'import/order': ['off'],
        'import/no-mutable-exports': ['off'],
        'import/no-duplicates': ['off'],
        'no-unused-vars': ['warn'],
        'no-unused-expressions': ['warn'],
        'no-sequences': ['off'],
      },
    },
  ],
};
