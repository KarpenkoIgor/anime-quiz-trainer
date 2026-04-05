import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

export default defineConfig([
  // 1. Базовые пресеты Next.js
  ...nextVitals,
  ...nextTs,

  // 2. Настройка TS-парсера (только для .ts/.tsx)
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // 3. Ваши правила
  {
    plugins: { '@stylistic': stylistic },
    rules: {
      // === ОТСТУПЫ (критично для вашей проблемы) ===
      'indent': 'off',
      '@typescript-eslint/indent': 'off',
      '@stylistic/indent': ['error', 2, { SwitchCase: 1, flatTernaryExpressions: false }],

      // === КАВЫЧКИ ===
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],

      // === Ваши оригинальные правила ===
      eqeqeq: 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      'import/prefer-default-export': 'off',
      'react/function-component-definition': 'off',
      'import/no-extraneous-dependencies': 'off',
      '@typescript-eslint/default-param-last': 'off',
      'linebreak-style': 'off',
      'react/jsx-props-no-spreading': 'off',
      'import/extensions': 'off',
      '@typescript-eslint/naming-convention': 'off',
      'no-irregular-whitespace': 'off',
      'max-classes-per-file': 'off',
      'no-plusplus': 'off',
      'prefer-rest-params': 'off',
      'default-case': 'off',
      'no-use-before-define': 'off',
      'import/no-cycle': 'warn',
      'react/jsx-filename-extension': 'off',
      'max-len': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'no-shadow': 'warn',
      'react/destructuring-assignment': 'off',
      'no-restricted-syntax': 'off',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'no-return-assign': 'warn',
      'import/order': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'no-param-reassign': 'warn',
      'import/no-duplicates': 'warn',
      'class-methods-use-this': 'off',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/alt-text': 'warn',
      'react/button-has-type': 'warn',
      'no-underscore-dangle': 'off',
      'no-await-in-loop': 'warn',
      'jsx-a11y/img-redundant-alt': 'warn',
      'no-mixed-operators': 'off',
      camelcase: 'off',
      'no-promise-executor-return': 'warn',
      'jsx-a11y/media-has-caption': 'warn',
      'consistent-return': 'warn',
      'no-nested-ternary': 'warn',
      
      '@stylistic/object-curly-newline': 'off',
      '@stylistic/object-shorthand': 'off', 
      
      'react/jsx-wrap-multilines': 'off',
      'no-restricted-globals': 'off',
      'react/require-default-props': 'warn',
      'react/no-array-index-key': 'warn',
      'react/jsx-no-bind': 'warn',
      'react/no-unstable-nested-components': 'warn',

      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/aria-role': 'off',
    },
  },

  // 4. Игноры
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'node_modules/**',
    'next-env.d.ts',
  ]),
]);