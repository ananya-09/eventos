# event-dashboard

## GitHub Pages deployment

This repository includes a GitHub Pages workflow at `.github/workflows/deploy-pages.yml`.

- Push to `main` (or run the workflow manually) to build and deploy.
- In repository settings, set **Pages** source to **GitHub Actions**.
- Pages build mode is enabled with `GITHUB_PAGES=true`, which applies the `/eventos` base path and static export settings.