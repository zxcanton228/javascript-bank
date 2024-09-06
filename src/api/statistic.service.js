import { kiroveQuery } from '@/core/kirove-query/kirove-query.lib'

export class StatisticService {
	#BASE_URL = '/statistics'

	main(onSuccess) {
		return kiroveQuery({
			path: this.#BASE_URL,
			onSuccess
		})
	}
}
