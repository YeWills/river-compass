const tsEslintConfig = require('./dist/tsEslintConfig.js').default;

const commonrules = {
  // prettier 推荐配置
  'prettier/prettier': 'error',
  'arrow-body-style': 'off',
  'prefer-arrow-callback': 'off',
  'import/no-unresolved': 0, // 提出一个解决方案 import/resolver
  'import/no-extraneous-dependencies': 0,
  'import/no-default-export': 0,
  'import/prefer-default-export': 0,
  'import/extensions': 0, // 待研究 import { buttonKeys } from '@/route/packagecard/router';
  'react/display-name': 0,
  'react/jsx-props-no-spreading': 0,
  'react/state-in-constructor': 0,
  'react/static-property-placement': 0,
  // Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
  'react/destructuring-assignment': 'off',
  'react/jsx-filename-extension': 'off',
  'react/no-array-index-key': 'warn',
  'react-hooks/rules-of-hooks': 0, // Checks rules of Hooks
  'react-hooks/exhaustive-deps': 0, // Checks deps of Hooks
  'react/require-default-props': 0,
  'react/jsx-fragments': 0,
  'react/jsx-wrap-multilines': 0,
  'react/prop-types': 0,
  'react/forbid-prop-types': 0,
  'react/sort-comp': 0,
  'react/react-in-jsx-scope': 0,
  'react/jsx-one-expression-per-line': 0,
  'react/no-unused-class-component-methods': 2,
  'generator-star-spacing': 0,
  'function-paren-newline': 0,
  'jsx-a11y/no-noninteractive-element-interactions': 0,
  'jsx-a11y/click-events-have-key-events': 0,
  'jsx-a11y/no-static-element-interactions': 0,
  'jsx-a11y/anchor-is-valid': 0,
  'sort-imports': 0,
  'class-methods-use-this': 0,
  'no-confusing-arrow': 0,
  'linebreak-style': 0,
  // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
  'no-prototype-builtins': 'off',
  'unicorn/prevent-abbreviations': 'off',
  // Conflict with prettier
  'arrow-parens': 0,
  'object-curly-newline': 0,
  'implicit-arrow-linebreak': 0,
  'operator-linebreak': 0,
  'eslint-comments/no-unlimited-disable': 0,
  'no-param-reassign': 2,
  'space-before-function-paren': 0,
  'no-unused-expressions': 0, // 待细节化
};

module.exports = {
  // extends: [require.resolve("./dist/eslint.js")],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto', // 不让prettier检测文件每行结束的格式
        singleQuote: true, // 单引号 双引号
      },
    ],
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      // plugins: ["@typescript-eslint"],
      extends: ['eslint-config-airbnb-base', 'prettier'].concat([
        'prettier/@typescript-eslint',
        'plugin:@typescript-eslint/recommended',
      ]),
      plugins: ['eslint-comments', 'prettier'],
      rules: { ...commonrules, ...tsEslintConfig },
      settings: {
        // support import modules from TypeScript files in JavaScript files
        'import/resolver': {
          node: {
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
          },
        },
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'],
        },
        'import/extensions': ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.d.ts'],
        'import/external-module-folders': [
          'node_modules',
          'node_modules/@types',
        ],
        polyfills: ['fetch', 'Promise', 'URL', 'object-assign'],
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        babelOptions: {
          presets: ['@babel/preset-env', '@babel/preset-react'].concat([
            '@babel/preset-typescript',
          ]),
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
          ],
        },
        requireConfigFile: false,
        project: './tsconfig.json',
      },
    },
    {
      files: ['*.js'],
      parser: '@babel/eslint-parser',
      plugins: ['eslint-comments', 'prettier'],
      // plugins: ["@typescript-eslint"],
      extends: ['eslint-config-airbnb-base', 'prettier'].concat([
        'plugin:react/recommended',
      ]),
      rules: { ...commonrules },
      settings: {
        // support import modules from TypeScript files in JavaScript files
        'import/resolver': {
          node: {
            extensions: ['.js', '.jsx'],
          },
        },
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'],
        },
        'import/extensions': ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.d.ts'],
        'import/external-module-folders': [
          'node_modules',
          'node_modules/@types',
        ],
        polyfills: ['fetch', 'Promise', 'URL', 'object-assign'],
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        babelOptions: {
          presets: ['@babel/preset-env', '@babel/preset-react'].concat([]),
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
          ],
        },
        requireConfigFile: false,
        project: './tsconfig.json',
      },
    },
  ],
};
