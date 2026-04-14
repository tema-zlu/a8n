export default {
  endOfLine: 'lf',
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 80,
  plugins: [
    'prettier-plugin-ignored',
    'prettier-plugin-tailwindcss',
    '@ianvs/prettier-plugin-sort-imports',
  ],
  tailwindStylesheet: 'src/index.css',
  tailwindFunctions: ['cn', 'cva'],
  importOrder: [
    '<BUILTIN_MODULES>',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/',
    '',
    '^[.]',
  ],
}
