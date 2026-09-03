import { groupPercent } from '@/utils/skillsFromWakaTime';

/** Grupos de lenguajes por tipo de servicio (icono del CMS). */
export const SERVICE_GROUPS = [
  {
    id: 'frontend',
    match: ['brush', 'paint', 'palette', 'design', 'ux', 'ui', 'code', 'laptop', 'web', 'html', 'terminal'],
    languages: ['JavaScript', 'TypeScript', 'React (JSX)', 'HTML', 'CSS'],
    mode: 'percent',
  },
  {
    id: 'backend',
    match: ['database', 'data', 'sql', 'storage', 'backend', 'back-end', 'server'],
    languages: ['C#', 'Java', 'Python', 'SQL', 'ASP.NET'],
    mode: 'percent',
  },
  {
    id: 'automation',
    match: ['bug', 'test', 'qa', 'check', 'shield'],
    languages: ['Gherkin', 'Bash', 'PowerShell', 'Groovy'],
    mode: 'stack',
  },
  {
    id: 'devops',
    match: ['cloud', 'docker', 'devops', 'aws'],
    languages: ['Docker', 'YAML', 'XML'],
    mode: 'stack',
  },
];

export const resolveServiceGroup = (iconClass) => {
  const normalized = typeof iconClass === 'string' ? iconClass.toLowerCase() : '';
  return SERVICE_GROUPS.find(({ match }) => match.some((keyword) => normalized.includes(keyword))) ?? null;
};

/**
 * Nota de dato para una tarjeta de servicio.
 * @returns {{ mode: 'percent'|'stack', value: string }|null}
 */
export const buildServiceDataNote = (iconClass, normalizedLanguages, t, locale) => {
  const group = resolveServiceGroup(iconClass);
  if (!group || !normalizedLanguages?.length) return null;

  if (group.mode === 'percent') {
    const total = groupPercent(normalizedLanguages, group.languages);
    if (!(total > 0)) return null;

    const formatted = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 1,
    }).format(Math.round(total * 10) / 10);

    return {
      mode: 'percent',
      value: t('service.dataNote', { value: `${formatted} %` }),
    };
  }

  const names = group.languages.filter((name) =>
    normalizedLanguages.some((item) => item.name === name),
  );

  if (names.length === 0) return null;

  return {
    mode: 'stack',
    value: t('service.dataStack', { value: names.join(' · ') }),
  };
};
