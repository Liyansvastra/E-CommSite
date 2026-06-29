<div align="center">

  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=800&size=34&duration=2600&pause=700&color=D2A935&center=true&vCenter=true&width=900&lines=LIYAN'S+VASTRA;Elevated+Elegance+in+Every+Thread;Luxury+Vite+React+Frontend;Dark+Gold+Premium+Apparel+UI" alt="LIYAN'S VASTRA animated title" />

  <p>
    <strong>LIYAN'S VASTRA</strong> is a premium apparel brand frontend project.
    This repository contains the Vite React frontend, GitHub Actions workflow, images, and deployment-ready static build setup.
  </p>

  <p><img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" /> <img alt="React" src="https://img.shields.io/badge/React-18-149ECA?style=for-the-badge&logo=react&logoColor=white" /> <img alt="CSS" src="https://img.shields.io/badge/CSS-Plain%20CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white" /> <img alt="Node" src="https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" /> <img alt="Frontend" src="https://img.shields.io/badge/Frontend-Only-D2A935?style=for-the-badge" /></p>

  <p>
    <a href="#overview">Overview</a>
    <span> | </span>
    <a href="#project-layout">Layout</a>
    <span> | </span>
    <a href="#frontend-pages">Pages</a>
    <span> | </span>
    <a href="#images">Images</a>
    <span> | </span>
    <a href="#github-pages">GitHub Pages</a>
  </p>

</div>

---

## Overview

This project contains the LIYAN'S VASTRA frontend website. The site presents the brand through a dark luxury visual system, gold accents, responsive sections, and a mobile-friendly navigation menu.

The project is frontend-only. No backend is included.

## Project Layout

| Path | Purpose |
| --- | --- |
| `frontend` | Main Vite React frontend |
| `frontend/public` | Public images and static assets |
| `frontend/src` | Main React and CSS source files |
| `.github/workflows/frontend.yml` | Frontend build and GitHub Pages deployment workflow |
| `.gitignore` | Ignore rules for generated frontend folders |

## Frontend Pages

| Page | Main Content |
| --- | --- |
| Home | Hero, story, why choose cards, footer |
| About | About hero, journey, values, business information, work together section |
| Services | Custom Design, Sustainable, Expert Team, Quality First, Fast Delivery, Customer Care |
| Contact | Address, phone, email, business hours, message form |

## Images

<div align="center">
  <img src="./frontend/public/logo.png" alt="LIYAN'S VASTRA logo" width="180" />
  <br />
  <strong>Logo</strong>
</div>

<br />

<div align="center">
  <img src="./frontend/public/background.jpg" alt="LIYAN'S VASTRA background" width="720" />
  <br />
  <strong>Background</strong>
</div>

| Asset | Location | Usage |
| --- | --- | --- |
| Logo | `frontend/public/logo.png` | Header, hero, footer, business details |
| Background | `frontend/public/background.jpg` | Global blurred background |
| Background copy | `frontend/public/images/background.jpg` | Extra public image copy |

## Visual Style

| Area | Direction |
| --- | --- |
| Background | Black luxury theme with blurred image layer |
| Accent | Gold highlights and borders |
| Typography | Serif headings and clean body text |
| Cards | Dark bordered panels |
| Header | Desktop nav plus mobile menu icon |
| Footer | Business and legal information |

## GitHub Pages

The workflow in `.github/workflows/frontend.yml` builds the frontend and deploys the `dist` output using GitHub Pages.

To get the public URL:

1. Open repository Settings.
2. Open Pages.
3. Set Source to GitHub Actions.
4. Run the frontend workflow from the Actions tab.
5. Open the deployment URL shown in the workflow summary.

## Development Notes

- The frontend lives inside `frontend`.
- Keep generated folders ignored.
- Keep images in `frontend/public`.
- Keep backend code out of this repository unless a separate backend phase is planned.

---

<div align="center">
  <strong>LIYAN'S VASTRA</strong><br />
  Premium apparel frontend with dark luxury styling.
</div>
