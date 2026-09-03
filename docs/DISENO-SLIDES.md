# Portafolio como diapositivas — Especificación de diseño e implementación

> **Autor del documento:** rol *Arquitecto* + UX (rol 1 de `AGENTS.md`).
> **Estado:** especificación aprobable. Ningún archivo de `src/` fue modificado al escribirla.
> **Público:** los agentes Front (2), Back (3), Fullstack (4), QA (5) y DevOps (6) que la van a ejecutar.
> **Restricción que atraviesa todo:** *no se instalan dependencias.* Solo MUI 7, `@mui/icons-material`, `framer-motion`, `recharts`, `react-countup`, `react-i18next`, RTK Query, EmailJS y CSS nativo.

---

## 0. Resumen de decisiones

| # | Decisión | Motivo en una línea |
|---|---|---|
| D1 | Diapositivas con **CSS `scroll-snap` sobre el scroll del documento**, no un contenedor propio | Conserva deep links, `scrollIntoView`, `IntersectionObserver`, teclado y la barra de URL móvil sin escribir un solo gestor de scroll. |
| D2 | Scrollbar **oculta**, scroll **nativo intacto** | "Que no se vea el desplazamiento" es un requisito visual, no un permiso para secuestrar la rueda. |
| D3 | **7 diapositivas**: hero, quién soy, servicios+métricas, habilidades, proyectos, trayectoria, cierre | Cabe la información pedida sin inventar secciones nuevas ni perder anclas existentes. |
| D4 | Cada slide declara `fit: 'contain' \| 'scroll'` | Regla explícita y única para "qué pasa si el contenido no cabe". |
| D5 | Paleta **indigo + violeta**, modo **oscuro por defecto**, tokens en un solo `tokens.js` | Ya existe el patrón de token único; solo cambian los valores, no la arquitectura. |
| D6 | **Riel de puntos vertical a la izquierda** (md+) + barra fina superior (xs) | El lado libre: arriba a la derecha ya viven marca, idioma y tema. |
| D7 | Navbar se reduce a marca + idioma + tema + **botón "Índice"** con overlay a pantalla completa | Los links inline duplicaban el riel; el índice grande es el gesto de las referencias. |
| D8 | Proyectos en **carrusel horizontal con `scroll-snap-type: x mandatory`** + filtros por tipo | Movimiento lateral pedido, resuelto con scroll nativo, sin swiper ni slick. |
| D9 | Sección **habilidades nueva** con los 20 lenguajes reales de WakaTime | El diferencial del dueño es medir su trabajo; esta sección es la prueba. |
| D10 | Se **retira el radar de recharts** (`StackChart`) | Las habilidades lo reemplazan con más información y menos peso. |
| D11 | Se **elimina el `45` hardcodeado**; su lugar lo toma `range.days_minus_holidays` (945, dato real) | Un número sin fuente en una sección que se llama "medido" es una mentira. |
| D12 | Servicios y métricas se fusionan: **cada servicio del CMS lleva una nota de dato del tracker** | Es lo que evita el collage: no son dos bloques pegados, es copy respaldado por número. |
| D13 | Contacto y footer se fusionan en **una sola diapositiva de cierre** | Un footer de 200px no puede ser un snap point; como cierre de pantalla completa sí. |
| D14 | Skeletons por tipo de sección; `CircularProgress` desaparece del home | Un spinner genérico no comunica qué está llegando. |
| D15 | Se activan `queryOne` (editores) y `queryThree` (SO), hoy muertos | Son dos payloads públicos ya pagados que dan textura al relato. |

---

## 1. Paradigma de navegación: "diapositiva" sin librerías

### 1.1 Quién hace el scroll

El scroll lo sigue haciendo **el documento** (`html`), no un `<div>` con `overflow-y`.

```css
html {
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;          /* Firefox */
  -ms-overflow-style: none;
}
html::-webkit-scrollbar { display: none; }   /* Chromium / WebKit */
```

Cada diapositiva:

```css
.slide {
  min-height: 100dvh;             /* dvh, nunca vh */
  scroll-snap-align: start;
  scroll-snap-stop: normal;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
```

**Por qué el documento y no un contenedor propio.** Con un contenedor `overflow-y: scroll` habría que reescribir `utils/scroll.js`, pasarle `root` al `IntersectionObserver` de `useActiveSection`, reimplementar el progreso (hoy usa `window.scrollY`), y en iOS la barra de direcciones no volvería a colapsar. Nada de eso aporta al resultado visual. Se queda en el documento.

**Por qué `scroll-snap-stop: normal` y no `always`.** Con `always` el navegador prohíbe pasar más de una diapositiva por gesto: un `Ctrl+End`, un flick largo o un `scrollIntoView` de 5 secciones se convierten en una pelea. `normal` sigue garantizando que el scroll **termina** en un borde de diapositiva (que es el efecto que se pide) sin encarcelar al usuario.

**`scroll-padding-top`.** El header es `fixed`. Se mantiene `scroll-padding-top` en `html` igual a `headerHeight`, y `scroll-margin-top` en cada slide, como ya hace `createAppTheme.js`. Con `scroll-snap-align: start` esto es lo que evita que el título quede debajo de la barra.

### 1.2 Teclado

Nada se rompe porque no se intercepta nada:

| Entrada | Comportamiento | Requiere código |
|---|---|---|
| `↓` / `↑` | scroll nativo → el snap lo lleva al borde de la diapositiva | no |
| `PageDown` / `PageUp` | avanza ~una ventana → cae exactamente en la siguiente diapositiva | no |
| `Espacio` / `Shift+Espacio` | igual que PageDown/Up | no |
| `Home` / `End` | primera / última diapositiva | no |
| `Tab` | recorre foco en orden DOM; el navegador hace scroll al elemento enfocado y el snap ajusta | no |
| `Esc` | cierra el overlay de índice | sí (overlay) |

**Único añadido opcional:** `J`/`K` y `←`/`→` como atajos de "siguiente/anterior diapositiva" en el hook `useSlideNavigation`. Debe **abortar** si `event.target` es `input`, `textarea`, `select` o `[contenteditable]`, o si hay un `Dialog`/overlay abierto. Si esto complica la fase, se omite: no es requisito.

> **Prohibido:** `wheel` con `preventDefault`, `touchmove` con `preventDefault`, `overflow: hidden` en `body` con transform del contenedor. Cualquiera de las tres rompe el scroll nativo y con él el teclado y los lectores de pantalla.

### 1.3 Lectores de pantalla

- El DOM sigue siendo un flujo vertical de `<section>` con `aria-labelledby` apuntando al `<h2>` de cada una. El snap es puramente visual: para un lector de pantalla esto es la misma página de siempre.
- **No** se usa `aria-hidden` en las diapositivas fuera de pantalla. Ocultar contenido que existe en el DOM rompe la navegación por encabezados y la búsqueda del navegador (Ctrl+F).
- Jerarquía de encabezados: `h1` solo en el hero; un `h2` por diapositiva; `h3` en tarjetas e ítems. Sin saltos.
- `SkipLink` se conserva y apunta a `#main-content`.
- El riel de puntos es un `<nav aria-label>` con anclas reales; no es decorativo.

### 1.4 `prefers-reduced-motion`

`createAppTheme.js` ya neutraliza animaciones y `scroll-behavior` bajo esa media query. Se **extiende**:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-snap-type: none; scroll-behavior: auto; }
}
```

Motivo: el snap es, literalmente, movimiento automático de la ventana. Con reduced-motion se apaga y la página vuelve a ser un scroll normal de secciones de altura completa — sigue viéndose bien porque el layout no depende del snap. Además:

- `MotionReveal` y todo `framer-motion` en `initial={false}` / sin desplazamiento.
- La marquesina del cierre **no anima**; queda estática.
- `scrollIntoView` y `scrollBy` pasan a `behavior: 'auto'`.

Se implementa con `useMediaQuery('(prefers-reduced-motion: reduce)')` expuesto en un hook `useReducedMotion` para que JS y CSS decidan igual.

### 1.5 Móvil real

| Riesgo | Mitigación |
|---|---|
| `100vh` mayor que el viewport visible por la barra de direcciones | **`100dvh` obligatorio.** Cero `vh` en el proyecto. |
| Salto al colapsar/expandir la barra de direcciones con snap activo | `min-height: 100dvh` (no `height`) + `scroll-snap-stop: normal`; el reflow reajusta al borde más cercano en vez de pelear. |
| Pantallas bajas (móvil horizontal, 320×568, ventana recortada) | `@media (max-height: 640px) { html { scroll-snap-type: none; } .slide { min-height: auto; padding-block: 48px; } }` — se degrada a página normal. |
| Gesto horizontal del carrusel que dispara "atrás" del navegador o el snap vertical | `overscroll-behavior-x: contain` en la pista; `touch-action` se deja en `auto` (el navegador resuelve la dirección dominante mejor que nosotros). |
| Barra de progreso lateral tapando contenido | El riel se oculta bajo `md`; en `xs` queda la barra fina superior. |

### 1.6 Regla de "no cabe": `fit`

Cada diapositiva declara su estrategia. Es un prop del componente `Slide`, no una decisión caso por caso.

**`fit="contain"` (por defecto).** El contenido *tiene* que caber. Cómo se garantiza:
- tipografía fluida con `clamp()` (ya existe en tokens);
- el número de ítems visibles depende del breakpoint, no del dato (habilidades: 20 en `md+` en 4×5, 20 en `xs` en 2×10 compactas);
- `overflow: hidden` **no** se usa; si algo se sale es un bug, no un estilo.

**`fit="scroll"`.** El contenido es de longitud desconocida (lo decide el CMS). El slide se parte en dos:

```
[ cabecera fija: h2 + subtítulo + filtros ]   ← nunca scrollea
[ región scrolleable: overflow-y: auto ]      ← scrollea dentro
```

Requisitos no negociables de esa región:
- `tabindex="0"`, `role="group"`, `aria-label` — **una región scrolleable debe ser enfocable por teclado** (WCAG 2.1.1); si no, un usuario de teclado no puede llegar al contenido de abajo.
- `overscroll-behavior-y: contain` para que al llegar al final no arrastre la página a la diapositiva siguiente en el mismo gesto.
- Máscara de degradado arriba/abajo (`mask-image: linear-gradient(...)`) como señal visual de "hay más".
- `scroll-snap-type: none` dentro (no se anidan snaps en el mismo eje).

**Asignación:**

| Diapositiva | `fit` | Por qué |
|---|---|---|
| Hero | `contain` | Copy fijo en i18n. |
| Quién soy | `contain` | Copy fijo + un medio opcional. |
| Servicios + métricas | `contain` | El CMS trae 3–6 servicios; por encima de 6 se muestran 6 y el resto se ignora (regla explícita). |
| Habilidades | `contain` | 20 ítems, rejilla dependiente del breakpoint. |
| Proyectos | `contain` | El desborde es **horizontal**, no vertical: es el carrusel. |
| Trayectoria | `scroll` | `education` es un array del CMS de longitud libre. |
| Cierre (contacto+footer) | `contain` en `md+`, `scroll` en `xs` | Formulario + datos + footer no caben en 100dvh de un móvil. |

### 1.7 Deep links y `Navbar`

Sin cambios de mecánica: los `id` siguen viviendo en el componente `Slide` (heredero de `Section`), `scrollToSection` sigue usando `getElementById` + `scrollIntoView`, y con snap activo el aterrizaje es exacto en vez de aproximado. Mejora colateral: `useActiveSection` con `rootMargin: '-45% 0px -45% 0px'` deja una banda del 10% en el centro de la ventana; con diapositivas de exactamente `100dvh` **siempre hay una y solo una** sección en esa banda, así que el estado activo deja de titilar (hoy sí puede).

**Compatibilidad de anclas.** El id `statistics` desaparece (se fusiona en `services` y `skills`). Como hay enlaces y CV publicados apuntando ahí, se añade un mapa de alias en `src/utils/scroll.js`:

```js
const ANCHOR_ALIASES = { statistics: 'skills' };
```

`scrollToSection` resuelve el alias antes de buscar el elemento, y `Home` lo aplica al leer `location.hash` al montar. Ancla muerta = scroll a la nada, y eso es un bug catalogado por QA.

### 1.8 Riesgos de a11y asumidos, con nombre

| Riesgo | Severidad | Mitigación adoptada |
|---|---|---|
| `scroll-snap-type: mandatory` puede hacer inalcanzable contenido más alto que el viewport | alta | Regla `fit` (§1.6) + apagado bajo `max-height: 640px` + prohibición de `overflow: hidden`. |
| Scrollbar oculta = se pierde la señal de "hay más página" y el arrastre del pulgar | media | Riel de puntos (md+) y barra fina (xs) la sustituyen; el scroll con rueda/teclado/touch queda intacto. |
| Zoom de texto al 200% (WCAG 1.4.4) puede desbordar un slide `contain` | media | Tipografía en `rem` + `clamp`; QA prueba 200% en cada diapositiva; si desborda, ese slide pasa a `fit="scroll"`. |
| Usuario con reduced-motion pierde el efecto pedido | baja | Aceptado a propósito: la accesibilidad gana sobre el efecto. |
| Anidar scroll horizontal dentro de scroll vertical con snap confunde en móvil | media | `overscroll-behavior-x: contain`, snap horizontal `mandatory` con `scroll-snap-align: center` en `xs`, botones prev/next solo en punteros finos. |

---

## 2. Mapa de secciones definitivo

| # | Diapositiva | `id` | Alimentada por | Si falta el dato | `fit` | Cambio vs. hoy |
|---|---|---|---|---|---|---|
| 1 | Hero | *(sin id; `scrollToTop`)* | i18n `hero.*` + CMS `resume`, `CV` | Siempre existe (copy en i18n). Sin `CV.link` no se pinta el botón de CV. | `contain` | Ahora ocupa 100dvh, tipografía de display, indicador de "desliza". |
| 2 | Quién soy | `introduction` | i18n `about.*` + CMS `introduction.link` (video opcional) | Sin `introduction.link` la diapositiva vive igual: copy + tarjetas de datos. | `contain` | Hoy es casi solo un iframe. Pasa a ser copy real de identidad; el video se vuelve secundario. |
| 3 | Servicios + métricas | `services` | CMS `services` + `queryFour` (totales) + `queryTwo` (lenguajes, para las notas de dato) | Sin `services`: la diapositiva sobrevive con las métricas y el título alterno `services.dataOnlyTitle`. Sin métricas: sobreviven las tarjetas de servicio, sin nota de dato. | `contain` | **Fusión.** Desaparece la diapositiva `statistics` separada. |
| 4 | Habilidades | `skills` | `queryTwo` (lenguajes) + `queryOne` (editores) | `< 5` lenguajes útiles o error → estado "no disponible" + reintentar; el título y la diapositiva permanecen. | `contain` | **Nueva.** Reemplaza al radar de recharts. |
| 5 | Proyectos | `portfolio` | CMS `portfolio` | Sin `portfolio` (o array vacío) la diapositiva **no existe** y desaparece del riel y del índice. | `contain` | Rejilla → carrusel horizontal con filtros. |
| 6 | Trayectoria | `resume` | CMS `education` | Sin `education` la diapositiva no existe. | `scroll` | Timeline igual; se le añade cabecera fija y región scrolleable. |
| 7 | Cierre: contacto + footer | `contact` | CMS `email`, `cel`, `socialN`, `location` + EmailJS | Sin `email` no hay formulario, pero **la diapositiva sigue** con los datos directos y el footer. Sin nada de contacto, se cae al footer mínimo. | `contain` / `scroll` en `xs` | **Fusión** de `Touch` + `footer`. El footer deja de ser un bloque suelto tras el `main`. |

**Lo que desaparece:**
- El `id` `statistics` (alias → `skills`).
- `src/components/stackChart/StackChart.jsx` (radar recharts).
- `src/components/scrollBar/scrollBar.jsx` en `md+` (se mantiene su lógica reducida para `xs`, renombrada).
- `PROJECTS_PARTICIPATED = 45` en `MetricDashboard.jsx`.
- Los links inline de navegación del `AppBar` en desktop.

**Regla de construcción de la lista.** Igual que hoy, una sola lista en `Home.jsx` gobierna orden, `id`, riel e índice. Si el CMS no trae el campo, la sección no existe **en ningún lado**. El riel y el overlay consumen exactamente el mismo array; ningún componente vuelve a declarar `ALL_SECTION_IDS` a mano (hoy `Navbar.jsx` lo hace como fallback: se retira ese fallback, es una fuente de verdad duplicada).

---

## 3. Paleta indigo / violeta

Modo por defecto: **oscuro**. Cambio en `src/context/ThemeContext.jsx`: `resolveInitialMode()` devuelve `'dark'` cuando no hay preferencia guardada ni preferencia de sistema legible (hoy devuelve `'light'`).

Todo vive en `src/config/tokens.js`. `lightTheme.js` y `darkTheme.js` no cambian ni una línea (ya solo llaman a `createAppTheme`).

### 3.1 Rampas base

```js
const brand = {
  indigo: { 50:'#EEF2FF', 100:'#E0E7FF', 200:'#C7D2FE', 300:'#A5B4FC', 400:'#818CF8',
            500:'#6366F1', 600:'#4F46E5', 700:'#4338CA', 800:'#3730A3', 900:'#2A1F5C', 950:'#1B1740' },
  violet: { 50:'#F5F3FF', 100:'#EDE9FE', 200:'#DDD6FE', 300:'#C4B5FD', 400:'#A78BFA',
            500:'#8B5CF6', 600:'#7C3AED', 700:'#6D28D9', 800:'#5B21B6', 900:'#4C1D95' },
};

const neutral = {
  0:'#FFFFFF', 50:'#F7F7FB', 100:'#EEEEF5', 200:'#E1E1EC', 300:'#CBCBDC', 400:'#9C9CB5',
  500:'#7C7C96', 600:'#52526A', 700:'#35354A', 750:'#2A2A42', 800:'#22223A',
  850:'#1C1C34', 900:'#131327', 950:'#0B0B18',
};
```

Los neutros llevan un sesgo violeta deliberado (matiz ~245°) para que los grises no se vean sucios junto al indigo.

### 3.2 Tabla de tokens

Ratios calculados con la fórmula WCAG 2.x (verificados con script, no estimados). "vs" indica el fondo contra el que se midió.

| Token | Claro | Oscuro | Uso | Contraste claro | Contraste oscuro |
|---|---|---|---|---|---|
| `background.default` | `#F7F7FB` | `#0B0B18` | Fondo de la página y de los slides pares | — | — |
| `background.paper` | `#FFFFFF` | `#131327` | Tarjetas, AppBar, overlay del índice | — | — |
| `surface.subtle` | `#EEEEF5` | `#131327` | Bandas alternas, fondo de riel | — | — |
| `surface.raised` | `#FFFFFF` | `#1C1C34` | Inputs, chips inactivos, tarjeta sobre tarjeta | — | — |
| `text.primary` | `#22223A` | `#EEEEF5` | Titulares y cuerpo | **14.47** vs default / **15.46** vs paper (AAA) | **16.91** vs default / **15.81** vs paper (AAA) |
| `text.secondary` | `#52526A` | `#9C9CB5` | Subtítulos, descripciones | **7.08** / **7.57** (AAA) | **7.29** / **6.81** (AA) |
| `text.disabled` | `#7C7C96` | `#6B6B8E` | Texto inactivo | 4.05 vs paper | 3.58 vs paper |
| `primary.main` | `#4F46E5` | `#A5B4FC` | Acento: activos, links, barras, foco | **6.29** vs paper / **5.88** vs default (AA) | **9.80** vs default / **9.16** vs paper (AAA) |
| `primary.light` | `#6366F1` | `#C7D2FE` | Hover de acento, glow | — | — |
| `primary.dark` | `#4338CA` | `#6366F1` | Pressed, texto de acento sobre `surface.subtle` | **7.90** vs paper (AAA) | — |
| `primary.contrastText` | `#FFFFFF` | `#0B0B18` | Texto sobre botón contenido | **6.29** sobre `primary.main` | **9.80** sobre `primary.main` |
| `secondary.main` | `#6D28D9` | `#C4B5FD` | Acento secundario: violeta de énfasis, cifras grandes | **7.10** vs paper (AAA) | **10.58** vs default (AAA) |
| `secondary.contrastText` | `#FFFFFF` | `#0B0B18` | — | **7.10** | **10.58** |
| `divider` | `#E1E1EC` | `#2A2A42` | Bordes de tarjeta, reglas de sección — **decorativo** | 1.30 (exento, §3.4) | 1.40 (exento, §3.4) |
| `surface.outlineStrong` | `#7C7C96` | `#6B6B8E` | Borde de input, punto inactivo del riel, borde de chip — **funcional** | **4.05** vs paper / **3.79** vs default (≥3:1) | **3.83** vs default / **3.58** vs paper (≥3:1) |
| `surface.marquee` | `#6B6B84` | `#7A7A99` | Texto gigante decorativo de la marquesina | **4.84** vs default (AA) | **4.72** vs default (AA) |
| `surface.scrim` | `rgba(34,34,58,.55)` | `rgba(0,0,0,.65)` | Fondo del overlay de índice y del `Dialog` | — | — |
| `surface.skeletonBase` | `#E1E1EC` | `#1C1C34` | Base del skeleton | — | — |
| `surface.skeletonHighlight` | `#F7F7FB` | `#2A2A42` | Brillo del skeleton | — | — |
| `success.main` | `#15803D` | `#4ADE80` | Envío correcto | **5.02** vs paper (AA) | **10.48** vs paper (AAA) |
| `error.main` | `#BE123C` | `#FB7185` | Error de formulario / de sección | **6.29** vs paper (AA) | **6.78** vs paper (AA) |
| `warning.main` | `#B45309` | `#FBBF24` | Métricas no disponibles | **5.02** vs paper (AA) | **10.94** vs paper (AAA) |
| `info.main` | `#0E7490` | `#67E8F9` | Notas informativas | **5.36** vs paper (AA) | **12.60** vs paper (AAA) |

### 3.3 Gradientes

| Token | Claro | Oscuro |
|---|---|---|
| `surface.heroGradient` | `linear-gradient(160deg, #FFFFFF 0%, #EEF2FF 45%, #EDE9FE 100%)` | `linear-gradient(160deg, #0B0B18 0%, #131327 45%, #2A1F5C 100%)` |
| `surface.accentGradient` | `linear-gradient(90deg, #4F46E5 0%, #6D28D9 100%)` | `linear-gradient(90deg, #A5B4FC 0%, #C4B5FD 100%)` |
| `surface.glow` | `radial-gradient(60% 60% at 15% 8%, rgba(99,102,241,.18), transparent 70%)` | `radial-gradient(60% 60% at 15% 8%, rgba(124,58,237,.28), transparent 70%)` |

**Texto sobre el extremo más exigente de cada gradiente (verificado):**

| Par | Ratio | Veredicto |
|---|---|---|
| `text.primary` oscuro sobre `#2A1F5C` (fin del hero oscuro) | **12.55** | AAA |
| `text.secondary` oscuro sobre `#2A1F5C` | **5.41** | AA |
| `primary.main` oscuro sobre `#2A1F5C` | **7.27** | AAA |
| `text.primary` claro sobre `#EDE9FE` (fin del hero claro) | **13.03** | AAA |
| `text.secondary` claro sobre `#EDE9FE` | **6.38** | AA |
| `text.secondary` claro sobre `#E0E7FF` (medio) | **6.14** | AA |

Es decir: se puede poner cualquier texto de la paleta sobre el gradiente del hero en cualquier punto y sigue cumpliendo AA. `accentGradient` **solo** admite `primary.contrastText` encima, y solo en píldoras de acento (barra de progreso, icono de servicio), nunca párrafos.

### 3.4 Nota sobre los `FAIL` aparentes

`divider` y `skeleton*` no alcanzan 3:1 y eso es **correcto**: WCAG 1.4.11 aplica a "componentes de interfaz de usuario" y a gráficos portadores de información. Un borde decorativo de tarjeta cuyo contenido ya está delimitado por fondo y espaciado, y un skeleton que solo indica "cargando" (con `aria-busy` y texto alternativo detrás), están exentos. Por eso existe **`outlineStrong`**: todo borde que sea *la única* señal de que algo es interactivo (input, chip filtro, punto del riel) usa `outlineStrong`, no `divider`. QA debe rechazar cualquier input con borde `divider`.

`text.disabled` a 3.58–4.05 tampoco es una falla: WCAG 1.4.3 exime explícitamente el texto de componentes inactivos.

### 3.5 Consecuencias fuera de `tokens.js`

- `src/config/cssVars.js` expone los nuevos tokens como variables CSS. Se le añaden `--slide-height`, `--rail-width`, `--header-height` para que el CSS colocado no repita números.
- `index.html` tiene `meta[name=theme-color]` con los hex Nord viejos (`#F7F9FB`, `#242933`) y `color-scheme: light dark`. **Es trabajo de DevOps (rol 6):** pasar a `#F7F7FB` / `#0B0B18` y a `color-scheme: dark light` (oscuro primero). No lo toca Front.

---

## 4. Tipografía y espaciado

Fuente: **Inter** ya cargada en `index.html` con pesos 400–800. No se añaden fuentes.

### 4.1 Escala tipográfica (reemplaza `typeScale` en `tokens.js`)

| Variante | `font-size` | Peso | `line-height` | `letter-spacing` | Uso |
|---|---|---|---|---|---|
| `display` *(nueva)* | `clamp(3rem, 1.5rem + 7.4vw, 7.5rem)` | 800 | 0.92 | `-0.04em` | Marquesina y titular del cierre. |
| `h1` | `clamp(2.5rem, 1.45rem + 4.8vw, 5rem)` | 800 | 1.02 | `-0.03em` | Solo el hero. |
| `h2` | `clamp(1.875rem, 1.3rem + 2.5vw, 3.25rem)` | 700 | 1.10 | `-0.02em` | Título de cada diapositiva. |
| `h3` | `clamp(1.375rem, 1.15rem + 1.1vw, 2rem)` | 700 | 1.20 | `-0.012em` | Título de tarjeta / proyecto. |
| `h4` | `clamp(1.125rem, 1.02rem + 0.5vw, 1.5rem)` | 600 | 1.30 | `-0.005em` | Institución en la trayectoria. |
| `h5` | `clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)` | 600 | 1.35 | `0` | Subtítulos internos. |
| `h6` | `clamp(1rem, .96rem + .2vw, 1.125rem)` | 600 | 1.40 | `0` | Marca del navbar. |
| `stat` *(nueva)* | `clamp(2rem, 1.2rem + 3.4vw, 3.5rem)` | 800 | 1.00 | `-0.02em` | Cifras del tracker. **`font-variant-numeric: tabular-nums`.** |
| `subtitle1` | `clamp(1rem, .94rem + .4vw, 1.25rem)` | 400 | 1.55 | `0` | Subtítulo de diapositiva. |
| `subtitle2` | `0.9375rem` | 600 | 1.55 | `0` | Etiquetas. |
| `body1` | `clamp(.9375rem, .91rem + .15vw, 1.0625rem)` | 400 | 1.65 | `0` | Párrafos. |
| `body2` | `0.9375rem` | 400 | 1.60 | `0` | Texto secundario en tarjetas. |
| `button` | `0.9375rem` | 600 | 1.50 | `.01em` | `textTransform: none`. |
| `caption` | `0.8125rem` | 500 | 1.50 | `.02em` | Notas de dato, porcentajes. |
| `overline` | `0.75rem` | 700 | 1.60 | `.14em` | Numeración de diapositiva, eyebrows. Mayúsculas. |

Máximo de línea legible: `62ch` para `body1`, `46ch` para `subtitle1` bajo un `h1`. Ya existe como `layout.readableMaxWidth`; se añade `layout.leadMaxWidth: '46ch'`.

### 4.2 Espaciado

Unidad base **8px** (sin cambios). Se reemplaza el bloque `layout` de `tokens.js`:

```js
const layout = {
  headerHeight: 56,                        // 64 → 56: gana altura útil el slide
  slideMinHeight: '100dvh',
  slidePaddingTop: { xs: 9, md: 10 },      // 72 / 80 px, ya incluye el header
  slidePaddingBottom: { xs: 6, md: 7 },
  slidePaddingX: { xs: 2.5, md: 4 },
  slideMaxWidth: 'lg',
  slideHeaderGap: { xs: 3, md: 4 },        // h2/subtítulo → contenido
  contentGap: { xs: 2.5, md: 4 },
  railWidth: 28,
  railOffset: { md: 20, lg: 32 },
  railDot: { idle: 6, active: 22 },        // punto → píldora al activarse
  carouselCard: { xs: 'min(78vw, 320px)', md: '360px' },
  carouselGap: { xs: 2, md: 3 },
  snapDisableMaxHeight: 640,
  readableMaxWidth: '62ch',
  leadMaxWidth: '46ch',
  touchTarget: 44,
};
```

**Ritmo vertical de una diapositiva `contain`:** `slidePaddingTop` → `overline` (número + nombre) → `h2` → `subtitle1` → `slideHeaderGap` → contenido → `slidePaddingBottom`. Se centra con `justify-content: center`, así una diapositiva de poco contenido no queda pegada arriba.

---

## 5. Carrusel de proyectos (`id="portfolio"`)

Archivos: `src/features/portfolio/project.jsx` (shell + filtros), `src/features/portfolio/ProjectCarousel.jsx` (nuevo, la pista), `src/features/portfolio/ProjectCard.jsx` (nuevo, extraído), `src/hooks/useCarousel.js` (nuevo).

### 5.1 Estructura

```
h2 "Proyectos" + subtítulo                         ← fijo
[ Todos (12) ][ FrontEnd (5) ][ BackEnd (4) ]…      ← filtros, fijos
<div class=track role=group tabindex=0>            ← scroll-snap-type: x mandatory
  [ card ][ card ][ card ][ card ] …
</div>
[ ‹ ]   ● ● ● ○ ○   [ › ]   "3 de 12"              ← controles + indicadores
```

### 5.2 Pista

```css
.track {
  display: flex;
  gap: var(--carousel-gap);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  scroll-padding-inline-start: var(--slide-padding-x);
  scrollbar-width: none;
}
.track::-webkit-scrollbar { display: none; }
.card {
  flex: 0 0 var(--carousel-card);
  scroll-snap-align: start;    /* center en xs */
}
```

- `xs`: `scroll-snap-align: center`, ancho `min(78vw, 320px)` → se ve el borde de la siguiente tarjeta, que es la señal de "hay más".
- `md+`: `scroll-snap-align: start`, ancho fijo `360px`.
- La pista sangra hasta el borde de la ventana (`mx: -slidePaddingX`, con `scroll-padding-inline-start` compensando) para que las tarjetas "salgan" del contenedor: es el gesto de las referencias.

### 5.3 Filtros

- Tipos: `all`, `FrontEnd`, `BackEnd`, `Automation`, `Devops`. Las labels salen de `portfolio.categories.*` (ya existen).
- Se **conserva la regla actual** de `project.jsx`: solo se ofrece un filtro si tiene `count > 0`. Por eso "filtro sin resultados" es un estado imposible por construcción; aun así, si por un cambio futuro se llegara a él, la pista renderiza `portfolio.empty_filter` ("Nada por aquí todavía. Prueba con *Todos*.") y un botón que vuelve a `all`. Se especifica para que no quede en blanco.
- Los chips pasan a `Chip component="button" type="button"` (hoy es un `div` con `aria-pressed`, que no anuncia estado). `aria-pressed` se conserva.
- Al cambiar el filtro: `track.scrollTo({ left: 0, behavior: reducedMotion ? 'auto' : 'smooth' })` y se anuncia el resultado en una región `aria-live="polite"`: `portfolio.results` → "12 proyectos".
- **Sin animación de reordenamiento** (`AnimatePresence` con layout) en la primera versión: es la clase de efecto que se ve mal si el usuario filtra rápido. Un `MotionReveal` con `key={activeCategory}` en la pista basta.

### 5.4 Botones prev/next

- `IconButton` con `ChevronLeftRounded` / `ChevronRightRounded`, `aria-label` de i18n.
- Solo se muestran en punteros finos: `@media (hover: hover) and (pointer: fine)`. En táctil el gesto es el control.
- Acción: `track.scrollBy({ left: ±(cardWidth + gap), behavior })`.
- `disabled` cuando `scrollLeft <= 0` o `scrollLeft >= scrollWidth - clientWidth - 1`. Un botón que no hace nada es un bug.
- Se ocultan del todo si `scrollWidth <= clientWidth` (caben todas).

### 5.5 Arrastre

- **Solo con ratón.** `onPointerDown` con `event.pointerType === 'mouse'`; en `touch`/`pen` se deja el scroll nativo, que es mejor que cualquier emulación.
- Umbral de 6px antes de considerar arrastre, para no comerse el click de "Detalles".
- `setPointerCapture` en el `pointerdown` y `releasePointerCapture` al final; `cursor: grab` → `grabbing`.
- Al soltar: no se implementa inercia. Se deja que el snap resuelva el aterrizaje. Menos código y el resultado se siente igual.

### 5.6 Teclado y a11y

| Elemento | Comportamiento |
|---|---|
| Pista | `tabindex="0"`, `role="group"`, `aria-label={t('portfolio.carousel_label')}`, `aria-roledescription="carrusel"`. `←`/`→` = una tarjeta; `Home`/`End` = extremos. Las flechas hacen `preventDefault` **solo** cuando el foco está en la pista, para no robar el scroll vertical del resto de la página. |
| Tarjeta | No es focusable. Sus botones/links sí, en orden DOM. Al llegar por `Tab` a un botón de una tarjeta fuera de vista, el navegador la trae solo (comportamiento nativo del contenedor scrolleable). |
| Indicadores | `<button>` por tarjeta cuando hay ≤ 8; con más, se sustituyen por el contador de texto `portfolio.position` ("3 de 12"). 12 puntos diminutos no son un control usable. |
| Estado | El índice activo sale de un `IntersectionObserver` con `root = track` y `threshold: 0.6`; nunca de `scrollLeft / cardWidth`, que se desincroniza con `gap` y `scroll-padding`. |
| Diálogo de detalle | Se conserva el `Dialog` actual (`fullScreen` en `xs`) sin cambios de comportamiento. Mientras esté abierto, `useSlideNavigation` ignora los atajos de teclado. |

---

## 6. Sección de habilidades (`id="skills"`)

Archivos nuevos: `src/features/skills/Skills.jsx`, `src/features/skills/SkillRow.jsx`, `src/features/metric/utils/languages.js`.

### 6.1 Payload real de WakaTime (verificado el 2026-08-19)

`GET https://wakatime.com/share/@hilbrakaku/eea4d614-7178-46fa-8828-54ef59996ac1.json` → **HTTP 200**, 3.4 KB.

```json
{ "data": [ { "name": "C#", "percent": 25.52, "color": "#178600" }, … ] }
```

- **59 entradas.** 42 con `percent > 0`.
- Campos: exactamente **`name`, `percent`, `color`**. **No hay `total_seconds`, ni `text`, ni `digital`, ni `hours`/`minutes`.** Cualquier spec que asuma `total_seconds` es inválida — `StackChart` hoy solo usa `name` y `percent`, y hace bien.
- `percent` es porcentaje del tiempo total, rango `all_time` (lo confirma el payload de totales: `range: "all_time"`, desde `2021-04-20`).
- La lista **incluye ruido** que no es una habilidad: `Other`, `Binary`, `Text`, `Text Template`, `JSON`, `CSV`, `INI`, `Properties`, `Java Properties`, `TSConfig`, `Git`, `Git Config`, `Diff`, `Rich Text Format`, `Image (svg)`, `Image (png)`.
- Y **duplica por variante**: `SQL`/`TSQL`, `CSS`/`SCSS`/`Sass`/`LESS`/`Less`, `Assembly`/`ca65 assembler`, `GDScript`/`GDScript3`.

`transformResponse` de `queryTwo` ya devuelve `response.data`, así que el componente recibe el array plano. Correcto tal cual.

### 6.2 Normalización (`src/features/metric/utils/languages.js`)

```js
export const LANGUAGE_DENYLIST = new Set([
  'Other','Binary','Text','Text Template','JSON','CSV','INI','Properties',
  'Java Properties','TSConfig','Git','Git Config','Diff','Rich Text Format',
  'Image (svg)','Image (png)',
]);

export const LANGUAGE_ALIASES = {
  TSQL: 'SQL',
  SCSS: 'CSS', Sass: 'CSS', LESS: 'CSS', Less: 'CSS',
  'ca65 assembler': 'Assembly',
  GDScript3: 'GDScript',
  CSHTML: 'ASP.NET',
  JSX: 'React (JSX)',
};
```

`normalizeLanguages(payload)`: descarta lo que no tenga `name`, lo que esté en la denylist y lo que tenga `percent <= 0`; aplica alias **sumando** porcentajes; ordena descendente por `percent` y luego alfabético; conserva el primer `color` visto.

`topSkills(list, n = 20)` corta. `groupPercent(list, names)` suma un grupo (lo usa la §7).

**Salida real con el payload de hoy — 27 candidatos, top 20:**

| # | Habilidad | % real | Ancho de barra (log) |
|---|---|---|---|
| 1 | C# | 25.52 | 100% |
| 2 | JavaScript | 17.96 | 93% |
| 3 | TypeScript | 10.64 | 83% |
| 4 | React (JSX) | 7.14 | 76% |
| 5 | SQL | 6.88 | 75% |
| 6 | Java | 3.44 | 62% |
| 7 | CSS | 3.19 | 60% |
| 8 | HTML | 3.06 | 59% |
| 9 | Python | 2.34 | 54% |
| 10 | ASP.NET | 0.86 | 35% |
| 11 | Docker | 0.69 | 31% |
| 12 | Assembly | 0.54 | 26% |
| 13 | Bash | 0.47 | 23% |
| 14 | XML | 0.36 | 18% |
| 15 | Gherkin | 0.34 | 17% |
| 16 | PowerShell | 0.32 | 16% |
| 17 | YAML | 0.31 | 15% |
| 18 | Markdown | 0.18 | 6% |
| 19 | SWIG | 0.17 | 6% |
| 20 | Groovy | 0.14 | 6% |

Sobran 7 (`Prolog`, `GDScript`, `Objective-C`, `Arduino`, `Batchfile`, `Ezhil`, `Go`), así que el margen para llegar a 20 es real y no hay que rellenar.

### 6.3 El indicador

**Una barra horizontal de 4px con ancho en escala logarítmica, más el porcentaje exacto como texto.** No hay gráfico.

```
C#                      ████████████████████  25.52%
JavaScript              ██████████████████▌   17.96%
…
Groovy                  ▌                      0.14%
```

Ancho = `max(6, round(((log10(p) - log10(pMin)) / (log10(pMax) - log10(pMin))) * 100))`, con `pMin`/`pMax` calculados **sobre los 20 mostrados**.

**Por qué logarítmica.** Los datos abarcan tres órdenes de magnitud (25.52% → 0.14%). Con escala lineal, 11 de las 20 barras quedarían en el suelo del 6% y serían indistinguibles: el gráfico dejaría de informar. La escala logarítmica preserva el orden y hace legible la comparación entre vecinos.

**Por qué es honesto.** El porcentaje exacto está impreso al lado de cada barra, con `tabular-nums`, y el subtítulo declara la unidad. La barra es comparativa, no cuantitativa; por eso lleva `aria-hidden="true"` y el nombre accesible del ítem incluye el número real: `"C#, 25,52 % del tiempo registrado"`.

**Si el usuario prefiere lineal**, es cambiar una función en `languages.js`; el resto no se toca. Queda como pregunta abierta (§13).

### 6.4 Layout

| Breakpoint | Rejilla | Alto de fila | Cabe en 100dvh |
|---|---|---|---|
| `xs` (<600) | 2 columnas × 10 filas, fila compacta (nombre 12px + barra + %) | ~34px | 340 + cabecera ≈ 480px ✔ |
| `sm` | 2 × 10, fila normal | ~44px | 440 + cabecera ✔ |
| `md`–`lg` | 4 columnas × 5 filas | ~52px | 260 + cabecera ✔ |

`fit="contain"`: no hay scroll interno en ningún breakpoint. Se usa `Box` con `display: grid` y `gridTemplateColumns` responsive; **no** `Grid` de MUI (20 ítems en `Grid` genera 20 wrappers para nada).

Semántica: `<ul>` / `<li>` con `Stack component="ul"`. Cada ítem: `<span>` nombre + `<div aria-hidden>` barra + `<span>` porcentaje. El `<li>` lleva un `aria-label` completo con nombre y porcentaje formateado por locale (`Intl.NumberFormat`, coma decimal en `es-CO`).

Color de la barra: **`primary.main` del tema**, no el `color` que trae WakaTime. Los hex de la API (verde `#178600` para C#, amarillo `#f1e05a` para JS) rompen la paleta y muchos no pasan contraste sobre el fondo oscuro. El `color` de la API se guarda pero solo se usa, si se quiere, como un punto de 6px junto al nombre — decorativo y `aria-hidden`. Contraste verificado de la barra: **7.76** sobre pista `#22223A` (oscuro), **4.85** sobre pista `#E1E1EC` (claro).

### 6.5 Tira de editores

Debajo de la rejilla, una fila de chips con `queryOne`: **VS Code 49.9%, Visual Studio 40.9%, SSMS 4.9%, IntelliJ IDEA 4.0%** (payload verificado, mismos campos `name`/`percent`/`color`). Se muestran los que tengan `percent >= 1`. Título: `skills.toolsTitle`. Si `queryOne` falla, la tira simplemente no se pinta; no bloquea la rejilla.

### 6.6 Degradados de fallo

| Situación | Comportamiento |
|---|---|
| `queryTwo` cargando | Skeleton `variant="skills"`: 20 filas fantasma con la misma rejilla. |
| `queryTwo` error, o `< 5` habilidades tras normalizar | La diapositiva **permanece** con su `h2`; en el cuerpo, `Alert severity="warning"` con `skills.unavailable` + botón `app.retry` que llama `refetch()`. |
| Entre 5 y 19 habilidades | Se pintan las que haya. La rejilla es `auto-fill`; no quedan huecos raros. |
| `queryOne` error | Sin tira de editores. Silencioso. |

### 6.7 Título

- **es-CO:** "Estas son mis habilidades, medidas con un tracker"
- **en-US:** "These are my skills, measured with a tracker"

Subtítulo con datos reales interpolados desde `queryFour`: "Todo mi tiempo de código registrado desde abril de 2021: **2.284 horas** en **945 días** activos." Las cifras vienen de la API, no del JSON de traducción.

---

## 7. Servicios + métricas fusionados (`id="services"`)

### 7.1 El problema del collage y su solución

Pegar "Mis servicios" arriba y "Mis números" abajo es un collage. La fusión funciona cuando **el número justifica el servicio**. Por eso cada tarjeta de servicio del CMS lleva una **nota de dato** derivada del tracker.

Mapa declarado en `src/features/service/serviceMetrics.js` (nuevo), por grupo de lenguajes, no por servicio individual (el CMS no tiene un campo de tipo en `services`; se resuelve por `item.icon`, que ya usa `serviceIcons.js`):

| Grupo | Lenguajes sumados | % con el payload de hoy | Nota mostrada |
|---|---|---|---|
| Frontend | JavaScript + TypeScript + React (JSX) + HTML + CSS | **41.99%** | "42 % de mi tiempo medido" |
| Backend | C# + Java + Python + SQL + ASP.NET | **39.04%** | "39 % de mi tiempo medido" |
| Automatización | Gherkin + Bash + PowerShell + Groovy | **1.27%** | "1,3 % · pruebas y scripting" |
| DevOps | Docker + YAML + XML | **1.36%** | "1,4 % · infraestructura como código" |

La nota se pinta como `caption` en el pie de la tarjeta, con un icono pequeño y el texto `service.dataNote` interpolado. Si `queryTwo` falla, la nota no se pinta y la tarjeta sigue siendo válida. **Ningún porcentaje se escribe a mano en i18n**; todos se calculan con `groupPercent`.

> Nota honesta que hay que aceptar: los grupos de automatización y devops dan cifras bajas (~1%) porque un `Dockerfile` se escribe una vez y se ejecuta mil. Si esos números se ven mal, la alternativa es mostrar en esos dos casos los nombres de las tecnologías en lugar del porcentaje (`"Gherkin · Bash · PowerShell"`). Se implementa como `mode: 'percent' | 'stack'` por grupo en el mismo archivo de config. Decisión por defecto: `percent` para frontend/backend, `stack` para automatización/devops.

### 7.2 Layout

`md+`: dos columnas, `7fr / 5fr`.

```
┌─ h2 "Lo que hago, respaldado por datos" ─────────────────────┐
│  columna A (7fr)              │  columna B (5fr)             │
│  [servicio] [servicio]        │  2.284   horas de código     │
│  [servicio] [servicio]        │      5   años midiendo       │
│  (máx 6, del CMS)             │    945   días con código     │
│                               │  ── mejor día: 16 h 37 min   │
│                               │  ── promedio: 2 h 25 min/día │
└──────────────────────────────────────────────────────────────┘
     fuente: WakaTime · @hilbrakaku ↗
```

`xs`: una columna, primero las 3 cifras en fila horizontal compacta (scroll horizontal si hace falta, mismo patrón de pista), luego los servicios.

- Las tarjetas de servicio pierden el gradiente de fondo del icono y quedan planas con borde `divider`, icono en `primary.main`. Menos ruido, más aire (referencia bepatrickdavid).
- Las cifras usan la variante `stat` con `react-countup` (ya instalado) y `tabular-nums`. `CountUp` solo cuando la diapositiva entra en viewport y `prefers-reduced-motion` no está activo; si lo está, se pinta el número final directo.
- La línea de fuente es un link real a `https://wakatime.com/@hilbrakaku`. Es lo que hace creíble todo el relato.

### 7.3 Las cifras, con su origen exacto

Todas de `queryFour` (`.../96dd4b3d-….json`, HTTP 200 verificado):

| Cifra | Ruta en el payload | Valor hoy | Nota |
|---|---|---|---|
| Horas de código | `grand_total.human_readable_total_including_other_language` → `formatDate.getHours()` | 2284 | El string es `"2,284 hrs 9 mins"`; el parser actual lo resuelve bien. |
| Años midiendo | `range.days_including_holidays` | 1947 → 5 | **Deuda a corregir:** `convertDaysToYearsByDate` calcula sumando días a *hoy* y restando años calendario; da 5 por casualidad. Debe ser `Math.floor(days / 365.25)`. Front/Fullstack lo cambia en `src/utils/formatDate.js`. |
| Días con código | `range.days_minus_holidays` | **945** | **Sustituye al `45` hardcodeado.** |
| Mejor día | `best_day.text` + `best_day.date` | "16 hrs 37 mins" · 2021-08-30 | Nuevo; texto ya formateado por la API, no hay que parsearlo. |
| Promedio diario | `grand_total.human_readable_daily_average_including_other_language` | "2 hrs 25 mins" | Nuevo. |
| Inicio del registro | `range.start` | 2021-04-20 | Alimenta el subtítulo de habilidades. |

### 7.4 El `45`

Se **borra** `const PROJECTS_PARTICIPATED = 45` de `src/containers/MetricDashboard.jsx`. Su tarjeta la ocupa "días con código" (945), que sí tiene fuente.

Si Hilder quiere de todas formas una cuenta de proyectos, hay exactamente dos caminos legítimos y ninguno es un literal en el código:
1. **Derivado:** `data.portfolio.length` desde `Home` — honesto pero pequeño (los proyectos publicados, no los vividos).
2. **Campo nuevo en el CMS:** `projects_count` en la colección `"0001"`, que él actualiza cuando quiera. Implica documento + prop en `Home` + UI + i18n. Es trabajo del rol Back.

Decisión por defecto de esta spec: opción "días con código". Las otras dos quedan como pregunta abierta.

### 7.5 `queryOne` y `queryThree`

| Endpoint | Contenido real (verificado) | Decisión |
|---|---|---|
| `queryOne` — `f6ec4610-….json` | **Editores.** 12 entradas `{name, percent, color}`: VS Code 49.88, Visual Studio 40.94, Ssms 4.88, IntelliJ IDEA 3.95, Excel 0.19, Notepad++ 0.10, VS for Mac 0.04, Agent 0.02, Cursor 0.01, … | **Se usa.** Tira de herramientas en la diapositiva de habilidades (§6.5). Renombrar a `getEditors`. |
| `queryThree` — `b4730f03-….json` | **Sistemas operativos.** 2 entradas: Windows 81.55, Mac 18.45. | **Se usa mínimamente:** una línea de `caption` en el cierre/servicios ("81 % Windows · 18 % macOS"). Dos datos no justifican un gráfico. Renombrar a `getOperatingSystems`. Si molesta, se borra el endpoint completo en vez de dejarlo muerto. |

Dos arreglos de contrato para el rol Back, en `src/features/metric/services/statistics.js`:
1. **Renombrar** `queryOne…queryFour` a `getEditors`, `getLanguages`, `getOperatingSystems`, `getTotals`. `queryTwo` para "lenguajes" es un nombre que obliga a leer el archivo cada vez.
2. Los UUID de `queryOne` y `queryThree` están **hardcodeados** mientras los otros dos vienen de env. Mover a `VITE_URL_STATS_EDITORS` y `VITE_URL_STATS_OS` en `config.js` y en los `.env.*`. Son URLs de "share" que Hilder puede regenerar; si caducan, un literal en el código es un bug de despliegue.
3. `queryTwo` hace `transformResponse: (r) => r.data` mientras `queryOne` hace `(r) => r` (devuelve `{data:{data:[…]}}`). Inconsistencia real: al activar `queryOne` hay que igualarlo a `response.data`.

---

## 8. Navbar, cierre, footer y estados de carga

### 8.1 Navbar

`src/components/Navbar/Navbar.jsx` — reescritura.

```
[ Hilder Arrieta ]                          [ ES/EN ] [ ☾ ] [ Índice ]
```

- `AppBar position="fixed"`, altura 56, fondo `background.paper` con `backdrop-filter: blur(12px)` y `background-color` a 82% de opacidad, borde inferior `divider`. Sin sombra.
- **Se retiran los links inline de desktop.** Su función la cubren el riel de puntos (ambiente) y el overlay de índice (explícito). Hoy hay tres navegaciones para seis destinos.
- **Se retira el `Drawer` lateral** y con él el estado `mobileOpen` de tipo drawer. Un solo overlay para todos los breakpoints = un solo camino de código que probar.
- La marca es un `<a href="#">` que hace `scrollToTop`, con `aria-label={t('nav.back_to_top')}` (ya existe).
- **Se retira el fallback `ALL_SECTION_IDS`.** `sections` llega siempre desde `Home`; si llega vacío, no se pinta navegación. Un fallback que inventa secciones inexistentes produce scroll a la nada.

**Overlay de índice** (`src/components/SlideIndex.jsx`, nuevo):

- `Dialog fullScreen` de MUI (trae focus trap, `Esc`, `aria-modal` y restauración de foco gratis; no reimplementar con `Box`).
- Fondo `surface.scrim` + `backdrop-filter: blur(16px)`.
- Lista de secciones como filas gigantes, estilo índice de las referencias:
  `01 — Quién soy`, `02 — Lo que hago`, … con `h3`/`display` reducido, `border-bottom: 1px solid divider`, hover que desplaza el texto 8px a la derecha y colorea con `primary.main`.
- La sección activa lleva `aria-current="true"` y un punto de acento.
- Pie del overlay: email, teléfono y redes en una fila (el índice también sirve para contactar sin recorrer la página).
- Al elegir: cierra y `scrollToSection(id)`.
- `framer-motion` con stagger de 40ms por fila; desactivado con reduced-motion.

### 8.2 Riel de progreso lateral → §9

### 8.3 Cierre: contacto + footer (`id="contact"`)

Una sola diapositiva. `src/features/touch/Touch.jsx` se convierte en `src/features/closing/Closing.jsx`, que compone `ContactForm.jsx` y `ClosingFooter.jsx` en la misma carpeta. `src/features/footer/footer.jsx` se retira.

```
┌────────────────────────────────────────────────────────────┐
│  HABLEMOS                        ← display, 2 líneas       │
│  de lo que quieres construir.                              │
│                                                            │
│  columna A (5fr)              │  columna B (7fr)           │
│  correo@…            ↗        │  [ Nombre            ]     │
│  +57 …               ↗        │  [ Correo            ]     │
│  Ciudad, País                 │  [ Mensaje           ]     │
│  LinkedIn · GitHub · X ↗      │  [ Enviar → ]              │
│                               │  (aria-live: ok / error)   │
├────────────────────────────────────────────────────────────┤
│  DISPONIBLE PARA PROYECTOS · DISPONIBLE PARA PROYECTOS · … │  ← marquesina
├────────────────────────────────────────────────────────────┤
│  © 2026 Hilder Arrieta    React · Vite · MUI    Volver ↑   │  ← <footer>
└────────────────────────────────────────────────────────────┘
```

**Contacto:**
- Datos directos como links grandes (`h3`), no como texto pequeño: `mailto:`, `tel:`, y redes con `target="_blank" rel="noopener noreferrer"`. Los datos vienen del CMS (`email`, `cel`, `socialN`, `location`). El correo se muestra completo: ya es público en el CMS, ofuscarlo en el cliente es teatro.
- Formulario: se conserva íntegra la lógica actual de `Touch.jsx`, incluida la decisión (bien comentada) de **no** poner `disabled` en los inputs al enviar, y la guarda `isConfigured`. Solo cambia el layout y se añade `aria-describedby` en cada campo para el error.
- Estados: `idle | loading | ok | error`, en `aria-live="polite"`. Se añade guarda anti doble submit (ya existe vía `status === 'loading'`).
- Se añade `honeypot`: un input oculto `_gotcha` con `aria-hidden` y `tabindex="-1"`; si viene con valor, no se envía. Cero dependencias, filtra bots básicos.
- `socialN` hoy solo mapea `Facebook`, `Linkedin`, `GitHub` en el footer. Los links reales del dueño incluyen **X** (`x.com/hilbrakaku`). Se añade la entrada `X`/`Twitter` al mapa (icono: `@mui/icons-material` no trae logo de X; se usa `AlternateEmailRounded` o el `Twitter` existente — decisión de Front, no se añaden SVG a mano).

**Marquesina:**
- `<div aria-hidden="true">` con el texto duplicado dos veces y una animación CSS `transform: translateX(-50%)` en loop de 22s, `will-change: transform`. El texto real y accesible es el `h2` de la diapositiva; la marquesina es refuerzo visual.
- Color `surface.marquee` (AA verificado: 4.72 oscuro / 4.84 claro), variante `display`, `text-transform: uppercase`.
- **Detenida** con `prefers-reduced-motion`. También se detiene con `:hover` (cortesía, no requisito).

**Footer (`<footer>` dentro de la misma sección):**
- Tres bloques: copyright + año dinámico; stack técnico como texto (`footer.built_with`); "volver arriba" con flecha.
- El link al repositorio (`github.com/hilbrakaku`) va aquí, no solo entre las redes: es prueba social para un perfil técnico.
- Borde superior `divider`, `caption`, altura ~56px.

### 8.4 Estados de carga

`src/components/skeletons/SectionSkeleton.jsx` (nuevo), un componente con prop `variant`. Usa `Skeleton` de MUI con `animation="wave"`, `sx` apuntando a `surface.skeletonBase` / `skeletonHighlight`. Con `prefers-reduced-motion`, `animation={false}`.

| `variant` | Composición | Se usa en |
|---|---|---|
| `hero` | píldora 120×28 · 2 barras de título al 80%/60% de alto `h1` · 3 líneas de bullet · 2 botones 160×44 | `App.jsx` mientras carga Firestore |
| `text` | 1 barra de `h2` al 45% · 1 de subtítulo al 65% · 4 líneas de párrafo | Quién soy |
| `cards` | `count` tarjetas (defecto 3) con rect de icono 52×52 + 1 título + 2 líneas | Servicios |
| `stats` | 3 bloques con rect de cifra 140×48 + etiqueta | Métricas |
| `skills` | 20 filas: nombre 40% + barra 4px de ancho aleatorio estable + `caption` | Habilidades |
| `carousel` | 3 tarjetas 360×320 en fila, la tercera cortada por el borde | Proyectos |
| `timeline` | 4 filas alternadas con punto + tarjeta | Trayectoria |
| `form` | 3 rects de input 56px + botón | Cierre |

Cambios de cableado:
- `src/components/FullPageState.jsx`: el modo `loading` deja de pintar `CircularProgress` y pinta el chasis real (navbar fantasma + riel fantasma + `SectionSkeleton variant="hero"`). Mantiene `role="status"` y `aria-busy`. Los modos `error`/`empty` se conservan tal cual (mensaje + reintentar), pero centrados en 100dvh.
- `src/components/LazySectionWrapper.jsx`: gana prop `skeleton` (nombre de variante). El `DefaultFallback` con `CircularProgress` se retira; sin prop, cae a `variant="text"`. El fallback debe tener **la altura de la diapositiva** (`min-height: 100dvh`), o el snap salta cuando el chunk termina de cargar. Es el bug más probable de toda la migración.
- `src/features/metric/containers/stats.jsx`: su `CircularProgress` se reemplaza por `variant="stats"`. El archivo se disuelve al fusionarse la sección; su lógica de "las dos consultas son independientes" (que es correcta y hay que preservar) se muda a la diapositiva de servicios.

---

## 9. Indicador lateral de progreso

`src/components/SlideRail.jsx` (nuevo). Reemplaza a `src/components/scrollBar/scrollBar.jsx` en `md+`.

**Forma y posición**

- `position: fixed`, `left: railOffset` (20px en `md`, 32px en `lg`), `top: 50%`, `translateY(-50%)`. A la izquierda porque arriba a la derecha ya están marca, idioma, tema e índice.
- Columna de puntos, `gap: 12px`, ancho total 28px (zona táctil), punto visible de 6px.
- Punto inactivo: `background: surface.outlineStrong` (3.83 oscuro / 3.79 claro — cumple el 3:1 de 1.4.11). Punto activo: crece a una **píldora vertical de 6×22px** con `background: primary.main` y transición de 240ms con la curva de `tokens.motion`.
- Hover/focus: aparece a la derecha del punto una etiqueta (`caption`, fondo `background.paper`, borde `divider`, radio `sm`) con el nombre de la sección. Se muestra también con `:focus-visible`, no solo con hover.

**Discreción**

- Sin números, sin línea de fondo, sin barra de relleno. Seis puntos y nada más.
- `opacity: 0.55` en reposo → `1` en hover del riel o durante 1.2s después de un cambio de sección. Implementado con una clase, no con timers por punto.
- Se oculta con `display: none` bajo `md`, y también cuando `@media (max-height: 640px)` (ahí el snap está apagado y el riel miente).

**Comportamiento y a11y**

- `<nav aria-label={t('progress.label')}>` con `<a href={'#'+id}>` por sección — navegación real, no `div` con `onClick`.
- El activo lleva `aria-current="true"`; el nombre accesible es `t('progress.go_to', { name })`.
- Estado desde el mismo `useActiveSection(sectionIds)` que consume el navbar. **Un solo hook, una sola verdad.** El riel no monta su propio observer.
- Click → `preventDefault` + `scrollToSection(id)` (respeta reduced-motion).
- Zona clicable de 28×28 alrededor del punto de 6px; en `md` el puntero es fino, así que 28px basta (el mínimo de 44px aplica a táctil, y en táctil el riel no existe).

**En `xs`:** se conserva la barra fina superior de 3px del `scrollBar` actual, con el gradiente `accentGradient` y `aria-hidden`. Se renombra a `src/components/SlideProgressBar.jsx` y se le añade `display: { xs: 'block', md: 'none' }`. Con snap activo el progreso avanza a saltos, lo cual es correcto: son diapositivas.

---

## 10. Copy nuevo (i18n)

Reglas: toda clave existe en **`src/locales/es-co/translation.json`** y **`src/locales/en-us/translation.json`**. Ninguna cifra se escribe en el JSON — entran por interpolación desde la API. `src/test/i18n-parity.test.js` ya existe y debe seguir pasando.

### 10.1 Claves nuevas

| Clave | es-CO | en-US |
|---|---|---|
| `nav.index` | Índice | Index |
| `nav.close_index` | Cerrar índice | Close index |
| `nav.skills` | Habilidades | Skills |
| `nav.about` | Quién soy | About |
| `nav.closing` | Contacto | Contact |
| `progress.label` | Progreso por secciones | Section progress |
| `progress.go_to` | Ir a {{name}} | Go to {{name}} |
| `slides.hint` | Desliza | Scroll |
| `slides.next` | Siguiente sección | Next section |
| `slides.prev` | Sección anterior | Previous section |
| `hero.eyebrow` | Ingeniero fullstack · Colombia | Fullstack engineer · Colombia |
| `hero.titleLine1` | Construyo software | I build software |
| `hero.titleLine2` | y mido lo que construyo. | and I measure what I build. |
| `hero.subtitle` | Ingeniero fullstack: UX clara, código mantenible y resultados que se pueden verificar. Llevo cinco años registrando cada hora de código: lo que ves aquí abajo no es una lista de deseos, son datos. | Fullstack engineer: clean UX, maintainable code, and results you can verify. I've tracked every coding hour for five years — what follows isn't a wish list, it's data. |
| `hero.cta_work` | Ver proyectos | See projects |
| `hero.cta_contact` | Hablemos | Let's talk |
| `about.title` | Quién soy | Who I am |
| `about.subtitle` | La versión corta, sin adornos. | The short version, no fluff. |
| `about.p1` | Soy Hilder Arrieta, ingeniero fullstack. Trabajo el producto de punta a punta: el modelo de datos, la API, la interfaz y el despliegue. No entrego "la mitad en el front y ya veremos el back". | I'm Hilder Arrieta, a fullstack engineer. I work the whole product: data model, API, interface, and deploy. I don't hand over "the frontend half and we'll see about the backend". |
| `about.p2` | Mi centro de gravedad es C# y .NET del lado del servidor, y React con TypeScript del lado del cliente, con SQL en medio. Alrededor de eso: automatización de pruebas, contenedores y pipelines, porque el código que nadie puede desplegar no está terminado. | My center of gravity is C# and .NET on the server, React with TypeScript on the client, and SQL in between. Around that: test automation, containers, and pipelines — because code nobody can deploy isn't finished. |
| `about.p3` | Y algo que casi nadie hace: mido mi propio trabajo. Cada hora de código desde abril de 2021 está registrada con un tracker, y esos números son los que ves en este portafolio. Si algo aquí dice "cinco años de experiencia", hay un JSON público que lo respalda. | And something almost nobody does: I measure my own work. Every coding hour since April 2021 is tracked, and those numbers are what you see in this portfolio. If something here says "five years of experience", there's a public JSON backing it. |
| `about.facts.role` | Rol | Role |
| `about.facts.role_value` | Ingeniero fullstack | Fullstack engineer |
| `about.facts.focus` | Foco | Focus |
| `about.facts.focus_value` | .NET · React · SQL · DevOps | .NET · React · SQL · DevOps |
| `about.facts.tracking` | Midiendo desde | Tracking since |
| `about.facts.languages` | Idiomas | Languages |
| `about.facts.languages_value` | Español · Inglés | Spanish · English |
| `about.videoTitle` | Video de presentación | Introduction video |
| `about.watch` | Ver la presentación | Watch the intro |
| `service.title` | Lo que hago, respaldado por datos | What I do, backed by data |
| `service.subtitle` | Cada servicio con la parte de mi tiempo de código que realmente le dedico. | Each service with the share of my coding time it actually gets. |
| `service.dataOnlyTitle` | Los números de mi trabajo | The numbers behind my work |
| `service.dataNote` | {{value}} de mi tiempo medido | {{value}} of my measured time |
| `service.dataStack` | {{value}} · medido con el tracker | {{value}} · measured with the tracker |
| `service.source` | Fuente: WakaTime · @hilbrakaku | Source: WakaTime · @hilbrakaku |
| `metrics.hours` | Horas de código | Coding hours |
| `metrics.years` | Años midiendo | Years tracking |
| `metrics.activeDays` | Días con código escrito | Days with code written |
| `metrics.bestDay` | Mejor día: {{value}} | Best day: {{value}} |
| `metrics.dailyAverage` | Promedio: {{value}} al día | Average: {{value}} per day |
| `metrics.os` | {{value}} | {{value}} |
| `metrics.unavailable` | Las métricas de actividad no están disponibles ahora. | Activity metrics aren't available right now. |
| `skills.title` | Estas son mis habilidades, medidas con un tracker | These are my skills, measured with a tracker |
| `skills.subtitle` | Todo mi tiempo de código registrado desde {{since}}: {{hours}} horas en {{days}} días activos. | All my coding time tracked since {{since}}: {{hours}} hours across {{days}} active days. |
| `skills.unit` | {{value}} % del tiempo registrado | {{value}}% of tracked time |
| `skills.item_label` | {{name}}: {{value}} % del tiempo registrado | {{name}}: {{value}}% of tracked time |
| `skills.scale_note` | Las barras comparan entre sí; el porcentaje exacto va al lado. | Bars compare against each other; the exact percentage is next to them. |
| `skills.toolsTitle` | Dónde escribo ese código | Where I write that code |
| `skills.unavailable` | No pude traer las habilidades del tracker. | I couldn't load the skills from the tracker. |
| `skills.list_label` | Habilidades ordenadas por tiempo de uso | Skills ordered by time spent |
| `portfolio.title` | Proyectos | Projects |
| `portfolio.subtitle` | Filtra por tipo de trabajo y desliza de lado. | Filter by kind of work and swipe sideways. |
| `portfolio.carousel_label` | Carrusel de proyectos | Projects carousel |
| `portfolio.prev` | Proyecto anterior | Previous project |
| `portfolio.next` | Proyecto siguiente | Next project |
| `portfolio.position` | {{current}} de {{total}} | {{current}} of {{total}} |
| `portfolio.results` | {{count}} proyectos | {{count}} projects |
| `portfolio.goTo` | Ir al proyecto {{index}} | Go to project {{index}} |
| `portfolio.empty_filter` | Nada por aquí todavía. | Nothing here yet. |
| `portfolio.show_all` | Ver todos | Show all |
| `education.title` | Trayectoria | Track record |
| `education.subtitle` | Formación y experiencia, en orden. | Education and experience, in order. |
| `education.scroll_hint` | Desplázate dentro de la lista | Scroll inside the list |
| `closing.title_line1` | Hablemos | Let's talk |
| `closing.title_line2` | de lo que quieres construir. | about what you want to build. |
| `closing.direct` | Contacto directo | Direct contact |
| `closing.email_label` | Correo | Email |
| `closing.phone_label` | Teléfono | Phone |
| `closing.location_label` | Ubicación | Location |
| `closing.social_label` | Redes | Social |
| `closing.form_title` | O escríbeme aquí | Or write to me here |
| `closing.marquee` | Disponible para proyectos | Available for projects |
| `closing.availability` | Disponible para proyectos y consultorías. | Available for projects and consulting. |
| `footer.built_with` | Hecho con React, Vite y MUI | Built with React, Vite, and MUI |
| `footer.source_code` | Código en GitHub | Source on GitHub |
| `footer.rights` | © {{year}} Hilder Arrieta | © {{year}} Hilder Arrieta |
| `footer.back_to_top` | Volver arriba | Back to top |
| `common.retry` | Reintentar | Retry |
| `common.loading_section` | Cargando sección | Loading section |
| `common.source` | Fuente | Source |

### 10.2 Claves que se retiran

`stackChart.title`, `stackChart.seriesName` (muere el radar) · `metrics.yearsProgramming`, `metrics.hoursProgramming`, `metrics.projectsParticipated` (renombradas a `metrics.years` / `.hours` / `.activeDays`) · `metrics.title`, `metrics.subtitle` (la sección ya no existe sola) · `intro.whoami`, `intro.subtitle`, `intro.description`, `intro.videoTitle` (pasan a `about.*`) · `service.description` (pasa a `service.subtitle`) · `footer.made_with`, `footer.by`, `footer.phone`, `footer.social_label` (absorbidas por `closing.*` y `footer.*` nuevas) · `nav.introduction`, `nav.statistics` (→ `nav.about`, `nav.skills`).

`nav.resume` cambia de "Resumen"/"Resume" a **"Trayectoria"/"Track record"**: hoy dice "Resumen" para una sección que es un timeline de educación, lo cual desorienta.

---

## 11. Plan de implementación por fases

Regla de oro: **una fase = un PR**. Ninguna fase deja el home roto. El i18n de una fase entra **en esa fase**, en los dos JSON; no se acumula para el final.

### F0 · Tokens y tema *(bloquea todo lo visual)*

| Archivo | Acción |
|---|---|
| `src/config/tokens.js` | Reemplazar `brand`, `neutral`, `status`, `palettes`, `surfaces`, `shadow`, `typeScale`, `layout` según §3 y §4. Añadir `display` y `stat`. |
| `src/config/createAppTheme.js` | Registrar `display` y `stat` en `typography`; añadir la regla `scroll-snap-type: none` bajo reduced-motion; `scroll-padding-top` con el nuevo `headerHeight`. |
| `src/config/cssVars.js` | Exponer `--slide-height`, `--rail-width`, `--header-height`, `--carousel-card`, `--carousel-gap`, `--slide-padding-x`. |
| `src/context/ThemeContext.jsx` | `resolveInitialMode()` → `'dark'` por defecto. |

Dueño: Front (2.2). No paralelizable.
Verificación: el sitio actual entero se ve en indigo, en oscuro, sin un solo cambio de layout. Si algo se rompe aquí, hay un hex suelto fuera de `tokens.js` y hay que cazarlo.

### F1 · Chasis de diapositivas

| Archivo | Acción |
|---|---|
| `src/components/Slide.jsx` | **Nuevo.** Sucesor de `Section`: props `id`, `index`, `total`, `fit`, `variant`, `labelledBy`. Aplica `min-height: 100dvh`, `scroll-snap-align`, la cabecera fija y la región scrolleable de `fit="scroll"`. |
| `src/components/Section.jsx` | Se retira cuando no queden usos. |
| `src/components/SlideHeader.jsx` | **Nuevo.** `overline` (número + nombre) + `h2` + `subtitle1`. Sustituye a `SectionHeading` dentro de las diapositivas. |
| `src/hooks/useReducedMotion.js` | **Nuevo.** |
| `src/hooks/useSlideNavigation.js` | **Nuevo** (opcional): atajos de teclado con las guardas de §1.2. |
| `src/pages/Home.jsx` | Migrar de `Section` a `Slide`; añadir la lista de 7 diapositivas con `fit` e `index`; resolver alias de ancla al montar. |
| `src/utils/scroll.js` | Añadir `ANCHOR_ALIASES` y respetar reduced-motion. |
| `src/components/SkipLink.jsx` | Verificar que el destino sigue recibiendo foco con snap activo. |

Dueño: Fullstack (4.1). Verificación de QA: teclado completo (§1.2), 200% de zoom, 320×568, `max-height: 640`, deep link en frío a cada ancla, `#statistics` → `#skills`.

### F2 · Riel e índice

| Archivo | Acción |
|---|---|
| `src/components/SlideRail.jsx` | **Nuevo** (§9). |
| `src/components/SlideProgressBar.jsx` | **Nuevo**, migrado desde `scrollBar/scrollBar.jsx`, solo `xs`. |
| `src/components/scrollBar/scrollBar.jsx` | Se retira. |
| `src/components/SlideIndex.jsx` | **Nuevo** (§8.1). |
| `src/components/Navbar/Navbar.jsx` | Reescritura: marca + toggles + botón índice. Retirar `Drawer` y `ALL_SECTION_IDS`. |
| `src/hooks/useActiveSection.js` | Sin cambios funcionales; verificar que `rootMargin` se comporta con slides de `100dvh`. |
| `src/locales/**` | `nav.*`, `progress.*`, `slides.*`. |

Dueño: Front (2.1). Depende de F1. **Paralelizable con F3.**

### F3 · Skeletons

| Archivo | Acción |
|---|---|
| `src/components/skeletons/SectionSkeleton.jsx` | **Nuevo**, 8 variantes (§8.4). |
| `src/components/LazySectionWrapper.jsx` | Prop `skeleton`; retirar `CircularProgress`; fallback a altura de diapositiva. |
| `src/components/FullPageState.jsx` | Modo `loading` = chasis + skeleton de hero. |
| `src/App.jsx` | Pasar el nuevo estado de carga; sin cambios de contrato. |
| `src/locales/**` | `common.loading_section`, `common.retry`. |

Dueño: Front (2.1). Depende de F0. **Paralelizable con F2 y F4.**

### F4 · Datos de métricas *(bloquea F5 y F6)*

| Archivo | Acción |
|---|---|
| `src/features/metric/services/statistics.js` | Renombrar los 4 endpoints; igualar `transformResponse`; UUID a env. |
| `src/config/config.js` | `urlStats.statsEditors`, `urlStats.statsOs`. |
| `.env.development` / `.env.*` | `VITE_URL_STATS_EDITORS=/f6ec4610-5ec8-4e0a-b40d-aec4d11abefd.json`, `VITE_URL_STATS_OS=/b4730f03-b81c-464a-953c-567e27e89a34.json`. **Trabajo de DevOps (6.3).** |
| `src/features/metric/utils/languages.js` | **Nuevo:** `normalizeLanguages`, `topSkills`, `groupPercent`, `barWidth`. |
| `src/utils/formatDate.js` | Corregir `convertDaysToYearsByDate` → `Math.floor(days / 365.25)`. |
| `src/features/metric/utils/__tests__/languages.test.js` | **Nuevo:** fixture con el payload real (denylist, alias, orden, `< 5` ítems, array vacío, `null`). |

Dueño: Back (3.2) + Fullstack. Depende de F0 solo por conveniencia; en rigor es independiente y **puede arrancar en paralelo con F1**.

### F5 · Servicios + métricas

| Archivo | Acción |
|---|---|
| `src/features/service/service.jsx` | Reescritura a dos columnas; consume CMS + `getTotals` + `getLanguages`. |
| `src/features/service/serviceMetrics.js` | **Nuevo:** mapa de grupos (§7.1). |
| `src/features/service/serviceIcons.js` | Sin cambios de API; puede añadir claves si el CMS trae iconos nuevos. |
| `src/containers/MetricDashboard.jsx` | Borrar el `45`; tres cifras reales; variante `stat`; `CountUp` condicionado a viewport y reduced-motion. |
| `src/features/metric/containers/stats.jsx` | Se retira; su lógica de fallos independientes se muda a `service.jsx`. |
| `src/components/stackChart/StackChart.jsx` | Se retira. |
| `src/locales/**` | `service.*`, `metrics.*`; retirar `stackChart.*`. |

Dueño: Fullstack (4.1). Depende de F4.

### F6 · Habilidades

| Archivo | Acción |
|---|---|
| `src/features/skills/Skills.jsx` | **Nuevo** (§6). |
| `src/features/skills/SkillRow.jsx` | **Nuevo.** |
| `src/features/skills/EditorStrip.jsx` | **Nuevo** (§6.5). |
| `src/pages/Home.jsx` | Registrar la diapositiva `skills` con `LazySectionWrapper skeleton="skills"`. |
| `src/locales/**` | `skills.*`, `nav.skills`. |

Dueño: Fullstack (4.1). Depende de F4. **Paralelizable con F5** (tocan archivos distintos; el único punto de contacto es `Home.jsx`, que debe editarse en una sola de las dos ramas — asignarlo a F6).

### F7 · Carrusel de proyectos

| Archivo | Acción |
|---|---|
| `src/features/portfolio/project.jsx` | Shell: cabecera, filtros, `aria-live`, diálogo. |
| `src/features/portfolio/ProjectCarousel.jsx` | **Nuevo:** pista, botones, indicadores. |
| `src/features/portfolio/ProjectCard.jsx` | **Nuevo:** extraído del `map` actual. |
| `src/hooks/useCarousel.js` | **Nuevo:** `scrollBy`, límites, índice activo por `IntersectionObserver`, arrastre de ratón. |
| `src/locales/**` | `portfolio.*` nuevas. |

Dueño: Front (2.1). Depende de F1. **Paralelizable con F5, F6, F8, F9.**

### F8 · Quién soy + trayectoria

| Archivo | Acción |
|---|---|
| `src/features/intro/introduction.jsx` | Reescritura: copy + 4 datos + video secundario (`Dialog` o bloque lateral). |
| `src/features/resume/Education.jsx` | Cabecera fija + región scrolleable enfocable; conservar el timeline. |
| `src/components/HV/education.css`, `education.jsx` | Revisar si siguen en uso; si no, retirar. |
| `src/locales/**` | `about.*`, `education.*`; retirar `intro.*`. |

Dueño: Front (2.1) + Fullstack para el copy. Depende de F1.

### F9 · Cierre

| Archivo | Acción |
|---|---|
| `src/features/closing/Closing.jsx` | **Nuevo:** compone todo. |
| `src/features/closing/ContactForm.jsx` | **Nuevo:** migra la lógica de `Touch.jsx` sin tocar EmailJS; añade honeypot. |
| `src/features/closing/ClosingFooter.jsx` | **Nuevo.** |
| `src/features/closing/Marquee.jsx` | **Nuevo.** |
| `src/features/touch/Touch.jsx`, `src/features/footer/footer.jsx` | Se retiran. |
| `src/features/closing/__tests__/ContactForm.test.js` | **Nuevo.** El antiguo `features/touch/__tests__/Touch.test.js` ya fue retirado del árbol por el refactor en curso, así que no hay nada que migrar: hay que escribirlo. **Coordinar con el agente de tests.** |
| `src/locales/**` | `closing.*`, `footer.*`. |

Dueño: Fullstack (4.1). Depende de F1.

### F10 · Cierre de calidad

- Paridad i18n (`src/test/i18n-parity.test.js` verde) y barrido de strings quemados.
- Matriz de QA (5.3): Firestore vacío / timeout / doc sin `portfolio`; stats 500 y CORS; `queryTwo` OK con `queryFour` caído y viceversa; EmailJS sin env; `/fr-fr`, `/EN-US`; `localStorage.themeMode` corrupto; offline a mitad de scroll (chunk lazy que no carga).
- DevOps (6.1/6.2): `index.html` (`theme-color`, `color-scheme: dark light`, `og:image`, `title` por idioma), retirar `recharts` de `package.json` si queda sin uso, lockfile único, `public/_redirects` intacto.

### Grafo de dependencias

```
F0 ──┬── F1 ──┬── F2 ──┐
     │        ├── F7 ──┤
     │        ├── F8 ──┼── F10
     │        └── F9 ──┤
     ├── F3 ───────────┤
     └── F4 ──┬── F5 ──┤
              └── F6 ──┘
```

Paralelizable sin colisión: **(F2, F3, F7, F8, F9)** entre sí, y **(F5, F6)** entre sí. `src/pages/Home.jsx` y los dos `translation.json` son los archivos de colisión garantizada: `Home.jsx` se edita en F1, F6 y F10 y en ningún otro lado; los JSON los edita cada fase solo en sus propias claves.

---

## 12. Riesgos y trade-offs

### 12.1 Se retira

| Se retira | Motivo | Riesgo |
|---|---|---|
| `StackChart.jsx` (radar recharts) | Las 20 habilidades lo superan en información y lo bajan en peso | `recharts` queda sin uso en `package.json`; hay que quitarlo o queda deuda |
| `PROJECTS_PARTICIPATED = 45` | Cifra sin fuente en la sección "medida con un tracker" | Hilder pierde el número más alto de la página; ver §7.4 |
| Links inline del navbar en desktop | Tres navegaciones para seis destinos | Menos afordancia inmediata en desktop; el riel y el índice la cubren |
| `Drawer` móvil del navbar | Un solo overlay para todos los breakpoints | Ninguno relevante |
| `id="statistics"` | Se fusiona en `services` + `skills` | Enlaces externos rotos → mitigado con `ANCHOR_ALIASES` |
| `features/footer/footer.jsx` y `features/touch/Touch.jsx` como secciones separadas | El cierre es una sola diapositiva | El formulario es el único punto con efecto de red saliente; se muda la lógica tal cual, sin "aprovechar para mejorarla" |
| `ALL_SECTION_IDS` de `Navbar.jsx` | Inventaba secciones que el CMS no trajo → scroll a la nada | Ninguno |
| `Section.jsx`, `scrollBar.jsx`, `SectionHeading.jsx` (dentro de slides) | Sustituidos por `Slide`, `SlideRail`, `SlideHeader` | Hay que barrer todos los usos antes de borrar |

### 12.2 Riesgos vivos

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| El fallback de `Suspense` mide menos de `100dvh` y el snap salta cuando llega el chunk | **alta** | medio | Todo skeleton de diapositiva a `min-height: 100dvh`. Es lo primero que debe probar QA en F3. |
| `100dvh` + snap con la barra de direcciones de iOS Safari produce microsaltos | media | medio | `min-height` (no `height`), `scroll-snap-stop: normal`, prueba en iPhone real. Si persiste: `scroll-snap-type: y proximity` en `@supports (-webkit-touch-callout: none)`. |
| Contenido de una diapositiva `contain` desborda a 200% de zoom o con textos largos del CMS | media | alto (contenido inalcanzable) | Auditoría de QA a 200%; el slide que desborde cambia a `fit="scroll"`. La regla ya está escrita para no discutirla en el momento. |
| Las URL de "share" de WakaTime son revocables por el dueño | media | alto (4 secciones sin datos) | Las 4 a env (F4); estados de fallo ya definidos en cada sección; nunca dejar la diapositiva en blanco. |
| Percibir la barra logarítmica como engañosa | media | bajo | Porcentaje exacto al lado, nota `skills.scale_note`, barra `aria-hidden`. Alternativa lineal a un cambio de función. |
| Scroll horizontal anidado en scroll vertical con snap, en móvil | media | medio | `overscroll-behavior-x: contain`, `touch-action: auto`, sin drag en táctil. QA con dedo real, no con DevTools. |
| Los grupos de automatización/devops dan ~1% y hacen ver flojos esos servicios | alta | bajo | Modo `stack` (nombres en vez de porcentaje) para esos dos grupos. |
| Sin runner de tests instalado, todo esto se valida a mano | alta | medio | Hay 3 tests escritos y sin ejecutar (`src/test/i18n-parity.test.js`, `src/hooks/__tests__/useLocalStorage.test.js`, `src/utils/__tests__/formatDate.test.js`); DevOps debe habilitar Vitest cuando `npm install` vuelva a funcionar. La spec no depende de ello, pero el test de `languages.js` de F4 es el que más falta hará. |
| Colisión con el agente que refactoriza UI en paralelo | alta | alto | El orden de fases y la tabla de archivos por fase existen justamente para esto. F0 debe fusionarse antes que cualquier otra cosa. |
| `framer-motion` en 7 diapositivas a la vez | baja | bajo | `MotionReveal` con `viewport={{ once: true }}`; con reduced-motion, `initial={false}`. |

### 12.3 Deuda que se acepta a propósito

1. **`recharts` sigue en `package.json`** hasta que DevOps pueda tocar el manifiesto y el lockfile. No se puede validar la remoción sin `npm install`.
2. **`queryThree` (SO) se usa para una sola línea de texto.** No vale más; se conserva porque ya está pagado y borrarlo tiene el mismo costo que usarlo.
3. **Los atajos de teclado `J`/`K`** son un extra: si la fase F1 se alarga, se cortan sin consecuencias.
4. **La denylist de lenguajes es una lista literal.** Un lenguaje nuevo raro entrará al top 20 sin avisar. Es una constante de una línea y el arreglo es trivial; una heurística automática sería peor.
5. **El overlay de índice usa `Dialog` de MUI**, más pesado que un `Box` a mano. Se acepta por el focus trap, `Esc` y `aria-modal` gratis y correctos.
6. **`about.p3` menciona "cinco años"** en texto. Es el único número redactado a mano en todo el copy; se acepta porque el subtítulo de habilidades lo respalda con la cifra real de la API. Hay que revisarlo en 2027.
7. **`src/components/HV/education.*`** queda pendiente de auditoría: si no está en uso, es código muerto que nadie ha reclamado.

---

## 13. Preguntas abiertas

1. **Navbar de desktop:** ¿se aceptan marca + idioma + tema + "Índice", perdiendo los links inline, con el riel de puntos como navegación ambiente? Es la decisión más discutible del documento.
2. **La tercera cifra:** ¿"945 días con código" (dato real), `portfolio.length` (derivado, pequeño) o un campo nuevo `projects_count` en Firestore que tú actualizas?
3. **Barras de habilidades:** ¿escala logarítmica (legible, con el porcentaje exacto al lado) o lineal (11 de 20 barras en el suelo)?
4. **Curiosidades del tracker:** SWIG, Ezhil, Prolog, ca65 y GDScript están en tus datos. ¿Se muestran como guiño o entran a la denylist para que el top 20 quede más serio?
5. **El video de `introduction.link`:** ¿sigue dentro de "Quién soy" como bloque lateral, se mueve a un diálogo con un botón "Ver la presentación", o se retira?
6. **`recharts`:** ¿se retira del proyecto cuando muera el radar, o lo reservas para algo?
7. **Redes:** el CMS mapea Facebook, LinkedIn y GitHub, pero tus links reales incluyen X (`x.com/hilbrakaku`) y no Facebook. ¿Se cambia el mapa a LinkedIn + GitHub + X?
8. **Marquesina:** ¿"Disponible para proyectos" en el idioma activo, o tu nombre repetido (más de marca, menos comercial)?
9. **Foto o retrato:** las dos referencias se sostienen con presencia visual fuerte. Hoy no hay ninguna imagen tuya (`og:image` apunta a un `profile.jpg` que no está en `public/`). ¿Habrá foto para el hero y el cierre?
