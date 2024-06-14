import pluginJs from '@eslint/js';
import pluginTs from '@typescript-eslint/eslint-plugin';
import pluginImport from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginReact from 'eslint-plugin-react';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      'import-eslint': pluginImport,
      'react-eslint': pluginReact,
      'react-refresh': reactRefresh,
      '@typescript-eslint': pluginTs,
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import-eslint/first': 'error',
      'import-eslint/newline-after-import': 'error',
      'import-eslint/no-duplicates': 'error',
      'import-eslint/consistent-type-specifier-style': ['error', 'prefer-inline'],
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-eslint/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          name: 'react-redux',
          importNames: ['useDispatch'],
          message: 'Use typed hook `useAppDispatch` instead.',
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
