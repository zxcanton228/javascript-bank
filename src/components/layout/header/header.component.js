import ChildComponent from '@/core/component/child.component'
import $K from '@/core/kquery/kquery.lib'
import renderService from '@/core/services/render.service.js'
import Store from '@/core/store/store'

import { Logo } from '@/components/layout/header/logo/logo.component'
import { LogoutButton } from '@/components/layout/header/logout-button/logout-button.component'
import { Search } from '@/components/layout/header/search/search.component'
import { UserItem } from '@/components/ui/user-item/user-item.component'

import styles from './header.module.scss'
import template from './header.template.html'

export class Header extends ChildComponent {
	constructor({ router }) {
		super()

		this.store = Store.getInstance()
		this.store.addObserver(this)

		this.router = router
	}
	update() {
		this.user = this.store.state.user
		const authSideElement = $K(this.element).find('#auth-side')
		if (this.user) {
			authSideElement.show()
		} else {
			authSideElement.hide()
		}

		if (this.user && this.router.getCurrentPath() === '/auth') {
			this.router.navigate('/')
		}
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

		this.update

		return this.element
	}
}
