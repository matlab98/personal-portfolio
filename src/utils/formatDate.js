import i18next from 'i18next';

const getLocale = () => (i18next.language || 'en').startsWith('es') ? 'es-ES' : 'en-US';

const formatterHour = (tiempo) => {
  const reference = new Date(tiempo);
  const locale = getLocale();
  const date = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(reference);
  return date; 
};

const whatHour = (tiempo) => {
  const reference = new Date(tiempo);
  const locale = getLocale();
  const date = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(reference);
  return date; 
};


/**
 * Años de registro a partir de días totales del tracker (WakaTime `range.days_*`).
 * Usa 365.25 días/año para alinear con el rango `all_time` del payload.
 *
 * @param {number} days
 * @returns {number|null} null si la entrada no es un número finito ≥ 0.
 */
const convertDaysToYearsByDate = (days) => {
  if (!Number.isFinite(days) || days < 0) return null;
  return Math.floor(days / 365.25);
};

// Entero con o sin separadores de miles ("7", "1234", "1,234,567"), decimal
// opcional, y la unidad de horas. Sin \b inicial: con él, "3.5 hrs" matcheaba
// el "5" tras el punto en vez de las 3.5 horas.
const HOURS_PATTERN = /(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d+))?\s*(?:hrs?|hours?|h)\b/i;

/**
 * Extrae las horas de un texto tipo WakaTime ("1,234 hrs 30 mins").
 * Los decimales se redondean al entero más cercano: el consumidor es un contador
 * de despliegue, y redondear deja menos error que truncar.
 *
 * @param {string} value
 * @returns {number|null}
 */
const getHours = (value) => {
  if (typeof value !== 'string') return null;

  const match = value.match(HOURS_PATTERN);
  if (!match) return null;

  const [, integerPart, decimalPart = '0'] = match;
  const hours = Number(`${integerPart.replace(/,/g, '')}.${decimalPart}`);

  return Number.isFinite(hours) ? Math.round(hours) : null;
};

const formatterDate = (tiempo) => {
  const reference = new Date(tiempo);
  const locale = getLocale();

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const date = dateFormatter.format(reference);
  const today = dateFormatter.format(new Date());
  const tomorrow = dateFormatter.format(new Date().getTime() + 1000 * 60 * 60 * 24);

  const day = reference.getDate();
  const month = reference.getMonth() + 1;

  const isEs = (i18next.language || 'en').startsWith('es');

  const diasEs = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];

  const diasEn = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const dias = isEs ? diasEs : diasEn;

  if (date === today) {
    return isEs ? 'Hoy ' : 'Today ';
  } else if (date === tomorrow) {
    return isEs ? 'Mañana ' : 'Tomorrow ';
  } else {
    const numeroDia = reference.getDay();
    const nombreDia = dias[numeroDia];
    const monthPadded = month < 10 ? `0${month}` : month;
    return `${nombreDia} ${day}-${monthPadded}`;
  }
};

export default { formatterDate, whatHour, formatterHour, convertDaysToYearsByDate, getHours };