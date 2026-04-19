# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start local dev server at http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

## Deployment

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds the Vite app and deploys `dist/` to GitHub Pages via the GitHub Actions Pages API. The custom domain `edcobos.com` is wired up via `public/CNAME` (copied into `dist/` at build time).

No manual deploy step — push and the workflow handles it.

## Architecture

Single-page React + Vite app. No router — it's a one-screen personal site.

- `src/App.jsx` — root component; holds all content and the `LINKS` array for social buttons
- `src/components/AnimatedBackground.jsx` — fixed fullscreen layer of CSS-animated blobs behind everything
- `src/App.css` — layout, card glassmorphism, avatar spin-ring, link button styles, entrance animation
- `src/components/AnimatedBackground.css` — blob keyframe animations and the SVG noise overlay

**Background effect:** four absolutely-positioned `div`s with `border-radius: 50%`, `filter: blur(90px)`, and individual `@keyframes` paths on a dark `#060612` base. A tiny inline SVG noise texture sits on top for depth.

**Card:** `backdrop-filter: blur(28px)` glassmorphism over the blobs, `rgba(255,255,255,0.04)` fill, `border-radius: 28px`.

**Avatar ring:** CSS `conic-gradient` on `::before` with a `spin` keyframe rotation.

## Static assets

Profile image lives at `public/images/profile_picture_clear_bg_small.png` → served as `/images/profile_picture_clear_bg_small.png` in dev and copied verbatim to `dist/` on build. To swap in a new image, replace that file.
