module.exports = {
	root: true,
	extends: ["eslint:recommended", "plugin:promise/recommended", "plugin:prettier/recommended"],
	plugins: ["@typescript-eslint", "jest", "promise", "import", "prettier"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	overrides: [
		{
			files: ["**/?(*.)+(spec|test).[jt]s?(x)"],
			extends: ["plugin:jest/recommended"],
			rules: {
				"jest/no-disabled-tests": "off",
			},
		},
		{
			extends: [
				"plugin:@typescript-eslint/recommended",
				"plugin:@typescript-eslint/recommended-requiring-type-checking",
			],
			files: ["*.ts", "*.tsx"],
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: ["./tsconfig.json"],
			},
		},
	],
	rules: {
		"no-console": "off",
		"prettier/prettier": "error",
		"import/prefer-default-export": "off",
		"import/no-default-export": "off",
		"arrow-body-style": "off",
		"@typescript-eslint/ban-ts-ignore": "off",
		"@typescript-eslint/ban-ts-comment": "off",
		"no-use-before-define": [
			"error",
			{
				functions: false,
				classes: true,
				variables: true,
			},
		],
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/no-use-before-define": [
			"error",
			{
				functions: false,
				classes: true,
				variables: true,
				typedefs: true,
			},
		],
		"import/no-extraneous-dependencies": "off",
	},
	env: {
		node: true,
		es2021: true,
		jest: true,
	},
};
