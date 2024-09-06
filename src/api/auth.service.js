import { kiroveQuery } from '@/core/kirove-query/kirove-query.lib'
import NotificationService from '@/core/services/notification.service'

export default class AuthService {
	#BASE_URL = '/auth'
	constructor() {
		// store
		this.notificationService = new NotificationService()
	}
	main(type, body) {
		const query = kiroveQuery({
			method: 'POST',
			path: `${this.#BASE_URL}/${type}`,
			body,
			onSuccess: data => {
				// login store
				this.notificationService.show(
					'success',
					'You have successfully logged in!'
				)
			}
		})
		return query
	}
}
