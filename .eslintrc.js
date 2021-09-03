module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-namespace': ['warn', {
            allowDeclarations: true
        }],
        '@typescript-eslint/no-non-null-assertion': 'off'
    }
};