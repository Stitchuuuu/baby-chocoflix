import {
	createRouter,
	createWebHistory
} from 'vue-router'

const routes = [
  {
		path: '/',
		component: () => import('./pages/collections.vue')
	},
  {
		path: '/',
		component: () => import('./pages/tvshow.vue')
	},
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})