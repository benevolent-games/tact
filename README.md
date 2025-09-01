
# @benev/tact
> user input keybindings and gamepad support for web games

```ts
npm install @benev/tact
```

- 🛰️ **devices** are for sampling user inputs
- 🔗 **bindings** describe how samples influence actions
- 📡 **station** runs device samples through bindings, updating actions
- 🔌 **switchboard** assigns devices to stations (multi-gamepad couch co-op!)
- 🔘 **nubs** is mobile ui virtual gamepad stuff

<br/><br/>

## 🍋 tact devices
> produces user input "samples"

### 🥝 polling is good, actually
- tact operates on the basis of *polling*
- *"but polling is bad"* says you — but no — you're wrong — polling is unironically *based,* and you *should* do it
- in a game, we want to be processing our inputs *every frame*
- the gift of polling is total control over *when* inputs are processed
- i will elaborate no further 🗿

### 🥝 basically how a device works
- make a keyboard device
    ```ts
    import {KeyboardDevice} from "@benev/tact"

    const device = new KeyboardDevice(window)
    ```
- take samples each frame
    ```ts
    const samples = device.takeSamples()
      // [
      //   ["KeyA", 1],
      //   ["Space", 0]
      // ]
    ```
- dispose the device when you're done with it
    ```ts
    device.dispose()
    ```

### 🥝 samples explained
- a sample is a raw input of type `[code: string, value: number]`
- a sample has a `code` string
  - it's either a [standard keycode](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values), like `KeyA`
  - or it's something we made up, like `pointer.button.left` or `gamepad.trigger.right`
- a sample has a `value` number
  - `0` means *"nothing is going on"*
  - `1` means *"pressed"*
  - we don't like negative numbers
  - values between `0` and `1`, like `0.123`, are how triggers and thumbsticks express themselves
  - sometimes we use numbers greater then `1`, like for dots of pointer movement like in `pointer.move.up`
  - don't worry about sensitivity, deadzones, values like `0.00001` — actions will account for all that using bindings later on

### 🥝 sample code modprefixes
- here at tact, we have this nifty `modprefix` convention
- consider a keycode like `KeyA`
    - `ctrl-KeyA` means the "ctrl" modifier was held
    - `alt-KeyA` means the "alt" modifier was held
    - `meta-KeyA` means the "meta" modifier was held (command or windows keys)
    - `shift-KeyA` means the "shift" modifier was held
    - `ctrl-alt-meta-shift-KeyA` they can stack, but always in this order (the word `cams` helps remind me the valid order)
    - `x-KeyA` means *no* modifier was held (exclusive)
    - `KeyA` doesn't care if any modifiers were held or not

### 🥝 sample code reference
- **KeyboardDevice**
    - any [standard keycode](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values)
        - `KeyA`
        - `Space`
        - `Digit2`
        - etc
    - plus the modprefixes
        - `ctrl-KeyA`
        - `alt-shift-Space`
        - `x-Digit2`
        - etc
- **PointerDevice**
    - mouse buttons (plus modprefixes)
        - `pointer.button.left`
        - `pointer.button.right`
        - `pointer.button.middle`
        - `pointer.button.4`
        - `pointer.button.5`
    - mouse wheel (plus modprefixes)
        - `pointer.wheel.up`
        - `pointer.wheel.down`
        - `pointer.wheel.left`
        - `pointer.wheel.right`
    - mouse movements
        - `pointer.move.up`
        - `pointer.move.down`
        - `pointer.move.left`
        - `pointer.move.right`
- **GamepadDevice**
    - gamepad buttons
        - `gamepad.a`
        - `gamepad.b`
        - `gamepad.x`
        - `gamepad.y`
        - `gamepad.bumper.left`
        - `gamepad.bumper.right`
        - `gamepad.trigger.left`
        - `gamepad.trigger.right`
        - `gamepad.alpha`
        - `gamepad.beta`
        - `gamepad.stick.left.click`
        - `gamepad.stick.right.click`
        - `gamepad.up`
        - `gamepad.down`
        - `gamepad.left`
        - `gamepad.right`
        - `gamepad.gamma`
    - gamepad sticks
        - `gamepad.stick.left.up`
        - `gamepad.stick.left.down`
        - `gamepad.stick.left.left`
        - `gamepad.stick.left.right`
        - `gamepad.stick.right.up`
        - `gamepad.stick.right.down`
        - `gamepad.stick.right.left`
        - `gamepad.stick.right.right`

<br/><br/>

## 🍋 tact bindings
> keybindings! they describe how actions interpret samples

### 🥝 bindings example
- let's start with a small example:
    ```ts
    import {Bindings} from "@benev/tact"

    const bindings = asBindings({
      walking: {
        forward: [{lenses: [{code: "KeyW"}]}],
        jump: [{lenses: [{code: "Space"}]}],
      },
      gunning: {
        shoot: [{lenses: [{code: "pointer.button.left"}]}],
      },
    })
    ```
    - `walking` and `gunning` are **modes**
    - `forward`, `jump`, and `shoot` are **actions**
    - data like `[{lenses: [{code: "KeyW"}]}]` are the rules for triggering the action.
      - 🚨 TODO okay these rules are complex and i'm gonna rework them soon
    - whole modes can be enabled or disabled

<br/><br/>

## 🍋 tact station
> polling gives you actions

### 🥝 creating a station
- create a station
    ```ts
    import {Station} from "@benev/tact"

    const station = new Station(bindings)
      .addModes("walking")
      .addDevices(
        new KeyboardDevice(window),
        new PointerDevice(window),
      )
    ```

### 🥝 how to use actions
- poll the station every frame
    ```ts
    station.poll(Date.now())
    ```
- now you use the `actions`
    ```ts
    station.actions.walking.forward.value // 1
    ```
    - `walking` is a `mode`
    - `forward` is an `action`
    - `action.value` — current value
    - `action.previous` — last frame's value
    - `action.changed` — true if value and previous are different
    - `action.pressed` — true if the value > 0
    - `action.down` — true for one frame when the key goes from up to down
    - `action.up` — true for one frame when the key goes from down to up
    - `action.on(action => {})` — react to changes ([`@e280/stz`](https://github.com/e280/stz) sub fn)
    - `action.onDown(action => {})` — react only on down ([`@e280/stz`](https://github.com/e280/stz) sub fn)

### 🥝 more about station
- you can enable/disable modes like this (it's a set)
    ```ts
    station.modes.add("gunning")
      // now the "gunning" actions can fire

    station.modes.delete("walking")
      // now the "walking" actions *cannot* fire
    ```
- you can add/remove devices from the set any time
    ```ts
    station.devices.add(new GamepadDevice(pad))
    ```
- you can update the bindings at runtime
    ```ts
    station.bindings = bindings2
    ```

<br/><br/>

## 🍋 tact switchboard
> multiple gamepads! couch co-op is so back

### 🥝 feel the vibes
- you know the way old timey game consoles had controller ports? and then players could plug their controller into whatever port they wanted? and then you could unplug and replug your controller into a different port? yeah — that's what switchboard does.
- with the switchboard, think of the "stations" as controller ports, and the "devices" as player controllers.
- import stuff:
    ```ts
    import {
      Switchboard, Station,
      GroupDevice, GamepadDevice, KeyboardDevice, PointerDevice,
    } from "@benev/tact"
    ```

### 🥝 create a switchboard with stations
- **adopt standard switchboard bindings**
    ```ts
    // transform your game's bindings into switchboard-friendly bindings
    const sBindings = Switchboard.bindings(bindings)
    ```
    - this allows players to shimmy what station their controller controls
    - gamepad: hold middle button and press bumpers
    - keyboard: left bracket or right bracket
- **make switchboard with stations at the ready**
    ```ts
    const switchboard = new Switchboard([
      new Station(sBindings),
      new Station(sBindings),
      new Station(sBindings),
      new Station(sBindings),
    ])
    ```
    - yes that's right — each player can have their own bindings 🤯

### 🥝 connect player's devices to the switchboard
- **let's connect the keyboard/mouse player**
    ```ts
    switchboard.connect(
      new GroupDevice(
        new KeyboardDevice(window),
        new PointerDevice(window),
      )
    )
    ```
    - the switchboard assumes a single device represents a single player, thus we can use a `GroupDevice` to combine multple devices into one
- **wire up gamepad auto connect/disconnect**
    ```ts
    GamepadDevice.on(device => switchboard.connect(device))
    ```

### 🥝 you're ready!
- **do your polling, interrogate those actions**
    ```ts
    const [p1, p2, p3, p4] = switchboard.stations

    // poll them all
    switchboard.poll(Date.now())

    p1.actions.walking.jump.value // 1
    p2.actions.walking.jump.value // 0
    ```

### 🥝 the more you know, about the switchboard
- `switchboard.stations` — direct access to the array of stations
- `switchboard.isActive(p1)` — check if there's a switchboard-connected-device assigned to this station
- `switchboard.shimmy(device, 1)` — shimmy a device forward one station
- `switchboard.shimmy(device, -1)` — shimmy a device backward one station
- `switchboard.connect(device, p4)` — connect-or-reassign a device to a specific station
- `switchboard.connect(device)` — connect a device to the next unassigned station (or the last station)
- `switchboard.disconnect(device)` — unassign a device and forget about it

<br/><br/>

## 🍋 tact nubs
> mobile ui like virtual thumbsticks and buttons

### 🥝 nub stick
> TODO lol need to write docs

### 🥝 nub virtual gamepad
> TODO lol need to write docs

<br/><br/>

## 🍋 tact is by https://benevolent.games/
> building the future of web games

