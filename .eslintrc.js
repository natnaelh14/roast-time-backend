module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "plugin:eslint-comments/recommended",
    "plugin:jest/recommended",
    "plugin:promise/recommended",
    "prettier"
  ],
  parser: "@typescript-eslint/parser",
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    "@typescript-eslint",
    "eslint-comments",
    "jest",
    "promise",
    "import",
    "prettier"
],
  rules: {
    "prettier/prettier": "error",
    "import/prefer-default-export": "off",
    "import/no-default-export": "error",
    "import/order": [
      'error',
      {
        "newlines-between": "never",
        groups: [
          ["builtin, external"],
          ["internal", "parent", "sibling", "index"],
        ],
      },
    ],
    "no-use-before-define": [
        "error",
        {
            "functions": false,
            "classes": true,
            "variables": true
        }
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-use-before-define": [
        "error",
        {
            "functions": false,
            "classes": true,
            "variables": true,
            "typedefs": true
        }
    ],
    "import/no-extraneous-dependencies": "off"
  },
  settings: {
    "import/parser": {
      "@typescript-eslint/parser": [".ts"],
    },
    "import/resolver": {
        "typescript": {
            "alwaysTryTypes": true,
            "project": "./tsconfig.json"
        }
    }
}
};
