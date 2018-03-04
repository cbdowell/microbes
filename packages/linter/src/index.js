module.exports = {
    extends: ['plugin:import/errors', 'prettier'],
    overrides: [
        {
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
        }
    ],
    parser: 'babel-eslint',
    plugins: ['markdown', 'import', 'prettier'],
    rules: {
        'import/no-duplicates': 2,
        'import/no-extraneous-dependencies': [
            2,
            {
                devDependencies: [
                    '**/__tests__/**',
                    '**/__mocks__/**',
                    '**/?(*.)(spec|test).js?(x)',
                    'scripts/**',
                    'eslintImportResolver.js',
                    'testSetupFile.js'
                ]
            }
        ],
        'import/order': 0,
        'no-console': 0,
        'no-unused-vars': 2,
        'prettier/prettier': [
            2,
            {
                bracketSpacing: true,
                printWidth: 80,
                proseWrap: 'always',
                singleQuote: true,
                trailingComma: 'none',
                semi: false,
                tabWidth: 4
            }
        ]
    }
}
