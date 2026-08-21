import { createApp } from 'vue'

import App from '@/App.vue'
import vuetify from '@plugins/vuetify'
import router from '@router'

import '@mdi/font/css/materialdesignicons.css'

import '@fontsource/fira-sans/400.css'
import '@fontsource/fira-sans/500.css'
import '@fontsource/fira-sans/600.css'
import '@fontsource/fira-sans/700.css'

import 'vuetify/styles'
import '@styles/main.scss'

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
