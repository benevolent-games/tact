
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
				<p><em>"from keypress to couch co-op"</em></p>
				<p>tact is a user input system for the web. it's good at customizable keybindings, and multiple gamepad support.</p>
				<p>tact is on <a href="https://github.com/benevolent-games/tact">github</a></p>
				<p>tact is by <a href="https://benevolent.games/">benevolent.games</a></p>
			</div>
		</header>

		<tact-demo></tact-demo>
	`,
}))

