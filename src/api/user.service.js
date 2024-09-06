import { kiroveQuery } from '@/core/kirove-query/kirove-query.lib'

export class UserService {
	#BASE_URL = '/users'

	getAll(searchTerm, onSuccess) {
		return kiroveQuery({
			path: `${this.#BASE_URL}${
				searchTerm
					? `?${new URLSearchParams({
							searchTerm
					  })}`
					: ''
			}`,
			onSuccess
		})
	}
}
