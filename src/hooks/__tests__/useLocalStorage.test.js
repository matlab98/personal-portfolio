import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  setLocalStorageItem,
  getLocalStorageItem,
  removeLocalStorageItem,
  clearLocalStorage,
} from '@/hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('escritura y lectura', () => {
    it('guarda y devuelve un objeto serializado', () => {
      // Arrange
      const preferencias = { themeMode: 'dark', lang: 'es-CO' };

      // Act
      setLocalStorageItem('userPreferences', preferencias);
      const resultado = getLocalStorageItem('userPreferences');

      // Assert
      expect(resultado).toEqual(preferencias);
      expect(resultado).not.toBe(preferencias); // pasó por JSON, no es la misma referencia
    });

    it.each([
      ['un string', 'dark'],
      ['un número', 42],
      ['un booleano', false],
      ['el número cero', 0],
      ['un string vacío', ''],
      ['un array', ['a', 'b']],
      ['null', null],
    ])('conserva el tipo original cuando el valor es %s', (_nombre, valor) => {
      setLocalStorageItem('clave', valor);

      expect(getLocalStorageItem('clave')).toEqual(valor);
    });

    it('devuelve null cuando la clave no existe', () => {
      expect(getLocalStorageItem('clave-inexistente')).toBeNull();
    });

    it('elimina una clave puntual sin tocar las demás', () => {
      // Arrange
      setLocalStorageItem('themeMode', 'dark');
      setLocalStorageItem('lang', 'es-CO');

      // Act
      removeLocalStorageItem('themeMode');

      // Assert
      expect(getLocalStorageItem('themeMode')).toBeNull();
      expect(getLocalStorageItem('lang')).toBe('es-CO');
    });

    it('limpia todo el storage', () => {
      setLocalStorageItem('themeMode', 'dark');
      setLocalStorageItem('lang', 'es-CO');

      clearLocalStorage();

      expect(localStorage.length).toBe(0);
    });
  });

  describe('valores corruptos', () => {
    it('devuelve null si el valor guardado no es JSON válido y no lanza', () => {
      // Arrange — así queda el storage si alguien escribió sin JSON.stringify
      // (caso real: themeMode = dark, que revienta un JSON.parse desprotegido).
      localStorage.setItem('themeMode', 'dark');

      // Act
      const lectura = () => getLocalStorageItem('themeMode');

      // Assert
      expect(lectura).not.toThrow();
      expect(lectura()).toBeNull();
    });

    it.each(['{"themeMode":', 'undefined', "{'a':1}", '\u0000', ''])(
      'trata el valor crudo %j como ausente',
      (crudo) => {
        localStorage.setItem('clave', crudo);

        expect(getLocalStorageItem('clave')).toBeNull();
      },
    );
  });

  describe('storage que lanza excepción (modo privado o cuota llena)', () => {
    it.each([
      ['setLocalStorageItem', 'setItem', () => setLocalStorageItem('themeMode', 'dark')],
      ['getLocalStorageItem', 'getItem', () => getLocalStorageItem('themeMode')],
      ['removeLocalStorageItem', 'removeItem', () => removeLocalStorageItem('themeMode')],
      ['clearLocalStorage', 'clear', () => clearLocalStorage()],
    ])('%s no propaga el error de storage', (_nombre, metodo, operacion) => {
      // Arrange
      vi.spyOn(Storage.prototype, metodo).mockImplementation(() => {
        throw new DOMException('SecurityError');
      });

      // Act & Assert
      expect(operacion).not.toThrow();
      expect(Storage.prototype[metodo]).toHaveBeenCalled();
    });

    it('getLocalStorageItem devuelve null si la lectura lanza', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new DOMException('SecurityError');
      });

      expect(getLocalStorageItem('themeMode')).toBeNull();
    });
  });

  describe('contrato con ThemeContext', () => {
    // ThemeContext resuelve el modo en el initializer del useState y acepta el
    // valor solo si es exactamente 'dark' o 'light'; cualquier otra cosa cae al
    // fallback de preferencia del sistema. Estos casos cubren ese contrato.
    const modoValido = (valor) => valor === 'dark' || valor === 'light';

    it('devuelve el modo guardado tal cual para que el primer paint no parpadee', () => {
      setLocalStorageItem('themeMode', 'dark');

      expect(getLocalStorageItem('themeMode')).toBe('dark');
      expect(modoValido(getLocalStorageItem('themeMode'))).toBe(true);
    });

    it.each([
      ['ausente', null],
      ['corrupto sin comillas', 'dark-sin-json'],
      ['un objeto inesperado', '{"mode":"dark"}'],
      ['vacío', ''],
    ])('con themeMode %s devuelve algo que el guard de ThemeContext rechaza', (_nombre, crudo) => {
      if (crudo !== null) localStorage.setItem('themeMode', crudo);

      expect(modoValido(getLocalStorageItem('themeMode'))).toBe(false);
    });

    it('sobrevive a un storage inaccesible sin romper el initializer', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new DOMException('SecurityError');
      });

      expect(() => getLocalStorageItem('themeMode')).not.toThrow();
      expect(modoValido(getLocalStorageItem('themeMode'))).toBe(false);
    });
  });
});
