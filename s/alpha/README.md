
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
  Bindings, Controller, Port,
  Devices, KeyboardDevice, PointerDevice,
} from "@benev/tact"
```

1. **setup your game's keybindings**
    ```ts
    const bindings = new Bindings({
      running: {forward: "KeyW", jump: ["and", "ShiftLeft", "Space"]},
      gunning: {shoot: ["or", "pointer.button.left", "gamepad.trigger.right"]},
    })
    ```
1. **composable devices yield raw input samples**
    ```ts
    const devices = new Devices(
      new KeyboardDevice(),
      new PointerDevice(),
    )
    ```
1. **resolver converts device samples into activity (compact binary format ideal for networking)**
    ```ts
    const resolveActivity = makeResolver(bindings)
    ```
1. **compiler converts activity into actions (ergonomics for checking if buttons are pressed etc)**
    ```ts
    const compileActions = makeCompiler(bindings.shape)
    ```
1. **all together now!**
    ```ts
    onMyGameTick(() => {
      const activity = resolveActivity(Date.now(), device.samples())
      const actions = compileActions(activity)

      // now you can check your actions
      actions.running.forward.value // 1.0
      actions.running.forward.pressed // true
    })
    ```

