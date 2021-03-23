import Vue from 'vue'
import HubUi from '@getcandy/hub-ui'
import Hookable from 'hable'
import VueI18n from 'vue-i18n'
import GetCandy from '@getcandy/node-client'
import Buefy from 'buefy'
import 'remixicon/fonts/remixicon.css'
import moment from 'moment'
import currency from 'currency.js'
import CandyPlugin from './getcandyhub/modules/CandyPlugin.js'
import numeral from 'numeral'

/**
 * Pages
 */
import HubIndex from './getcandyhub/pages/index.vue'
import Account from './getcandyhub/pages/Account.vue'
import ApiSettingsHandle from './getcandyhub/pages/settings/api/_handle.vue'
import AttributesIndex from './getcandyhub/pages/settings/attributes/index.vue'
import AttributesShow from './getcandyhub/pages/settings/attributes/_id.vue'
import AttributeGroupsIndex from './getcandyhub/pages/settings/attribute-groups/index.vue'
import AttributeGroupsShow from './getcandyhub/pages/settings/attribute-groups/_id.vue'
import Login from './getcandyhub/pages/Login.vue'
import ReycleBinIndex from './getcandyhub/pages/recycle-bin/index.vue'
import ReycleBinShow from './getcandyhub/pages/recycle-bin/_id.vue'
import UsersIndex from './getcandyhub/pages/users/index.vue'
import UsersShow from './getcandyhub/pages/users/_id.vue'

import ActivityLog from './getcandyhub/components/hub/ActivityLog.vue'
import AppNotification from './getcandyhub/components/hub/AppNotification.vue'
import AttributeTranslate from './getcandyhub/components/hub/AttributeTranslate.vue'
import AutoComplete from './getcandyhub/components/hub/AutoComplete.vue'
import BasicTranslate from './getcandyhub/components/hub/BasicTranslate.vue'
import Button from './getcandyhub/components/forms/Button.vue'
import CandyModal from './getcandyhub/components/hub/CandyModal.vue'
import CategorySelectorTable from './getcandyhub/components/hub/CategorySelectorTable.vue'
import ChannelManager from './getcandyhub/components/hub/ChannelManager.vue'
import ClickToCopy from './getcandyhub/components/hub/ClickToCopy.vue'
import CodeBlock from './getcandyhub/components/hub/CodeBlock.vue'
import CreateAttribute from './getcandyhub/components/forms/CreateAttribute.vue'
import CustomerGroupManager from './getcandyhub/components/hub/CustomerGroupManager.vue'
import DraftTools from './getcandyhub/components/hub/DraftTools.vue'
import EntrySidebar from './getcandyhub/components/hub/EntrySidebar.vue'
import ExternalAssetUploader from './getcandyhub/components/forms/ExternalAssetUploader.vue'
import FormField from './getcandyhub/components/forms/FormField.vue'
import GetCandyLogo from './getcandyhub/components/global/GetCandyLogo.vue'
import GetCandyStamp from './getcandyhub/components/global/GetCandyStamp.vue'
import GroupedInput from './getcandyhub/components/forms/GroupedInput.vue'
import HandleInput from './getcandyhub/components/forms/HandleInput.vue'
import ImageUpload from './getcandyhub/components/forms/ImageUpload.vue'
import Input from './getcandyhub/components/forms/Input.vue'
import LanguagePicker from './getcandyhub/components/hub/LanguagePicker.vue'
import LinkInput from './getcandyhub/components/forms/LinkInput.vue'
import LoadingSpinner from './getcandyhub/components/hub/LoadingSpinner.vue'
import LocalisedAttributes from './getcandyhub/components/hub/LocalisedAttributes.vue'
import MainNav from './getcandyhub/components/global/MainNav.vue'
import MainMenuLink from './getcandyhub/components/global/MainMenuLink.vue'
import MediaManager from './getcandyhub/components/hub/MediaManager.vue'
import PriceField from './getcandyhub/components/forms/PriceField.vue'
import PriceInput from './getcandyhub/components/forms/PriceInput.vue'
import ProductSelectorTable from './getcandyhub/components/hub/ProductSelectorTable.vue'
import QuickViewPanel from './getcandyhub/components/hub/QuickViewPanel.vue'
import RadioCheckbox from './getcandyhub/components/forms/RadioCheckbox.vue'

import RichText from './getcandyhub/components/forms/RichText.vue'
import Pagination from './getcandyhub/components/hub/Pagination.vue'
import SearchTable from './getcandyhub/components/hub/SearchTable.vue'
import SelectInput from './getcandyhub/components/forms/SelectInput.vue'
import SimpleModal from './getcandyhub/components/hub/SimpleModal.vue'
import ThumbnailLoader from './getcandyhub/components/utils/ThumbnailLoader.vue'
import Toggle from './getcandyhub/components/forms/Toggle.vue'
import Toolbar from './getcandyhub/components/toolbar/Toolbar.vue'
import TopBar from './getcandyhub/components/global/TopBar.vue'
import UrlManager from './getcandyhub/components/hub/UrlManager.vue'
import VersionHistory from './getcandyhub/components/hub/VersionHistory.vue'
import VersionRecord from './getcandyhub/components/hub/VersionRecord.vue'
import YoutubeUploader from './getcandyhub/components/forms/YoutubeUploader.vue'
import { state, mutations, actions } from './getcandyhub/store/index.js';
import UserStore from './getcandyhub/store/user.js';

Vue.use(HubUi)

Vue.component('activity-log', ActivityLog)
Vue.component('app-notification', AppNotification)
Vue.component('attribute-translate', AttributeTranslate)
Vue.component('auto-complete', AutoComplete)
Vue.component('basic-translate', BasicTranslate)
Vue.component('candy-modal', CandyModal)
Vue.component('category-selector-table', CategorySelectorTable)
Vue.component('channel-manager', ChannelManager)
Vue.component('click-to-copy', ClickToCopy)
Vue.component('code-block', CodeBlock)
Vue.component('create-attribute', CreateAttribute)
Vue.component('customer-group-manager', CustomerGroupManager)
Vue.component('draft-tools', DraftTools)
Vue.component('entry-sidebar', EntrySidebar)
Vue.component('external-asset-uploader', ExternalAssetUploader)
Vue.component('form-field', FormField)
// Vue.component('gc-button', Button)
Vue.component('pagination', Pagination)
Vue.component('get-candy-logo', GetCandyLogo)
Vue.component('get-candy-stamp', GetCandyStamp)
Vue.component('grouped-input', GroupedInput)
Vue.component('handle-input', HandleInput)
Vue.component('image-upload', ImageUpload)
Vue.component('language-picker', LanguagePicker)
Vue.component('link-input', LinkInput)
Vue.component('loading-spinner', LoadingSpinner)
Vue.component('localised-attributes', LocalisedAttributes)
Vue.component('main-nav', MainNav)
Vue.component('main-menu-link', MainMenuLink)
Vue.component('media-manager', MediaManager)
Vue.component('price-field', PriceField)
Vue.component('price-input', PriceInput)
Vue.component('product-selector-table', ProductSelectorTable)
Vue.component('quick-view-panel', QuickViewPanel)
Vue.component('radio-checkbox', RadioCheckbox)
Vue.component('rich-text', RichText)
Vue.component('search-table', SearchTable)
Vue.component('select-input', SelectInput)
Vue.component('simple-modal', SimpleModal)
Vue.component('thumbnail-loader', ThumbnailLoader)
Vue.component('toggle', Toggle)
Vue.component('toolbar', Toolbar)
Vue.component('top-bar', TopBar)
Vue.component('url-manager', UrlManager)
Vue.component('version-record', VersionRecord)
Vue.component('version-history', VersionHistory)
Vue.component('youtube-uploader', YoutubeUploader)

Vue.use(VueI18n)

var notifier = {
    pending: [],
    clear: function (index) {
      this.pending.splice(index, 1)
    },
    queue: function (level, message) {
      this.pending.push({
        level : level || 'info',
        message: message
      })
    }
  }

  const config = {
    defaultIconPack: 'remix',
    customIconPacks: {
      remix: {
        iconPrefix: 'ri-',
        sizes: {
          'default': 'is-size-5',
          'is-small': '',
          'is-medium': 'is-size-3',
          'is-large': 'is-size-1'
        },
        internalIcons: {
          search: 'search-line',
          'chevron-right': 'arrow-right-s-line',
          'chevron-left': 'arrow-left-s-line',
          'arrow-up': 'arrow-up-s-line',
          'arrow-down': 'arrow-down-s-line'
        }
      }
    }
  }

  Vue.use(Buefy, config)

  class Formatter {
    constructor (state) {
      this.state = state
    }
    date (date, format = 'YYYY/MM/DD @ hh:mma') {
      return this.dateRaw(date).format(format)
    }

    number (val, format) {
      return numeral(val).format(format || '0,0')
    }

    percent (oldVal, newVal) {
      if (!oldVal && !newVal) {
        return 0;
      }
      return this.number((newVal - oldVal) / oldVal * 100)
    }

    dateRaw (date) {
      return moment(date)
    }

    currency (value, override = null, cents = true, showSymbol = true, precision = 2) {
      // Going to allow passing value as an object, eventually we will migrate all to an object
      // so we can destructure properly. For now, we support both.
      if (typeof value === 'object' && value !== null) {
        override = value.override || override
        cents = value.cents || cents
        showSymbol = value.showSymbol || showSymbol
        precision = (value.precision === 0 || value.precision) ? value.precision : precision
        value = value.amount
      }

      let currencyInfo = this.state.core.currency

      if (override) {
        currencyInfo = override
      }

      return currency(cents ? value / 100 : value, {
        symbol: currencyInfo.format.replace('{price}', ''),
        precision,
        decimal: currencyInfo.decimal || currencyInfo.decimal_point,
        formatWithSymbol: showSymbol
      }).format()
    }

    slug (value, delimiter = '-', allowSubPaths = false) {
      const a = 'àáäâèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/,:;'
      const b = 'aaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------'
      const p = new RegExp(a.split('').join('|'), 'g');

      let slug = value.toString().toLowerCase();

      slug = slug.replace(/[^\w\-]+/g, allowSubPaths ? '/' : delimiter);
      slug = slug.replace(/\s+/g, delimiter)
          .replace(/&/g, delimiter + 'and' + delimiter)
          .replace(/^-+/, '')
          .replace(/-+$/, '');

      if (!allowSubPaths) {
          slug = slug.replace(p, c => b.charAt(a.indexOf(c)))
              .replace(/-+$/, '')
              .replace(/-+$/, '');
      }
      return slug;
    }
  }

export default async ({ app }, inject) => {
    app.$hooks = new Hookable()

    // This is a better way to inject with nuxt
    inject('gc', new GetCandy())
    inject('plugin', CandyPlugin)

    const options = <%= JSON.stringify(options, null, 2) %>

    inject('config', options)

    inject('notify', notifier)

    const store = await app.store.state
    inject('format', new Formatter(store))

    app.i18n = new VueI18n({
      locale: 'en', // store.state.locale,
      fallbackLocale: 'en',
      formatFallbackMessages: true,
      silentTranslationWarn: true, // We don't want to spam the console
      messages: {
        'en': require('~/locales/en.json'),
        'fr': require('~/locales/fr.json'),
        'de': require('~/locales/de.json')
      }
    })

    app.store.registerModule('core', {
      namespaced: false,
      state,
      mutations,
      actions
    })

    app.store.registerModule('user', {
      namespaced: true,
      UserStore
    })

    app.store.dispatch('addNavItems', {
      section: "order-processing",
      items: [
        {
          label: 'Users',
          position: 50,
          access: ['manage-users'],
          route: {
              name: 'users'
          }
        }
      ]
    })

/**
 *import ReycleBinIndex from './getcandyhub/pages/recycle-bin/index.vue'
import ReycleBinShow from './getcandyhub/pages/recycle-bin/_id.vue'
import ApiSettingsHandle from './getcandyhub/pages/api/_handle.vue'
import AttributeGroupsIndex from './getcandyhub/pages/attribute-groups/index.vue'
import AttributeGroupsShow from './getcandyhub/pages/attribute-groups/_id.vue'
import AttributesIndex from './getcandyhub/pages/attributes/index.vue'
import AttributesShow from './getcandyhub/pages/attributes/_id.vue'
import HubIndex from './getcandyhub/pages/index.vue'
 */

  app.router.addRoutes([
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/recycle-bin',
      name: 'recycle-bin',
      component: ReycleBinIndex
    },
    {
      path: '/recycle-bin/:id',
      name: 'recycle-bin-id',
      component: ReycleBinShow
    },
    {
        path: '/settings/api/:handle',
        name: 'settings-api-handle',
        component: ApiSettingsHandle
    },
    {
        path: '/settings/attribute-groups',
        name: 'settings-attribute-groups',
        component: AttributeGroupsIndex
    },
    {
        path: '/settings/attribute-groups/:id',
        name: 'settings-attribute-groups-id',
        component: AttributeGroupsShow
    },
    {
        path: '/settings/attributes',
        name: 'settings',
        component: AttributesIndex
    },
    {
        path: '/settings/attributes/:id',
        name: 'settings-attributes-id',
        component: AttributesShow
    },
    {
        path: '/users',
        name: 'users',
        component: UsersIndex,
        meta: {
          permissions: ['manage-users']
        }
    },
    {
        path: '/users/:id',
        name: 'users-id',
        component: UsersShow,
        meta: {
          permissions: ['manage-users']
        }
    },
    {
        path: '/',
        name: 'index',
        component: HubIndex
    },
    {
      path: '/account',
      name: 'account',
      component: Account
  }
  ])
}
