import { describe, it, expect } from 'vitest';
import formatDate from '@/utils/formatDate';

const { getHours, convertDaysToYearsByDate } = formatDate;

describe('getHours', () => {
  it('extrae las horas de un string con sufijo hrs', () => {
    // Arrange
    const valor = '12 hrs';

    // Act
    const resultado = getHours(valor);

    // Assert
    expect(resultado).toBe(12);
  });

  it.each([
    ['12 hrs', 12],
    ['1 hr', 1],
    ['5 h', 5],
    ['3 hours', 3],
    ['1 hour', 1],
    ['10 HRS', 10],
    ['7hrs', 7],
  ])('acepta la variante "%s" y devuelve %i', (valor, esperado) => {
    expect(getHours(valor)).toBe(esperado);
  });

  it('quita los separadores de miles antes de convertir a número', () => {
    // Arrange
    const valor = '1,234 hrs';

    // Act
    const resultado = getHours(valor);

    // Assert
    expect(resultado).toBe(1234);
    expect(typeof resultado).toBe('number');
  });

  it('soporta varios grupos de miles', () => {
    expect(getHours('1,234,567 hours')).toBe(1234567);
  });

  it.each([
    ['1234 hrs', 1234],
    ['12345 hrs', 12345],
    ['100000 hours', 100000],
  ])('acepta enteros largos sin separador: "%s" devuelve %i', (valor, esperado) => {
    // Antes el regex exigía grupos de 3 dígitos separados por coma, así que
    // cualquier entero de 4+ dígitos sin formatear devolvía null y la métrica
    // desaparecía sin error visible.
    expect(getHours(valor)).toBe(esperado);
  });

  it('toma solo la porción de horas cuando el string trae también minutos', () => {
    // Formato típico de WakaTime: "7 hrs 30 mins".
    expect(getHours('7 hrs 30 mins')).toBe(7);
    expect(getHours('1,234 hrs 56 mins')).toBe(1234);
  });

  describe('decimales', () => {
    it.each([
      ['3.5 hrs', 4],
      ['3.4 hrs', 3],
      ['2.6 hours', 3],
      ['1234.7 hrs', 1235],
      ['0.5 h', 1],
    ])('redondea al entero más cercano: "%s" devuelve %i', (valor, esperado) => {
      // Criterio explícito: se REDONDEA, no se trunca. Antes "3.5 hrs" devolvía 5
      // porque el punto actuaba como límite de palabra y matcheaba el decimal.
      expect(getHours(valor)).toBe(esperado);
    });

    it('nunca devuelve un decimal: el consumidor pinta un contador entero', () => {
      const resultado = getHours('3.5 hrs');

      expect(Number.isInteger(resultado)).toBe(true);
    });
  });

  it.each([
    ['un número', 42],
    ['undefined', undefined],
    ['null', null],
    ['un objeto', { hours: 10 }],
    ['un array', ['10 hrs']],
  ])('devuelve null cuando el valor es %s (no-string)', (_nombre, valor) => {
    expect(getHours(valor)).toBeNull();
  });

  it('devuelve null cuando no hay coincidencia de horas en el string', () => {
    expect(getHours('sin datos')).toBeNull();
    expect(getHours('')).toBeNull();
    expect(getHours('30 mins')).toBeNull();
  });

  it('no confunde una palabra que empieza por h con la unidad de horas', () => {
    expect(getHours('5 hola')).toBeNull();
  });
});

describe('convertDaysToYearsByDate', () => {
  it('devuelve 0 cuando no se suman días', () => {
    expect(convertDaysToYearsByDate(0)).toBe(0);
  });

  it('devuelve 1 al superar 365 días con la constante 365.25', () => {
    expect(convertDaysToYearsByDate(365)).toBe(0);
    expect(convertDaysToYearsByDate(366)).toBe(1);
  });

  it('devuelve 5 para 1947 días (payload WakaTime verificado)', () => {
    expect(convertDaysToYearsByDate(1947)).toBe(5);
  });

  it('trunca hacia abajo fracciones de año', () => {
    expect(convertDaysToYearsByDate(365.9)).toBe(1);
    expect(convertDaysToYearsByDate(730)).toBe(1);
  });

  describe('validación de entrada', () => {
    it.each([
      ['undefined', undefined],
      ['null', null],
      ['un string numérico', '365'],
      ['un string basura', 'abc'],
      ['un objeto', {}],
      ['NaN', NaN],
      ['Infinity', Infinity],
      ['un booleano', true],
    ])('devuelve null cuando days es %s', (_nombre, valor) => {
      expect(convertDaysToYearsByDate(valor)).toBeNull();
    });

    it('devuelve null cuando days es negativo', () => {
      expect(convertDaysToYearsByDate(-10)).toBeNull();
    });
  });
});

describe('contrato con MetricDashboard', () => {
  // El dashboard filtra con `.filter((metric) => Number.isFinite(metric.value))`,
  // así que ambas utilidades deben devolver algo que ese filtro descarte cuando
  // no hay dato. Si alguien vuelve a devolver NaN, CountUp pinta "NaN".
  it.each([
    ['convertDaysToYearsByDate sin días', convertDaysToYearsByDate(undefined)],
    ['convertDaysToYearsByDate con basura', convertDaysToYearsByDate('abc')],
    ['getHours sin string', getHours(undefined)],
    ['getHours sin match', getHours('sin datos')],
  ])('%s produce un valor que Number.isFinite descarta', (_nombre, valor) => {
    expect(Number.isFinite(valor)).toBe(false);
  });

  it.each([
    ['convertDaysToYearsByDate con días reales', convertDaysToYearsByDate(1947)],
    ['getHours con horas reales', getHours('1,234 hrs 30 mins')],
  ])('%s produce un valor que Number.isFinite acepta', (_nombre, valor) => {
    expect(Number.isFinite(valor)).toBe(true);
    expect(Number.isInteger(valor)).toBe(true);
  });
});
