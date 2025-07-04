import React, { useState } from 'react';
import { useRecipeFilters } from '../hooks/useRecipes';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import type { Recipe } from '../types/Recipe';

const DemoFilterPage: React.FC = () => {
  const { getRecipeStats, getRecipesByDifficulty } = useRecipeFilters();
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const stats = getRecipeStats();

  const handleSearchResults = (results: Recipe[]) => {
    setFilteredRecipes(results);
    setShowResults(true);
  };

  const showRecipesByDifficulty = (difficulty: 'fácil' | 'medio' | 'difícil') => {
    const recipes = getRecipesByDifficulty(difficulty);
    setFilteredRecipes(recipes);
    setShowResults(true);
  };

  return (
    <div className="demo-filter-page">
      <div className="page-header">
        <h1 className="page-title">🔍 Demo de Filtros</h1>
        <p className="page-subtitle">
          Prueba las nuevas funcionalidades de búsqueda y filtrado
        </p>
      </div>

      {/* Estadísticas de recetas */}
      <div className="stats-section">
        <h2 className="section-title">📊 Estadísticas de Recetas</h2>
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total Recetas</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.facil}</span>
            <span className="stat-label">🟢 Fáciles ({stats.porcentajes.facil}%)</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.medio}</span>
            <span className="stat-label">🟡 Medias ({stats.porcentajes.medio}%)</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.dificil}</span>
            <span className="stat-label">🔴 Difíciles ({stats.porcentajes.dificil}%)</span>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <SearchBar 
        onSearch={handleSearchResults}
        placeholder="🔍 Buscar por nombre, ingredientes o categoría..."
      />

      {/* Botones de filtro rápido */}
      <div className="quick-filters">
        <h3 className="section-title">⚡ Filtros Rápidos por Dificultad</h3>
        <div className="filters-container">
          <button 
            onClick={() => showRecipesByDifficulty('fácil')}
            className="cta-button primary"
          >
            🟢 Ver Recetas Fáciles ({stats.facil})
          </button>
          <button 
            onClick={() => showRecipesByDifficulty('medio')}
            className="cta-button primary"
          >
            🟡 Ver Recetas Medias ({stats.medio})
          </button>
          <button 
            onClick={() => showRecipesByDifficulty('difícil')}
            className="cta-button primary"
          >
            🔴 Ver Recetas Difíciles ({stats.dificil})
          </button>
        </div>
      </div>

      {/* Resultados */}
      {showResults && (
        <div className="results-section">
          <div className="results-info">
            <h3 className="section-title">
              📋 Resultados ({filteredRecipes.length} recetas)
            </h3>
          </div>
          
          {filteredRecipes.length === 0 ? (
            <div className="no-results">
              <h3>😔 No se encontraron recetas</h3>
              <p>Intenta cambiar los términos de búsqueda o filtros</p>
            </div>
          ) : (
            <div className="recipes-grid">
              {filteredRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DemoFilterPage;