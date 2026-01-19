import pluginVue, { rules } from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warning",
      "@typescript-eslint/prefer-literal-enum-member": "warning"
    }
  },
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  skipFormatting,
]
