import BaseScreen from '@/core/components/base-screen.components'

export default class NotFound extends BaseScreen {
	constructor() {
		super({ title: 'Not Found' })
	}
	render() {
		return '<p>Not Found!<p/>'
	}
}
