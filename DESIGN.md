# Design Brief

## Direction

Dark Editorial Task Manager — a refined, productivity-focused interface inspired by Linear and Todoist with vibrant cyan accents for fresh momentum.

## Tone

Brutally minimal with zero ornamentation — every element serves information density and keyboard-first interaction patterns.

## Differentiation

Sidebar + main content grid with refined hover states, smooth task state transitions, and embedded keyboard shortcuts visible in UI.

## Color Palette

| Token      | OKLCH          | Role                          |
| ---------- | -------------- | ----------------------------- |
| background | 0.145 0.014 260| deep charcoal base            |
| foreground | 0.95 0.01 260  | crisp neutral text            |
| card       | 0.18 0.014 260 | slightly elevated surfaces    |
| primary    | 0.75 0.15 190  | vibrant cyan/teal action     |
| accent     | 0.75 0.15 190  | same as primary (consistency) |
| muted      | 0.22 0.02 260  | secondary UI layer            |
| destructive| 0.55 0.2 25    | clear red for delete actions  |

## Typography

- Display: Space Grotesk — geometric, confident headings and task titles
- Body: DM Sans — clean, neutral labels and content
- Scale: hero `text-3xl font-bold`, h2 `text-2xl font-semibold`, label `text-sm font-medium`, body `text-base`

## Elevation & Depth

Card-based rows with subtle 1px borders (--border) and minimal shadows. Hover states lift tasks slightly with `shadow-subtle`. No decorative depth, only functional layers.

## Structural Zones

| Zone    | Background              | Border              | Notes                                   |
| ------- | ----------------------- | ------------------- | --------------------------------------- |
| Header  | var(--card)             | border-b            | theme toggle (moon/sun), app title      |
| Sidebar | var(--sidebar) slightly | sidebar-border      | projects, status filters, compact list |
| Content | var(--background)       | —                   | task rows with alternating subtle tint |
| Footer  | var(--background)       | —                   | optional: keyboard shortcuts legend    |

## Spacing & Rhythm

Compact density (12px/16px gaps), tight task rows (4px internal padding), 24px section breaks. Groups separated by `gap-3` or `gap-4`. Whitespace creates visual rhythm without decoration.

## Component Patterns

- Buttons: minimal borders, cyan fill on primary action, secondary with border only, destructive red, hover adds `shadow-subtle`
- Cards: flat background `var(--card)`, 1px border, no shadow (lifts on hover), 6px border-radius
- Badges: inline inline tags/priority labels, small text `text-xs`, compact padding (4px 8px), muted background with colored text
- Checkboxes: custom circles with cyan border, filled on check, smooth transition
- Task rows: card-based, flex layout, icon + content + meta, 4px v-padding, hover state adds background tint

## Motion

- Entrance: fade-in 200ms on task list load (staggered for each row)
- Hover: background-color + shadow-subtle 150ms smooth transition on task row hover, scale-up 100ms on button press
- Decorative: subtle pulse on unsaved indicator, smooth slide for sidebar collapse/expand

## Constraints

- No gradients, no decorative elements, no rounded corners > 12px
- Max 2 colors in any single state (foreground + background)
- Use CSS custom properties exclusively (no inline colors)
- Keyboard focus rings always visible (`--ring`)
- Transitions always smooth (300ms cubic-bezier)

## Signature Detail

Inline keyboard shortcut hints in the UI (e.g., "⌘S" next to save button) — reinforces power-user interaction pattern without tutorial friction.
