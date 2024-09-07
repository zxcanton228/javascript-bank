import ChildComponent from '@/core/component/child.component.js'
import $K from '@/core/kquery/kquery.lib'
import renderService from '@/core/services/render.service.js'
import Store from '@/core/store/store'

import { Heading } from '@/components/ui/heading/heading.component'
import {
	LOADER_SELECTOR,
	Loader
} from '@/components/ui/loader/loader.component'

import { TransactionService } from '@/api/transaction.service'

import styles from './transactions.module.scss'
import template from './transactions.template.html'

import { TransactionItem } from './transaction-item/transaction-item.component'
import { TRANSACTION_COMPLETED } from '@/constants/event.constants'

export class Transactions extends ChildComponent {
	constructor() {
		super()
		this.store = Store.getInstance().state
		this.transactionService = new TransactionService()

		this.element = renderService.htmlToElement(
			template,
			[new Heading('Recent transactions')],
			styles
		)
		this.#addListeners()
	}

	#addListeners() {
		document.addEventListener(
			TRANSACTION_COMPLETED,
			this.#onTransactionCompleted
		)
	}

	#removeListeners() {
		document.removeEventListener(
			TRANSACTION_COMPLETED,
			this.#onTransactionCompleted
		)
	}

	#onTransactionCompleted = () => {
		this.fetchData()
	}

	destroy() {
		this.#removeListeners()
	}

	fetchData() {
		this.transactionService.getAll(data => {
			if (!data) return

			const loaderElement = this.element.querySelector(LOADER_SELECTOR)
			if (loaderElement) loaderElement.remove()

			const transactionsList = $K(this.element).find('#transactions-list')
			transactionsList.text('')

			if (data.length) {
				for (const transaction of data.transactions) {
					transactionsList.append(new TransactionItem(transaction).render())
				}
			} else {
				transactionsList.text('Transactions not found!')
			}
		})
	}

	render() {
		if (this.store.user) {
			$K(this.element).append(new Loader().render())
			setTimeout(() => this.fetchData(), 500)
		}

		return this.element
	}
}
