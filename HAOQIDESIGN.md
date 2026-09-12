## CSEA Landing Page — Interactive Glass + Falling Stickers

I want the CSEA landing page hero to have a premium retro-futurist visual effect inspired by HAOQI.DESIGN.

IMPORTANT:
Do not implement this as simple CSS glassmorphism.
I want a REAL interactive WebGL/WebGL-shader-based glass/refraction effect.

### Visual Concept

The page has a clean white/off-white background.

Behind the main hero typography, several small CSEA-themed sticker graphics continuously fall from the top of the screen.

Examples of stickers:
- CSEA logo/symbol
- lightning symbol
- stars
- smiley-style symbols
- abstract CSEA shapes
- small geometric graphics

There should only be around 3–6 visible stickers at a time.
They should feel like physical stickers/particles naturally falling downward rather than UI cards.

The stickers should move behind a large transparent/frosted glass layer.

The hero typography remains completely sharp and readable above everything.

Layer order:

BACKGROUND
↓
FALLING CSEA STICKERS
↓
INTERACTIVE GLASS / REFRACTION
↓
GRID / DECORATIVE ELEMENTS
↓
HERO TEXT
↓
NAVIGATION

### Glass Behavior

The glass should behave like a transparent physical lens.

It should:
- distort/refract the content behind it
- slightly magnify/warp the falling stickers
- create subtle chromatic dispersion
- have a soft translucent/frosted appearance
- have a subtle highlight/rim-light
- react to the user's mouse position
- feel fluid and organic rather than like a CSS blur

When the cursor moves:

- the glass distortion should follow the cursor
- distortion should have smooth inertia
- the effect should not instantly snap to the cursor
- distortion should be subtle and premium
- cursor movement can slightly increase distortion strength
- a subtle light/rim highlight can move around the glass

DO NOT distort the actual HTML typography.

The text, navigation and UI must remain perfectly sharp.

### Technical Architecture

Use React + Three.js / React Three Fiber if the existing project supports it.

Prefer this architecture:

CSEA App
├── DOM Layer
│   ├── Header
│   ├── Hero Typography
│   └── UI
│
├── WebGL Layer
│   ├── Background
│   ├── FallingStickerField
│   ├── Glass
│   │   ├── Render Target / FBO
│   │   ├── Refraction Shader
│   │   ├── Chromatic Dispersion
│   │   └── Rim Light
│   └── Post Processing
│
└── Shared Interaction
    ├── Pointer
    └── Animation State

### Falling Stickers

Implement the stickers inside WebGL so that the glass can actually refract them.

Prefer an InstancedMesh or another GPU-efficient approach instead of creating many independent meshes.

Use a texture atlas if practical.

Each sticker should have:
- position
- velocity
- rotation
- rotation velocity
- scale
- lifetime

Movement should feel natural.

Do NOT make all stickers fall at exactly the same speed.

Add slight:
- horizontal drift
- rotation
- scale variation
- timing variation

When a sticker leaves the bottom, recycle it from the top.

### Glass Rendering

The glass should be rendered separately from the scene behind it.

Conceptually:

1. Render background + falling stickers into an FBO/render target.
2. Do NOT include the glass itself in that render.
3. Render the glass mesh afterward.
4. The glass shader samples the FBO texture.
5. Distort the sampled UV coordinates to create refraction.
6. Add subtle RGB/chromatic separation.
7. Add Fresnel/rim lighting.
8. Use pointer position to control the distortion.

The glass should therefore actually distort the stickers behind it.

Do NOT fake this using only:

backdrop-filter: blur(...)

CSS backdrop-filter can be used as a fallback for unsupported devices, but it should not be the primary desktop implementation.

### Pointer Interaction

Create a centralized pointer state rather than updating React state every frame.

Normalize mouse coordinates to 0–1.

Track:

- pointer position
- pointer velocity
- whether pointer is inside viewport

Smooth/interpolate the pointer values in the render loop.

Example conceptual uniforms:

uPointer
uPointerVelocity
uTime
uResolution
uGlassStrength
uDispersion
uFresnel

Keep the distortion subtle.

The goal is:

"Whoa, the glass is reacting to my mouse."

NOT:

"Everything is being aggressively warped."

### Hero Typography

The foreground text must stay in normal DOM/HTML.

Example visual hierarchy:

BEYOND
THE
CLASSROOM.

or whatever typography already exists in the current CSEA design.

The typography should:
- remain crisp
- have strong editorial scale
- sit above the WebGL canvas
- not be affected by the shader
- remain accessible/selectable
- work properly on mobile

### Visual Style

Overall style:

- white/off-white background
- CSEA blue/purple accent
- minimal editorial design
- premium
- futuristic
- slightly experimental
- clean typography
- lots of negative space
- subtle grid
- no generic SaaS gradients
- no excessive glassmorphism
- no giant glowing blobs
- no excessive particles

The WebGL effect should support the design, not dominate it.

### Responsive Behavior

Desktop:
- full interactive WebGL glass
- falling stickers
- cursor interaction
- refraction
- subtle post-processing

Tablet:
- reduce particle count
- reduce distortion strength

Mobile:
- no expensive cursor interaction
- significantly reduce sticker count
- retain subtle glass appearance
- use CSS fallback or simplified shader
- no horizontal overflow
- maintain excellent performance

Respect:

prefers-reduced-motion

For reduced motion:
- disable falling animation
- disable aggressive distortion
- provide a static/frosted glass appearance
- keep the page fully usable

### Performance Requirements

This must be production quality.

Avoid:
- React state updates on every animation frame
- unnecessary DOM measurements
- creating/destroying meshes every frame
- excessive post-processing
- huge texture sizes
- unnecessary render passes

Use:
- requestAnimationFrame / R3F render loop
- GPU-friendly shaders
- InstancedMesh where appropriate
- texture atlas where appropriate
- proper disposal of geometries/materials/textures
- responsive pixel ratio limits

Target smooth 60 FPS on a reasonable laptop.

### IMPORTANT — Before Coding

First inspect the existing repository.

Determine:
- framework
- existing Three.js/R3F dependencies
- existing animation libraries
- existing component structure
- existing CSEA assets
- existing fonts
- existing hero implementation

Do NOT unnecessarily rewrite the existing application.

Reuse existing architecture where possible.

If Three.js/R3F is already installed, use it.

If it isn't installed and adding it is appropriate, install the minimum required dependencies.

### Implementation Process

Work autonomously.

1. Inspect repository.
2. Understand current landing page.
3. Identify reusable CSEA assets.
4. Implement the WebGL stage.
5. Implement falling stickers.
6. Implement FBO-based glass refraction.
7. Implement pointer interaction.
8. Integrate the DOM hero above WebGL.
9. Add responsive behavior.
10. Add reduced-motion fallback.
11. Run the application.
12. Open it in the browser.
13. Visually inspect the result.
14. Compare against the intended visual description.
15. Iterate on spacing, scale, distortion strength, sticker movement and layering.
16. Fix console errors and performance issues.
17. Run build/lint/typecheck if available.

Do not stop after the first implementation if the visual result is obviously unfinished.

### Most Important Visual Requirement

The final result should communicate this hierarchy:

             CSEA HERO TEXT
                    ↑
             crisp HTML text
                    ↑
          ┌──────────────────┐
          │  GLASS / LENS    │
          │                  │
          │  distorted       │
          │  falling CSEA    │
          │  stickers        │
          │                  │
          └──────────────────┘
                    ↑
          white background

The user should be able to move their mouse around the glass and visibly see the falling CSEA stickers subtly bend/refract through it.

It should feel like a physical transparent lens sitting in front of the scene.

Do not implement generic "glassmorphism".
Implement interactive refraction.