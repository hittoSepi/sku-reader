import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

import OCR from '../views/OCR.vue'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		component: OCR
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router
