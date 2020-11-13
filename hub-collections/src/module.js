import path from 'path'

export default function (moduleOptions) {
  const templates = [
    // Store
    'store/collections.js',

    // Pages
    'pages/CollectionIndex.vue',
    'pages/edit/CollectionDetails.vue',
    'pages/edit/CollectionMedia.vue',
    'pages/edit/CollectionAvailability.vue',
    'pages/edit/CollectionAssociations.vue',
    'pages/edit/CollectionRoutes.vue',
  ];

  templates.forEach((template) => {
    this.addTemplate({
      src: path.resolve(__dirname, template),
      fileName: 'collections/' + template
    })
  })

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options: moduleOptions
  })

  this.addLayout(path.resolve(__dirname, 'layouts/CollectionLayout.vue'), 'collection')
}

module.exports.meta = require('../package.json')
