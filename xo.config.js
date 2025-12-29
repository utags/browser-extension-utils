/** @type {import('xo').FlatXoConfig} */
const xoConfig = [
  {
    ignores: ['build/**/*'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    space: 2,
    prettier: 'compat',
    languageOptions: {
      globals: {
        document: 'readonly',
        window: 'readonly',
        history: 'readonly',
        trustedTypes: 'readonly',
        top: 'readonly',
        chrome: 'readonly',
        browser: 'readonly',
        GM: 'readonly',
        GM_info: 'readonly',
        GM_addValueChangeListener: 'readonly',
        GM_removeValueChangeListener: 'readonly',
        GM_getValue: 'readonly',
        GM_setValue: 'readonly',
        GM_deleteValue: 'readonly',
        GM_listValues: 'readonly',
        GM_registerMenuCommand: 'readonly',
        GM_unregisterMenuCommand: 'readonly',
        GM_xmlhttpRequest: 'readonly',
        GM_setClipboard: 'readonly',
        GM_openInTab: 'readonly',
        GM_addStyle: 'readonly',
        GM_addElement: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'objectLiteralProperty',
          format: null,
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],
      camelcase: 0,
      'new-cap': 0,
      'no-global-assign': 0,
      'prefer-destructuring': 0,
      'capitalized-comments': 0,
      'import-x/extensions': 0,
      'n/file-extension-in-import': 0,
      '@typescript-eslint/prefer-nullish-coalescing': 0,
      '@typescript-eslint/prefer-optional-chain': 0,
      '@typescript-eslint/no-restricted-types': 0,
      'logical-assignment-operators': 0,
      'unicorn/prevent-abbreviations': 0,
      'unicorn/prefer-spread': 0,
      'prefer-object-spread': 0,
      'prefer-object-has-own': 0,
      'no-await-in-loop': 0,
      // '@typescript-eslint/no-unsafe-assignment': 0,
      // '@typescript-eslint/no-unsafe-return': 0,
      // '@typescript-eslint/no-unsafe-argument': 0,
    },
  },
  {
    files: ['lib/**/*.ts'],
    rules: {
      '@stylistic/indent': 0,
      '@stylistic/indent-binary-ops': 0,
    },
  },
  {
    files: ['test/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-call': 0,
      '@typescript-eslint/no-empty-function': 0,
    },
  },
]

export default xoConfig
