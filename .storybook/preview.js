import '~~/.nuxt-storybook/storybook/preview.js'
import {VApp} from 'vuetify/lib'

export const decorators = [() => {
  return {
    template: "<v-app><story/></v-app>",
    components: {VApp}
  }
}]