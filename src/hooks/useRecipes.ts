import { useContext } from 'react';
import { RecipeContext } from '../context/RecipeContext';

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes debe ser usado dentro de un RecipeProvider');
  }
  return context;
};