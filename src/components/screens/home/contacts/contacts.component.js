import ChildComponent from '@/core/component/child.component.js'
import $K from '@/core/kquery/kquery.lib'
import renderService from '@/core/services/render.service.js'
import Store from '@/core/store/store'

import { Heading } from '@/components/ui/heading/heading.component'
import {
	LOADER_SELECTOR,
	Loader
} from '@/components/ui/loader/loader.component'
import { UserItem } from '@/components/ui/user-item/user-item.component'

import { formatCardNumberWithDashes } from '@/utils/format/format-card-number'

import { UserService } from '@/api/user.service'

import styles from './contacts.module.scss'
import template from './contacts.template.html'

import {
	TRANSFER_FIELD_SELECTOR,
	TransferField
} from './transfer-field/transfer-field.component'

export class Contacts extends ChildComponent {
	constructor() {
		super()
		this.store = Store.getInstance().state
		this.userService = new UserService()
	}

	fetchData() {
		this.userService.getAll(null, data => {
			if (!data) return

			this.element.querySelector(LOADER_SELECTOR).remove()

			for (const user of data) {
				$K(this.element)
					.find('#contacts-list')
					.append(
						new UserItem(user, true, () => {
							$K(TRANSFER_FIELD_SELECTOR).value(
								formatCardNumberWithDashes(user.card.number)
							)
						}).render()
					)
			}

			$K(this.element)
				.find('#contacts-list')
				.findAll('button')
				.forEach(contactElement => {
					contactElement.addClass('fade-in')
				})
		})
	}

	render() {
		this.element = renderService.htmlToElement(
			template,
			[TransferField, new Heading('Transfer money')],
			styles
		)

		if (this.store.user) {
			$K(this.element)
				.find('#contacts-list')
				.html(new Loader().render().outerHTML)

			setTimeout(() => this.fetchData(), 500)
		}

		return this.element
	}
}
