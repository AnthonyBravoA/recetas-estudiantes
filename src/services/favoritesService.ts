/**
 * Servicio para manejar las recetas favoritas en localStorage
 */

const FAVORITES_KEY = 'recetas-favoritas';

export interface FavoritesService {
  getFavorites: () => number[];
  addFavorite: (recipeId: number) => boolean;
  removeFavorite: (recipeId: number) => boolean;
  isFavorite: (recipeId: number) => boolean;
  clearFavorites: () => void;
  getFavoritesCount: () => number;
}

/**
 * Obtiene la lista de IDs de recetas favoritas desde localStorage
 */
export const getFavorites = (): number[] => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    if (!favorites) {
      return [];
    }
    
    const parsed = JSON.parse(favorites);
    
    // Validar que sea un array de números
    if (Array.isArray(parsed) && parsed.every(id => typeof id === 'number')) {
      return parsed;
    }
    
    // Si los datos están corruptos, limpiar y retornar array vacío
    localStorage.removeItem(FAVORITES_KEY);
    return [];
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    // En caso de error, limpiar localStorage y retornar array vacío
    localStorage.removeItem(FAVORITES_KEY);
    return [];
  }
};

/**
 * Guarda la lista de favoritos en localStorage
 */
const saveFavorites = (favorites: number[]): boolean => {
  try {
    // Validar que sea un array de números únicos
    const uniqueFavorites = Array.from(new Set(favorites.filter(id => typeof id === 'number')));
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(uniqueFavorites));
    return true;
  } catch (error) {
    console.error('Error al guardar favoritos:', error);
    return false;
  }
};

/**
 * Agrega una receta a favoritos
 */
export const addFavorite = (recipeId: number): boolean => {
  try {
    if (typeof recipeId !== 'number' || recipeId <= 0) {
      console.error('ID de receta inválido:', recipeId);
      return false;
    }

    const currentFavorites = getFavorites();
    
    // Si ya está en favoritos, no hacer nada
    if (currentFavorites.includes(recipeId)) {
      return true;
    }
    
    const newFavorites = [...currentFavorites, recipeId];
    return saveFavorites(newFavorites);
  } catch (error) {
    console.error('Error al agregar favorito:', error);
    return false;
  }
};

/**
 * Remueve una receta de favoritos
 */
export const removeFavorite = (recipeId: number): boolean => {
  try {
    if (typeof recipeId !== 'number') {
      console.error('ID de receta inválido:', recipeId);
      return false;
    }

    const currentFavorites = getFavorites();
    const newFavorites = currentFavorites.filter(id => id !== recipeId);
    
    return saveFavorites(newFavorites);
  } catch (error) {
    console.error('Error al remover favorito:', error);
    return false;
  }
};

/**
 * Verifica si una receta está en favoritos
 */
export const isFavorite = (recipeId: number): boolean => {
  try {
    if (typeof recipeId !== 'number') {
      return false;
    }
    
    const favorites = getFavorites();
    return favorites.includes(recipeId);
  } catch (error) {
    console.error('Error al verificar favorito:', error);
    return false;
  }
};

/**
 * Limpia todos los favoritos
 */
export const clearFavorites = (): void => {
  try {
    localStorage.removeItem(FAVORITES_KEY);
  } catch (error) {
    console.error('Error al limpiar favoritos:', error);
  }
};

/**
 * Obtiene el número total de favoritos
 */
export const getFavoritesCount = (): number => {
  return getFavorites().length;
};

/**
 * Exporta todas las funciones como un objeto servicio
 */
const favoritesService: FavoritesService = {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  clearFavorites,
  getFavoritesCount,
};

export default favoritesService;