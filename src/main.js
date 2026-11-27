import { createApp } from 'vue'
import router from './router'
import './assets/style/main.css'
import App from './App.vue'
import 'remixicon/fonts/remixicon.css'

createApp(App).use(router).mount('#app')
