import BaseScreen from '@/core/components/base-screen.components'
import $K from '@/core/kquery/kquery.lib'
import renderService from '@/core/services/render.service'

import { Button } from '@/components/ui/button/button.component'

import styles from './home.module.scss'
import template from './home.template.html'

export class Home extends BaseScreen {
	constructor() {
		super({ title: 'Home' })
	}
	render() {
		const element = renderService.htmlToElement(
			template,
			[
				new Button({
					children: 'Send',
					onClick: () => alert('Clicked'),
					variant: 'green'
				})
			],
			styles
		)

		$K(element).find('h1').css('color', 'blue')

		return element
	}
}
