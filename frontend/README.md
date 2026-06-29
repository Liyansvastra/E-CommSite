# LIYAN'S VASTRA Frontend

Vite React frontend for the LIYAN'S VASTRA brand site.

## Run Locally

```powershell
npm install --no-audit --no-fund --ignore-scripts
npm run dev
```

Local URL:

```text
http://localhost:5173
```

Build:

```powershell
npm run build
```

## Stack

- React 18
- React DOM 18
- Vite 5
- Plain CSS
- Static images from `public/`

## Pages

The frontend is a single-page React app with menu-based views:

- Home
- About
- Services
- Contact

Main files:

```text
src/main.jsx
src/styles.css
index.html
vite.config.js
```

## Colors

The color system is defined in `src/styles.css`.

```css
:root {
  --bg: #020202;
  --panel: #0e0e0d;
  --line: rgba(214, 178, 75, 0.18);
  --line-strong: rgba(214, 178, 75, 0.38);
  --gold: #d2a935;
  --gold-light: #f1d562;
  --text: #f7f4ef;
  --muted: #a3a1aa;
}
```

Usage:

- `--bg`: main black luxury background
- `--panel`: cards and dark panels
- `--line`: thin gold borders
- `--line-strong`: hover/active borders
- `--gold`: brand accent text
- `--gold-light`: icon/button highlight
- `--text`: main white text
- `--muted`: secondary paragraph text

### Color Style Rules

Use the color system consistently so the frontend stays close to the supplied UI images.

- Use black or near-black backgrounds for every main section.
- Use gold only for emphasis: nav active state, buttons, icon blocks, section eyebrows, stats, and thin borders.
- Use white for headings and important labels.
- Use muted gray for paragraphs and secondary details.
- Avoid adding extra dominant colors unless they are used only for small status messages.
- Keep cards dark with thin gold/gray borders instead of bright fills.

Recommended CSS pattern:

```css
.luxury-panel {
  color: var(--text);
  border: 1px solid var(--line);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.045),
    rgba(255, 255, 255, 0.025)
  );
}

.gold-text {
  color: var(--gold);
}

.muted-copy {
  color: var(--muted);
}
```

Recommended button color style:

```css
.gold-button {
  color: #14100a;
  border: 1px solid #e0bc45;
  background: linear-gradient(135deg, #c59624 0%, #f1d45d 100%);
}

.dark-button {
  color: #e6c765;
  border: 1px solid rgba(230, 199, 101, 0.3);
  background: rgba(0, 0, 0, 0.35);
}
```

## Typography

Fonts are imported in `src/styles.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@600;700;800&display=swap');
```

Style usage:

- `Inter`: navigation, buttons, labels, cards, body text
- `Playfair Display`: section headings, page hero headings, premium editorial text

## Images

Images live in:

```text
public/
```

Current required images:

```text
public/logo.jpg
public/background.jpg
```

Recommended usage:

- `logo.jpg`: header logo, hero circular logo, footer logo, business card logo
- `background.jpg`: About page hero background and lifestyle visual fallback

In Vite, public assets are referenced from root paths:

```jsx
const logo = '/logo.jpg';
const background = '/background.jpg';
```

## Styling Sections

Main style areas in `src/styles.css`:

- `.site-header` and `.header-inner`: black sticky navbar
- `.home-hero`: home first-view hero layout
- `.hero-logo-orbit`: circular logo treatment
- `.split-story`: Home about/story section
- `.section-title`: gold eyebrow + serif title pattern
- `.feature-card`: dark bordered card style
- `.page-hero`: About hero with background image
- `.business-card`: business details panel
- `.contact-grid`: Contact page layout
- `.footer`: shared footer

## Animation And Interaction

The current UI keeps movement subtle to preserve the luxury style.

Existing interaction polish:

- Sticky header blur
- Navigation color transitions
- Button hover-ready structure
- Input focus border change

Recommended future animations:

```css
.feature-card {
  transition: transform 180ms ease, border-color 180ms ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: var(--line-strong);
}

.gold-button {
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.gold-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(210, 169, 53, 0.18);
}
```

Avoid:

- Bright neon effects
- Heavy motion
- Large bouncing animations
- Background blobs or decorative orbs outside the logo treatment

### Animation APIs

Use browser APIs for lightweight animation. Do not add a large animation package unless the UI becomes much more complex.

Recommended APIs:

- `IntersectionObserver`: reveal sections/cards when they enter the viewport.
- Web Animations API: run small imperative animations without adding a package.
- `requestAnimationFrame`: use only for custom continuous animation.
- CSS transitions/keyframes: preferred for hover, focus, and simple repeating effects.

### IntersectionObserver Reveal Animation

Use this for section fade-in and card entrance animations.

```jsx
import { useEffect } from 'react';

function useRevealOnScroll() {
  useEffect(() => {
    const items = document.querySelectorAll('[data-reveal]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);
}
```

Example markup:

```jsx
<article className="feature-card" data-reveal>
  ...
</article>
```

Example CSS:

```css
[data-reveal] {
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 520ms ease,
    transform 520ms ease;
}

[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Web Animations API

Use this for one-off effects, such as a soft hero logo entrance.

```jsx
import { useEffect, useRef } from 'react';

function HeroLogo() {
  const logoRef = useRef(null);

  useEffect(() => {
    if (!logoRef.current) return;

    logoRef.current.animate(
      [
        { opacity: 0, transform: 'scale(0.94)' },
        { opacity: 1, transform: 'scale(1)' },
      ],
      {
        duration: 700,
        easing: 'cubic-bezier(.2,.8,.2,1)',
        fill: 'both',
      }
    );
  }, []);

  return <img ref={logoRef} src="/logo.jpg" alt="LIYAN'S VASTRA" />;
}
```

### Hero Logo Glow Animation

Use CSS keyframes for the subtle circular logo treatment.

```css
.hero-logo-orbit > div {
  animation: logoGlow 4s ease-in-out infinite;
}

@keyframes logoGlow {
  0%,
  100% {
    box-shadow: 0 0 0 rgba(210, 169, 53, 0);
  }

  50% {
    box-shadow: 0 0 34px rgba(210, 169, 53, 0.18);
  }
}
```

### Respect Reduced Motion

Always support users who prefer less motion.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.001ms !important;
  }
}
```

### Animation Style Rules

- Keep durations between `160ms` and `700ms`.
- Use `ease`, `ease-out`, or `cubic-bezier(.2,.8,.2,1)`.
- Animate `opacity` and `transform` first because they are smoother.
- Avoid animating layout-heavy properties like `height`, `width`, `top`, and `left`.
- Keep hover movement small, usually `translateY(-2px)` to `translateY(-4px)`.
- Do not animate every element at once; stagger only cards or section content.

## Responsive Behavior

Breakpoints are handled in `src/styles.css`:

- `980px`: header stacks, grids become two-column or one-column
- `640px`: cards, stats, forms, and footer stack into one column

Test mobile after any UI change:

```text
375px width
768px width
1440px width
```

## GitHub Actions

Workflow:

```text
.github/workflows/frontend.yml
```

It runs only for frontend changes:

```text
frontend/**
.github/workflows/frontend.yml
```

It performs:

```text
npm ci --no-audit --no-fund --ignore-scripts
npm run build
```

The production `dist` folder is uploaded as a workflow artifact named:

```text
frontend-dist
```
