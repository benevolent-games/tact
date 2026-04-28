
import {template, html, dataSvgEmoji, socialCard} from "@e280/scute"

const title = "@benev/tact"
const domain = "tact.benevolent.games"
const favicon = "/assets/b.png"
const description = "keybindings and gamepad support for web games"

export default template(import.meta.url, async orb => html`
	<!doctype html>
	<html>
		<head>
			<title>${title}</title>

			<meta charset="utf-8"/>
			<meta name="viewport" content="width=device-width,initial-scale=1"/>
			<meta name="darkreader-lock"/>
			<style>@layer base{html{background:#000}}</style>

			<link rel="icon" href="${dataSvgEmoji("🎮")}"/>
			<link rel="stylesheet" href="${orb.hashurl("demo/main.css")}"/>
			<script type="module" src="${orb.hashurl("demo/main.bundle.min.js")}"></script>

			${socialCard({
				title,
				description,
				themeColor: "#f2ea8e",
				siteName: domain,
				image: `https://${domain}${favicon}`,
			})}
		</head>
		<body>
			<header>
				<h1>
					<strong>@benev/tact</strong>
					<small>v${orb.packageVersion()}</small>
				</h1>
				<div>
					<blockquote>"from keypress to couch co-op"</blockquote>
					<p>
						tact is a user input toolkit for the web. it's good at customizable keybindings, and multiple gamepad support.
						<a href="https://github.com/benevolent-games/tact">github</a>.
						<a href="https://benevolent.games/">benevolent.games</a>.
					</p>
				</div>
			</header>

			<demo-app></demo-app>

			<section>
				<h3>controls</h3>
				<ul>
					<li><strong>keyboard</strong> wasd, left-bracket, right-bracket, backslash.</li>
					<li><strong>gamepad</strong> thumbsticks, hold beta/gamma and press bumpers or dpad left/right.</li>
					<li><strong>virtual</strong> use your mouse to press the little buttons.</li>
				</ul>
			</section>
		</body>
	</html>
`)

