# Mac Steel — Website Design Contract

**Authority**: This contract is the single source of taste for every site/shop builder in the Mac Steel fleet. It derives from `website/assets/components.css` (the token authority) and the design knowledge cited therein. No page-local custom properties, no inline colour. The web excellence gate enforces both.

**Scope**: Applies to all generated pages — marketing, services, product, resource library, shop. The contract is consumed by `scripts/web_design_studio.py` via `load_design_rules()` and included verbatim in the design-direction prompt.

---

## 1. Identity

**Mac Steel** — autonomous AI operations for local businesses. Done-for-you, flat-rate, free-first tooling. Tone: confident, precise, no hype. Visual language: brutalist Swiss minimalism — square corners, no soft shadows, deliberate hierarchy, generous whitespace.

---

## 2. Tokens (from components.css — do not override)

### Neutral Ramp (OKLCH lightness sequence)
```
--ink-900: oklch(0.15 0.02  250)  /* page ground */
--ink-700: oklch(0.28 0.02  250)  /* raised surface */
--ink-500: oklch(0.45 0.015 250)  /* borders, rules */
--ink-300: oklch(0.72 0.01  250)  /* secondary text */
--ink-100: oklch(0.95 0.005 250)  /* primary text */
```

### Chromatics — Exactly Two
```
--signal:     oklch(0.78 0.16   75)   /* amber — CTA, receipt accent */
--signal-ink: oklch(0.15 0.02 250)    /* text ON signal */
--link:       oklch(0.70 0.12  225)   /* cyan — links, informational */
```

### Type
```
--font-display: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
--font-body:    "IBM Plex Sans", system-ui, -apple-system, sans-serif;
```

### Swiss Grid + Rhythm
```
--measure: 68ch;
--gutter:  clamp(1rem, 3vw, 2.5rem);
--shell:   72rem;
--step--1: clamp(0.83rem, 0.8rem + 0.15vw, 0.9rem);
--step-0:  clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
--step-1:  clamp(1.35rem, 1.2rem + 0.7vw, 1.75rem);
--step-2:  clamp(1.8rem, 1.5rem + 1.5vw, 2.75rem);
--step-3:  clamp(2.4rem, 1.8rem + 3vw, 4rem);
```

### Motion (from motion-presets.csv — not invented)
```
--dur-hover:  180ms;  /* subtle hover 150–200ms */
--dur-reveal: 420ms;  /* standard scroll reveal 400–600ms */
--ease:       cubic-bezier(0.2, 0, 0, 1);
```

---

## 3. Typography Rules

- **Headings (h1–h3, .display)**: JetBrains Mono, weight 700, line-height 1.1, letter-spacing -0.02em, `text-wrap: balance`.
- **Body**: IBM Plex Sans, step-0, line-height 1.6, `text-wrap: pretty`.
- **Max measure**: 68ch for prose.
- **Eyebrow**: JetBrains Mono, step--1, uppercase, letter-spacing 0.14em, color `--signal`.
- **Lede**: step-1, color `--ink-300`.
- **Code/mono/metric**: JetBrains Mono.
- **Links**: `--link` color, underline-offset 0.2em; hover to `--ink-100`.
- **No gradient headlines**. No decorative emoji in headings.

---

## 4. Layout Rules

- **Shell**: `.shell` — `width: min(100% - 2*gutter, 72rem)`, centered.
- **Section padding**: `clamp(3rem, 8vw, 6rem)` block.
- **Grid**: `.grid`, `.grid-2`, `.grid-3` — auto-fit, minmax, gap = `--gutter`.
- **Cards**: `.card` — background `--ink-700`, border `--ink-500`, padding `--gutter`, **square corners, no shadow** (brutalist).
- **Resource cards**: `.rcard` — flex column, hover border `--ink-300`, translateY(-2px).
- **Pillars**: `.pillar-list` / `.pillar` — numbered rows (Swiss), not icon-card grids. Desktop: 2fr/3fr split; mobile: stacked.
- **Figures**: max-width `min(100%, 32rem)`; hero figures full width. Data visuals shown whole at column width, `object-fit: contain`.

---

## 5. Mobile / Responsive

- **Breakpoints via clamp()** — no hard media queries for type/spacing.
- **Nav**: stacks at ≤40rem (`.site-header .shell` flex-wrap, `.site-nav` full-width wrap).
- **Tables**: `.scroll-x` — horizontal scroll inside box, never page scroll.
- **Touch targets**: minimum 44px (`.btn`, `.capture` inputs).
- **Gutter** clamps 1rem → 2.5rem across viewports.

---

## 6. Imagery — Purposeful Only

- **No decorative hero images**. Every image is data: scorecards, fleet map, ops clock, proof receipts.
- **Figures** in grid-2 stretch to row height, centered, `object-fit: contain`, caption as bar below.
- **Generated figures**: render at 512×384; cap display at native width (32rem max), left-aligned as evidence.
- **No generic stock photos**, no abstract 3D blobs, no "AI aesthetic" gradients.

---

## 7. Accessibility — Non-Negotiable

- **Visible focus**: `:focus-visible` — 2px solid `--signal`, offset 3px.
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` — animations → 0.01ms, transitions → 0.01ms, `scroll-behavior: auto`, `.reveal` → instant opaque.
- **Skip link**: `.skip-link` — jumps to main content.
- **Contrast**: All text on backgrounds meets WCAG AA (tokens designed for it).
- **Semantic HTML**: landmarks, headings in order, `aria-current` on active nav.

---

## 8. Motion — CSS-First, Optional

- **Scroll reveal**: `.reveal` — animation-timeline: view(), range entry 0%–75%, from 0.001 opacity (never 0 — stalled timeline degrades to faint, not gone).
- **Stagger**: `.stagger > *` — `animation-delay: calc(var(--i,0) * 70ms)`.
- **Hover**: `--dur-hover` (180ms) on cards, nav, buttons — transform translateY(-2px) or border-color.
- **No JS scroll libraries**. No parallax that shifts content. Canvas particles only as ambient background (z-index -1), never over content.

---

## 9. Forbidden Patterns (Gate Failures)

| Pattern | Why |
|---------|-----|
| Gradient headlines (`background-clip: text` with gradient) | AI tell; reduces legibility |
| Decorative emoji in headings/UI | Clutter; not brand |
| Generic glass cards (`backdrop-filter: blur` + transparency) | Not brutalist; readability risk |
| Invented proof / fake metrics | Integrity violation |
| Gratuitous 3D (Three.js heroes not tied to brief) | Performance cost; distraction |
| Rounded corners on cards | "Rounded + left border accent" = AI tell (huashu README:248) |
| Soft shadows on cards | Brutalist = square, border only |
| Page-local CSS custom properties | Drift; token authority is components.css |
| Inline `style="color:…"` | Gate rejects; use utility classes |
| More than two chromatic hues | Token system defines exactly two |
| Icon-card grids (3+ identical icon+heading cards) | `design_antipattern_audit` HARD-fails |

---

## 10. Release Evidence — Required Before Ship

**This workflow is FUTURE WORK — not enforced by this contract.** The contract describes what *must* exist; automation to capture/evaluate/enforce remains to be built.

For each candidate revision, the following must be retained before release:

1. **Desktop Playwright screenshot** — full page, 1440×900 minimum, saved to `data/web-designs/screenshots/<slug>-desktop-<rev>.png`
2. **Mobile Playwright screenshot** — 390×844, saved to `data/web-designs/screenshots/<slug>-mobile-<rev>.png`
3. **Independent vision review** — separate model/agent evaluates screenshots against this contract; findings recorded as structured JSON:
   ```json
   {
     "revision": "2026-01-15T14:30:00Z",
     "screenshots": {"desktop": "...", "mobile": "..."},
     "findings": [
       {"rule": "3.1", "severity": "fail", "detail": "Gradient headline detected on h1"},
       {"rule": "7.2", "severity": "pass", "detail": "Focus visible outline present"}
     ],
     "verdict": "blocked"  // or "pass"
   }
   ```
4. **Missing evidence or unresolved "fail" findings = NOT READY**.

**Explicit distinction**: This contract *requires* the evidence and verdict. Automated screenshot capture, vision evaluation, and release enforcement are **future work**. Prompt inclusion does not enforce rendered quality.

---

## 11. Integration Note

`scripts/web_design_studio.py` loads this contract via `load_design_rules()` and injects the complete text into the design-direction prompt as a clearly delimited authoritative section (2026-10-22, c9263d961232). The design-direction model must treat this contract as binding — its output (palette, fonts, mood, sections, scene) must be *compatible* with these rules; the renderers enforce them.