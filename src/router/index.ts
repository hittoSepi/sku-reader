import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

import Tabs from '../views/Tabs.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import OCR from '../views/OCR.vue'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: '/login'
	},
	{
		path: '/login',
		component: Login
	},
	{
		path: '/OCR',
		component: OCR
	},

	{
		path: '/signup',
		component: Signup
	},
	{
		path: '/pages/',
		component: Tabs,
		children: [
			{
				path: '',
				redirect: '/pages/main'
			},
			{
				path: 'main',
				component: () => import('@/views/Mainpage.vue')
			},
			{
				path: 'tab2',
				component: () => import('@/views/Tab2.vue')
			},
			{
				path: 'tab3',
				component: () => import('@/views/Tab3.vue')
			}
		]
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router
