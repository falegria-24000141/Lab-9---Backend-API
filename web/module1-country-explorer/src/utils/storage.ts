const FAVORITES_KEY = 'country-explorer-favorites';

/**
 * Obtiene la lista de nombres de países favoritos desde localStorage
 */
export function getFavorites(): string[] {
  const stored = localStorage.getItem(FAVORITES_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error al parsear favoritos:', error);
    return [];
  }
}

/**
 * Guarda la lista de favoritos en localStorage
 * @param favorites - Array de nombres de países
 */
export function saveFavorites(favorites: string[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

/**
 * Alterna el estado de favorito de un país (lo añade o lo quita)
 * @param countryName - Nombre único del país
 */
export function toggleFavorite(countryName: string): void {
  const favorites = getFavorites();
  const index = favorites.indexOf(countryName);

  if (index === -1) {
    favorites.push(countryName);
  } else {
    favorites.splice(index, 1);
  }

  saveFavorites(favorites);
}

/**
 * Comprueba si un país está en la lista de favoritos
 * @param countryName - Nombre del país a verificar
 */
export function isFavorite(countryName: string): boolean {
  return getFavorites().includes(countryName);
}