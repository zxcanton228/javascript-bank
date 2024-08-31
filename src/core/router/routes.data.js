import { AboutUs } from '@/components/screens/about-us/about-us.components'
import { Auth } from '@/components/screens/auth/auth.component'
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
		component: Auth
	}
]
