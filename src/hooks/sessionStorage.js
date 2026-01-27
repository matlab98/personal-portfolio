// Guardar un ítem en sessionStorage
function setSessionStorageItem(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

// Obtener un ítem de sessionStorage
function getSessionStorageItem(key) {
  const value = sessionStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

// Eliminar un ítem de sessionStorage
function removeSessionStorageItem(key) {
  sessionStorage.removeItem(key);
}

// Limpiar todo el sessionStorage
function clearSessionStorage() {
  sessionStorage.clear();
}

export {
  setSessionStorageItem,
  getSessionStorageItem,
  removeSessionStorageItem,
  clearSessionStorage,
};
