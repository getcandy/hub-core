import path from 'path';


export default function (moduleOptions) {

  const templates = [
    // Store
    'store/shippingMethods.js',
    'store/shippingZones.js',

    // Components
    'components/ShippingZoneChooser.vue',
    'components/ShippingMethodPriceForm.vue',

    // Pages
    'pages/methods/ShippingMethodsIndex.vue',
    'pages/methods/edit/ShippingMethodDetails.vue',
    'pages/methods/edit/ShippingMethodPricing.vue',
    'pages/methods/edit/ShippingMethodAvailability.vue',
    'pages/zones/ShippingZonesIndex.vue',
    'pages/zones/edit/ShippingZonesDetails.vue',
  ];

  templates.forEach((template) => {
    this.addTemplate({
      src: path.resolve(__dirname, template),
      fileName: 'shipping/' + template
    })
  })

  this.addLayout(path.resolve(__dirname, 'layouts/ShippingZoneLayout.vue'), 'shipping-zone')
  this.addLayout(path.resolve(__dirname, 'layouts/ShippingMethodLayout.vue'), 'shipping-method')


  this.addPlugin(path.resolve(__dirname, 'plugin.js'))
}

module.exports.meta = require('../package.json')
