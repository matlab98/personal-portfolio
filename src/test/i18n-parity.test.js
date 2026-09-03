import { describe, it, expect } from 'vitest';
import en from '@/locales/en-us/translation.json';
import es from '@/locales/es-co/translation.json';

/**
 * Aplana un objeto de traducción a rutas de keys separadas por punto.
 * Los arrays se tratan como hoja: i18next los devuelve completos con
 * `returnObjects`, así que la key es el contrato, no cada índice.
 */
const flattenKeys = (objeto, prefijo = '') =>
  Object.entries(objeto).flatMap(([clave, valor]) => {
    const ruta = prefijo ? `${prefijo}.${clave}` : clave;
    const esRama = valor !== null && typeof valor === 'object' && !Array.isArray(valor);

    return esRama ? flattenKeys(valor, ruta) : [ruta];
  });

const flattenLeaves = (objeto, prefijo = '') =>
  Object.entries(objeto).flatMap(([clave, valor]) => {
    const ruta = prefijo ? `${prefijo}.${clave}` : clave;
    const esRama = valor !== null && typeof valor === 'object' && !Array.isArray(valor);

    return esRama ? flattenLeaves(valor, ruta) : [[ruta, valor]];
  });

const keysEn = flattenKeys(en);
const keysEs = flattenKeys(es);

describe('contrato i18n: paridad en-us / es-co', () => {
  it('no hay keys presentes en en-us y ausentes en es-co', () => {
    // Arrange
    const enEs = new Set(keysEs);

    // Act
    const faltantes = keysEn.filter((clave) => !enEs.has(clave));

    // Assert
    expect(faltantes).toEqual([]);
  });

  it('no hay keys presentes en es-co y ausentes en en-us', () => {
    // Arrange
    const enEn = new Set(keysEn);

    // Act
    const faltantes = keysEs.filter((clave) => !enEn.has(clave));

    // Assert
    expect(faltantes).toEqual([]);
  });

  it('el set de keys es exactamente el mismo en ambos idiomas', () => {
    expect([...keysEs].sort()).toEqual([...keysEn].sort());
  });

  it('no hay keys duplicadas dentro de un mismo idioma', () => {
    expect(new Set(keysEn).size).toBe(keysEn.length);
    expect(new Set(keysEs).size).toBe(keysEs.length);
  });

  it('ningún valor traducido queda vacío', () => {
    // Una key vacía pasa la paridad pero deja un hueco en la UI.
    const vacias = [
      ...flattenLeaves(en).map(([ruta, valor]) => [`en-us:${ruta}`, valor]),
      ...flattenLeaves(es).map(([ruta, valor]) => [`es-co:${ruta}`, valor]),
    ]
      .filter(([, valor]) => typeof valor === 'string' && valor.trim() === '')
      .map(([ruta]) => ruta);

    expect(vacias).toEqual([]);
  });

  it('los arrays de traducción tienen la misma longitud y la misma forma en ambos idiomas', () => {
    // Arrange — p. ej. hero.bullets: si un idioma trae 3 bullets y el otro 2,
    // la sección se renderiza incompleta sin ningún error visible.
    const arraysEn = flattenLeaves(en).filter(([, valor]) => Array.isArray(valor));

    // Act & Assert
    expect(arraysEn.length).toBeGreaterThan(0);

    for (const [ruta, valorEn] of arraysEn) {
      const valorEs = ruta.split('.').reduce((acc, parte) => acc?.[parte], es);

      expect(Array.isArray(valorEs), `es-co:${ruta} debería ser un array`).toBe(true);
      expect(valorEs, `${ruta} con distinta longitud`).toHaveLength(valorEn.length);

      valorEn.forEach((item, indice) => {
        if (item !== null && typeof item === 'object') {
          expect(
            Object.keys(valorEs[indice] ?? {}).sort(),
            `${ruta}[${indice}] con distintas sub-keys`,
          ).toEqual(Object.keys(item).sort());
        }
      });
    }
  });

  it('las interpolaciones {{var}} coinciden entre idiomas', () => {
    // Arrange
    const interpolaciones = (texto) =>
      typeof texto === 'string'
        ? [...texto.matchAll(/{{\s*([^}\s]+)\s*}}/g)].map((m) => m[1]).sort()
        : [];
    const hojasEs = new Map(flattenLeaves(es));

    // Act
    const desalineadas = flattenLeaves(en)
      .filter(([ruta, valorEn]) => {
        const esperado = interpolaciones(valorEn);
        const actual = interpolaciones(hojasEs.get(ruta));

        return esperado.join('|') !== actual.join('|');
      })
      .map(([ruta]) => ruta);

    // Assert
    expect(desalineadas).toEqual([]);
  });
});
