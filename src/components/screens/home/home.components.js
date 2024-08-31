import BaseScreen from '@/core/component/base-screen.component'
import $K from '@/core/kquery/kquery.lib'
import renderService from '@/core/services/render.service'

import { UserItem } from '@/components/ui/user-item/user-item.component'

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
				new UserItem(
					{
						avatarPath:
							'https://i.pinimg.com/736x/b7/5b/29/b75b29441bbd967deda4365441497221.jpg',
						name: 'Kirill Vegele'
					},
					true,
					() => alert('H')
				)
			],
			styles
		)

		$K(element).find('h1').css('color', 'blue')

		return element
	}
}
