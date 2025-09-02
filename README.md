
# 🎮 @benev/tact
> *web game input library, from keypress to couch co-op*

```ts
npm install @benev/tact
```

- 🛹 **deck** user input coordinator with bindings persistence
- 🎮 **controllers** produce user input samples
- 🧩 **bindings** describe how actions interpret samples
- 🔌 **port** updates actions by interpreting samples
- 🛞 **hub** plugs controllers into ports (multi-gamepad couch co-op!)
- 📱 **nubs** is mobile ui virtual gamepad stuff



<br/><br/>

## 🍋 tact deck
> *full user input system with localstorage bindings persistence*

the deck is the heart of tact, bundling together a hub with multiple ports, and handling persistence for bindings preferences.

you don't have to use the deck, you could wire up a hub and ports yourself — but the deck wraps it up and puts a bow on it for you.

### 🛹 deck setup
- **import stuff from tact**
    ```ts
    import * as tact from "@benev/tact"
    ```
- **setup your deck, and your game's bindings**
    ```ts
    const deck = await tact.Deck.load({
      portCount: 4,
      kv: tact.localStorageKv(),
      bindings: {
        ...tact.hubBindings(),
        walking: {
          forward: [
            {lenses: [{code: "KeyW"}]},
            {lenses: [{code: "gamepad.stick.left.up"}]},
          ],
          jump: [
            {lenses: [{code: "Space"}]},
            {lenses: [{code: "gamepad.a"}]},
          ],
        },
        gunning: {
          shoot: [
            {lenses: [{code: "pointer.button.left"}]},
            {lenses: [{code: "gamepad.trigger.right"}]},
          ],
        },
      },
    })
    ```

### 🛹 plug controllers into the hub
- **plug a keyboard/mouse player into the hub**
    ```ts
    deck.hub.plug(
      new tact.GroupController(
        new tact.KeyboardController(),
        new tact.PointerController(),
        new tact.VirtualGamepadController(),
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
    for (const port of deck.ports)
      port.modes.adds("walking", "gunning")
    ```
- **poll the deck, interrogate actions for your gameplay**
    ```ts
    onEachTickInYourGame(() => {

      // do your polling
      const [p1, p2, p3, p4] = deck.hub.poll()

      // check if the first player is pressing "forward" action
      p1.actions.walking.forward.pressed // true

      // check how hard the second player is pulling that trigger
      p2.actions.gunning.shoot.value // 0.123
    })
    ```



<br/><br/>

## 🍋 tact controllers
> *produces user input "samples"*

### 🎮 polling is good, actually
- tact operates on the basis of *polling*
- *"but polling is bad"* says you — but no — you're wrong — polling is unironically *based,* and you *should* do it
- in a game, we want to be processing our inputs *every frame*
- the gift of polling is total control over *when* inputs are processed
- i will elaborate no further 🗿

### 🎮 basically how a controller works
- make a controller
    ```ts
    const keyboard = new tact.KeyboardController()
    ```
- take samples each frame
    ```ts
    const samples = keyboard.takeSamples()
      // [
      //   ["KeyA", 1],
      //   ["Space", 0]
      // ]
    ```
- some controllers have disposers to call when you're done with them
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

### 🎮 sample code modprefixes
- here at tact, we have this nifty `modprefix` convention
- consider a keycode like `KeyA`
    - `ctrl-KeyA` means the "ctrl" modifier was held
    - `alt-KeyA` means the "alt" modifier was held
    - `meta-KeyA` means the "meta" modifier was held (command or windows keys)
    - `shift-KeyA` means the "shift" modifier was held
    - `ctrl-alt-meta-shift-KeyA` they can stack, but always in this order (the word `cams` helps remind me the valid order)
    - `x-KeyA` means *no* modifier was held (exclusive)
    - `KeyA` doesn't care if any modifiers were held or not

### 🎮 sample code reference
- **KeyboardController**
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
- **PointerController**
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
- **GamepadController**
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
> *keybindings! they describe how actions interpret samples*

### 🧩 bindings example
- let's start with a small example:
    ```ts
    const bindings = tact.asBindings({
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

## 🍋 tact port
> *polling gives you "actions"*

### 🔌 port basics
- **make a port**
    ```ts
    const port = new tact.Port(bindings)
    ```
- **attach some controllers to the port**
    ```ts
    port.controllers
      .add(new tact.KeyboardController())
      .add(new tact.PointerController())
      .add(new tact.VirtualGamepadController())
    ```
    - you can add/delete controllers from the set any time
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

## 🍋 tact hub
> *multiple gamepads! couch co-op is so back*

you know the way old-timey game consoles had four controller ports on the front?

the hub embraces that analogy, helping you coordinate the plugging and unplugging of virtual controllers into its virtual ports.

### 🛞 create a hub with ports
- **adopt standard hub bindings**
    ```ts
    const hubBindings = {
      ...yourBindings,

      // mixin the hub bindings
      ...tact.hubBindings(),
    }
    ```
    - hub bindings let players shimmy what port their controller is plugged into
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

### 🛞 plug in some controllers
- **let's plug in the keyboard/mouse player**
    ```ts
    hub.plug(
      new tact.GroupController(
        new tact.KeyboardController(),
        new tact.PointerController(),
        new tact.VirtualGamepadController(),
      )
    )
    ```
    - the hub requires a single controller to represent a player, thus we can use a `GroupController` to combine multple controllers into one
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

## 🍋 tact nubs
> *mobile ui like virtual thumbsticks and buttons*

### 📱 nub stick
> TODO lol need to write docs

### 📱 nub virtual gamepad
> TODO lol need to write docs



<br/><br/>

## 🍋 tact is by https://benevolent.games/
> *building the future of web games*

