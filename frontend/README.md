<div align="center">

  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=800&size=34&duration=2600&pause=700&color=D2A935&center=true&vCenter=true&width=900&lines=LIYAN'S+VASTRA;Elevated+Elegance+in+Every+Thread;Luxury+Vite+React+Frontend;Dark+Gold+Premium+Apparel+UI" alt="LIYAN'S VASTRA animated title" />

  <p>
    <strong>LIYAN'S VASTRA</strong> is a premium apparel brand frontend built with a clean Vite React setup.
    The UI follows the supplied dark luxury reference screenshots with gold accents, serif headings, bordered cards, and responsive page sections.
  </p>

  <p>
    <img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
    <img alt="React" src="https://img.shields.io/badge/React-18-149ECA?style=for-the-badge&logo=react&logoColor=white" />
    <img alt="CSS" src="https://img.shields.io/badge/CSS-Plain%20CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
    <img alt="Node" src="https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
    <img alt="Frontend" src="https://img.shields.io/badge/Frontend-Only-D2A935?style=for-the-badge" />
  </p>

  <p>
    <a href="#quick-start">Quick Start</a>
    <span> | </span>
    <a href="#project-structure">Structure</a>
    <span> | </span>
    <a href="#frontend-pages">Pages</a>
    <span> | </span>
    <a href="#visual-style">Visual Style</a>
    <span> | </span>
    <a href="#colors">Colors</a>
    <span> | </span>
    <a href="#animations">Animations</a>
    <span> | </span>
    <a href="#images">Images</a>
    <span> | </span>
    <a href="#github-actions">GitHub Actions</a>
  </p>

</div>

---

## Overview

LIYAN'S VASTRA is a frontend-only brand website for a luxury apparel/textile business.

The current implementation focuses on:

- Matching the supplied `ui_images` design direction.
- Keeping the project simple with Vite, React, and plain CSS.
- Supporting desktop, tablet, and mobile layouts.
- Showing mobile navigation under a menu icon.
- Avoiding unnecessary backend, Next.js, Tailwind, Netlify, or extra framework setup.

## Quick Start

```powershell
cd E:\job\Brillaris\E-CommSite\project\frontend
npm install --no-audit --no-fund --ignore-scripts
npm run dev
```

Open:

```text
http://localhost:5173
```

Production build:

```powershell
cd E:\job\Brillaris\E-CommSite\project\frontend
npm run build
```

## Project Structure

```text
frontend/
  public/
    logo.jpg
    background.jpg
  src/
    main.jsx
    styles.css
  index.html
  package.json
  package-lock.json
  vite.config.js
  README.md
```

## Frontend Details

| Area | Details |
| --- | --- |
| Framework | Vite |
| UI Library | React 18 |
| Styling | Plain CSS |
| Routing | React state based page switching |
| Backend | Not included |
| Package manager | npm |
| Build output | `dist/` |
| Local port | `5173` |

## Frontend Pages

| Page | Sections |
| --- | --- |
| Home | Header, hero, story/about section, why choose cards, footer |
| About | Background hero, journey section, values cards, business information, work together CTA, footer |
| Services | Services title and six service cards |
| Contact | Contact information cards and message form |

## Visual Style

LIYAN'S VASTRA uses a dark luxury apparel palette and layout style.

| Design Area | Direction |
| --- | --- |
| Background | Deep black and near-black gradients |
| Accent | Gold for active nav, buttons, icons, stats, and borders |
| Typography | Serif headings with modern sans-serif body text |
| Cards | Dark panels with thin gold-tinted borders |
| Header | Black sticky header with logo, nav, CTA, and mobile menu icon |
| Footer | Dark structured business footer |
| Mobile | Menu icon opens nav links below the header |

Main UI classes:

```text
.site-header
.main-nav
.menu-toggle
.home-hero
.hero-logo-orbit
.split-story
.section-title
.feature-card
.page-hero
.business-card
.contact-grid
.footer
```

## Colors

The color system is stored in `src/styles.css`.

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

| Token | Use |
| --- | --- |
| `--bg` | Main page background |
| `--panel` | Cards and business panels |
| `--line` | Thin border color |
| `--line-strong` | Strong border/hover color |
| `--gold` | Brand accent |
| `--gold-light` | Button and icon highlight |
| `--text` | Primary heading/body text |
| `--muted` | Secondary body text |

Color style example:

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

Button style:

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

Fonts are imported in `src/styles.css`.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@600;700;800&display=swap');
```

| Font | Usage |
| --- | --- |
| Inter | Navigation, body text, cards, forms, buttons |
| Playfair Display | Premium headings and hero/page titles |

## Images

Images are served from `public/`.

| Image | Usage |
| --- | --- |
| `public/images/logo.jpg` | Header logo, hero logo orbit, footer logo, business information card |
| `public/images/background.jpg` | About hero background and story/lifestyle fallback image |

Vite public asset usage:

```jsx
const assetPath = (path) => `${import.meta.env.BASE_URL}${path}`;
const logo = assetPath('images/logo.jpg');
const background = assetPath('images/background.jpg');
```

Recommended image rules:

- Keep final frontend images in `public/`.
- Use `import.meta.env.BASE_URL` paths like `assetPath('images/logo.jpg')`.
- Compress large images before production deployment.
- Keep hero and section images dark enough so white/gold text remains readable.
- Avoid blurry or unrelated stock-style imagery for product/business sections.

## Mobile Menu

The mobile header uses a menu icon.

Behavior:

- Desktop shows full navigation.
- Tablet/mobile shows logo and menu icon.
- Clicking the menu icon opens links under the header.
- Selecting a menu item closes the menu.
- The CTA appears inside the mobile dropdown.

Important classes:

```text
.menu-toggle
.menu-toggle.is-open
.main-nav
.main-nav.is-open
.mobile-nav-cta
```

## Animations

The current design should use subtle luxury motion, not loud effects.

Recommended effects:

- Smooth nav color changes.
- Small card hover lift.
- Button hover lift and soft shadow.
- Hero logo glow.
- Section reveal on scroll.
- Reduced motion support.

### Hover Animation

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

### Hero Logo Glow

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

### IntersectionObserver API

Use `IntersectionObserver` for scroll reveal effects without adding an animation package.

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

Markup:

```jsx
<article className="feature-card" data-reveal>
  ...
</article>
```

CSS:

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

Use the Web Animations API for small one-off entrance effects.

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

  return <img ref={logoRef} src={assetPath('images/logo.jpg')} alt="LIYAN'S VASTRA" />;
}
```

### Reduced Motion

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

Animation rules:

- Keep durations between `160ms` and `700ms`.
- Prefer `opacity` and `transform`.
- Avoid animating `height`, `width`, `top`, and `left`.
- Avoid heavy motion that distracts from the premium apparel style.

## Responsive Behavior

| Width | Behavior |
| --- | --- |
| Desktop | Full nav, two-column hero/story layouts, three/four-column grids |
| `980px` and below | Header changes to mobile menu, large grids reduce columns |
| `640px` and below | Cards, stats, form fields, and footer stack to one column |

Recommended test widths:

```text
375px
768px
1024px
1440px
```

## GitHub Actions

Workflow file:

```text
../.github/workflows/frontend.yml
```

The workflow runs only for frontend changes:

```text
frontend/**
.github/workflows/frontend.yml
```

CI commands:

```text
npm ci --no-audit --no-fund --ignore-scripts
npm run build
```

The production build is uploaded as:

```text
frontend-dist
```

## Deployment Notes

For Vercel:

| Setting | Value |
| --- | --- |
| Root Directory | `frontend` |
| Install Command | `npm ci --no-audit --no-fund --ignore-scripts` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

## Development Notes

- Do not add backend code inside `frontend/`.
- Do not commit secrets.
- Keep `node_modules`, `.vite`, and `dist` ignored.
- Keep the frontend dependency list small unless a real feature needs a package.
- Run `npm run build` before pushing frontend UI changes.

---

<div align="center">
  <strong>LIYAN'S VASTRA</strong><br />
  Elevated elegance in every thread.
</div>
