/** Lenguajes que no son habilidades reales en el payload de WakaTime. */
export const LANGUAGE_DENYLIST = new Set([
  'Other',
  'Binary',
  'Text',
  'Text Template',
  'JSON',
  'CSV',
  'INI',
  'Properties',
  'Java Properties',
  'TSConfig',
  'Git',
  'Git Config',
  'Diff',
  'Rich Text Format',
  'Image (svg)',
  'Image (png)',
]);

/** Variantes que se fusionan sumando porcentajes. */
export const LANGUAGE_ALIASES = {
  TSQL: 'SQL',
  SCSS: 'CSS',
  Sass: 'CSS',
  LESS: 'CSS',
  Less: 'CSS',
  'ca65 assembler': 'Assembly',
  GDScript3: 'GDScript',
  CSHTML: 'ASP.NET',
  JSX: 'React (JSX)',
};

/**
 * Normaliza el array de lenguajes: denylist, alias con suma, orden descendente.
 * @param {Array<{ name: string, percent: number, color?: string }>|null|undefined} payload
 */
export const normalizeLanguages = (payload) => {
  if (!Array.isArray(payload)) return [];

  const merged = new Map();

  for (const item of payload) {
    if (!item?.name || LANGUAGE_DENYLIST.has(item.name)) continue;
    if (!(item.percent > 0)) continue;

    const name = LANGUAGE_ALIASES[item.name] ?? item.name;
    const existing = merged.get(name);

    if (existing) {
      existing.percent += item.percent;
    } else {
      merged.set(name, { name, percent: item.percent, color: item.color });
    }
  }

  return [...merged.values()].sort((a, b) => {
    if (b.percent !== a.percent) return b.percent - a.percent;
    return a.name.localeCompare(b.name);
  });
};

/** Top N habilidades tras normalizar. */
export const topSkills = (list, n = 20) => list.slice(0, n);

/** Suma porcentajes de un grupo de nombres (servicios + métricas). */
export const groupPercent = (list, names) => {
  const wanted = new Set(names);
  return list
    .filter((item) => wanted.has(item.name))
    .reduce((sum, item) => sum + item.percent, 0);
};

/**
 * Ancho de barra en escala logarítmica (6–100) sobre el rango de los ítems mostrados.
 */
export const logBarWidth = (percent, minPercent, maxPercent) => {
  if (!(percent > 0) || !(maxPercent > minPercent)) return 6;

  const logMin = Math.log10(minPercent);
  const logMax = Math.log10(maxPercent);
  const logP = Math.log10(percent);
  const ratio = (logP - logMin) / (logMax - logMin);

  return Math.max(6, Math.round(ratio * 100));
};

/** Formatea porcentaje según locale activo. */
export const formatSkillPercent = (value, locale) =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
