import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Decimal from './break_eternity.mjs'
import App from './App.vue'

// no type hinting???
const app = createApp(App)
console.log(new Decimal('1e200')) //googol^2
app.use(createPinia())
app.mount('#app')
