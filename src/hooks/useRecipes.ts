import { useContext } from 'react';
import { RecipeContext } from '../context/RecipeContext';

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes debe ser usado dentro de un RecipeProvider');
  }
  return context;
};

export const useRecipeFilters = () => {
  const { recetas } = useRecipes();

  const filterByDifficulty = (difficulty: string): typeof recetas => {
    if (!difficulty || difficulty === '') {
      return recetas;
    }
    
    return recetas.filter(receta => 
      receta.dificultad.toLowerCase() === difficulty.toLowerCase()
    );
  };

  const getDifficultyLevels = (): string[] => {
    const difficulties = Array.from(new Set(recetas.map(receta => receta.dificultad)));
    return difficulties.sort((a, b) => {
      const order = { 'fácil': 1, 'medio': 2, 'difícil': 3 };
      return (order[a as keyof typeof order] || 4) - (order[b as keyof typeof order] || 4);
    });
  };

  const getRecipesByDifficulty = (difficulty: 'fácil' | 'medio' | 'difícil') => {
    return recetas.filter(receta => receta.dificultad === difficulty);
  };

  const getRecipeStats = () => {
    const total = recetas.length;
    const facil = recetas.filter(r => r.dificultad === 'fácil').length;
    const medio = recetas.filter(r => r.dificultad === 'medio').length;
    const dificil = recetas.filter(r => r.dificultad === 'difícil').length;

    return {
      total,
      facil,
      medio,
      dificil,
      porcentajes: {
        facil: total > 0 ? Math.round((facil / total) * 100) : 0,
        medio: total > 0 ? Math.round((medio / total) * 100) : 0,
        dificil: total > 0 ? Math.round((dificil / total) * 100) : 0,
      }
    };
  };

  return {
    filterByDifficulty,
    getDifficultyLevels,
    getRecipesByDifficulty,
    getRecipeStats,
    recetas
  };
};