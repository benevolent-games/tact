
export type GamepadInputs = ReturnType<typeof gamepadInputs>

export function gamepadInputs() {
	return {
		"gamepad.any": 0,

		"gamepad.stick.left.up": 0,
		"gamepad.stick.left.down": 0,
		"gamepad.stick.left.left": 0,
		"gamepad.stick.left.right": 0,

		"gamepad.stick.right.up": 0,
		"gamepad.stick.right.down": 0,
		"gamepad.stick.right.left": 0,
		"gamepad.stick.right.right": 0,

		"gamepad.stick.left.click": 0,
		"gamepad.stick.right.click": 0,

		"gamepad.a": 0,
		"gamepad.b": 0,
		"gamepad.x": 0,
		"gamepad.y": 0,

		"gamepad.up": 0,
		"gamepad.down": 0,
		"gamepad.left": 0,
		"gamepad.right": 0,

		"gamepad.trigger.left": 0,
		"gamepad.trigger.right": 0,

		"gamepad.bumper.left": 0,
		"gamepad.bumper.right": 0,

		"gamepad.alpha": 0,
		"gamepad.beta": 0,
		"gamepad.gamma": 0,
	}
}

