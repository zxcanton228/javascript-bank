import ChildComponent from '@/core/component/child.component'
import $K from '@/core/kquery/kquery.lib'
import renderService from '@/core/services/render.service'

import styles from './donut-chart.module.scss'
import template from './donut-chart.template.html'

/**
 * DonutChart class for creating a simple donut chart with customizable options.
 */
export class DonutChart extends ChildComponent {
	gap = 15

	/**
	 * Create a new DonutChart instance.
	 * @param {string|HTMLElement} container - The container element (either a selector or HTMLElement) where the chart will be appended.
	 * @param {object[]} data - An array of data objects to represent each slice of the donut chart.
	 * @param {number} data[].value - The value of the slice.
	 * @param {string} data[].color - The color of the slice.
	 * @param {number} [options.size=250] - The diameter of the donut chart.
	 * @param {number} [options.donutWidth=50] - The width of the donut ring.
	 */
	constructor(
		data,
		options = {
			size: 250,
			donutWidth: 50
		}
	) {
		super()
		this.data = data
		this.size = options.size
		this.donutWidth = options.donutWidth
	}

	/**
	 * Calculate the total value of all slices.
	 * @returns {number} The total value.
	 */
	// вычисляет общую сумму значений сегментов.
	#calculateTotalValue() {
		return this.data.reduce((acc, slice) => acc + slice.value, 0)
	}

	/**
	 * Convert polar coordinates to Cartesian coordinates.
	 * @param {number} percentage - The percentage of the circle.
	 * @param {number} radius - The radius of the circle.
	 * @returns {number[]} The Cartesian coordinates [x, y].
	 */
	// преобразует полярные координаты в декартовы координаты.
	#polarToCartesian(percentage, radius) {
		const angleInDegrees = percentage * 3.6 - 90
		const angleInRadians = (angleInDegrees * Math.PI) / 180
		const x = radius * Math.cos(angleInRadians)
		const y = radius * Math.sin(angleInRadians)
		return [x, y]
	}

	/**
	 * Create an SVG element and set its attributes.
	 * @returns {SVGElement} The created SVG element.
	 */
	#createSvgElement() {
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

		svg.setAttribute('width', this.size)
		svg.setAttribute('height', this.size)
		svg.setAttribute(
			'viewBox',
			`-5 -5 ${this.size + this.gap} ${this.size + this.gap}`
		)
		return svg
	}

	/**
	 * Create an SVG group element and set its attributes.
	 * @returns {SVGElement} The created SVG group element.
	 */
	#createSvgGroupElement() {
		const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
		g.setAttribute(
			'transform',
			`translate(${this.size / 2 + this.gap / 4}, ${
				this.size / 2 + this.gap / 4
			})`
		)
		return g
	}

	#createPathElement(slice, pathData) {
		if (!pathData || pathData.includes('NaN')) return

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
		path.setAttribute('d', pathData)
		path.setAttribute('fill', 'none')
		path.setAttribute('stroke', slice.color)
		path.setAttribute('stroke-width', this.donutWidth)
		return path
	}

	// создает элементы пути SVG для каждого сегмента диаграммы.
	#createSvgPathElements(g) {
		const totalValue = this.#calculateTotalValue(),
			scale = 0.8,
			newSize = this.size * scale,
			radius = newSize / 2

		let accumulatedPercentage = 0

		this.data.forEach(slice => {
			const percentage = (slice.value / totalValue) * 100
			const [startX, startY] = this.#polarToCartesian(
				accumulatedPercentage,
				radius
			)
			accumulatedPercentage += percentage
			const [endX, endY] = this.#polarToCartesian(accumulatedPercentage, radius)
			const largeArcFlag = percentage > 50 ? 1 : 0
			const pathData = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`

			const path = this.#createPathElement(slice, pathData)
			path.classList.add('rotate')
			g.appendChild(path)
		})
	}

	/**
	 * Generates an SVG element representing the donut chart.
	 * @returns {SVGElement} The SVG element containing the donut chart.
	 */
	#getSvg() {
		const svg = this.#createSvgElement()
		const g = this.#createSvgGroupElement()
		this.#createSvgPathElements(g)
		svg.appendChild(g)

		return svg
	}

	/**
	 * Render Pie chart
	 */
	render() {
		this.element = renderService.htmlToElement(template, [], styles)

		$K(this.element).append(this.#getSvg())

		return this.element
	}
}
