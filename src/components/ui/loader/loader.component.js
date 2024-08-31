import { $R } from '@/core/rquery/rquery.lib'

import styles from './loader.module.scss'
import template from './loader.template.html'

import ChildComponent from '../../src/core/component/child.component.js'
import renderService from '../../src/core/services/render.service.js'

export const LOADER_SELECTOR = '[data-component="loader"]'

export class Loader extends ChildComponent {
	constructor(width = 100, height = 100) {
		this.width = width
		this.height = height
	}
	render() {
		this.element = renderService.htmlToElement(template, [], styles)

		$R(this.element)
			.css('width', `${this.width}px`)
			.css('height', `${this.height}px`)
			.addClass('bounce')
		this.element.style = `width: ${this.width}px; height: ${this.height}px`
		this.element.classList.add('bounce')

		return this.element
	}
}
