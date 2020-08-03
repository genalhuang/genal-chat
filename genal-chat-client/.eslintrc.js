module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/prettier', '@vue/typescript'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  rules: {
    // "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-unused-component': 'off',
    'no-console': 'off',
    'no-irregular-whitespace': 'off',
    'prefer-spread': 0,
    'no-plusplus': 0,
    'max-len': 0,
    'no-underscore-dangle': 0,
    'eslint-disable-next-line': 'off',
  },
};
