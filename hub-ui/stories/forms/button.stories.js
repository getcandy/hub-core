import GcButton from '../../src/components/forms/Button.vue';
// import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';

export default {
  title: 'Button',
  component: GcButton,
  parameters: {
    componentSubtitle: 'Handy status label',
  },
};

// export const withText = () => ({
//   render: h => <gc-button>with text</gc-button>
//   });

const themes = {
  Default: 'default',
  Green: 'green',
  Gray: 'gray',
  Danger: 'danger',
  Outline: 'outline'
}

const sizes = {
  Default: 'default',
  'X-Small': 'x-small',
  Small: 'small',
  Large: 'lg',
}

// export const Default = () => ({
//   components: { GcButton },
//   props: {
//     loading: {
//       default: boolean('loading', false)
//     },
//     text: {
//       default: text('Text', 'Hello Storybook')
//     },
//     theme: {
//       default: select('Theme', themes, 'default', null)
//     },
//     size: {
//       default: select('Size', sizes, 'default', null)
//     }
//   },
//   template: '<div><gc-icon-sprite /> <gc-button :loading="loading" :theme="theme" :size="size">{{ text }}</gc-button></div>',
// });

export const Default = () => ({
  components: { GcButton },
  template: '<div><gc-icon-sprite /> <gc-button>Button</gc-button></div>',
});

export const Themes = () => ({
  components: { GcButton },
  template: '<div><gc-icon-sprite /> <gc-button theme="default">Default</gc-button> <gc-button theme="gray">Gray</gc-button> <gc-button theme="green">Green</gc-button> <gc-button theme="danger">Danger / Red</gc-button></div> <gc-button theme="outline">Outline</gc-button></div>',
});


export const Sizes = () => ({
  components: { GcButton },
  template: '<div><gc-icon-sprite /> <gc-button>Regular</gc-button> <gc-button size="small">Button Small</gc-button> <gc-button size="x-small">Button x-small</gc-button></div>',
});

export const Icons = () => ({
  components: { GcButton },
  template: '<div><gc-icon-sprite /> <gc-button icon-left="activity">Icon Left</gc-button> <gc-button icon-right="activity">Icon Right</gc-button> <gc-button icon-left="activity" icon-right="user">Icon left and right</gc-button></div>',
});

export const Loading = () => ({
  components: { GcButton },
  template: '<div><gc-icon-sprite /> <gc-button :loading="true">Loading</gc-button> <gc-button :loading="true" theme="green">Loading</gc-button></div>',
});


