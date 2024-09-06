import { kiroveQuery } from '@/core/kirove-query/kirove-query.lib'
import NotificationService from '@/core/services/notification.service'
import Store from '@/core/store/store'

export default class AuthService {
	#BASE_URL = '/auth'
	constructor() {
		this.store = Store.getInstance()
		this.notificationService = new NotificationService()
	}
	main(type, body) {
		const query = kiroveQuery({
			method: 'POST',
			path: `${this.#BASE_URL}/${type}`,
			body,
			onSuccess: ({ user, accessToken }) => {
				this.store.login(user, accessToken)
				this.notificationService.show(
					'success',
					'You have successfully logged in!'
				)
			}
		})
		return query
	}
}
