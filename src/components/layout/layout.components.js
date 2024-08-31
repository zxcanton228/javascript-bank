import $K from '@/core/kquery/kquery.lib'
import renderService from '@/core/services/render.service.js'

import { Header } from '@/components/layout/header/header.component'

import styles from './layout.module.scss'
import template from './layout.template.html'

export class Layout {
	constructor({ router, children }) {
		this.router = router
		this.children = children
	}
	render() {
		this.element = renderService.htmlToElement(template, [], styles)
		const mainElement = $K(this.element).find('main')
		mainElement.before(new Header().render())

		return this.element.outerHTML
	}
}
