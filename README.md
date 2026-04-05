# Stellarae Company Website

This directory contains the company-facing static website showcasing our commitment to open source security infrastructure.

## Pages

- `index.html`: Landing page
- `projects.html`: Open source projects for identity and authorization
- `about.html`: Company mission centered on open source commitment
- `solutions.html`: Adoption patterns for different team profiles
- `contact.html`: Contact channels for support and collaboration
- `styles.css`: Shared visual system

## Local Preview

From repository root:

```bash
python3 -m http.server 8787 --directory STELLARAE
```

Open `http://127.0.0.1:8787`.

## GitHub Pages

A dedicated workflow publishes this directory to GitHub Pages:

- `.github/workflows/company-pages.yml`

Note: If another Pages workflow is also active, the last deployed artifact becomes the active site.
