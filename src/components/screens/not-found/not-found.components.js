import BaseScreen from '@/core/component/base-screen.component'

export default class NotFound extends BaseScreen {
	constructor() {
		super({ title: 'Not Found' })
	}
	render() {
		return '<p>Not Found!<p/>'
	}
}
