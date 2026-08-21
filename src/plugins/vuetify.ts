import { createVuetify, useDisplay } from 'vuetify'
import type { ThemeDefinition } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { ru } from 'vuetify/locale'

const fpkLightTheme: ThemeDefinition = {
  dark: false,

  colors: {
    background: '#F4F6F8',
    surface: '#FFFFFF',
    'surface-variant': '#EEF1F3',
    'on-surface-variant': '#565E69',

    primary: '#315F68',
    'primary-darken-1': '#284E55',

    secondary: '#D81E2B',
    'secondary-darken-1': '#B51620',

    dark: '#292D34',
    'on-dark': '#FFFFFF',

    accent: '#315F68',
    muted: '#66717F',
    border: '#DDE2E7',

    'on-background': '#202833',
    'on-surface': '#202833',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
  },
}

export default createVuetify({
  theme: {
    defaultTheme: 'fpkLight',

    themes: {
      fpkLight: fpkLightTheme,
    },
  },

  locale: {
    locale: 'ru',
    fallback: 'en',

    messages: {
      ru,
    },
  },

  icons: {
    defaultSet: 'mdi',
    aliases,

    sets: {
      mdi,
    },
  },

  defaults: {
    VTextField: {
      color: 'primary',
      variant: 'outlined',
      density: 'comfortable',
      hideDetails: true,
    },

    VSelect: {
      color: 'primary',
      variant: 'outlined',
      density: 'comfortable',
      hideDetails: true,
    },

    VBtn: {
      rounded: 'lg',
    },

    VCard: {
      elevation: 0,
    },
  },
})
