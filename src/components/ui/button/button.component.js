import ChildComponent from '@/core/components/child.components'
import $K from '@/core/kquery/kquery.lib'
import renderService from '@/core/services/render.service.js'

import styles from './button.module.scss'
import template from './button.template.html'

export class Button extends ChildComponent {
	constructor({ children, onClick, variant }) {
		super()
		if (!children) throw new Error('Children is empty')

		this.children = children
		this.onClick = onClick
		this.variant = variant
	}
	render() {
		this.element = renderService.htmlToElement(template, [], styles)

		$K(this.element).html(this.children).click(this.onClick)
		if (this.variant) $K(this.element).addClass(styles[this.variant])

		return this.element
	}
}
