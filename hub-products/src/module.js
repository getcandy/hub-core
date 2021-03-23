import path from 'path'

export default function (moduleOptions) {
  const templates = [
    'mixins/HasGroups.js',
    'components/EditStock.vue',
    'components/ProductSettings.vue',

    // VueX Store
    'store/product.js',
    'store/product-family.js',
    'store/listing.js',

    // Pages
    'pages/ProductIndex.vue',
    'pages/edit/ProductDetails.vue',
    'pages/edit/ProductMedia.vue',
    'pages/edit/ProductAvailability.vue',
    'pages/edit/ProductAssociations.vue',
    'pages/edit/ProductUrls.vue',
    'pages/families/ProductFamilyIndex.vue',
    'pages/families/ProductFamilyEdit.vue',
    'pages/families/ProductFamilyAttributes.vue',
    'pages/families/ProductFamilyProducts.vue',
    // 'pages/reports/ProductStockReport.vue',

    // New components
    'components/variants/VariantManager.vue',
    'components/variants/VariantTiers.vue',
    'components/variants/VariantOptions.vue',
    'components/variants/CreateVariant.vue',
    'components/variants/VariantCustomerGroupPricing.vue',
    'components/ProductAssociation.vue',
    'components/ProductTable.vue',
    'components/ProductCreate.vue',
    'components/ProductFamilyAttributeManager.vue',
    'components/ProductFamilyProductsManager.vue',

    // Locales!
    'locales/en.json',
    'locales/fr.json'
  ]

  templates.forEach((template) => {
    this.addTemplate({
      src: path.resolve(__dirname, template),
      fileName: 'products/' + template
    })
  })

  this.addLayout(path.resolve(__dirname, 'layouts/ProductFamilyLayout.vue'), 'product-family')
  this.addLayout(path.resolve(__dirname, 'layouts/ProductLayout.vue'), 'product')

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options: moduleOptions
  })
}

module.exports.meta = require('../package.json')
