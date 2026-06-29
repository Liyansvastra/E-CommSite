# LIYAN'S VASTRA Frontend Notes

This folder documents the current frontend work for the Vite React site in:

```text
project/frontend
```

The running method is intentionally simple:

```powershell
cd E:\job\Brillaris\E-CommSite\project\frontend
npm install --no-audit --no-fund --ignore-scripts
npm run dev
```

Local URL:

```text
http://localhost:5173
```

## Current Frontend Stack

- React 18
- React DOM 18
- Vite 5
- Plain CSS in `src/styles.css`
- Static assets served from `public/`
- No Next.js
- No Tailwind
- No backend
- No Netlify or Vercel config inside the frontend app

## Page Structure

The frontend is built as a single Vite React app with in-page navigation:

- Home
- About
- Services
- Contact

The UI follows the reference images in `ui_images`:

- Home hero: `01_home_page.jpg`
- Home about/story: `02_home_page_in_about_section.jpg`
- Home why choose: `03_home_page_in_why_choose.jpg`
- Footer: `04_home_page_in_footer.jpg`
- About page: `05_about_page.jpg` through `09_about_page_in_lets_work_together.jpg`
- Services: `10_our_services.jpg`
- Contact: `11_contact_page.jpg`

## Assets

The frontend uses these copied assets:

```text
project/frontend/public/logo.jpg
project/frontend/public/background.jpg
```

Source assets:

```text
images/logo.jpg
images/background.jpg
```

Additional existing public images are available in:

```text
project/frontend/public
```

## Color System

The main color tokens live in `src/styles.css`:

```css
:root {
  --bg: #020202;
  --panel: #0e0e0d;
  --panel-soft: #121211;
  --line: rgba(214, 178, 75, 0.18);
  --line-strong: rgba(214, 178, 75, 0.38);
  --gold: #d2a935;
  --gold-light: #f1d562;
  --text: #f7f4ef;
  --muted: #a3a1aa;
  --faint: #686771;
}
```

Style direction:

- Black luxury background
- Gold accent text, borders, buttons, and icon blocks
- White serif page headings
- Muted gray body copy
- Thin bordered cards
- Dark glass-like panels

## Typography

Imported fonts:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@600;700;800&display=swap');
```

Usage:

- `Inter` for navigation, body text, buttons, labels, and cards
- `Playfair Display` for large headings and premium editorial sections

## Images

Recommended image behavior:

- Use `logo.jpg` for header, hero orbit, footer, and business card
- Use `background.jpg` for the About hero
- Use a lifestyle/family apparel image in the Home story section
- Keep all images in `public/` for simple Vite paths
- Reference public images with absolute paths such as `/logo.jpg`

## Styles And Components

Main UI sections are implemented in `src/main.jsx`:

- `Header`
- `HomePage`
- `WhyChoose`
- `AboutPage`
- `Journey`
- `Values`
- `BusinessInformation`
- `ServicesPage`
- `ContactPage`
- `Footer`

Reusable UI patterns:

- `SectionTitle`
- `Eyebrow`
- `FeatureCard`
- `GoldIcon`
- `Stat`

## Animation Guidance

Current UI uses restrained interaction polish:

- Header backdrop blur
- Button hover-ready structure
- Navigation color transitions
- Input focus border transitions

Future animation additions should stay subtle:

- Fade sections in on scroll
- Slight card lift on hover
- Soft gold glow on primary buttons
- Slow hero logo glow pulse
- Avoid heavy motion or bright effects that break the luxury style

Example hover polish:

```css
.feature-card {
  transition: transform 180ms ease, border-color 180ms ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: var(--line-strong);
}
```

## Build Check

Run:

```powershell
npm run build
```

Expected result:

```text
vite build
dist/
```

## Deployment Notes

For Vercel:

- Framework preset: Vite
- Root directory: `project/frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install --no-audit --no-fund --ignore-scripts`

See:

```text
github-actions/vercel-deploy.yml
```

