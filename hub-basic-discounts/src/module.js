import path from 'path';


export default function (moduleOptions) {

  const templates = [
    // Store
    'store/discounts.js',

    // Pages
    'pages/DiscountsIndex.vue',
    'pages/edit/DiscountDetails.vue',
    'pages/edit/DiscountSets.vue',
    'pages/edit/DiscountRewards.vue',
    'pages/edit/DiscountAvailability.vue',
    'components/DiscountCreate.vue',
  ];


  this.addLayout(path.resolve(__dirname, 'layouts/DiscountLayout.vue'), 'discount')

  templates.forEach((template) => {
    this.addTemplate({
      src: path.resolve(__dirname, template),
      fileName: 'discounts/' + template
    })
  })

  this.addPlugin(path.resolve(__dirname, 'plugin.js'))
}

module.exports.meta = require('../package.json')
