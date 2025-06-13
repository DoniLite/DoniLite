import { includeIgnoreFile } from '@eslint/compat'
import prettierPlugin from 'eslint-plugin-prettier'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'
import withNuxt from './.nuxt/eslint.config.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

export default withNuxt(
  // includeIgnoreFile will ignore files listed in .gitignore
  includeIgnoreFile(gitignorePath),
  // Ignore components/ui folder
  {
    ignores: ['components/ui/**']
  },
  //rules for prettier conflicts
  {
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto'
        }
      ]
    }
  },

  // rules for files to lint
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue,js,mjs}'],
    // ---> Add languageOptions to configure parser for type info <---
    languageOptions: {
      parser: vueParser, // Primary parser for .vue files
      parserOptions: {
        parser: tseslint.parser, // Parser for <script> blocks
        project: true, // Use tsconfig.json for type info
        tsconfigRootDir: __dirname, // Root dir for tsconfig lookup
        extraFileExtensions: ['.vue'], // Include .vue files
        sourceType: 'module'
      }
    },
    rules: {
      // Existing rules (keeping these)
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }
      ],
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': 'off',
      'no-console': 'error',
      'no-debugger': 'error',

      // // TypeScript strictness (essential ones only)
      '@typescript-eslint/return-await': 'error', // Requires return statements to be awaited
      '@typescript-eslint/no-non-null-assertion': 'error', // Prevents using the non-null assertion operator (!)
      '@typescript-eslint/no-floating-promises': 'error', // Requires handling of Promise rejections

      // Vue-specific rules (most impactful)
      // Vue-specific rules
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/no-unused-properties': 'error',
      'vue/no-unused-vars': 'error',
      'vue/no-v-for-template-key-on-child': 'error',
      'vue/v-on-event-hyphenation': ['error', 'always'],
      'vue/no-unused-refs': 'error', // Prevents declaring unused refs
      'vue/require-explicit-emits': 'error', // Requires emits to be declared in the component options
      'vue/no-bare-strings-in-template': [
        'error',
        {
          // Forces translation of strings in templates
          allowlist: [
            '(',
            ')',
            '[',
            ']',
            '{',
            '}',
            ',',
            '.',
            '!',
            '?',
            ':',
            '-',
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '%',
            '+',
            '=',
            '*',
            '/',
            '#',
            '$',
            '&',
            '@',
            '|',
            '~',
            '^',
            ' ',
            '\t',
            '\r',
            '\n' // Allow whitespace
          ],
          attributes: {
            '/.+/': [
              'title',
              'aria-label',
              'aria-placeholder',
              'aria-roledescription',
              'aria-valuetext'
            ]
          },
          directives: ['v-text']
        }
      ],
      // General code quality (core rules)
      eqeqeq: ['error', 'always'], // Requires === and !== instead of == and !=
      curly: 'error', // Requires curly braces for all control
      'no-var': 'error', // Prevents using var, use let or const instead
      'prefer-const': 'error', // Requires const for variables that never change
      'no-param-reassign': 'error', // Prevents modifying function parameters
      'max-depth': ['error', 4] // Limits nesting depth to 4 levels
    }
  }
)
