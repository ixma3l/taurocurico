# Tauro Curicó website

Astro static site for the Tauro Curicó product catalog. The app is built with Astro, TypeScript, Vitest, pnpm, and an nginx runtime image for Coolify deployments.

## Quick start

1. Use Node.js 22 LTS and enable pnpm with Corepack.
2. Install dependencies with `pnpm install`.
3. Run `pnpm dev` for local development.
4. Run `pnpm validate` before deploying.

## Stack

| Area | Tooling |
|------|---------|
| Framework | Astro 7 |
| Language | TypeScript |
| Package manager | pnpm |
| Tests | Vitest |
| Validation | Astro check |
| Runtime deploy | Docker + nginx on port `8080` |

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start the Astro dev server. |
| `pnpm test` | Run Vitest tests once. |
| `pnpm check` | Run `astro check`. |
| `pnpm build` | Build the static site into `dist/`. |
| `pnpm preview` | Preview the production build locally. |
| `pnpm validate` | Run tests, Astro checks, and the production build. |

## Docker and Coolify deploy

The Dockerfile builds the Astro site with Node 22 and serves the generated files with nginx.

Deployment expectations:

- Container port: `8080`.
- Static output path: `/usr/share/nginx/html`.
- Persistent uploads mount: `/usr/share/nginx/html/uploads`.
- nginx keeps `absolute_redirect off;` and `port_in_redirect off;` for proxy-friendly redirects.

In Coolify, mount persistent storage at `/usr/share/nginx/html/uploads` so uploaded catalog images survive image rebuilds and container replacement.

## Uploads

Runtime uploads are served from `/uploads/` and are intentionally not tracked by Git.

Expected structure:

```text
/usr/share/nginx/html/uploads/
└── <catalog folders and image files>
```

Allowed public upload extensions are image-only: `jpg`, `jpeg`, `png`, `webp`, `avif`, and `gif`. Dotfiles, SVG uploads, backups, config files, archives, scripts, keys, database dumps, logs, and HTML/JSON-like files are blocked by nginx.

## Repo hygiene

- Use pnpm; do not track `package-lock.json`.
- Keep `public/uploads/` and `src/assets/images/uploads/` untracked.
- Do not commit local environment files or production uploads.
- Prefer project assets from `src/assets` or `public` for static UI imagery.
