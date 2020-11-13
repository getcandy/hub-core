import './utils.css';
import Vue from 'vue';
import IconSprite from '../src/components/IconSprite.vue'
import Icon from '../src/components/Icon.vue'
import LoadingSpinner from '../src/components/LoadingSpinner.vue'


Vue.component('gc-icon-sprite', IconSprite);
Vue.component('gc-icon', Icon);
Vue.component('gc-loading-spinner', LoadingSpinner);
