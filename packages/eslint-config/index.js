import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export const base = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/.turbo/**',
    ],
  },
)

export default base
