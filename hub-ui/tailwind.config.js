module.exports = {
  prefix: '',
  important: false,
  separator: ':',
  theme: {},
  corePlugins: {},
  plugins: [
    require('./tailwind'),
    require('@tailwindcss/ui'),
  ]
}
