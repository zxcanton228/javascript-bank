import ChildComponent from '@/core/component/child.component.js'
import $K from '@/core/kquery/kquery.lib'
import renderService from '@/core/services/render.service.js'

import { formatToCurrency } from '@/utils/format/format-to-currency'
import { formatDate } from '@/utils/format/format-to-date'

import styles from './transaction-item.module.scss'
import template from './transaction-item.template.html'

export class TransactionItem extends ChildComponent {
	constructor(transaction) {
		super()
		this.transaction = transaction
	}
	render() {
		this.element = renderService.htmlToElement(template, [], styles)

		const isIncome = this.transaction.type === 'TOP_UP'
		const name = isIncome ? 'Income' : 'Expense'

		if (isIncome) {
			$K(this.element).addClass(styles.income)
		}

		$K(this.element).find('#transaction-name').text(name)

		$K(this.element)
			.find('#transaction-date')
			.text(formatDate(this.transaction.createdAt))

		$K(this.element)
			.find('#transaction-amount')
			.text(formatToCurrency(this.transaction.amount))

		return this.element
	}
}
