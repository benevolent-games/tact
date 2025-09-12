
import {css} from "lit"
export default css`

:host {
	--gap: 0.3em;
	pointer-events: none;
	cursor: default;
	user-select: none;
}

.portlist {
	pointer-events: none;

	display: flex;
	align-items: start;

	width: max-content;
	gap: var(--gap);
	padding: 0.5em;

	color: #fff8;
	background: #222a;
	border-radius: 1em;

	opacity: 0;
	transition: opacity 300ms linear;

	&[data-active] {
		opacity: 1;
		pointer-events: all;
	}

	.port {
		flex: 1 0 0;
		display: flex;
		flex-direction: column;

		min-width: 6em;
		gap: var(--gap);

		> * {
			color: white;
			font-weight: bold;
			text-shadow: 0.05em 0.05em 0.1em #0008;
			text-transform: uppercase;
		}

		header {
			text-align: center;
			color: #fff8;
		}

		.device {
			display: flex;
			flex-direction: column;
			gap: var(--gap);

			box-shadow: 0.1em 0.2em 0.7em #0004;
			background: color-mix(in srgb, #fffa, var(--color) 50%);
			border-top: 2px solid #fff8;
			border-bottom: 2px solid #0004;
			border-radius: 0.5em;

			.row {
				display: flex;
				align-items: center;

				&.primary {
					justify-content: space-between;
				}

				&.secondary {
					justify-content: center;
				}
			}

			.icon {
				font-size: 1.5em;
			}

			.label {
				font-family: monospace;
				font-size: 0.8em;
				opacity: 0.5;
				line-height: 0.9em;
			}

			button {
				opacity: 0.2;
				cursor: pointer;
				padding: 0 0.2em;
				font-family: monospace;
				font-size: 1.5em;
				font-weight: bold;

				background: transparent;
				border: 1px solid transparent;
				text-shadow: inherit;

				&:is(:hover, :focus-visible) {
					opacity: 1;
				}
			}
		}
	}
}

`



