import React, { useState, useEffect } from 'react';
import { useRecipes } from '../hooks/useRecipes';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import type { Recipe } from '../types/Recipe';

const DemoFilterPage: React.FC = () => {
  const { recetas } = useRecipes();
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Inicializar con todas las recetas
  useEffect(() => {
    setFilteredRecipes(recetas);
    setShowResults(true);
  }, [recetas]);

  // Calcular estadísticas
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

  const stats = getRecipeStats();

  const handleSearchResults = (results: Recipe[]) => {
    setFilteredRecipes(results);
    setShowResults(true);
  };

  const showRecipesByDifficulty = (difficulty: 'fácil' | 'medio' | 'difícil') => {
    const recipes = recetas.filter(receta => receta.dificultad === difficulty);
    setFilteredRecipes(recipes);
    setShowResults(true);
  };

  const showAllRecipes = () => {
    setFilteredRecipes(recetas);
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
        <div className="hero-buttons">
          <button 
            onClick={() => showAllRecipes()}
            className="cta-button secondary"
          >
            📋 Ver Todas ({stats.total})
          </button>
          <button 
            onClick={() => showRecipesByDifficulty('fácil')}
            className="cta-button primary"
          >
            🟢 Ver Fáciles ({stats.facil})
          </button>
          <button 
            onClick={() => showRecipesByDifficulty('medio')}
            className="cta-button primary"
          >
            🟡 Ver Medias ({stats.medio})
          </button>
          <button 
            onClick={() => showRecipesByDifficulty('difícil')}
            className="cta-button primary"
          >
            🔴 Ver Difíciles ({stats.dificil})
          </button>
        </div>
      </div>

      {/* Resultados */}
      {showResults && (
        <div className="results-section">
          <div className="results-info">
            <h3 className="section-title">
              📋 Resultados ({filteredRecipes.length} recetas encontradas)
            </h3>
          </div>
          
          {filteredRecipes.length === 0 ? (
            <div className="no-results">
              <div className="empty-icon">😔</div>
              <h3>No se encontraron recetas</h3>
              <p>Intenta cambiar los términos de búsqueda o filtros</p>
              <button 
                onClick={showAllRecipes}
                className="cta-button primary"
              >
                Ver Todas las Recetas
              </button>
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