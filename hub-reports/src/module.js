import path from 'path'

export default function (moduleOptions) {
  const templates = [
    // Pages
    'pages/ReportsIndex.vue'
  ];

  templates.forEach((template) => {
    this.addTemplate({
      src: path.resolve(__dirname, template),
      fileName: 'reports/' + template
    })
  })

  this.addPlugin(path.resolve(__dirname, 'plugin.js'))
}

module.exports.meta = require('../package.json')
