'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var src = {
    extends: ['plugin:import/errors', 'prettier'],
    overrides: [{
        files: ['*.md'],
        rules: {
            'consistent-return': 0,
            'import/no-extraneous-dependencies': 0,
            'import/no-unresolved': 0,
            'jest/no-focused-tests': 0,
            'jest/no-identical-title': 0,
            'jest/valid-expect': 0,
            'no-undef': 0,
            'no-unused-vars': 0,
            'prettier/prettier': 0,
            'sort-keys': 0
        }
    }],
    parser: 'babel-eslint',
    plugins: ['markdown', 'import', 'prettier'],
    rules: {
        'import/no-duplicates': 2,
        'import/no-extraneous-dependencies': [2, {
            devDependencies: ['**/__tests__/**', '**/__mocks__/**', '**/?(*.)(spec|test).js?(x)', 'scripts/**', 'eslintImportResolver.js', 'testSetupFile.js']
        }],
        'import/order': 0,
        'no-console': 0,
        'no-unused-vars': 2,
        'prettier/prettier': [2, {
            bracketSpacing: true,
            printWidth: 80,
            proseWrap: 'always',
            singleQuote: true,
            trailingComma: 'none',
            semi: false,
            tabWidth: 4
        }]
    }
};
var src_1 = src.overrides;
var src_2 = src.parser;
var src_3 = src.plugins;
var src_4 = src.rules;

exports.default = src;
exports.overrides = src_1;
exports.parser = src_2;
exports.plugins = src_3;
exports.rules = src_4;
