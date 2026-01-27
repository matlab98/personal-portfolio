// Guardar un ítem en localStorage
function setLocalStorageItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Obtener un ítem de localStorage
function getLocalStorageItem(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

// Eliminar un ítem de localStorage
function removeLocalStorageItem(key) {
  localStorage.removeItem(key);
}

// Limpiar todo el localStorage
function clearLocalStorage() {
  localStorage.clear();
}

function isUserActive() {
  const lastActiveTime = getLocalStorageItem("lastActiveTime");
  const currentTime = new Date().getTime();

  // Si han pasado más de 30 minutos (1800000 milisegundos)
  return lastActiveTime && currentTime - lastActiveTime < 1800000;
}

// Actualizar tiempo de última actividad
function updateLastActiveTime() {
  setLocalStorageItem("lastActiveTime", new Date().getTime());
}

// Guardar preferencias del usuario en localStorage
function saveUserPreferences(preferences) {
  setLocalStorageItem("userPreferences", preferences);
}

// Obtener preferencias del usuario
function getUserPreferences() {
  return getLocalStorageItem("userPreferences") || {};
}

export {
  setLocalStorageItem,
  getLocalStorageItem,
  removeLocalStorageItem,
  clearLocalStorage,
  isUserActive,
  updateLastActiveTime,
  saveUserPreferences,
  getUserPreferences,
};
