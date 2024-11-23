import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Default Axios configuration
axios.defaults.baseURL = 'https://192.168.1.70:80/api'


app.mount('#app')
