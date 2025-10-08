import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
  },
  {
    files: ['playground/**/*'],
    rules: {
      'no-console': 'off',
    },
  },
)
