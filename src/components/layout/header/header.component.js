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

		this.userItem = new UserItem(
			{
				avatarPath: '/',
				name: 'default'
			},
			true
		)
	}
	update() {
		this.user = this.store.state.user
		const authSideElement = $K(this.element).find('#auth-side')
		if (this.user) {
			authSideElement.show()
			this.userItem.update(this.user)
			this.router.navigate('/')
		} else {
			authSideElement.hide()
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
				this.userItem
			],
			styles
		)

		this.update()

		return this.element
	}
}
