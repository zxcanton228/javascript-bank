import ChildComponent from '@/core/component/child.component.js'
import $K from '@/core/kquery/kquery.lib'
import renderService from '@/core/services/render.service.js'
import Store from '@/core/store/store'

import { formatCardNumber } from '@/utils/format/format-card-number'
import { formatToCurrency } from '@/utils/format/format-to-currency'

import { CardService } from '@/api/card.service'

import styles from './card-info.module.scss'
import template from './card-info.template.html'

import { BALANCE_UPDATED } from '@/constants/event.constants'

const CODE = '*****'

export class CardInfo extends ChildComponent {
	constructor() {
		super()

		this.cardService = new CardService()
		this.store = new Store.getInstance()

		this.element = renderService.htmlToElement(template, [], styles)

		this.#addListeners()
	}

	#copyCardNumber(e) {
		navigator.clipboard.writeText(e.target.innerText).then(() => {
			e.target.innerText = 'Card number copied!'
			setTimeout(() => {
				e.target.innerText = formatCardNumber(this.card.number)
			}, 2000)
		})
	}
	#toggleCvc(cardCvcElement) {
		const text = cardCvcElement.text()
		text === CODE
			? cardCvcElement.text(this.card.cvc)
			: cardCvcElement.text(CODE)
	}
	#addListeners() {
		document.addEventListener(BALANCE_UPDATED, this.#onBalanceUpdate)
	}
	#removeListener() {
		document.removeEventListener(BALANCE_UPDATED, this.#onBalanceUpdate)
	}
	#onBalanceUpdate = () => {
		this.fetchData()
	}
	destroy() {
		this.#removeListener()
	}

	fillElements() {
		$K(this.element).html(
			renderService.htmlToElement(template, [], styles).innerHTML
		)

		$K(this.element)
			.findAll(':scope > div')
			.forEach(child => {
				child.addClass('fade-in')
			})

		$K(this.element)
			.find('#card-number')
			.text(formatCardNumber(this.card.number))
			.click(this.#copyCardNumber.bind(this))

		$K(this.element).find('#card-expire-date').text(this.card.expireDate)

		const cardCvcElement = $K(this.element).find('#card-cvc')
		cardCvcElement.text(CODE).css('width', '44px')

		$K(this.element)
			.find('#toggle-cvc')
			.click(this.#toggleCvc.bind(this, cardCvcElement))

		$K(this.element)
			.find('#card-balance')
			.text(formatToCurrency(this.card.balance))
	}
	fetchData() {
		this.cardService.byUser(data => {
			if (data?.id) {
				this.card = data
				this.fillElements()
				this.store.updateCard(data)
			} else {
				this.store.updateCard(null)
			}
		})
	}
	render() {
		if (this.store.state.user) this.fetchData()

		return this.element
	}
}
