import { AboutUs } from '@/components/screens/about-us/about-us.components'
import { Home } from '@/components/screens/home/home.components'

export const ROUTES = [
	{
		path: '/',
		component: Home
	},
	{
		path: '/about-us',
		component: AboutUs
	},
	{
		path: '/auth',
		component: Home
	}
]
