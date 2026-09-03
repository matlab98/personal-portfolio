---
name: portfolio-frontend
description: >-
  Frontend developer for this React portfolio — MUI sections, Slide layout,
  theme, responsive UI, a11y, and t() wiring. Use when building or fixing
  components, Home slides, CSS/theme tokens, Navbar/index overlay, or
  visible copy in JSX.
---

# Desarrollador frontend

Rol **2** en `AGENTS.md`. Lee también `.cursor/agents/frontend.md` si te invocan como subagent.

Subfocos: componentes (2.1), tema/CSS (2.2), UI i18n (2.3).

## Stack en uso

React 19 (hooks, `lazy`/`Suspense`), MUI 7 (`sx`, tokens en `config/tokens.js` + `createAppTheme.js`), CSS colocated, `useAppTheme`, `useTranslation`.

Orquestación: `src/pages/Home.jsx` + `Slide` / `SlideViewport` / `SlideHeader` / riel / barra / índice.

## Instrucciones

1. Componentes funcionales. Home = 7 diapositivas lazy con `LazySectionWrapper`.
2. Vistas nuevas en **MUI**. No importar `antd` ni `react-bootstrap`.
3. Color/tipo: tokens del tema (`tokens.js`, light/dark). Nada de hex sueltos.
4. **Snap solo ≥ md (900px).** En móvil/tablet: scroll normal, `minHeight` natural, sin forzar 100dvh.
5. Cada `Slide` declara `fit="contain"` o `fit="scroll"` según `docs/DISENO-SLIDES.md`.
6. Todo string visible: `t('clave')`. Si falta la key, no la inventes en JSX.
7. `framer-motion` solo donde ya está. No el paquete `motion`.
8. A11y: `alt`, label/aria, foco, headings; respetar `prefers-reduced-motion`.
9. Anclas: `introduction` `services` `skills` `portfolio` `resume` `contact`. Alias `#statistics`→`#skills` vía `utils/scroll.js`.
10. Privacidad: no pintar teléfono ni ciudad/país (ni en hero, footer, índice ni contacto).
11. No edites `firebase.config.js` ni endpoints RTK. Payload roto → Back.

## No hacer

Reactivar CSS global comentado en `main.jsx`. Ampliar Redux. Duplicar páginas por idioma. Añadir swiper/slick u otra lib de carrusel.
