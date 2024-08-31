import ChildComponent from '@/core/component/child.component'
import renderService from '@/core/services/render.service.js'

import { Logo } from '@/components/layout/header/logo/logo.component'
import { LogoutButton } from '@/components/layout/header/logout-button/logout-button.component'
import { Search } from '@/components/layout/header/search/search.component'
import { UserItem } from '@/components/ui/user-item/user-item.component'

import styles from './header.module.scss'
import template from './header.template.html'

export class Header extends ChildComponent {
	constructor({ router }) {
		super()
		this.router = router
	}
	render() {
		this.element = renderService.htmlToElement(
			template,
			[
				Logo,
				new LogoutButton({
					router: this.router
				}),
				Search,
				new UserItem(
					{
						avatarPath:
							'https://i.pinimg.com/736x/b7/5b/29/b75b29441bbd967deda4365441497221.jpg',
						name: 'Kirill Vegele'
					},
					true,
					() => alert('Hello, Kirill Vegele')
				)
			],
			styles
		)

		return this.element
	}
}
