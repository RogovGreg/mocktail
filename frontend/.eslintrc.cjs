module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  ignorePatterns: ['*.d.ts', '*.css'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'prettier', 'simple-import-sort'],
  rules: {
    'prettier/prettier': [
      'error',
      { arrowParens: 'avoid', jsxSingleQuote: true, singleQuote: true },
    ],
    'sort-keys': [
      'warn',
      'asc',
      {
        allowLineSeparatedGroups: true,
        caseSensitive: true,
      },
    ],
    'implicit-arrow-linebreak': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'import/prefer-default-export': 0,
    'no-plusplus': 0,
    'operator-linebreak': 0,
    'simple-import-sort/imports': 'error',
    indent: 0,
    'jsx-quotes': ['warn', 'prefer-single'],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/control-has-associated-label': 0,
    'arrow-parens': ['error', 'as-needed'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-var-requires': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    'import/no-unresolved': [
      0,
      {
        commonjs: true,
      },
    ],
    'import/extensions': [
      2,
      {
        ts: 'always',
        svg: 'always',
        json: 'always',
      },
    ],
    'import/no-extraneous-dependencies': 0,
    'react/require-default-props': 0,
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['tsx'],
      },
    ],
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-props-no-spreading': 0,
    'react/jsx-curly-newline': 0,
    'object-curly-newline': [
      0,
      {
        ObjectPattern: {
          multiline: true,
          minProperties: 3,
        },
      },
    ],
    'padded-blocks': 0,
    'no-trailing-spaces': 0,
    'lines-between-class-members': 0,
    semi: 2,
    '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
    'no-shadow': 0,
    'no-use-before-define': 2,
    quotes: [
      'warn',
      'single',
      {
        avoidEscape: true,
      },
    ],
    'typescript-eslint/explicit-function-return-type': [0],
    'typescript-eslint/explicit-module-boundary-types': [0],
    'react/function-component-definition': [
      2,
      { namedComponents: 'arrow-function' },
    ],
    'react/react-in-jsx-scope': [0],
    'react/prop-types': 0,
    'react/jsx-wrap-multilines': 0,
    'react/display-name': 0,
  },
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            groups: [['^react', '^@?\\w'], ['^#'], ['^\\.\\/', '^../']],
          },
        ],
      },
    },
    {
      files: ['*Service.ts', '*Adapter.ts', '*Adapters.ts'],
      rules: {
        camelcase: 'off',
        'no-promise-executor-return': 0,
      },
    },
    {
      files: ['**/slice.ts'],
      rules: {
        'no-param-reassign': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
};
