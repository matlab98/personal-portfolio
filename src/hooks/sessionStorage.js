// Guardar un ítem en sessionStorage
export function setSessionStorageItem(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
}

// Obtener un ítem de sessionStorage
export function getSessionStorageItem(key) {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

// Eliminar un ítem de sessionStorage
export function removeSessionStorageItem(key) {
    sessionStorage.removeItem(key);
}

// Limpiar todo el sessionStorage
export function clearSessionStorage() {
    sessionStorage.clear();
}
