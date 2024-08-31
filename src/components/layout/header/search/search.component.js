import ChildComponent from '@/core/component/child.component'
import renderService from '@/core/services/render.service.js'

import styles from './search.module.scss'
import template from './search.template.html'

export class Search extends ChildComponent {
	render() {
		this.element = renderService.htmlToElement(template, [], styles)

		return this.element
	}
}
