import ChildComponent from '@/core/component/child.component.js'
import NotificationService from '@/core/services/notification.service'
import renderService from '@/core/services/render.service.js'

import styles from './notification.module.scss'
import template from './notification.template.html'

export class Notification extends ChildComponent {
	render() {
		this.element = renderService.htmlToElement(template, [], styles)
		window.notification = new NotificationService()
		return this.element
	}
}
