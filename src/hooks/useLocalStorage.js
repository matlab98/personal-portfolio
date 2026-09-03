// Envoltorio de localStorage: ninguna operación de storage debe tumbar la UI.
// En modo privado, con cuota llena o con cookies bloqueadas, el acceso lanza.

function setLocalStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Cuota llena o storage bloqueado (modo privado): no es motivo para tumbar la UI.
  }
}

function getLocalStorageItem(key) {
  try {
    const value = localStorage.getItem(key);
    // Un '' crudo no es JSON válido; se trata como ausente igual que null.
    if (value === null || value === '') return null;

    return JSON.parse(value);
  } catch {
    // Valor corrupto o sin comillas (themeMode = dark): se trata como ausente.
    return null;
  }
}

function removeLocalStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Nada que borrar si el storage no está disponible.
  }
}

function clearLocalStorage() {
  try {
    localStorage.clear();
  } catch {
    // Idem: el storage inaccesible ya está, de hecho, vacío.
  }
}

export {
  setLocalStorageItem,
  getLocalStorageItem,
  removeLocalStorageItem,
  clearLocalStorage,
};
