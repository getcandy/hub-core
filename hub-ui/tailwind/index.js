const plugin = require('tailwindcss/plugin')

const colors = require('./colors')

module.exports = plugin.withOptions(
  function() {
    return function(options) {
      const { addUtilities, addVariant, theme, e, prefix, variants } = options
    }
  },
  function(options = {}) {
    return {
      theme: {
        colors,
      },
      variants: {
      },
    }
  }
)
