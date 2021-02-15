import path from 'path'

export default function (moduleOptions) {
  const templates = [
    // Categories
    'components/CategoryAssociations.vue',
    'components/CategoryBrowser.vue',
    'components/CategoryListItem.vue',
    'components/CategoryTree.vue',
    'components/CategoryCreate.vue',
    'components/ChildAssociations.vue',

    // VueX Store
    'store/categories.js',

    // Pages
    'pages/CategoryIndex.vue',
    'pages/edit/CategoryDetails.vue',
    'pages/edit/CategoryMedia.vue',
    'pages/edit/CategoryAvailability.vue',
    'pages/edit/CategoryAssociations.vue',
    'pages/edit/CategoryDisplay.vue',
    'pages/edit/CategoryRoutes.vue'
  ]

  templates.forEach((template) => {
    this.addTemplate({
      src: path.resolve(__dirname, template),
      fileName: 'categories/' + template
    })
  })

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options: moduleOptions
  })

  this.addLayout(path.resolve(__dirname, 'layouts/CategoryLayout.vue'), 'category')
}

module.exports.meta = require('../package.json')
