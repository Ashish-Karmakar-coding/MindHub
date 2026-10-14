---
name: Mindhub Tactical Workspace
colors:
  surface: '#111317'
  surface-dim: '#111317'
  surface-bright: '#37393d'
  surface-container-lowest: '#0c0e11'
  surface-container-low: '#1a1c1f'
  surface-container: '#1e2023'
  surface-container-high: '#282a2d'
  surface-container-highest: '#333538'
  on-surface: '#e2e2e6'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e2e2e6'
  inverse-on-surface: '#2f3034'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00885d'
  on-tertiary-container: '#000703'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#111317'
  on-background: '#e2e2e6'
  surface-variant: '#333538'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.011em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.006em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
  code-inline:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies the ethos of a high-performance personal operating workspace and cognitive second brain. The interface prioritizes deep focus, data density, and effortless spatial categorization. It projects an atmosphere of surgical precision, quiet intellect, and sovereign control over complex personal knowledge.

The visual style blends **minimalist precision** with **utilitarian technical instrumentation**:
- **Graphite & Obsidian Substrates:** Deep, neutral slate foundations minimize eye strain while anchoring focus entirely on information architecture.
- **Electric Cognitive Accents:** Pinpoint spectral bursts of electric indigo, violet, and emerald delineate status, active nodes, and contextual connections without clutter.
- **Low-Contrast Ghost Architecture:** Borders and structural separators remain featherlight (`border-white/10` or `border-white/5`), structuring dense data matrices without harsh visual barriers.
- **Micro-Technical Clarity:** Monospaced and geometric type treatments provide immediate legibility for metadata, keybindings, and structural indices.

## Colors

The palette is engineered specifically for dark-mode productivity, leaning heavily on cool carbon surfaces and precise luminescent signals.

### Functional Color Roles
- **Primary (`#6366F1` - Electric Indigo):** Primary focal actions, cursor markers, active tree nodes, structural links, and primary UI selection rings.
- **Secondary (`#8B5CF6` - Cognitive Violet):** Knowledge taxonomy, secondary graph connections, contextual tooltips, and exploratory tags.
- **Tertiary (`#10B981` - Emerald Sync):** System validation, active background sync indicators, completed task states, and live operating metrics.
- **Neutral Canvas (`#0D0F12` - Deep Obsidian Graphite):** Baseline environment substrate. Surface gradations step sequentially through `#14171D` (Surface Default), `#1C2029` (Surface Elevated / Cards), and `#242A36` (Surface Overlay / Modals).
- **Text & Borders:** Text operates at three distinct opacities of crisp cool white: `#F8FAFC` (High emphasis), `#94A3B8` (Subtle meta), and `#475569` (Disabled / Keyhint). Borders consistently utilize `#FFFFFF` at `0.07` to `0.12` alpha channels to maintain razor-thin optical division.

## Typography

The typographic hierarchy enforces high-velocity data scanning and literary focus:
- **Headlines (Geist):** Tight tracking, surgical geometry, and structural stability for section titles, document canvases, and viewports.
- **Body Text (Inter):** Highly legible neutral grotesque with tall x-height, rendering long-form notes, recursive task lists, and metadata streams effortlessly.
- **Labels, Codes & Shortcuts (JetBrains Mono):** Applied deliberately to breadcrumbs, taxonomy chips, status pill counters, keyboard shortcuts (`Cmd+K`), and execution parameters.

## Layout & Spacing

The workspace leverages a flexible, fluid-responsive multi-pane architecture designed around a primary 12-column dynamic grid:
- **Panels & Dividers:** The desktop viewport partitions into a collapsible utility tree (240px–280px fixed-fluid sidebar), a central canvas area (spans 6–8 columns or flex-1), and an optional contextual inspector (320px right dock).
- **Rhythm & Metrics:** Internal gaps rely strictly on a 4px/8px modular base. Compact gaps (`space-xs`, `space-sm`) are preferred within folder trees, tag groupings, and inline metadata to maintain high functional density.
- **Breakpoints:**
  - **Desktop (>1024px):** Tri-pane view fully unlocked; margins set to `margin-desktop`, gutters at `gutter-desktop`.
  - **Tablet (768px - 1024px):** Inspector defaults to an overlay drawer; central workspace retains 12-column fluid structure.
  - **Mobile (<768px):** Sidebars collapse into slide-out modal drawers; margins drop to `margin`; cards and lists reflow to a unified 1-column stack.

## Elevation & Depth

Elevation eschews skeuomorphic heavy drop-shadows in favor of **tonal layering**, **diffused backdrops**, and **low-contrast luminous borders**:
- **Layer 0 (Base Obsidian Canvas - `#0D0F12`):** Ground plane for empty margins and viewport background.
- **Layer 1 (Card Grids & Workspace Cells - `#14171D`):** Framed with `1px solid rgba(255, 255, 255, 0.08)`. No cast shadow.
- **Layer 2 (Hover States & Active Floating Bars - `#1C2029`):** Scaled with `1px solid rgba(255, 255, 255, 0.14)` and a microscopic ambient glow: `0 4px 20px -2px rgba(0, 0, 0, 0.5)`.
- **Layer 3 (Modals, Command Palettes & Popovers - `#242A36`):** Features `backdrop-filter: blur(16px)`, translucent background alpha (`rgba(28, 32, 41, 0.85)`), and elevated ambient occlusion: `0 12px 32px -4px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.12)`.

## Shapes

The interface adopts a **Soft (Level 1)** geometric standard. This delivers a sharp, technical aesthetic without being uncomfortably abrupt:
- **Inputs, Buttons, and Grid Cards:** Base radius of `0.25rem` (4px) to `0.375rem` (6px) reinforces the feeling of modular technical hardware.
- **Chips, Keycaps, and Tags:** Strict micro-radii or full capsule pill shapes (`rounded-full`) exclusively when used to signify categorical filters and taxonomy pills.
- **Modals & Drawers:** Maximum corner radius capped at `rounded-lg` (0.5rem / 8px) to retain geometric discipline across all screen bounds.

## Components

### Buttons
- **Primary:** Solid Electric Indigo (`#6366F1`) fill, text `#FFFFFF` (Geist 500), border `1px solid rgba(255,255,255,0.15)`. Active states compress by 1px scale; hover illuminates to `#4F46E5`.
- **Secondary / Ghost:** Transparent background with `1px solid rgba(255,255,255,0.10)`. Hover shifts background to `rgba(255, 255, 255, 0.05)` with text shifting from `#94A3B8` to `#F8FAFC`.
- **Icon Buttons:** Fixed square proportions (32x32px or 28x28px), centering 16px stroke icons with subtle tooltips.

### Folder Chips & Tag Pills
- **Folder Chips:** Structural rectangles with `0.25rem` radius, subtle `#1C2029` background, `border-white/10`, featuring an inline folder icon followed by `body-sm` typography and an optional item-count badge formatted in JetBrains Mono.
- **Tag Pills:** Rounded capsule shape (`rounded-full`), miniature text (`label-sm`), featuring low-opacity tint backgrounds matched to cognitive tags (e.g., Indigo: `rgba(99, 102, 241, 0.12)`, text `#818CF8`; Emerald: `rgba(16, 185, 129, 0.12)`, text `#34D399`).

### Structured Knowledge Cards
- **Construction:** Graphite surface (`#14171D`), micro-beveled border (`border-white/10`), inner padding `space-md` to `space-lg`.
- **States:** Hover transitions border to `#6366F1` at 40% opacity with a smooth 150ms ease-out.
- **Card Header:** Houses categorical tag pill, document timestamp (`label-sm`), and an ellipses action trigger.

### Form Inputs & Command Bars
- **Text Inputs:** Background `#0D0F12`, border `1px solid rgba(255, 255, 255, 0.10)`, text `#F8FAFC`, placeholder `#475569`.
- **Focus Ring:** Replaces standard browser focus with `1px solid #6366F1` accompanied by a localized box-shadow spread: `0 0 0 2px rgba(99, 102, 241, 0.20)`.
- **Command Palette (`Cmd+K`):** Floating viewport header with search icon prefix and an explicit keybinding badge suffix rendered in `label-sm`.

### Checkboxes & Binary Toggles
- **Checkboxes:** 16x16px square with 3px border radius. Unchecked: `border-white/20`, background transparent. Checked: `#6366F1` background, crisp white 1.5px check icon.
- **Switch Toggles:** 36x20px capsule with a 14px circular thumb. Smooth 100ms spring transition from graphite off-state to vivid emerald/indigo active state.

### Specialized Workspace Modules
- **Graph Connection Node:** Miniature link badge connecting two related thoughts with a directional arrow (`→`), styled in monochrome slate and violet highlight on hover.
- **Status Indicator Dot:** A 6px breathing emerald light (`#10B981`) paired with `label-sm` text signifying real-time local-first sync integrity.