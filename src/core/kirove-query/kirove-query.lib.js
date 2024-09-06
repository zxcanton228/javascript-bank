import extractErrorMessage from '@/core/kirove-query/extract-error-message'

import { SERVER_URL } from '@/config/url.config'

import NotificationService from '../services/notification.service'
import StorageService from '../services/storage.service'

import { ACCESS_TOKEN_KEY } from '@/constants/auth.constants'

/**
 * kiroveQuery is a minimalistic library for handling API requests.
 * Fetch data from the API with provided options.
 *
 * @param {Object} options - Configuration options for the API request.
 * @param {string} options.path - The API endpoint path.
 * @param {('GET'|'POST'|'PATCH'|'DELETE'|'PUT')} [options.method='GET'] - The HTTP method to use for the request.
 * @param {Object} [options.body=null] - The request payload to send as JSON.
 * @param {Object} [options.headers={}] - Additional headers to include with the request.
 * @param {Function} [options.onSuccess=null] - Callback function to be called on successful response.
 * @param {Function} [options.onError=null] - Callback function to be called on error response.
 * @returns {Promise<{isLoading: boolean, error: string|null, data: any|null}>} - An object containing the loading state, error, and data from the response.
 */
export async function kiroveQuery({
	path,
	body = null,
	headers = {},
	method = 'GET',
	onError = null,
	onSuccess = null
}) {
	let isLoading = true,
		error = null,
		data = null
	const url = `${SERVER_URL}/api${path}`

	const accessToken = new StorageService().getItem(ACCESS_TOKEN_KEY)

	const requestOptions = {
		method,
		headers: {
			'Content-Type': 'application/json',
			...headers
		}
	}

	if (accessToken)
		requestOptions.headers.Authorization = `Bearer ${accessToken}`
	if (body) requestOptions.body = JSON.stringify(body)

	try {
		const response = await fetch(url, requestOptions)
		const json = await response.json()
		if (response.ok) {
			data = json
			if (onSuccess) onSuccess(data)
		} else {
			const errorData = json
			const errorMessage = extractErrorMessage(errorData)
			if (onError) onError(errorMessage)
			new NotificationService().show('error', errorMessage)
		}
	} catch (errorData) {
		const errorMessage = extractErrorMessage(errorData)
		if (errorMessage) onError(errorMessage)
		new NotificationService().show('error', errorMessage)
	} finally {
		isLoading = false
	}

	return { isLoading, error, data }
}
