import path from 'path'

export default function (_moduleOptions) {
  const { nuxt } = this

  // Combine options
  const moduleOptions = {
    ...nuxt.options.hub,
    ..._moduleOptions,
    ...(nuxt.options.runtimeConfig && nuxt.options.runtimeConfig.hub)
  }

  const templates = [
    // Form components
    'components/forms/CreateAttribute.vue',
    'components/forms/ExternalAssetUploader.vue',
    'components/forms/FormField.vue',
    'components/forms/GroupedInput.vue',
    'components/forms/HandleInput.vue',
    'components/forms/ImageUpload.vue',
    'components/forms/LinkInput.vue',
    'components/forms/PriceField.vue',
    'components/forms/PriceInput.vue',
    'components/forms/RadioCheckbox.vue',
    'components/forms/RichText.vue',
    'components/forms/SelectInput.vue',
    'components/forms/YoutubeUploader.vue',
    'components/forms/Toggle.vue',
    'components/forms/Button.vue',
    'components/forms/Input.vue',

    // Global components
    'components/global/GetCandyLogo.vue',
    'components/global/GetCandyStamp.vue',
    'components/global/MainNav.vue',
    'components/global/MainMenuLink.vue',
    // 'components/global/MainNavLinkItem.vue',
    'components/global/TopBar.vue',

    // Hub components
    'components/hub/ActivityLog.vue',
    'components/hub/AppNotification.vue',
    'components/hub/AttributeTranslate.vue',
    'components/hub/AutoComplete.vue',
    'components/hub/BasicTranslate.vue',
    'components/hub/CandyModal.vue',
    'components/hub/CategorySelectorTable.vue',
    'components/hub/ChannelManager.vue',
    'components/hub/ClickToCopy.vue',
    'components/hub/CodeBlock.vue',
    'components/hub/CustomerGroupManager.vue',
    'components/hub/DraftTools.vue',
    'components/hub/EntrySidebar.vue',
    'components/hub/LanguagePicker.vue',
    'components/hub/LoadingSpinner.vue',
    'components/hub/LocalisedAttributes.vue',
    'components/hub/MediaManager.vue',
    'components/hub/ProductSelectorTable.vue',
    'components/hub/QuickViewPanel.vue',
    'components/hub/Pagination.vue',
    'components/hub/SearchTable.vue',
    'components/hub/SimpleModal.vue',
    'components/hub/UrlManager.vue',
    'components/hub/VersionHistory.vue',
    'components/hub/VersionRecord.vue',

    // Toolbar
    'components/toolbar/Toolbar.vue',

    // Utils
    'components/utils/ThumbnailLoader.vue',

    // Need to register this here as other layouts need to import

    // Layouts
    'layouts/Default.vue',

    // Recycle bin
    'pages/recycle-bin/types/ProductType.vue',

    // Users
    'pages/users/components/OrderHistory.vue',
    'pages/users/components/PurchaseHistory.vue',
    'pages/users/components/UserSpending.vue',
    'pages/users/components/UserDashboard.vue',

    // Mixins
    'mixins/HandlesForms.js',
    'mixins/HasAttributes.js',
    'mixins/HasCurrencies.js',
    'mixins/HasDrafts.js',
    'mixins/HasGroups.js',
    'mixins/HasLocalisedValues.js',
    'mixins/HubPage.js',
    'mixins/Index.js',
    'mixins/NormalizesObjects.js',

    // Store
    'store/index.js',
    'store/user.js',

    // Pages
    'pages/Login.vue',
    'pages/Account.vue',
    'pages/settings/index.vue',
    'pages/settings/api/_handle.vue',
    'pages/settings/attribute-groups/_id.vue',
    'pages/settings/attribute-groups/index.vue',
    'pages/settings/attributes/_id.vue',
    'pages/settings/attributes/index.vue',
    'pages/recycle-bin/index.vue',
    'pages/recycle-bin/_id.vue',
    'pages/users/index.vue',
    'pages/users/_id.vue',
    'pages/index.vue',

    // Modules
    'modules/CandyPlugin.js',
    'modules/HubUser.js'
  ]

  templates.forEach((template) => {
    this.addTemplate({
      src: path.resolve(__dirname, template),
      fileName: 'getcandyhub/' + template
    })
  })

  this.addLayout(path.resolve(__dirname, 'layouts/Auth.vue'), 'auth')
  this.addLayout(path.resolve(__dirname, 'layouts/Default.vue'), 'default')
  this.addLayout(path.resolve(__dirname, 'layouts/Error.vue'), 'error')
  this.addLayout(path.resolve(__dirname, 'layouts/Settings.vue'), 'settings')

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options: moduleOptions
  })
}

module.exports.meta = require('../package.json')
