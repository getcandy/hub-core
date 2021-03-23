module.exports = {
  prefix: '',
  important: false,
  separator: ':',
  theme: {
    cursor: {
      auto: 'auto',
      default: 'default',
      pointer: 'pointer',
      wait: 'wait',
      text: 'text',
      move: 'move',
      'not-allowed': 'not-allowed',
      crosshair: 'crosshair',
      'zoom-in': 'zoom-in',
    }
  },
  corePlugins: {},
  plugins: [
    require('./tailwind'),
    require('@tailwindcss/ui'),
    require('@tailwindcss/forms'),
  ]
}
