module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  ignorePatterns: ['dist/**'],
  extends: [
    // Recommended rules
    'plugin:@typescript-eslint/recommended',

    // Import plugin
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',

    // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'prettier/@typescript-eslint',

    // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/no-unresolved': 'off',
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '@api/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@config/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@libs/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@models/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@shared/**',
            group: 'external',
            position: 'after',
          },
        ],
        'newlines-between': 'always',
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
};
