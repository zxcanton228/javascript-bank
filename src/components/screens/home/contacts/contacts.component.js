import ChildComponent from '@/core/component/child.component.js'
import renderService from '@/core/services/render.service.js'

import { Heading } from '@/components/ui/heading/heading.component'

import styles from './contacts.module.scss'
import template from './contacts.template.html'

import { TransferField } from './transfer-field/transfer-field.component'

export class Contacts extends ChildComponent {
	render() {
		this.element = renderService.htmlToElement(
			template,
			[TransferField, Heading],
			styles
		)

		return this.element
	}
}
