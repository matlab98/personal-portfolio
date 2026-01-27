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
   * Converts days to years based on real calendar dates.
   *
   * @param {number} days
   * @param {Date} startDate
   * @returns {number}
   */
  const convertDaysToYearsByDate = (days, startDate = new Date()) => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);

    return endDate.getFullYear() - startDate.getFullYear();
  };
const getHours = (value) => {
  if (typeof value !== 'string') return null;

  const match = value.match(/\b(\d{1,3}(?:,\d{3})*)\s*(hrs?|hours?|h)\b/i);
  if (!match) return null;

  // Remove thousand separators and convert to number
  return Number(match[1].replace(/,/g, ''));
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