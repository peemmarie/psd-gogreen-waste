import eslint from '@eslint/js'
import next from '@next/eslint-plugin-next'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import perfectionist from 'eslint-plugin-perfectionist'
import prettier from 'eslint-plugin-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import tanstack from '@tanstack/eslint-plugin-query'
import tlm from './eslint-plugin-tlm/index.mjs'

// Note: eslint-plugin-tailwindcss v3 does not fully support Tailwind CSS v4
// Uncomment when eslint-plugin-tailwindcss adds v4 support
// import tailwindPlugin from "eslint-plugin-tailwindcss";

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  // Base ESLint recommended rules
  eslint.configs.recommended,
  // Global ignores
  {
    ignores: [
      '.next/**',
      '.yarn/**',
      'out/**',
      'build/**',
      'node_modules/**',
      '*.config.js',
      '*.config.mjs',
      '.pnp.cjs',
      '.pnp.loader.mjs',
    ],
  },

  // TypeScript files configuration
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        projectService: {
          allowDefaultProject: [],
          defaultProject: 'tsconfig.json',
        },
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        React: 'readonly',
        JSX: 'readonly',
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      '@next/next': next,
      'react-hooks': reactHooks,
      perfectionist,
      prettier,
      tlm,
    },
    rules: {
      // TypeScript rules
      ...tseslint.configs.recommended.rules,

      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-console': 'error',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'func-style': ['error', 'declaration'],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],

      // Next.js rules
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,

      ...reactHooks.configs.recommended.rules,
      ...perfectionist.configs['recommended-alphabetical'].rules,
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'alphabetical',
          order: 'asc',
          fallbackSort: { type: 'unsorted' },
          ignoreCase: true,
          specialCharacters: 'keep',
          internalPattern: ['^~/.+'],
          partitionByComment: false,
          partitionByNewLine: false,
          customGroups: [
            {
              groupName: 'type-react',
              elementNamePattern: ['^react$', '^react-.+'],
              modifiers: ['type'],
            },
            {
              groupName: 'react',
              elementNamePattern: ['^react$', '^react-.+'],
            },
          ],
          groups: [
            ['type-react', 'type-builtin', 'type-external'],
            'react',
            ['builtin', 'external'],
            ['type-internal', 'type-parent', 'type-sibling', 'type-index'],
            'internal',
            ['parent', 'sibling', 'index'],
            'side-effect',
            'side-effect-style',
            'style',
            'unknown',
          ],
          environment: 'node',
        },
      ],
      'perfectionist/sort-named-imports': 'error',

      // TLM custom rules
      'tlm/component-function-order': 'warn',
    },
  },

  // JavaScript files configuration
  {
    files: ['**/*.js', '**/*.mjs'],
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'warn',
    },
  },

  // TanStack Query rules
  ...tanstack.configs['flat/recommended'],

  // Prettier config (disables conflicting rules)
  eslintConfigPrettier,
]

export default eslintConfig
