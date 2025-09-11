
# 🎮 @benev/tact
> *web game input library, from keypress to couch co-op*

```ts
npm install @benev/tact
```

tact is a toolkit for handling user inputs on the web.  
it's good at user-customizable keybindings, multiple gamepad support, and mobile ui.  

- 🛹 **[#deck](#deck)** full setup with localstorate persistence
- 🎮 **[#devices](#devices)** produce user input samples
- 🧩 **[#bindings](#bindings)** describe how actions interpret samples
- 🔌 **[#port](#port)** updates actions by interpreting samples
- 🛞 **[#hub](#hub)** plugs devices into ports (multi-gamepad couch co-op!)
- 📱 **[#nubs](#nubs)** is mobile ui virtual gamepad stuff

> [!CAUTION]
> ### 🚨🚨 TACT IS UNDER DEVELOPMENT!! 🚨🚨
> *everything is half-broken right now.. just gimmie a minute to finish coding this, will ya?*



<br/><br/>
<a id="deck"></a>

## 🍋 tact deck
> *the full setup*

the deck is the heart of tact, tying all the pieces together and putting a bow on it for you.

### 🛹 deck setup
- **import stuff from tact**
    ```ts
    import * as tact from "@benev/tact"
    ```
- **setup your deck, and your game's bindings**
    ```ts
    const deck = await tact.Deck.load({

      // how many player ports are possible? 1 is fine..
      portCount: 4,

      // where to store the user-customized bindings
      kv: tact.localStorageKv(),

      // default archetypal bindings for your game
      bindings: {
        walking: {forward: "KeyW", jump: "Space"},
        gunning: {
          shoot: ["or", "pointer.button.left", "gamepad.trigger.right"],
        },
      },
    })
    ```

### 🛹 plug devices into the hub
- **plug a keyboard/mouse player into the hub**
    ```ts
    deck.hub.plug(
      new tact.GroupDevice(
        new tact.KeyboardDevice(),
        new tact.PointerDevice(),
        new tact.VpadDevice(),
      )
    )
    ```
- **auto connect/disconnect gamepads as they come and go**
    ```ts
    tact.autoGamepads(deck.hub.plug)
    ```

### 🛹 do your gameplay
- **start with what modes you want enabled in your game**
    ```ts
    for (const port of deck.hub.ports)
      port.modes.adds("walking", "gunning")
    ```
- **poll the deck, interrogate actions for your gameplay**
    ```ts
    onEachTickInYourGame(() => {

      // do your polling
      const [p1, p2, p3, p4] = deck.hub.poll()

      // check if the first player is pressing "forward" action
      p1.walking.forward.pressed // true

      // check how hard the second player is pulling that trigger
      p2.gunning.shoot.value // 0.123
    })
    ```



<br/><br/>
<a id="devices"></a>

## 🍋 tact devices
> *sources of user input "samples"*

### 🎮 polling is good, actually
- tact operates on the basis of *polling*
- *"but polling is bad"* says you — but no — you're wrong — polling is unironically *based,* and you *should* do it
- in a game, we want to be processing our inputs *every frame*
- the gift of polling is total control over *when* inputs are processed
- i will elaborate no further 🗿

### 🎮 basically how a device works
- make a device
    ```ts
    const keyboard = new tact.KeyboardDevice()
    ```
- take samples each frame
    ```ts
    const samples = keyboard.takeSamples()
      // [
      //   ["KeyA", 1],
      //   ["Space", 0]
      // ]
    ```
- some devices have disposers to call when you're done with them
    ```ts
    keyboard.dispose()
    ```

### 🎮 samples explained
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

### 🎮 sample code reference
- **KeyboardDevice**
    - any [standard keycode](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values)
        - `KeyA`
        - `Space`
        - `Digit2`
        - etc
- **PointerDevice**
    - mouse buttons
        - `pointer.button.left`
        - `pointer.button.right`
        - `pointer.button.middle`
        - `pointer.button.4`
        - `pointer.button.5`
    - mouse wheel
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
<a id="bindings"></a>

## 🍋 tact bindings
> *keybindings! they describe how actions interpret samples*

### 🧩 bindings example
- **let's start with a small example:**
    ```ts
    const bindings = tact.asBindings({
      walking: {forward: "KeyW", jump: "Space"},
      gunning: {
        shoot: ["or", "pointer.button.left", "gamepad.trigger.right"],
      },
    })
    ```
    - `walking` and `gunning` are **modes**
    - `forward`, `jump`, and `shoot` are **actions**
    - note that whole modes can be enabled or disabled during gameplay

### 🧩 bindings are a lispy domain-specific-language
- **you can do complex stuff**
    ```ts
    ["or",
      "KeyQ",
      ["and",
        "KeyA",
        "KeyD",
        ["not", "KeyS"],
      ],
    ]
    ```
    - press Q, or
    - press A + D, while not pressing S
- **you can get really weird**
    ```ts
    ["cond",
      ["code", "gamepad.trigger.right", {range: [0, 0.5], timing: ["tap"]}],
      ["and", "gamepad.bumper.left", ["not", "gamepad.trigger.left"]],
    ]
    ```
    - hold LB and tap RT halfway while not holding LT

### 🧩 bindings atom reference
- **string** — strings are interpreted as "code" atoms with default settings
- **"code"** — allows you to customize the settings
    ```ts
    ["code", "KeyA", {
		  scale: 1,
		  invert: false,
		  deadzone: 0,
		  timing: ["direct"],
    }]
    ```
    - defaults shown
    - `scale` is sensitivity, the value gets multiplied by this
    - `invert` will invert a value by subtracting it from 1
    - `deadzone` ignores values below the threshold (and remaps to preserve the range)
    - `timing` lets you specify special timing considerations
      - `["direct"]` ignores timing considerations
      - `["tap", 250]` only fires for taps under 250ms
      - `["hold", 250]` only fires for holds over 250ms
- **"or"** — resolves to the maximum value
    ```ts
    ["or", "KeyA", "KeyB", "KeyC"]
    ```
- **"and"** — resolves to the minimum value
    ```ts
    ["and", "KeyA", "KeyB", "KeyC"]
    ```
- **"not"** — resolves to the opposite effect
    ```ts
    ["not", "KeyA"]
    ```
- **"cond"** — conditional situation (example for modifiers shown)
    ```ts
    ["cond", "KeyA", ["and",
      ["or", "ControlLeft", "ControlRight"],
      ["not", ["or", "AltLeft", "AltRight"]],
      ["not", ["or", "MetaLeft", "MetaRight"]],
      ["not", ["or", "ShiftLeft", "ShiftRight"]],
    ]]
    ```
    - KeyA is the value that gets used
    - but only if the following condition passes
- **"mods"** — macro for modifiers
    ```ts
    ["mods", "KeyA", {ctrl: true}]
    ```
    - equivalent to the "cond" example above
    - `ctrl`, `alt`, `meta`, `shift` are available



<br/><br/>
<a id="port"></a>

## 🍋 tact port
> *polling gives you "actions"*

a port represents a single playable port, and you poll it each frame to resolve actions for you to read.

### 🔌 port basics
- **make a port**
    ```ts
    const port = new tact.Port(bindings)
    ```
- **attach some devices to the port**
    ```ts
    port.devices
      .add(new tact.KeyboardDevice())
      .add(new tact.PointerDevice())
      .add(new tact.VpadDevice())
    ```
    - you can add/delete devices from the set any time
- **don't forget to enable modes!**
    ```ts
    port.modes.add("walking")
    ```
    - if you don't enable any modes, no actions will happen
    - actions only happen for enabled modes
    - you can toggle modes on and off by adding/deleting them from the modes set
- **you can update the bindings any time**
    ```ts
    port.bindings = freshBindings
    ```
- **wire up gamepad auto connect/disconnect**
    ```ts
    tact.autoGamepads(device => {
      port.devices.add(device)
      return () => port.devices.delete(device)
    })
    ```

### 🔌 interrogating actions
- **poll the port every frame**
    ```ts
    const actions = port.poll()
    ```
- **now you can inspect the `actions`**
    ```ts
    actions.walking.forward.value // 1
    ```
    - `walking` is a `mode`
    - `forward` is an `action`
    - `action.value` — current value
    - `action.previous` — last frame's value
    - `action.changed` — true if value and previous are different
    - `action.pressed` — true if the value > 0
    - `action.down` — true for one frame when the key goes from up to down
    - `action.up` — true for one frame when the key goes from down to up



<br/><br/>
<a id="hub"></a>

## 🍋 tact hub
> *multiple gamepads! couch co-op is so back*

you know the way old-timey game consoles had four controller ports on the front?

the hub embraces that analogy, helping you coordinate the plugging and unplugging of virtual controller devices into its virtual ports.

### 🛞 create a hub with ports
- **adopt standard hub bindings**
    ```ts
    const hubBindings = {
      ...yourBindings,

      // mixin standard hub bindings
      ...tact.hubBindings(),
    }
    ```
    - hub bindings let players shimmy what port their device is plugged into
    - gamepad: hold gamma (middle button) and press bumpers
    - keyboard: left bracket or right bracket
- **make hub with multiple ports at the ready**
    ```ts
    const hub = new tact.Hub([
      new tact.Port(hubBindings),
      new tact.Port(hubBindings),
      new tact.Port(hubBindings),
      new tact.Port(hubBindings),
    ])
    ```
    - yes that's right — each player port gets its own bindings 🤯

### 🛞 plug in some devices
- **let's plug in the keyboard/mouse player**
    ```ts
    hub.plug(
      new tact.GroupDevice(
        new tact.KeyboardDevice(),
        new tact.PointerDevice(),
        new tact.VpadDevice(),
      )
    )
    ```
    - the hub requires a single device to represent a player, thus we can use a `GroupDevice` to combine multple devices into one
- **wire up gamepad auto connect/disconnect**
    ```ts
    tact.autoGamepads(hub.plug)
    ```

### 🛞 it's gaming time
- **do your polling, interrogate those actions**
    ```ts
    const [p1, p2, p3, p4] = hub.poll()

    p1.walking.jump.value // 1
    p2.walking.jump.value // 0
    ```



<br/><br/>
<a id="nubs"></a>

## 🍋 tact nubs
> *mobile ui like virtual thumbsticks and buttons*

### 📱 nub stick
> TODO lol need to write docs

### 📱 nub virtual gamepad
> TODO lol need to write docs



<br/><br/>
<a id="benev"></a>

## 🍋 tact is by https://benevolent.games/
> *building the future of web games*

