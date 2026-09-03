# Tests — Vitest

Runner: **Vitest** sobre la config de Vite (`vite.config.js`, bloque `test`). No hay Jest ni CRA.

## Comandos

```bash
npm test            # vitest run  — una pasada, lo que corre CI
npm run test:watch  # vitest      — modo watch en desarrollo
npm run test:coverage
```

## Estado: pendiente de instalación

El runner **todavía no está instalado**. Esta máquina no alcanza el registry de npm
(`UNABLE_TO_VERIFY_LEAF_SIGNATURE`, certificado no verificable), así que la config y los
tests están escritos pero no se han ejecutado con Vitest.

Cuando haya red, un único comando lo deja funcionando:

```bash
npm install
```

Las dependencias ya están declaradas en `devDependencies`:
`vitest@^3.2.4`, `@vitest/coverage-v8@^3.2.4`, `jsdom@^26.1.0`,
`@testing-library/jest-dom@^6.6.3` y `@testing-library/dom@^10.4.0`
(este último es peer dep de `@testing-library/react` 16 y faltaba en `node_modules`,
por lo que hoy ningún `render()` funcionaría).

Si `npm install` completo es demasiado, el mínimo para correr esta suite es:

```bash
npm install -D vitest jsdom @vitest/coverage-v8
```

> No se debe desactivar la verificación TLS (`strict-ssl=false`,
> `NODE_TLS_REJECT_UNAUTHORIZED=0`) para saltarse el error: se arregla el certificado
> corporativo (`NODE_EXTRA_CA_CERTS` / `npm config set cafile`), no la seguridad.

**Nota de versiones:** este equipo corre Node 18.20.8. Vitest 4 exige Node 20+, por eso
el rango está fijado en `^3.2.4`. Al subir a Node 20+ se puede evaluar Vitest 4.

## Convenciones

- Ubicación: `src/**/__tests__/*.test.js` junto al módulo, o `src/test/*.test.js` para
  tests transversales (contratos, i18n).
- Patrón **AAA** (Arrange / Act / Assert) y nombres descriptivos en español.
- `environment: 'jsdom'`, `globals: true` y alias `@/` heredado de `resolve.alias`.
- Sin mocks innecesarios: solo se stubbea `Storage.prototype` para simular un storage
  que lanza (modo privado, cuota llena).
- Los tests verifican el comportamiento **correcto**, no el histórico. Cuando un test
  documenta una decisión discutible (redondeo de decimales, años cumplidos vs
  calendario), el criterio va escrito en el comentario del `it`.

## Qué cubre hoy

| Archivo | Cubre |
|---|---|
| `src/utils/__tests__/formatDate.test.js` | `getHours` (variantes de sufijo, enteros largos sin coma, separadores de miles, decimales redondeados, no-string, sin match) y `convertDaysToYearsByDate` (años cumplidos, aniversarios, bisiesto, validación de entrada → `null`) + contrato con el filtro `Number.isFinite` de `MetricDashboard` |
| `src/hooks/__tests__/useLocalStorage.test.js` | round-trip por tipo, valores crudos corruptos → `null`, las cuatro operaciones contra un storage que lanza, y el contrato de `themeMode` con `ThemeContext` |
| `src/test/i18n-parity.test.js` | paridad exacta de keys `en-us` ↔ `es-co`, valores vacíos, longitud/forma de arrays (`hero.bullets`) e interpolaciones `{{var}}` |

Pendiente para la segunda ronda: tests de componentes de UI (`Section`, `Navbar`,
`Touch`, `stats`), una vez estabilice el rediseño en curso.

## CI

`.github/workflows/main.yml` no debe llamar a `npm test` hasta que el install funcione:
un paso rojo permanente entrena al equipo a ignorar el pipeline, y un `continue-on-error`
es un verde falso. Se agrega el paso en el mismo PR que instala las dependencias.
