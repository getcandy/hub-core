import Button from './components/forms/Button.vue'
import Input from './components/forms/Input.vue'
import FormField from './components/forms/FormField.vue'
import CreateAttribute from './components/forms/CreateAttribute.vue'
import ExternalAssetUploader from './components/forms/ExternalAssetUploader.vue'
import FileUpload from './components/forms/FileUpload.vue'
import GroupedInput from './components/forms/GroupedInput.vue'
import HandleInput from './components/forms/HandleInput.vue'
import ImageUpload from './components/forms/ImageUpload.vue'
import LinkInput from './components/forms/LinkInput.vue'
import PriceField from './components/forms/PriceField.vue'
import PriceInput from './components/forms/PriceInput.vue'
import RadioCheckbox from './components/forms/RadioCheckbox.vue'
import RichText from './components/forms/RichText.vue'
import SelectInput from './components/forms/SelectInput.vue'
import SearchInput from './components/forms/SearchInput.vue'
import Toggle from './components/forms/Toggle.vue'
import YoutubeUploader from './components/forms/YoutubeUploader.vue'
import Icon from './components/Icon.vue'
import IconSprite from './components/IconSprite.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import Table from './components/Table.vue'
import TabItem from './components/TabItem.vue'
import Tabs from './components/Tabs.vue'
import ResourceNav from './components/ResourceNav.vue'
import DatePicker from './components/forms/DatePicker.vue'
import ColourPicker from './components/forms/ColourPicker.vue'
import DropDown from './components/forms/DropDown.vue'
import DropDownItem from './components/forms/DropDownItem.vue'
import UserSearch from './components/forms/UserSearch.vue'

const components = {
  button: Button,
  input: Input,
  'create-attribute': CreateAttribute,
  'external-asset-uploader': ExternalAssetUploader,
  'file-upload': FileUpload,
  'grouped-input': GroupedInput,
  'handle-input': HandleInput,
  'image-upload': ImageUpload,
  'link-input': LinkInput,
  'price-field': PriceField,
  'price-input': PriceInput,
  'radio-checkbox': RadioCheckbox,
  'rich-text': RichText,
  'select-input': SelectInput,
  'select': SelectInput,
  toggle: Toggle,
  'youtube-uploader': YoutubeUploader,
  icon: Icon,
  'icon-sprite': IconSprite,
  'loading-spinner': LoadingSpinner,
  'table': Table,
  'tab-item': TabItem,
  'tabs': Tabs,
  'resource-nav': ResourceNav,
  'form-field': FormField,
  'search-input': SearchInput,
  'date-picker': DatePicker,
  'colour-picker': ColourPicker,
  'drop-down': DropDown,
  'drop-down-item': DropDownItem,
  'user-search': UserSearch,
}

// prettier-ignore
const install = function(Vue, opts = {}) {
  Object.keys(components).forEach((key) => {
    Vue.component(`${opts.prefix || 'gc'}-${key}`, components[key])
  })
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
}
