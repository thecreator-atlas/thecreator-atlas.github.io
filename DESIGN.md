---
version: alpha
name: Atlas Monument
description: The name as a monument. Plum-black and hot pink, one geometric black typeface, a WebGL globe that carries the inbox home to Laguna, and work titles torn at the seam.
colors:
  primary: "#ff488b"
  on-primary: "#0d060b"
  secondary: "#470c35"
  on-secondary: "#ffffff"
  neutral: "#0d060b"
  surface: "#1b0e17"
  on-surface: "#ffffff"
  muted: "#b3a7af"
  band: "#3c0a2c"
  band-hover: "#5a1243"
  paper: "#ffffff"
  on-paper: "#101421"
  on-paper-muted: "#4a4f60"
  globe-dot: "#f6dbe8"
  globe-core: "#14070f"
typography:
  headline-display:
    fontFamily: Red Hat Display
    fontSize: 216px
    fontWeight: 900
    lineHeight: 0.82
    letterSpacing: -0.04em
  headline-poster:
    fontFamily: Red Hat Display
    fontSize: 132px
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Red Hat Display
    fontSize: 84px
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: -0.035em
  contact-row:
    fontFamily: Red Hat Display
    fontSize: 84px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Red Hat Display
    fontSize: 40px
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: -0.02em
  statement:
    fontFamily: Red Hat Text
    fontSize: 36px
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Red Hat Text
    fontSize: 26px
    fontWeight: 400
    lineHeight: 1.35
  body-md:
    fontFamily: Red Hat Text
    fontSize: 19px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: Red Hat Text
    fontSize: 19px
    fontWeight: 500
    lineHeight: 1
  body-sm:
    fontFamily: Red Hat Text
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.45
rounded:
  none: 0px
  full: 9999px
spacing:
  base: 8px
  margin: 32px
  margin-mobile: 16px
  gutter: 20px
  section: 200px
  section-mobile: 96px
  row: 150px
  row-mobile: 84px
  grid-columns: 12
components:
  page:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
  hero:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.headline-display}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 48px
    padding: 0 26px
  button-on-paper:
    backgroundColor: "{colors.on-paper}"
    textColor: "{colors.paper}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 48px
  quote-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.statement}"
  seam-title:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.headline-poster}"
    rounded: "{rounded.none}"
  inbox-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    typography: "{typography.body-sm}"
  status-resolved:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
  paper-section:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.on-paper}"
    typography: "{typography.body-md}"
  paper-caption:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.on-paper-muted}"
    typography: "{typography.body-sm}"
  contact-band:
    backgroundColor: "{colors.band}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.contact-row}"
    height: 150px
  contact-band-hover:
    backgroundColor: "{colors.band-hover}"
  experience-line:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    typography: "{typography.headline-poster}"
  globe:
    backgroundColor: "{colors.globe-core}"
    textColor: "{colors.globe-dot}"
  heading-section:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    typography: "{typography.headline-md}"
  lead-paragraph:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.on-paper}"
    typography: "{typography.body-lg}"
  section-title:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    typography: "{typography.headline-lg}"
---

# Atlas Monument

## Overview

Atlas is one person doing customer support and operations for growing businesses, from Laguna, Philippines, for clients in other time zones. The name is the idea: Atlas is the titan who holds up the world. The page sets **ATLAS ANSWERS** as a monument across the first screen. A WebGL globe then carries the inbox home: as the visitor scrolls, it turns from their time zone to Laguna, and five example messages arc in and resolve. The visitor can pick a time zone and see both clocks live.

The look is a dark studio site in the Awwwards tradition: plum-black ground, one hot pink, one heavy geometric typeface at enormous size against small, calm text. One loud moment per screen, everything else quiet.

## Colors

Two values carry the page, ground and ink. Pink is the one accent.

- **Hot Pink (#ff488b):** the primary button, the second line of the name, the torn work titles, "Resolved" states, the live clock figures and Laguna on the globe. Text on pink is always plum-black (#0d060b).
- **Plum (#470c35):** the hero field and the contact field, bracketing the page top and bottom.
- **Plum-black (#0d060b):** the page ground behind the globe, the work stage and the experience list.
- **Surface (#1b0e17):** one tone step up, for the testimonial field and inbox rows. Surfaces are separated by tone, never by lines or shadows.
- **Paper (#ffffff) with navy ink (#101421):** the services, about and footer sections, a white middle and close.
- **Muted (#b3a7af):** secondary notes on dark grounds only, never running text.

## Typography

One family, two cuts.

- **Red Hat Display 900**, uppercase, tracking -0.04em, leading 0.82–0.92, for the name, the work titles and the experience list.
- **Red Hat Display 400** for the contact rows, set as display-size lines.
- **Red Hat Text 400/500** for everything you read: 19px body at line height 1.5, a 26px lead, a 36px statement for the lead quote, 14px for notes.

Scale is the whole visual event: the monument (15vw, up to 230px) and the poster lines (8.4vw) against small text. Headlines never run past two lines. No eyebrows or small uppercase labels.

## Layout

- A 12-column grid with one pair of 32px margins (16px on phones). Large type reaches the edges.
- Sections run 120–200px apart. Each section has its own composition: monument hero, pinned globe scene, centered quote with corner quotes, pinned work stage, one-size service columns, side facts with a wide paragraph, poster list, display-size contact rows, cropped-name footer.
- The globe scene holds for about 1.3 screens. The work stage holds each project for 1.2 screens.
- Phones get their own composition: scenes unpin, panes stack under their title, and the nav scrolls away with the hero.

## Elevation & Depth

Flat. There are no shadows, glows or gradients. Depth comes from three things:

- **Tone steps** between grounds (plum-black → surface → plum).
- **Real 3D**: the WebGL globe, with dots that dim around the limb and a solid core that hides the far side.
- **Layering in motion**: work panes slide over each other from opposite directions while the titles sit on a solid plum-black band above them.

## Shapes

- Square corners on every panel, picture, pane and band.
- Full pills only for buttons, status tags and the time-zone select.
- Circles only on the globe markers and the round arrow in the "Say hello" row.

## Components

- **Hero:** the name on two lines in two inks (white, pink) on plum. The supporting line (role plus one sentence) and one pink pill button sit bottom-right on desktop and directly under the name on tablet and phone.
- **Globe scene:** a three.js dot globe built from continent outlines. Arcs travel from example senders to Laguna. Drag to rotate. The inbox rows go New → Replied → Resolved as the scene scrolls. Falls back to a flat disc without WebGL.
- **Torn title:** each project title is set twice and clipped to its left and right halves, in pink on a plum-black band. The halves meet on the seam between two panes, with a small caption bar and a "Read the whole case" button beneath.
- **Case dialog:** a native `<dialog>` that shows a project's description and both panes at full size. Escape and the backdrop close it.
- **Service columns:** three text columns at body size. Hovering or focusing an item shows its one-line description in the empty fourth column.
- **Poster list:** company names at poster size, each with its role, dates and one-line description at the right. Hover turns the name pink.
- **Contact rows:** full-width alternating plum bands at display size: place, live time, email and phone (with Copy), and a pink "Say hello" band that opens a pre-written email.
- **Footer:** the invitation and one button over ATLAS at 29vw, cropped by the bottom edge.

## Do's and Don'ts

- Do keep pink to actions, the second line of the name, titles, live figures and resolved states. Never fill a section with it.
- Do give every pinned title a solid ground so it reads over any pane.
- Do keep one masked headline reveal as the loud load moment. Every other entrance is a short rise as a section arrives.
- Do respect reduced motion: no smooth scroll, globe turning or scroll travel, and every status shows its final state.
- Do keep content visible by default. Entrances only play when an element scrolls into view.
- Don't add gradients, glows, glass, shadows at rest, hairline dividers or eyebrow labels.
- Don't use a second typeface or monospace.
- Don't present example data (inbox senders, the fictional store) as real clients. Label it as an example.
- Don't let a headline run past two lines at any width.
