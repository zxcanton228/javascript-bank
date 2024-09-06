import { kiroveQuery } from '@/core/kirove-query/kirove-query.lib'

export class TransactionService {
	#BASE_URL = '/transactions'

	getAll(onSuccess) {
		return kiroveQuery({
			path:
				this.#BASE_URL +
				`?${new URLSearchParams({
					orderBy: 'desc'
				})}`,
			onSuccess
		})
	}
}
