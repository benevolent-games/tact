
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
1. **controller will convert device samples to activity (compact binary data ideal for networking)**
    ```ts
    const controller = new Controller(bindings)
    ```
1. **port will convert activity into actions (ergonomics for checking if buttons are pressed etc)**
    ```ts
    const port = new Port(bindings.shape)
    ```
1. **all together now!**
    ```ts
    onMyGameTick(() => {
      const activity = controller.update(devices.samples())
      const actions = port.update(activity)

      // now you can check your actions
      actions.running.forward.value // 1.0
      actions.running.forward.pressed // true
    })
    ```
1. **consider the following...**  
    imagine an old-timey game console, with four ports on the front for plugging controllers into. *each **controller** sends **activity** down the wire to a **port.***  
    now if you're thinking about networking: controllers make sense on the clientside, ports make sense on the serverside.

