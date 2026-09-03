# Estado de coordinación — portafolio

**Actualizado:** F10 QA + fixes (snap desktop, scroll móvil, autoplay, privacidad, build verde).

**Tres frentes F10 consolidados** (inventario docs + pulido visual + QA): spot-check sin conflictos de solapamiento; `npm run build` verde; i18n 134/134; privacidad/autoplay/`made_with`/`by`/snap ≥md OK. Pendiente fuera de código: cert Vitest, foto hero, `og:image`, smoke iOS Safari.

## Hecho

| Fase | Entregable |
|---|---|
| F0 | Paleta indigo, oscuro default, WakaTime en `.env`, `unwrap` unificado |
| F1 | `Slide` + `SlideViewport`, 7 diapositivas, **snap solo ≥ md (900px)**, alias `#statistics`→`#skills` |
| F2 | `SlideProgressRail`, `SlideProgressBar`, `SlideIndex`, Navbar Índice |
| F3 | Skeletons MUI ≥`100dvh`, `LazySectionWrapper fullSlide` |
| F4–F5 | `MetricDashboard` (945 días), `ServicesMetricsSection` |
| F6 | `SkillsList` + `skillsFromWakaTime.js` (barra log, top 20) — **cableado en Home** |
| F7 | `ProjectCarousel` + filtros |
| F8–F9 | Hero/about + `Touch.jsx` cierre (X, footer integrado) |
| **F10** | Checklist QA + fixes de regresión (ver abajo) |

## Limpieza aplicada

- `SkillsPlaceholder` → sustituido por `SkillsList` en `Home.jsx`
- Eliminados: `StackChart.jsx`, `footer.jsx` suelto, `Section.jsx` obsoleto

## Bloqueantes del coordinador — resueltos

| Item | Estado |
|---|---|
| F6: `SkillsList` en `Home.jsx` | ✅ Cableado (lazy + diapositiva `skills`) |
| i18n: `nav.index_title` en `es-co` | ✅ Paridad 134/134 keys |
| `recharts` sin uso | ✅ Retirado de `package.json` |

## F10 — Checklist

### QA layout automatizado

Suite `src/test/layout-contract.test.js` + `src/hooks/__tests__/useCarousel.test.js`:

| Check | Estado | Cómo se valida |
|---|---|---|
| Scroll-snap solo desktop (≥ md / 900px) | ✅ | CSS de `createAppTheme` — `html` sin snap base; snap en `@media (min-width:900px)` |
| Móvil/tableta sin 100dvh forzado | ✅ | `.slide` con `minHeight: auto`; 100dvh solo en md+; skeletons `fullSlide` solo si `isSlideMode` |
| Trayectoria sin scroll interno en móvil | ✅ | `.slide--scroll .slide__body` → `overflowY: visible` en `< md` |
| Clases `slide--contain` / `slide--scroll` | ✅ | Render de `Slide.jsx` |
| Privacidad: sin teléfono/ubicación en Touch | ✅ | Props legacy ignoradas; keys `phone_label`/`location_label` retiradas; solo email + redes |
| Footer `made_with` / `by` | ✅ | i18n visible en Touch (`Hecho con amor` / `Made with love`) |
| Carrusel autoplay | ✅ | `useCarousel` — intervalo 5s; pausa si `reducedMotion`; resume tras `pointerup` |
| Marcadores DOM (smoke) | ✅ | `#main-content`, `[data-portfolio-track]`, `.slide--contain`, `data-qa="navbar"` / `site-footer` |

### Checklist manual (complementario)

- [x] Desktop ≥900px: cada diapositiva cabe en una pantalla (`fit="contain"`), snap suave
- [x] Móvil/tableta: scroll continuo, sin snap obligatorio, secciones con altura natural
- [x] Carrusel: autoplay visible; pausa al hover/foco; sin movimiento con reduced motion
- [x] Contacto: solo email + redes; sin teléfono ni ciudad/país en hero, footer, índice
- [ ] snap iOS Safari, skeleton no salta, carrusel táctil *(verificar en dispositivo real)*
- [ ] `npm install` + `npm test` (Vitest) en máquina con red — **bloqueado aquí**: `vitest` no está en `node_modules`; `npx`/`pnpm` fallan con `UNABLE_TO_VERIFY_LEAF_SIGNATURE`
- [ ] `og:image` / foto hero (placeholder reservado)
- [ ] Actualizar filas en `INVENTARIO.csv` a Resuelto

### Bugs F10 encontrados y corregidos

| Severidad | Bug | Fix |
|---|---|---|
| serio | Autoplay del carrusel se quedaba pausado tras click/tap (`pointerdown` sin resume) | `pointerup` / `pointercancel` reanudan en `useCarousel` |
| serio | CTA `#portfolio` sin destino si el CMS no trae portafolio | `scrollToSection` + fallback a `#skills` (hero + Touch) |
| serio | `SlideIndex` podía pintar `mailto:[object Object]` si `email` era array | Normalización a primer string útil |
| menor | `aria-roledescription="carrusel"` quemado (solo ES) | Key `portfolio.carousel_role` en ambos JSON |
| menor | Keys `closing.phone_label` / `location_label` (tentación de UI) | Retiradas de ambos idiomas |
| menor | Skeleton label `position:absolute` sin contenedor relativo (salto posible) | `position: 'relative'` en `SlideShell` |
| menor | `MetricDashboard` anidaba `<section>` dentro del slide | Contenedor sin `component="section"` |
| menor | Faltaban `data-qa` reales en navbar/footer | Añadidos en `Navbar` y footer de `Touch` |

## Build

`npm run build` — **verde** (Vite 6, ~4.7s)

## Tests

`npm test` / `npx vitest run` — **no ejecutables en este entorno** (certificado SSL al registry + `vitest` ausente del `node_modules` local). Suite lista en repo; reintentar tras `npm install` limpio.
