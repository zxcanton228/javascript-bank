import BaseScreen from '@/core/components/base-screen.components'

export class Home extends BaseScreen {
	constructor() {
		super({ title: 'Home' })
	}
	render() {
		return '<p>Home<p/>'
	}
}
