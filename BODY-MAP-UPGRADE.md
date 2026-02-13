# BODY MAP - REPLACE WIREFRAME WITH POLISHED SVG SILHOUETTE

You CANNOT ask questions. You CANNOT ask for approval. Just make it look amazing.

First: git pull origin main and npm install

# TASK
Replace the current BodyMap figure (wireframe outline with circle hitpoints) with a clean, modern, anatomically proportioned SVG body silhouette. Same functionality - tap a body region to see/add conditions linked to that area. Just way better looking.

## Step 1: Read the current implementation
Read src/pages/BodyMap.tsx and grep for BodyMap references. Understand what regions are defined, what happens on tap, how conditions map to regions, and the current color scheme.

## Step 2: Design the new SVG body
Create an inline SVG (NOT an external file) directly in the React component.

Visual Design:
- Style: Filled silhouette - NOT wireframe, NOT stick figure, NOT realistic anatomy illustration
- Proportions: Proper human proportions (8-head-tall rule), standing front-facing, arms slightly away from body so regions are tappable
- Gender: Neutral/androgynous silhouette - no gendered features
- Default body fill: #1A1A2E (dark navy-charcoal) in dark mode, #E0E0E0 (light gray) in light mode
- Region hover/active: Metallic Gold gradient (135deg, #C5A442, #E8D48B) - use SVG linearGradient
- Region with conditions: Gold fill at 40 percent opacity persistent highlight
- Region border on hover: Gold stroke #C5A442, 2px
- Selected region: Full gold fill with gentle pulse animation
- Background: Transparent

Body Regions (tap zones) - each is an SVG path element, NOT circles on figure:
head, face-jaw, eyes, ears, neck, left-shoulder, right-shoulder, chest, upper-back, lower-back, abdomen, left-upper-arm, right-upper-arm, left-forearm, right-forearm, left-hand, right-hand, left-hip, right-hip, left-upper-leg, right-upper-leg, left-knee, right-knee, left-lower-leg, right-lower-leg, left-foot, right-foot, mental (brain overlay on head for PTSD/depression/anxiety/TBI)

Mental Health: Add brain/mind icon overlaid on head region. Visually distinct - subtle glow or different icon shape.

## Step 3: Interaction Design
On tap: region fills gold (200ms), panel slides up showing region name, conditions list (name, rating, link to detail), or empty state with Add Condition button. Tap another region switches panel. Tap same region closes it.

Use existing condition-to-body-region mapping. Enhance if incomplete. Mental health to mental region.

Visual indicators: 0 conditions = default. 1+ = gold 40 percent. 50+ rated = 60 percent. Desktop hover = brightness + gold border.

Responsive: SVG width 100 percent viewBox 0 0 400 800. Works at 375px. Touch targets 44x44px min. Max width 400px desktop.

## Step 4: SVG Construction
viewBox 0 0 400 800. Gold gradients in defs. Each region separate path with id, className, onClick, role button, tabIndex 0, aria-label. Paths fit seamlessly like puzzle pieces. Smooth curves (C, S, Q commands). Drop shadow filter.

DO NOT draw crude rectangles. Natural body outline with curves:
Head oval 50px radius, neck tapered, shoulders smooth curve 160px span, torso tapers, arms separated with elbow bend, hands paddle shapes, hips widen, legs taper, feet angled. Professional not cartoonish.

## Step 5: Animations
Hover: transition fill/stroke/filter 200ms ease, cursor pointer, brightness 1.2
Selected: gentle-pulse keyframes opacity 0.8 to 1, 2s ease-in-out infinite

## Step 6: Dark/Light mode
Dark: fill #1A1A2E. Light: fill #D0D0D0. Use existing theme system.

## Step 7: Keep ALL existing functionality preserved.

## Step 8: Test everything then build, typecheck, test, commit and push:
npm run build and npx tsc --noEmit and npx vitest run
git add -A and git commit -m feat: replace wireframe BodyMap with polished SVG silhouette
git push origin main

## Step 9: Add Body Map button to Dashboard
Read Dashboard.tsx. Add Body Map in tool shortcuts row. Use PersonStanding or Accessibility icon from Lucide. Gold #C5A442 icon. Match existing button style. Navigate to Body Map route. Put in first 4-5 visible shortcuts.
Then build, typecheck, test, commit and push.
