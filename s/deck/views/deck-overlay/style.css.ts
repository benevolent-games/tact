
import {css} from "lit"
export default css`

:host {
	--gap: 0.3em;
	cursor: default;
	user-select: none;
	pointer-events: none;
}

.portlist {
	display: flex;
	gap: var(--gap);
	padding: 0.5em;

	width: max-content;
	min-height: 10em;

	color: #fff8;
	background: #4448;
	border-radius: 1em;

	opacity: 0;
	pointer-events: none;
	transition: opacity 500ms linear;

	&[data-active] {
		opacity: 1;
		pointer-events: all;
	}

	.port {
		flex: 1 0 0;
		display: flex;
		flex-direction: column;

		gap: var(--gap);
		min-width: 7em;

		> * {
			padding: 0.5em;
			min-width: 5em;

			color: white;
			border-radius: 0.5em;
			font-weight: bold;
			text-shadow: 0.05em 0.05em 0.1em #0008;
			box-shadow: 0.1em 0.2em 0.7em #0004;
			border-top: 2px solid #fff8;
			text-transform: uppercase;
		}

		header {
			background: #aaa8;
			text-align: center;
		}

		.device {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: var(--gap);

			background: color-mix(in srgb, #fffa, var(--color) 50%);

			> * {
				font-size: 1.1em;
			}

			button {
				opacity: 0.5;
				cursor: pointer;
				padding: 0 0.2em;

				background: transparent;
				border: 1px solid transparent;

				&:is(:hover, :focus-visible) {
					opacity: 1;
				}
			}
		}
	}
}

`



