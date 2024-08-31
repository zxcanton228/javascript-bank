import ChildComponent from '@/core/component/child.component'
import $K from '@/core/kquery/kquery.lib'
import renderService from '@/core/services/render.service.js'

import styles from './search.module.scss'
import template from './search.template.html'

export class Search extends ChildComponent {
	render() {
		this.element = renderService.htmlToElement(template, [], styles)

		$K(this.element).find('input').input({
			type: 'search',
			name: 'search',
			placeholder: 'Search contacts...'
		})

		return this.element
	}
}
