import { afterEach } from 'vitest';

// Los matchers de jest-dom y el cleanup de Testing Library son opcionales: si el
// paquete no está instalado, la suite de utils/hooks debe seguir corriendo.
// Se resuelve en tiempo de setup, no en cada test, para no pagar el import N veces.
const optional = async (specifier) => {
  try {
    return await import(specifier);
  } catch {
    return null;
  }
};

await optional('@testing-library/jest-dom/vitest');
const testingLibrary = await optional('@testing-library/react');

afterEach(() => {
  testingLibrary?.cleanup?.();

  // jsdom da un localStorage real y compartido entre tests del mismo archivo.
  try {
    localStorage.clear();
  } catch {
    // Storage stubbeado o bloqueado por un test: no es motivo para fallar el afterEach.
  }
});
