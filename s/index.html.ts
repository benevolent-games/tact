
import {ssg, html} from "@e280/scute"

const title = "@benev/tact"
const domain = "tact.benevolent.games"
const favicon = "/assets/b.png"
const description = "keybindings and gamepad support for web games"

export default ssg.page(import.meta.url, async orb => ({
	title,
	js: "demo/main.bundle.min.js",
	css: "demo/main.css",
	dark: true,
	favicon,
	head: html`
		<meta data-version="${orb.packageVersion()}" />
	`,

	socialCard: {
		title,
		description,
		themeColor: "#f2ea8e",
		siteName: domain,
		image: `https://${domain}${favicon}`,
	},

	body: html`
		<header>
			<h1>
				<strong>@benev/tact</strong>
				<span>v${orb.packageVersion()}</span>
			</h1>
			<div class=deets>
				<a href="https://github.com/benevolent-games/tact">github</a>
				<a href="https://benevolent.games/">benevolent.games</a>
			</div>
		</header>

		<tact-app></tact-app>
	`,
}))

