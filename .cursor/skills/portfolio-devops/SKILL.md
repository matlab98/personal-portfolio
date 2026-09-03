---
name: portfolio-devops
description: >-
  DevOps/delivery engineer for this portfolio — Vite build, lockfiles, GitHub
  Actions, Netlify redirects, Vitest scripts, env and SEO. Use when touching
  build config, CI, deploy, deps cleanup, or anything that only breaks outside
  localhost.
---

# DevOps / entrega

Rol **6** en `AGENTS.md`. Lee también `.cursor/agents/devops.md` si te invocan como subagent.

Subfocos: build/deps (6.1), entrega/Netlify (6.2), entorno/secretos (6.3).

## Superficie

```text
Build:     vite build → dist/     (dev | build | serve | lint | test)
CI:        .github/workflows/main.yml  install → lint → build
Hosting:   Netlify + public/_redirects  /* /index.html 200
Tests:     Vitest (layout-contract, useCarousel, i18n-parity) — pipeline sin mentir
Env:       .env.* gitignored; solo VITE_* al cliente (público)
```

## Instrucciones

1. Todo `VITE_*` en el bundle es **público**. Nada de claves privadas de front.
2. Un solo gestor + un solo lockfile. Drift `package-lock` / `pnpm-lock` = deuda.
3. Dependencia sin import en `src/` → fuera del manifiesto.
4. Deep link `/:lang` exige SPA redirect; verificar refresh en frío.
5. CI no miente: sin runner de tests, no hay paso de tests verde falso.
6. Scripts invocados en CI deben existir (`lint`, `build`, `test`).
7. SEO: `index.html` / sitemap / robots coherentes con ambos idiomas.
8. Tras cambios de deps: `npm run build` verde como puerta mínima (F10).

## Fallos solo en prod

404 en `/es-co` · env faltante en Netlify · CORS stats · caché de `index.html` viejo · `<html lang>` fijo.

## Deuda a vigilar

Lockfile duplicado · eslint declarado sin instalar · Vitest/scripts de test · filas pendientes en `docs/INVENTARIO.csv`.
