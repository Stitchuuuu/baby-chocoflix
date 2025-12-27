import { createApp } from 'vue'
import './style.css'
import { router } from './router'

import App from './app.vue'

createApp(App)
	.use(router)
	.mount('#app')
