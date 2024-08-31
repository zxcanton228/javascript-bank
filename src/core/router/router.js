import { ROUTES } from '@/core/router/routes.data'

import NotFound from '@/components/screens/not-found/not-found.components'

export class Router {
	#routes
	#currentRoute
	constructor() {
		this.#routes = ROUTES
		this.#currentRoute = null
	}
	getCurrentPath() {
		return window.location.pathname
	}
	#handleRouteChange() {
		const path = this.getCurrentPath() || '/'
		let route = this.#routes.find(route => route.path === path)

		if (!route) route = { component: NotFound }

		this.#currentRoute = route
		this.render()
	}

	render() {
		const component = new this.#currentRoute.component()

		document.getElementById('app').innerHTML = component.render()
	}
}
