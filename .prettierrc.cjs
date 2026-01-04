/**
 * @type {import('prettier').Options}
 */
module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: true,
  overrides: [
    {
      files: ['*.css', '*.scss', '*.yml', 'build/**/*'],
      options: {
        singleQuote: false,
      },
    },
    {
      files: 'src/messages/*.ts',
      options: {
        printWidth: 9999,
      },
    },
    { files: '*.json', options: { parser: 'json-stringify' } },
  ],
}
