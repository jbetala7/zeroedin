# 🎯 Interactive Particle Shooting Range (Claude Guide)

## Project Goal

Build a **non-violent, abstract shooting-range simulation** using **particle systems**.
The focus is on **interaction, feedback, and motion design**, not realism.

---

## Design Principles

* **No realism** (no bullets, no damage models)
* **Particles represent impact**
* **Immediate visual feedback**
* **High performance**
* **Modular architecture**

---

## Tech Stack

* Three.js (core)
* WebGL
* requestAnimationFrame
* Optional: GSAP (for easing only)

---

## Folder Structure

```
/src
  /core
    scene.js
    camera.js
    renderer.js
    loop.js

  /systems
    ParticleSystem.js
    TargetSystem.js
    ImpactSystem.js

  /interaction
    AimController.js
    FireController.js
    RaycastManager.js

  /effects
    Shockwave.js
    ColorBurst.js

  /utils
    math.js
    constants.js

  main.js
index.html
claude.md
```

---

## Core Modules (Responsibilities)

### ParticleSystem

* Creates particle geometry
* Handles position, color, velocity buffers
* Exposes:

  * `explode(origin)`
  * `reset()`
  * `update(delta)`

---

### TargetSystem

* Defines target shapes
* Converts target geometry → particles
* Tracks hit zones

---

### RaycastManager

* Converts screen position → world ray
* Detects target intersection
* Returns impact point

---

### ImpactSystem

* Receives hit data
* Triggers:

  * Particle dispersion
  * Shockwave effect
  * Color transition
* No physics engine required

---

## Interaction Flow

1. User moves mouse → aim reticle
2. User clicks → fire
3. Raycast hits target
4. ImpactSystem triggers particle response
5. Target regenerates after delay

---

## Performance Rules

* Use `BufferGeometry`
* Avoid per-particle objects
* Update arrays directly
* Clamp particle counts
* Prefer shaders over JS when possible

---

## Visual Rules

* Dark background
* Bright particles
* Subtle bloom-friendly colors
* No UI clutter

---

## Extensibility Notes

This architecture must support:

* Multiple targets
* Multiple weapons
* Scoring overlays
* Replay mode
* Training analytics

---

## What NOT to Do

* No gun realism
* No physics engines unless necessary
* No DOM-heavy UI
* No unnecessary libraries

---

## Success Criteria

* Smooth interaction
* Clear hit feedback
* Visually satisfying impacts
* Clean, readable code
* Easy to extend

---

## Mental Model

This is **motion graphics meets training simulation**, not a game.
