/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Recipe } from '../types/Recipe';
import recetasData from '../data/recetas.json';
import favoritesService from '../services/favoritesService';

interface RecipeContextType {
  recetas: Recipe[];
  favoritos: number[];
  addToFavoritos: (id: number) => void;
  removeFromFavoritos: (id: number) => void;
  isFavorito: (id: number) => boolean;
  addReceta: (receta: Omit<Recipe, 'id'>) => void;
  clearAllFavoritos: () => void;
  getFavoritosCount: () => number;
  filterByDifficulty: (difficulty: 'fácil' | 'medio' | 'difícil' | '') => Recipe[];
}

export const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

interface RecipeProviderProps {
  children: ReactNode;
}

export const RecipeProvider: React.FC<RecipeProviderProps> = ({ children }) => {
  const [recetas, setRecetas] = useState<Recipe[]>(recetasData.recetas as Recipe[]);
  const [favoritos, setFavoritos] = useState<number[]>([]);

  // useEffect para cargar favoritos del localStorage usando el servicio
  useEffect(() => {
    const favoritosGuardados = favoritesService.getFavorites();
    setFavoritos(favoritosGuardados);
  }, []);

  // useEffect para sincronizar favoritos con localStorage cuando cambien
  useEffect(() => {
    // No necesitamos guardar aquí porque el servicio ya lo hace
    // Este efecto se mantiene para posibles futuras funcionalidades
  }, [favoritos]);

  const addToFavoritos = (id: number) => {
    const success = favoritesService.addFavorite(id);
    if (success) {
      setFavoritos(prev => {
        if (!prev.includes(id)) {
          return [...prev, id];
        }
        return prev;
      });
    }
  };

  const removeFromFavoritos = (id: number) => {
    const success = favoritesService.removeFavorite(id);
    if (success) {
      setFavoritos(prev => prev.filter(favId => favId !== id));
    }
  };

  const isFavorito = (id: number) => {
    return favoritesService.isFavorite(id);
  };

  const clearAllFavoritos = () => {
    favoritesService.clearFavorites();
    setFavoritos([]);
  };

  const getFavoritosCount = () => {
    return favoritesService.getFavoritesCount();
  };

  const filterByDifficulty = (difficulty: 'fácil' | 'medio' | 'difícil' | '') => {
    if (!difficulty) {
      return recetas;
    }
    return recetas.filter(receta => receta.dificultad === difficulty);
  };

  const addReceta = (nuevaReceta: Omit<Recipe, 'id'>) => {
    const newId = Math.max(...recetas.map(r => r.id)) + 1;
    const receta: Recipe = {
      ...nuevaReceta,
      id: newId
    };
    setRecetas(prev => [...prev, receta]);
  };

  const value = {
    recetas,
    favoritos,
    addToFavoritos,
    removeFromFavoritos,
    isFavorito,
    addReceta,
    clearAllFavoritos,
    getFavoritosCount,
    filterByDifficulty,
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
};