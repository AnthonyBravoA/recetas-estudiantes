
const FAVORITES_KEY = 'recetas-favoritas';

export interface FavoritesService {
  getFavorites: () => number[];
  addFavorite: (recipeId: number) => boolean;
  removeFavorite: (recipeId: number) => boolean;
  isFavorite: (recipeId: number) => boolean;
  clearFavorites: () => void;
  getFavoritesCount: () => number;
}

export const getFavorites = (): number[] => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    if (!favorites) {
      return [];
    }
    
    const parsed = JSON.parse(favorites);
    
    if (Array.isArray(parsed) && parsed.every(id => typeof id === 'number')) {
      return parsed;
    }

    localStorage.removeItem(FAVORITES_KEY);
    return [];
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    // En caso de error, limpiar localStorage y retornar array vacío
    localStorage.removeItem(FAVORITES_KEY);
    return [];
  }
};

 
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

export const clearFavorites = (): void => {
  try {
    localStorage.removeItem(FAVORITES_KEY);
  } catch (error) {
    console.error('Error al limpiar favoritos:', error);
  }
};

export const getFavoritesCount = (): number => {
  return getFavorites().length;
};


const favoritesService: FavoritesService = {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  clearFavorites,
  getFavoritesCount,
};

export default favoritesService;