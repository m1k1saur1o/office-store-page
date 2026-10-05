/* Utilidades compartidas entre componentes */

export const CATEGORY_LABELS = {
  electronica: 'Electrónica',
  accesorios: 'Accesorios'
};

const priceFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0
});

export function formatPrice(value) {
  return priceFormatter.format(value);
}

/* Lee un valor JSON desde localStorage; si no existe, está corrupto o no es válido, usa el valor por defecto */
export function readStorage(key, fallback, isValid) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;

    const value = JSON.parse(raw);
    return isValid(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Almacenamiento lleno o bloqueado: la app sigue funcionando sin persistencia
  }
}

export function isValidCart(value) {
  return Array.isArray(value) && value.every(function (item) {
    return item !== null &&
      typeof item === 'object' &&
      typeof item.id === 'number' &&
      typeof item.name === 'string' &&
      typeof item.price === 'number' &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0;
  });
}

/* Antepone la base de Vite ('/' en local, '/office-store-page/' en GitHub Pages) a una ruta de public/ */
export function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, '')}`;
}
