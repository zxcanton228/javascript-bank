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

	/**
	 * Set the CSS style of the selected element.
	 * @param {string} property - The CSS property to set.
	 * @param {string} value - The value to set for the CSS property.
	 * @returns {KQuery} The current KQuery instance for chaining.
	 */
	css(property, value) {
		if (typeof property !== 'string' || typeof value !== 'string') {
			throw new Error('property and value must be strings')
		}

		this.element.style[property] = value
		return this
	}

	/**
	 * Append a new element as a child of the selected element.
	 * @param {HTMLElement} childElement - The new child element to append.
	 * @returns {KQuery} The current KQuery instance for chaining.
	 */
	append(childElement) {
		this.element.appendChild(childElement)
		return this
	}

	/**
	 * Insert a new element before the selected element.
	 * @param {HTMLElement} newElement - The new element to insert before the selected element.
	 * @returns {KQuery} The current KQuery instance for chaining.
	 */
	before(newElement) {
		if (!(newElement instanceof HTMLElement)) {
			throw new Error('Element must be an HTMLElement')
		}

		const parentElement = this.element.parentElement

		if (!parentElement)
			throw new Error('Element does not have a parent element')

		parentElement.insertBefore(newElement, this.element)
		return this
	}
}

/**
 * Create a new KQuery instance for the given selector.
 * @param {string|HTMLElement} selector - A CSS selector string or an HTMLElement.
 * @returns {KQuery} A new KQuery instance for the given selector.
 */
const $K = selector => new KQuery(selector)
export default $K
