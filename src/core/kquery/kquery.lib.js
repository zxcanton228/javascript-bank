/**
 * Represents the KQuery class for working with DOM elements.
 */

const isNotFoundError = (element, selector) => {
	if (!element) throw new Error(`Element ${selector} not found!`)
}

class KQuery {
	/**
	 * Create a new KQuery instance.
	 * @param {string|HTMLElement} selector - A CSS selector string or an HTMLElement.
	 */
	constructor(selector) {
		if (typeof selector === 'string') {
			isNotFoundError(this.element, selector)
			this.element = document.querySelector(selector)
		} else if (selector instanceof HTMLElement) {
			this.element = selector
		} else {
			throw new Error('Invalid selector type')
		}
	}

	/**
	 * Find the first element that matches the specified selector within the selected element.
	 * @param {string} selector - A CSS selector string to search for within the selected element.
	 * @returns {KQuery} A new KQuery instance for the found element.
	 */
	find(selector) {
		const element = new KQuery(this.element.querySelector(selector))
		isNotFoundError(element, selector)
		return element
	}
}

/**
 * Create a new KQuery instance for the given selector.
 * @param {string|HTMLElement} selector - A CSS selector string or an HTMLElement.
 * @returns {KQuery} A new KQuery instance for the given selector.
 */
const $R = selector => new KQuery(selector)
export default $R
