import ChildComponent from '@/core/component/child.component'
import $K from '@/core/kquery/kquery.lib'
import renderService from '@/core/services/render.service.js'

import { TRANSFER_FIELD_SELECTOR } from '@/components/screens/home/contacts/transfer-field/transfer-field.component'
import { UserItem } from '@/components/ui/user-item/user-item.component'

import debounce from '@/utils/debounce.util'
import { formatCardNumberWithDashes } from '@/utils/format/format-card-number'

import { UserService } from '@/api/user.service'

import styles from './search.module.scss'
import template from './search.template.html'

export class Search extends ChildComponent {
	constructor() {
		super()
		this.userService = new UserService()
	}
	#handleSearch = async event => {
		const searchTerm = event.target.value
		const searchResultElement = $K(this.element).find('#search-results')

		if (!searchTerm) {
			searchResultElement.html('')
			return
		}
		await this.userService.getAll(searchTerm, users => {
			searchResultElement.html('')
			users.forEach((user, index) => {
				const userItem = new UserItem(user, true, () => {
					$K(TRANSFER_FIELD_SELECTOR).value(
						formatCardNumberWithDashes(user.card.number)
					)

					searchResultElement.html('')
				}).render()
				$K(userItem)
					.addClass(styles.item)
					.css('transition-delay', `${index * 0.1}s`)
				searchResultElement.append(userItem)

				setTimeout(() => {
					$K(userItem).addClass(styles.visible)
				}, 50)
			})
		})
	}
	render() {
		this.element = renderService.htmlToElement(template, [], styles)
		const debouncedHandleSearch = debounce(this.#handleSearch, 300)

		$K(this.element)
			.find('input')
			.input({
				type: 'search',
				name: 'search',
				placeholder: 'Search contacts...'
			})
			.on('input', debouncedHandleSearch)

		return this.element
	}
}
