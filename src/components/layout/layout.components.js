import ChildComponent from '@/core/component/child.components'
import $K from '@/core/kquery/kquery.lib'
import renderService from '@/core/services/render.service.js'

import { Header } from '@/components/layout/header/header.component'

import styles from './layout.module.scss'
import template from './layout.template.html'

export class Layout extends ChildComponent {
	constructor({ router, children }) {
		super()

		this.router = router
		this.children = children
	}

	render() {
		this.element = renderService.htmlToElement(template, [], styles)

		const mainElement = $K(this.element).find('main')

		const contentContainer = $K(this.element).find('#content')
		contentContainer.append(this.children)

		mainElement
			.before(new Header({ router: this.router }).render())
			.append(contentContainer.element)

		return this.element
	}
}
