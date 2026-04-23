
# 🎮 @benev/tact
> *web game input library, from keypress to couch co-op*

```ts
npm install @benev/tact
```

tact is a toolkit for handling user inputs on the web.  
it's good at user-customizable keybindings, multiple gamepad support, networking, and mobile ui.  



<br/>

## tact basics

```ts
import {
  Bindings, Devices,
  KeyboardDevice, PointerDevice,
  makeActivityResolver, makeActionsResolver,
} from "@benev/tact"
```

1. **setup your game's keybindings**
    ```ts
    // 🧙‍♂️ initializes a static schema for networking purposes
    const bindings = new Bindings({
      running: {forward: "KeyW", jump: ["and", "ShiftLeft", "Space"]},
      gunning: {shoot: ["or", "pointer.button.left", "gamepad.trigger.right"]},
    })
    ```
1. **create your devices (which provide raw input samples)**
    ```ts
    const devices = new Devices(
      new KeyboardDevice(),
      new PointerDevice(),
    )
    ```
1. **make your resolvers**
    ```ts
    const resolveActivity = makeActivityResolver(bindings)
    const resolveActions = makeActionsResolver(bindings.shape)
    ```
1. **run your resolvers, read your actions**
    ```ts
    import {cycle} from "@e280/stz"

    cycle(function myGameTick() {

      // 🧙‍♂️ "activity" is a Uint8Array, ready for networking/recording
      const activity = resolveActivity(Date.now(), devices.samples())

      // 🧙‍♂️ "actions" is your friendly ergonomic way to read action values.
      const actions = resolveActions(activity)

      // 🧙‍♂️ ok, now check your actions.
      actions.running.forward.value // 1.0
      actions.running.forward.pressed // true
    })
    ```

