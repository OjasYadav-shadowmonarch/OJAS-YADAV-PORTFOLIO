# Ojas Yadav — Developer Portfolio

A responsive personal portfolio built with plain HTML, CSS, and JavaScript and deployed with GitHub Pages.

## Live site

https://ojasyadav-shadowmonarch.github.io/OjasYadav-Portfolio/

## Features

- **Dark and light themes** — follows the operating system preference on first visit and remembers the visitor's choice in `localStorage`
- Responsive layout for desktop, tablet, and mobile
- Animated hero console with syntax-highlighted, typed code snippet
- Interactive particle network in the hero that reacts to the pointer
- Rotating headline word and animated statistic counters
- Scroll-spy navigation that highlights the section you are reading
- Scroll-progress bar and a back-to-top button
- Filterable project grid
- Contact form that composes the message in the visitor's email app — no backend required
- Copy-to-clipboard button for the email address
- Scroll-reveal effects with full `prefers-reduced-motion` support
- Print-friendly stylesheet
- JSON-LD structured data, Open Graph and Twitter cards, and an SVG favicon
- Direct links to GitHub, LinkedIn, HackerRank, and LeetCode
- No framework, package manager, or build step required

## Sections

| # | Section   | Anchor     | Purpose                                              |
|---|-----------|------------|------------------------------------------------------|
| 01 | About     | `#about`   | Introduction, quick facts and current approach       |
| 02 | Journey   | `#journey` | Timeline of what has been built and what comes next   |
| 03 | Toolkit   | `#skills`  | Skill groups plus a map of how the stack fits together|
| 04 | Work      | `#projects`| Selected projects with a category filter              |
| 05 | Credentials | `#credentials` | Verified certificates, courses and awards      |
| 06 | Connect   | `#connect` | Email, message form and social profiles              |

## Projects featured

- **HostelHub:** Flask + PostgreSQL accommodation platform with role-based student, owner, and admin workflows. Deployed on Render.
- **StudyPulse:** browser-based study-planning prototype. Listed as a contribution; its recommendations are rule-based.
- **Personal Portfolio:** this site.

## Run locally

1. Download or clone the repository.
2. Open `index.html` in a browser.

No installation or build command is required.

## File structure

```
index.html         markup for every section
style.css          design tokens, themes and layout
script.js          theme, navigation, scroll spy, console, filters, form
assets/
  favicon.svg      browser icon
  og-cover.png     social preview image (1200 × 630)
  build-og.ps1     script that regenerates og-cover.png
```

## Adding your own certificates

The **Credentials** section in `index.html` contains three dashed placeholder slots. Replace the contents of each `<article class="credential-card">` with your real details and drop the `credential-slot` class once the card holds a genuine credential:

```html
<article class="credential-card reveal">
  <span class="credential-badge mono">2026</span>
  <h3>Python for Everybody</h3>
  <p class="credential-issuer">Coursera · 2026</p>
  <p class="credential-note">Short description of what the course covered.</p>
</article>
```

Add the credential URL to the card title if you want it to be clickable. Only publish credentials you can verify.

## Wiring the contact form to a real backend

The form works out of the box by opening the visitor's email app. To collect messages on your own server instead:

1. Create a free endpoint on [Formspree](https://formspree.io), [Web3Forms](https://web3forms.com) or similar.
2. Replace the `submit` handler in `script.js` (section 13) with a `fetch` call to that endpoint.
3. Keep the client-side validation, and show the success message when the request resolves.

## Customising the theme

All colours, spacing and typography live in custom properties at the top of `style.css`. Change the values in `:root` for the dark theme and in `[data-theme="light"]` for the light theme — every component reads from those tokens.

## Deploy with GitHub Pages

1. Open the repository settings.
2. Select **Pages** under **Code and automation**.
3. Choose **Deploy from a branch**, select `main` and `/(root)`, then save.
4. Wait for the deployment to finish and open the published URL.

## Before publishing

- Confirm all profile and project links.
- Keep project descriptions aligned with the work actually implemented.
- Fill the credential slots only with details you have verified.
- Regenerate `assets/og-cover.png` if you change the headline.
- Do not publish private credentials or personal account information.
