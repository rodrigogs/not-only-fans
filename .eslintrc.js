/* eslint-disable filename-rules/match */
module.exports = {
  root: true,
  env: {
    browser: false,
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'script',
  },
  extends: ['standard'],
  plugins: ['filename-rules'],
  rules: {
    'filename-rules/match': [2, 'camelcase'],
    'comma-dangle': ['error', 'always-multiline'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'generator-star-spacing': ['error', { before: false, after: true }],
    'yield-star-spacing': ['error', 'after'],
  },
  globals: {
  },
}
