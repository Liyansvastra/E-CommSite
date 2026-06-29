<div align="center">

  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=800&size=34&duration=2600&pause=700&color=D2A935&center=true&vCenter=true&width=900&lines=LIYAN'S+VASTRA;Elevated+Elegance+in+Every+Thread;Luxury+Vite+React+Frontend;Dark+Gold+Premium+Apparel+UI" alt="LIYAN'S VASTRA animated title" />

  <p>
    <strong>LIYAN'S VASTRA</strong> is a premium apparel brand frontend built with a clean Vite React setup.
    The site follows the supplied dark luxury reference screens with gold accents, serif headings, bordered cards, responsive sections, and a mobile menu.
  </p>

  <p><img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" /> <img alt="React" src="https://img.shields.io/badge/React-18-149ECA?style=for-the-badge&logo=react&logoColor=white" /> <img alt="CSS" src="https://img.shields.io/badge/CSS-Plain%20CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white" /> <img alt="Node" src="https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" /> <img alt="Frontend" src="https://img.shields.io/badge/Frontend-Only-D2A935?style=for-the-badge" /></p>

  <p>
    <a href="#overview">Overview</a>
    <span> | </span>
    <a href="#screens-and-assets">Images</a>
    <span> | </span>
    <a href="#frontend-pages">Pages</a>
    <span> | </span>
    <a href="#visual-style">Visual Style</a>
    <span> | </span>
    <a href="#responsive-behavior">Responsive</a>
    <span> | </span>
    <a href="#deployment">Deployment</a>
  </p>

</div>

---

## Overview

LIYAN'S VASTRA is a frontend-only brand website for a luxury apparel and textile business. It is built as a simple Vite React frontend with no backend code inside the frontend folder.

The frontend focuses on:

- A dark luxury brand presentation.
- Gold accent styling inspired by the supplied UI screenshots.
- Clear Home, About, Services, and Contact pages.
- A shared header and footer across all pages.
- A mobile menu icon that opens navigation links below the header.
- A blurred background image layer across the full site.

## Screens And Assets

<div align="center">
  <img src="./public/logo.png" alt="LIYAN'S VASTRA logo" width="180" />
  <br />
  <strong>Primary Logo</strong>
</div>

<br />

<div align="center">
  <img src="./public/background.jpg" alt="LIYAN'S VASTRA background" width="720" />
  <br />
  <strong>Global Background Image</strong>
</div>

| Asset | Location | Usage |
| --- | --- | --- |
| Logo | `public/logo.png` | Header, hero logo, footer, business information card |
| Background | `public/background.jpg` | Global blurred background and page visual treatment |
| Background copy | `public/images/background.jpg` | Additional public image copy for page sections |

## Frontend Pages

| Page | Main Content |
| --- | --- |
| Home | Hero, brand story, feature cards, shared footer |
| About | About hero, journey, values, business information, work together CTA |
| Services | Six service cards for apparel solutions |
| Contact | Contact information cards and message form |

## Menu Flow

| Device | Navigation Behavior |
| --- | --- |
| Desktop | Full menu is visible in the header |
| Tablet | Menu icon appears and opens the dropdown navigation |
| Mobile | Logo and menu icon stay compact; links open below the header |

Navigation order:

Home -> About -> Services -> Contact -> Get In Touch

## Visual Style

| Design Area | Direction |
| --- | --- |
| Background | Deep black with a blurred apparel background image |
| Accent | Gold for active states, buttons, icons, dividers, and borders |
| Typography | Premium serif headings with clean sans-serif body text |
| Cards | Dark panels with thin gold-tinted borders |
| Header | Sticky black header with logo, navigation, CTA, and mobile menu |
| Footer | Dark business footer with company, legal, and contact details |
| Forms | Dark fields with gold labels and subtle borders |

## Color Palette

| Color Role | Value | Usage |
| --- | --- | --- |
| Main background | `#020202` | Page base |
| Panel background | `#0e0e0d` | Cards and business panels |
| Gold accent | `#d2a935` | Brand highlights |
| Light gold | `#f1d562` | Button and icon highlights |
| Main text | `#f7f4ef` | Headings and primary text |
| Muted text | `#a3a1aa` | Paragraphs and secondary labels |

## Animation Direction

The README intentionally does not include animation code. The intended animation style is:

- Subtle card hover lift.
- Smooth button hover response.
- Gentle hero logo glow.
- Soft mobile menu open and close transition.
- Reduced, calm motion suitable for a luxury apparel brand.

Avoid heavy bouncing, bright neon motion, and distracting effects.

## Responsive Behavior

| Viewport | Layout Behavior |
| --- | --- |
| Desktop | Full header menu, large hero, multi-column cards |
| Tablet | Mobile menu icon, stacked major sections, two-column cards where space allows |
| Mobile | Single-column layout, compact header, dropdown menu, stacked cards and form fields |

Recommended visual checks:

- 375 px mobile width
- 768 px tablet width
- 1024 px small desktop width
- 1440 px desktop width

## Project Details

| Area | Details |
| --- | --- |
| Framework | Vite |
| UI | React 18 |
| Styling | Plain CSS |
| Backend | Not included |
| Package manager | npm |
| Local dev server | `http://localhost:5173` |
| Build output | `dist` |

## Deployment

The repository includes a frontend GitHub Actions workflow in the parent project folder. It builds the Vite frontend and deploys the production output through GitHub Pages when configured.

GitHub Pages setup:

- Open repository Settings.
- Open Pages.
- Select GitHub Actions as the source.
- Run the frontend workflow again.

## Development Notes

- Keep backend code out of the frontend folder.
- Keep the dependency list small.
- Keep images in the public folder.
- Do not commit secrets.
- Check the production build before pushing frontend changes.

---

<div align="center">
  <strong>LIYAN'S VASTRA</strong><br />
  Elevated elegance in every thread.
</div>
