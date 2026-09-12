# CSEA Storytelling Section — Autonomous Implementation Rules

## 0. ROLE

You are the lead frontend engineer and visual interaction designer for the CSEA website.

Your task is to autonomously implement and polish ONE new scroll-driven storytelling section based on the provided visual reference.

You are authorized to:
- inspect the entire repository
- inspect existing components and styles
- create new components
- modify the target page
- install a dependency only when genuinely necessary
- run the development server
- use the browser to visually inspect the result
- iterate on the implementation
- fix visual and technical problems
- run build/lint/type checks
- refactor your own implementation

You must NOT wait for approval between normal implementation steps.

Work autonomously until the completion criteria in this document are satisfied.

---

# 1. PRIMARY OBJECTIVE

Create a premium editorial-style CSEA storytelling section.

This is NOT a conventional landing page.

This is NOT five vertically stacked sections.

It is ONE approximately 320vh scroll container containing FIVE visual story states.

The user scrolls through the 320vh container while a 100vh inner stage remains pinned.

The viewport/stage stays visually fixed.

The content, imagery, decorative elements, typography and SVG artwork transition as scroll progress changes.

The five stories are:

01 / VISION
Imagine more.

02 / AIM
Learn by building.

03 / COMMUNITY
Build together.

04 / CULTURE
Create together.

05 / IMPACT
Ideas create impact.

The experience should feel:
- premium
- minimal
- editorial
- technological
- sophisticated
- spacious
- intentional
- highly polished

Avoid:
- generic SaaS design
- generic AI-generated website aesthetics
- excessive gradients
- excessive glassmorphism
- excessive rounded cards
- excessive animation
- unnecessary 3D
- visual clutter

---

# 2. REFERENCE IMAGES

The provided reference images are the visual source of truth.

Study them carefully before implementation.

The reference establishes:

- white/off-white background
- electric blue accent
- oversized minimalist typography
- thin editorial grid
- large negative space
- asymmetric layouts
- thin borders
- small uppercase labels
- floating photography
- large abstract blue SVG path
- subtle decorative elements
- minimal navigation
- bottom story indicator

DO NOT use the screenshots themselves as website backgrounds.

Recreate the design using:
- HTML
- CSS
- SVG
- React
- existing project technologies

If suitable real CSEA images exist in the repository, use them.

Do not invent external image URLs.

---

# 3. FIRST ACTION — INSPECT THE REPOSITORY

Before modifying anything:

1. Identify the framework.
2. Identify the package manager.
3. Identify the application entry point.
4. Identify the page containing the target section.
5. Inspect existing components.
6. Inspect global CSS.
7. Inspect Tailwind configuration if present.
8. Inspect fonts.
9. Inspect existing animation libraries.
10. Check whether GSAP is already installed.
11. Inspect available image assets.
12. Inspect existing responsive breakpoints.
13. Inspect existing design tokens.
14. Identify components that can be reused.

Do NOT rewrite the application architecture.

Do NOT replace existing components unless necessary.

Do NOT modify unrelated pages.

Before coding, internally determine the smallest safe set of files that need modification.

---

# 4. PRESERVE THE EXISTING WEBSITE

The existing CSEA website is authoritative.

Never:
- delete working functionality
- rewrite unrelated pages
- replace the routing system
- replace the existing styling framework
- replace existing components without reason
- remove existing animations
- remove existing content outside this section
- introduce a new framework
- migrate the project to another framework

If existing infrastructure already solves a problem, use it.

Prefer extending the current architecture.

---

# 5. COMPONENT ARCHITECTURE

Create a reusable architecture appropriate to the existing project.

Preferred conceptual structure:

StorySection
├── StoryStage
├── StoryContent
├── StoryVisual
├── StoryPath
├── StoryDecorations
└── StoryProgress

Use data-driven story configuration.

Do NOT create five completely independent copies of the same component.

Conceptually:

stories = [
    {
        id: "vision",
        number: "01",
        label: "VISION",
        title: "Imagine more.",
        description: "...",
        images: [...]
    },
    ...
]

The implementation may use different component names if the existing architecture suggests better naming.

---

# 6. SCROLL ARCHITECTURE

The outer section must be approximately:

height: 320vh

The inner stage must be approximately:

height: 100vh
position: sticky
top: 0

Conceptually:

<section class="story-section">
    <div class="story-stage">
        ...
    </div>
</section>

The stage remains pinned while the user scrolls through the entire 320vh.

After the 320vh section completes, normal page scrolling resumes.

Do not create five separate sticky sections.

Do not use five separate pages.

Do not implement the interaction as a conventional carousel.

---

# 7. SCROLL PROGRESS

Use GSAP + ScrollTrigger if GSAP is available or is appropriate for the existing project.

Use one primary ScrollTrigger for the storytelling timeline.

Conceptually:

start: "top top"
end: "bottom bottom"
scrub: true

Map progress approximately:

0.00–0.20 → Story 01
0.20–0.40 → Story 02
0.40–0.60 → Story 03
0.60–0.80 → Story 04
0.80–1.00 → Story 05

Do not make story transitions feel abrupt.

Allow animation interpolation around the boundaries.

The implementation must be performant.

Do NOT cause unnecessary React state updates on every scroll frame.

Prefer:
- GSAP timelines
- refs
- transforms
- opacity
- CSS variables
- GPU-friendly properties

---

# 8. STORY 01 — VISION

Content:

01 / VISION

Imagine more.

A place where curiosity becomes exploration and ideas become something real.

Supporting concept:

LEARN · EXPLORE · GROW

Visual direction:

- large editorial image
- abstract blue path
- subtle plus-grid
- generous negative space
- small metadata

The image should feel like a floating editorial photograph.

Entrance:

- opacity 0 → 1
- scale approximately 0.88 → 1
- slight translation
- slight rotation settling into place

Text:

- upward reveal
- subtle opacity transition
- no exaggerated effects

---

# 9. STORY 02 — AIM

Content:

02 / AIM

Learn by building.

We encourage experimentation, collaboration, competition, and hands-on creation.

Supporting concept:

PROJECT · PRACTICE · PROGRESS

Visual direction:

- coding/building image
- smaller secondary image if appropriate
- blue path continuing from Story 01
- subtle plus-grid

Transition should feel continuous rather than like a slide change.

---

# 10. STORY 03 — COMMUNITY

Content:

03 / COMMUNITY

Build together.

Different ideas, different skills, one community pushing each other forward.

Supporting concept:

PEERS · MENTORS · OPPORTUNITIES

Visual direction:

Use 2–3 editorial image cards if suitable.

Cards should:
- overlap subtly
- have slight rotations
- use consistent border radius
- have controlled shadows
- enter with staggered timing

Do not clutter the viewport.

---

# 11. STORY 04 — CULTURE

Content:

04 / CULTURE

Create together.

CSEA is where students challenge themselves, share knowledge, and turn ideas into action.

Supporting concept:

DISCUSS · COLLABORATE · CREATE

Visual direction:

- event/workshop imagery
- editorial composition
- subtle orbital/decorative line work
- blue accent elements

Maintain the same visual system while allowing the composition to evolve.

---

# 12. STORY 05 — IMPACT

Content:

05 / IMPACT

Ideas create impact.

Use this state as the visual conclusion.

Include meaningful statistics if real data exists.

Potential structure:

24
PROJECTS

18
WORKSHOPS

300+
MEMBERS

12
EVENTS

IMPORTANT:

Do NOT invent real CSEA statistics.

If real values are not available in the repository, use placeholders or omit statistics.

Numbers should animate when the Impact state becomes active.

The final state should feel like a conclusion, not another ordinary content block.

---

# 13. TYPOGRAPHY

Typography is one of the most important parts of this design.

Prioritize:

- clean geometric sans-serif
- thin/light large headings
- strong hierarchy
- tight but intentional letter spacing
- small uppercase metadata
- muted gray body text

Do not introduce a new font unnecessarily.

If the project already has an appropriate font, use it.

Heading hierarchy should approximately feel like:

Imagine
more.

rather than:

IMAGINE MORE.

Avoid excessive font weights.

Avoid excessive bold text.

---

# 14. GRID

Create an editorial grid.

Desktop should approximately contain:

- 3 major vertical columns
- thin vertical guides
- horizontal guide lines
- subtle intersection markers

The grid is a visual element.

It should not interfere with readability.

Use:

- CSS grid
- pseudo-elements
- SVG
- CSS backgrounds

Do not create hundreds of unnecessary DOM elements just to draw grid lines.

The grid should be responsive.

---

# 15. BLUE SVG PATH

Create one large continuous SVG path.

The path should:

- use the primary CSEA blue
- have thick stroke
- use rounded line caps
- have no fill
- extend beyond the viewport
- sit behind the content
- use a responsive viewBox
- have pointer-events disabled

The path should visually connect all five stories.

It should feel like one continuous thread:

VISION
   ↓
AIM
   ↓
COMMUNITY
   ↓
CULTURE
   ↓
IMPACT

Do NOT create five unrelated blue lines.

---

# 16. SVG SCROLL ANIMATION

Animate the continuous SVG path using scroll progress.

Prefer:

stroke-dasharray
stroke-dashoffset

or an equivalent GSAP SVG animation.

The path should gradually reveal/travel as the user scrolls.

Do not restart the path animation at every story.

It is ONE continuous visual journey.

Keep the SVG behind text and images.

---

# 17. IMAGE SYSTEM

Use actual repository assets whenever possible.

Images should behave like editorial cards.

Desktop:
- 1–3 images per story
- asymmetric positioning
- subtle rotation
- controlled overlap
- rounded corners
- subtle shadow
- optional grayscale/desaturation

Transitions:

Outgoing:
- opacity → 0
- scale → approximately 1.04–1.08
- slight translation

Incoming:
- opacity 0 → 1
- scale 0.88–0.96 → 1
- slight rotation → final rotation
- optional blur → 0

Do not overuse blur.

Do not use expensive filters continuously during scrolling.

Mobile:
- prefer one primary image
- simplify overlapping compositions
- prevent text/image collisions

---

# 18. DECORATIVE ELEMENTS

Use whitespace intentionally.

Do NOT fill empty space with random graphics.

Possible decorative elements:

- small + grids
- blue dots
- orbital circles
- tiny arrows
- section metadata
- coordinate-style labels
- thin lines
- subtle blue glow
- small star/spark symbols
- wireframe shapes

Maximum guideline:

2–4 decorative systems per story.

Decorations should support the composition.

They should not compete with the headline.

---

# 19. STORY PROGRESS

Add a minimal progress indicator:

01   02   03   04   05

The active story should update according to scroll progress.

Active:
- blue
- subtle underline

Inactive:
- muted gray

The indicator remains visually stable while the stage is pinned.

Do not make it behave like a normal navigation menu unless existing requirements demand it.

---

# 20. HEADER

Preserve the visual language:

Top-left:
CSEA lightning/brand mark.

Top-right:

Menu +

Keep the header minimal.

It should remain usable throughout the pinned experience.

Do not introduce a large navigation bar.

---

# 21. ANIMATION STYLE

The animation must feel:

- smooth
- restrained
- cinematic
- editorial
- premium

Preferred properties:

- transform
- opacity
- scale
- rotation
- clip-path where appropriate
- SVG path drawing

Avoid:

- bouncing
- excessive spring effects
- aggressive parallax
- spinning objects
- flashing
- excessive blur
- excessive scaling
- constant background movement

The user should feel that the website is responding to their scroll, not fighting it.

---

# 22. REDUCED MOTION

Implement:

@media (prefers-reduced-motion: reduce)

or the appropriate framework equivalent.

When reduced motion is enabled:

- disable major transitions
- avoid continuous parallax
- avoid excessive SVG animation
- preserve content visibility
- preserve usability

The content must remain accessible without animation.

---

# 23. RESPONSIVE DESIGN

Test at:

Desktop:
1440 × 900
1280 × 800

Tablet:
1024 × 768
768 × 1024

Mobile:
390 × 844
375 × 812

Desktop:
- full editorial grid
- floating image cards
- large typography
- large SVG path

Tablet:
- reduce typography
- reduce image size
- preserve asymmetric composition

Mobile:
- preserve storytelling
- simplify decorations
- simplify SVG path
- use one main image per story
- prevent horizontal overflow
- preserve readable typography
- preserve five story states

Do NOT simply stack the five stories vertically unless absolutely required.

---

# 24. PERFORMANCE

Prioritize smooth scrolling.

Avoid:

- scroll event listeners that execute expensive work every frame
- React re-rendering every scroll frame
- layout calculations inside animation loops
- unnecessarily large images
- continuously animated filters
- unnecessary DOM nodes
- unnecessary dependencies

Prefer:

- transform
- opacity
- GSAP
- CSS transforms
- optimized images
- lazy loading where appropriate

Ensure ScrollTrigger is properly cleaned up on component unmount.

---

# 25. ACCESSIBILITY

Maintain:

- semantic HTML
- readable contrast
- keyboard accessibility
- image alt text
- usable navigation
- reduced-motion support

Decorative SVGs should not pollute the accessibility tree.

Use appropriate:

aria-hidden="true"

for purely decorative elements.

---

# 26. CODE QUALITY

Follow the existing project's conventions.

Use:
- existing naming conventions
- existing TypeScript configuration
- existing linting rules
- existing formatting rules
- existing component conventions

Avoid giant components.

Avoid duplicated markup.

Avoid magic numbers scattered throughout the code.

Centralize:
- story data
- animation constants
- major layout values

Add comments only where the implementation is non-obvious.

---

# 27. DEPENDENCIES

Before installing anything:

1. Check package.json.
2. Check whether GSAP already exists.
3. Check whether an existing animation solution can accomplish the task.

Do not install libraries unnecessarily.

If GSAP is absent and the project does not have an equivalent animation system, GSAP + ScrollTrigger is preferred for this interaction.

Do not add:
- unnecessary UI libraries
- unnecessary carousel libraries
- unnecessary animation libraries
- unnecessary 3D libraries

---

# 28. DEVELOPMENT LOOP

After each major implementation stage:

1. Run the development server.
2. Open the page in the browser.
3. Navigate to the storytelling section.
4. Scroll through the entire 320vh.
5. Inspect the animation.
6. Check for console errors.
7. Check for horizontal overflow.
8. Check layout at desktop.
9. Fix issues before continuing.

Never assume the implementation is correct just because it compiles.

---

# 29. VISUAL QA LOOP

After completing the first implementation:

Perform a visual comparison against the provided reference.

Check:

### Layout
- grid alignment
- whitespace
- section proportions
- content positioning

### Typography
- heading scale
- line breaks
- letter spacing
- paragraph width

### Images
- scale
- position
- rotation
- overlap

### SVG
- scale
- stroke width
- path placement
- animation

### Animation
- transition timing
- scroll synchronization
- state changes
- image entrances
- text entrances

### UI
- logo
- menu
- progress indicator
- decorative elements

Fix the largest visual differences first.

Repeat the comparison after every significant correction.

---

# 30. BROWSER TESTING

Test:

1. Entering the section from above.
2. Scrolling slowly.
3. Scrolling quickly.
4. Scrolling backwards.
5. Entering directly in the middle.
6. Leaving the section.
7. Returning to the section.
8. Resizing the browser.
9. Mobile viewport.
10. Reduced-motion mode.

There must be no:
- stuck sticky section
- blank content
- flickering
- broken animation
- horizontal scrollbar
- content disappearing permanently
- console errors

---

# 31. BUILD VALIDATION

Before declaring completion:

Run the project's appropriate:

- lint
- typecheck
- build

Use the actual scripts from package.json.

Do not invent commands.

Fix all errors caused by your implementation.

Warnings that already existed before your changes may remain if unrelated.

---

# 32. GIT SAFETY

You are working on an existing feature branch.

Do NOT:

- reset the branch
- force push
- delete branches
- rewrite unrelated commits
- modify git configuration

Do NOT automatically commit unless explicitly instructed.

Before finishing, inspect:

git status

and:

git diff

Make sure only intended files were modified.

---

# 33. FINAL COMPLETION CRITERIA

The task is complete ONLY when all of the following are true:

[ ] Existing website functionality still works.

[ ] Story section is approximately 320vh.

[ ] Inner stage is approximately 100vh and sticky.

[ ] Five story states exist.

[ ] Story content changes according to scroll progress.

[ ] Scroll behavior is smooth.

[ ] Text transitions are polished.

[ ] Images have premium entrance/exit animations.

[ ] Continuous blue SVG path exists.

[ ] SVG responds to scroll.

[ ] Editorial grid exists.

[ ] Intentional whitespace is preserved.

[ ] Decorative elements support the composition.

[ ] Story progress indicator works.

[ ] Impact state has a strong visual conclusion.

[ ] Mobile layout works.

[ ] No horizontal overflow.

[ ] Reduced-motion behavior works.

[ ] No new console errors.

[ ] Build succeeds.

[ ] Lint/typecheck succeeds where applicable.

[ ] Only relevant files were changed.

[ ] Browser visual QA has been completed.

---

# 34. AUTONOMOUS DECISION MAKING

When a minor implementation decision is not explicitly specified:

Choose the option that:

1. Best matches the reference.
2. Preserves the existing architecture.
3. Requires the least unnecessary code.
4. Provides the best performance.
5. Maintains accessibility.
6. Is easiest to maintain.

Do NOT stop and ask for approval for minor decisions.

If an asset is missing:
- inspect the repository for alternatives
- use an existing suitable asset
- create a clearly defined placeholder slot if necessary

Do not invent external resources.

If a technical approach fails:
- diagnose it
- try a reasonable alternative
- verify it in the browser
- continue autonomously

---

# 35. IMPORTANT DESIGN PRINCIPLE

Do not think:

"Five sections that need animations."

Think:

"One 320vh visual narrative containing five states."

The user should feel like they are travelling through one continuous CSEA story.

The blue path is the visual thread.

The grid is the structural thread.

The typography is the editorial thread.

The images provide the human/technical story.

The scroll is the interaction.

Everything should feel like one coherent system.

---

# 36. FINAL REPORT

When the implementation is complete, report:

1. Files created.
2. Files modified.
3. Dependencies added, if any.
4. Animation architecture.
5. Responsive behavior.
6. Tests/build commands executed.
7. Any known limitations.

Do not claim completion unless the browser QA and build validation have been performed.