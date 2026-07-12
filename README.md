# Vista Make — Scan Page Prototype

**Live demo:** https://hey714.github.io/Vista-Make/

An interactive front-end prototype of a microscope control application's scan workflow, built from a Figma design and implemented entirely with [Claude Code](https://claude.com/claude-code).

It recreates the "Rough" scan screen of a PiFM/AFM microscopy tool: camera/scanner-map view, coordinate and location controls, live scan pattern configuration (rasterized/spiral), a simulated scan with an animated top-to-bottom heatmap reveal, laser/spectrum controls with a "Take spectrum" flow, and a scan/spectrum history panel with editable notes.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS v4

## Getting started

```bash
npm install
npm run dev
```

## Deployment

Pushing to `master` builds the app and deploys it to GitHub Pages via the workflow in `.github/workflows/deploy.yml`.
