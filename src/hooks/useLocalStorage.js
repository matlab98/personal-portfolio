// Guardar un ítem en localStorage
export function setLocalStorageItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Obtener un ítem de localStorage
export function getLocalStorageItem(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

// Eliminar un ítem de localStorage
export function removeLocalStorageItem(key) {
    localStorage.removeItem(key);
}

// Limpiar todo el localStorage
export function clearLocalStorage() {
    localStorage.clear();
}

export function isUserActive() {
    const lastActiveTime = getLocalStorageItem('lastActiveTime');
    const currentTime = new Date().getTime();

    // Si han pasado más de 30 minutos (1800000 milisegundos)
    return lastActiveTime && (currentTime - lastActiveTime) < 1800000;
}

// Actualizar tiempo de última actividad
export function updateLastActiveTime() {
    setLocalStorageItem('lastActiveTime', new Date().getTime());
}

// Guardar preferencias del usuario en localStorage
export function saveUserPreferences(preferences) {
    setLocalStorageItem('userPreferences', preferences);
}

// Obtener preferencias del usuario
export function getUserPreferences() {
    return getLocalStorageItem('userPreferences') || {};
}
