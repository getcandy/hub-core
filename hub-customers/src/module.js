import path from 'path'


export default function (moduleOptions) {

  const templates = [
    'components/CustomerAddresses.vue',
    'components/CustomerCreate.vue',
    'components/CustomerAddressCreate.vue',
    'pages/CustomerIndex.vue',
    'pages/CustomerEdit.vue',
    'pages/CustomerDetails.vue',
    'pages/CustomerOrderHistory.vue',
  ];

  templates.forEach((template) => {
    this.addTemplate({
      src: path.resolve(__dirname, template),
      fileName: 'customers/' + template
    })
  })

  this.addLayout(path.resolve(__dirname, 'layouts/CustomerLayout.vue'), 'customer')

  this.addPlugin(path.resolve(__dirname, 'plugin.js'))
}

module.exports.meta = require('../package.json')
