# First Draft — Concept Product & Web Design

**First Draft** is a fictional organic sparkling juice brand sold in 330ml cans, in four flavours: Apple, Peach, Guava and Pineapple. This repo holds the brand and e-commerce website I designed to go with the can packaging.

> Concept project by **Amritanshu**. Product, packaging and web design.

**Live site:** _add your Vercel link here_

---

## About the project

The brief I set myself: design a juice brand from the can outward, then build a website that feels like the packaging. The site's type, colour and layout all come from the can labels, so the product and the page read as one system.

### Design language
- **Type:** Antonio (headlines), Pathway Gothic One (body), Taken by Vultures (script accents), matching the can.
- **Colour:** each flavour has its own palette. The page background and accents shift as you switch flavours.
- **Structure:** a white page framed by a black floating pill nav and a black footer, with editorial numbering ("No. 01", "No. 02"…) that echoes the label.

## Features
- **3D rotating can** in the hero, set on a stamp and built with three.js, using the real label artwork as its texture.
- **The Edit:** a section with scroll-driven animations introducing the range.
- **Shop:** flavour and pack-size selectors, a one-off or subscribe choice (10% off, every 2 or 4 weeks), and a working cart drawer.
- **Ingredient badges** and taste notes for each flavour.
- **Reviews** in a black band.
- **FAQ, stockist finder and help/contact section.**
- **Mobile touches:** tilt and drag on the can.
- **Accessibility:** every animation switches off for users who prefer reduced motion.
- **Performance:** WebP images, with label textures scaled to 2048px.

## Tech
- Static HTML, CSS and JavaScript with no build step
- [three.js](https://threejs.org/) for the 3D can
- Google Fonts
- Hosted on [Vercel](https://vercel.com/)

## Project structure
```
├── index.html      # The website
├── support.js      # Component runtime
├── can3d.js        # 3D can model (three.js)
└── assets/         # Labels, logo, wordmarks, stamp, fonts
```

## Run locally
```bash
npx serve .
```
Then open the local address it prints. Serve the folder over HTTP; opening `index.html` directly may block the assets.

## Deploy
1. Push this repo to GitHub.
2. In Vercel, choose **Add New → Project** and import the repo.
3. Set the framework preset to **Other** and leave the build settings empty.
4. Deploy.

## Notes
This is a design prototype. Checkout, the newsletter and the contact form are not connected to any backend. The brand, reviews, pricing and contact details are all fictional.

---

© 2026 Amritanshu. First Draft is a fictional brand created for portfolio purposes.
