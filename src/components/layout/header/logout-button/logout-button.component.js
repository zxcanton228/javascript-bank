import ChildComponent from '@/core/component/child.component.js'
import $K from '@/core/kquery/kquery.lib'
import renderService from '@/core/services/render.service.js'

import styles from './logout-button.module.scss'
import template from './logout-button.template.html'

export class LogoutButton extends ChildComponent {
	constructor({ router }) {
		super()
		this.router = router
	}
	render() {
		this.element = renderService.htmlToElement(template, [], styles)
		$K(this.element)
			.find('button')
			.click(() => this.router.navigate('/auth'))
		return this.element
	}
}
