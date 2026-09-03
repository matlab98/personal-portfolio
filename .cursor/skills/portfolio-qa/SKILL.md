---
name: portfolio-qa
description: >-
  QA for this React portfolio — functional checks, premium bugs, outage
  simulation, layout-contract and carousel tests, merge readiness. Use when
  testing, reviewing, hunting bugs, F10 checklist, or deciding if a change is
  functionally ready.
---

# QA — máquina de fallos

Rol **5** en `AGENTS.md`. Lee también `.cursor/agents/qa.md` si te invocan como subagent.

Subfocos: funcional (5.1), bug premium (5.2), caos (5.3), regresión (5.4).

Reproduce → aísla → reporta. Funcional primero.

## Matriz funcional (mínima)

- `/` redirige a `en-us` o `es-co`.
- 7 diapositivas en `Home.jsx`; nav/índice scrollean a ids reales.
- Alias `#statistics` → `#skills`.
- Desktop ≥900px: snap activo; móvil/tablet: scroll normal sin 100dvh forzado.
- Idioma: paridad `t()` en ambos JSON (`i18n-parity.test.js`).
- Tema: toggle + `themeMode`.
- CMS: loading, retry, vacío, error.
- Secciones condicionales: sin dato no crash.
- Métricas/skills: fallo RTK no tumba el resto.
- Contacto: sin teléfono ni ubicación en UI; form loading/ok/error.
- `/error` y path basura.

## Suite automatizada (F10)

- `src/test/layout-contract.test.js` — snap ≥md, fit classes, privacidad Touch, marcadores DOM.
- `src/hooks/__tests__/useCarousel.test.js` — autoplay / reduced motion.
- `src/test/i18n-parity.test.js` — keys en ambos idiomas.

Correr con Vitest cuando el script exista; si no, señalar deuda DevOps.

## Bugs premium a cazar

- Props sin desestructurar (`MetricDashboard`).
- `error.message ?? errorFour.message` si `error` es undefined.
- Números hardcodeados vs datos WakaTime reales.
- `console.log(emailKey)` u otros secretos en log.
- Spinner/bloqueo global si Firebase pestañea.
- Nav a sección que el CMS no trajo (scroll silencioso).
- IDs duplicados padre/hijo; Grid API vieja en MUI 7.
- Keys i18n crudas; `themeMode` corrupto sin try/catch.
- Snap activo en viewport < 900px (regresión responsive).

Estado vivo: `docs/ESTADO-COORDINACION.md`.

## Caos con lápiz

Offline · JSON null · key i18n borrada · `/:lang=fr-fr` · EmailJS vacío · localStorage basura · doc sin `portfolio` · stats 500.

## Informe

```text
Severidad: bloqueante | serio | menor
Pasos:
Esperado:
Actual:
Archivo probable:
```

No apruebes strings quemados, keys en un solo idioma, ni secretos en consola. Fix solo si lo piden (mínimo); si no, devuelve al dueño.
