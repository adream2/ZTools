import { createApp } from 'vue'
import './assets/styles/tokens.css'
import './assets/styles/base.css'
import App from './App.vue'
import { router } from './core/router'

createApp(App).use(router).mount('#app')
