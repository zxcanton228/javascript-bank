export class Layout {
	constructor({ router, children }) {
		this.children = children
		this.router = router
	}
	render() {
		const headerHTMl = `<header>Header 
				<nav>
					<a href="/">Home</a>
					<a href="/auth">Auth</a>
				</nav>
			</header>`
		return `
			${headerHTMl}
			<main>
				${this.children}
			</main>
		`
	}
}
