import React, { useState } from 'react';
import { useRecipes } from '../hooks/useRecipes';

interface SearchBarProps {
  onSearch: (results: any[]) => void;
  placeholder?: string;
  showDifficultyFilter?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "🔍 Buscar recetas...",
  showDifficultyFilter = true 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const { recetas } = useRecipes();

  // Obtener niveles de dificultad únicos
  const getDifficultyLevels = (): string[] => {
    const difficulties = Array.from(new Set(recetas.map(receta => receta.dificultad)));
    return difficulties.sort((a, b) => {
      const order = { 'fácil': 1, 'medio': 2, 'difícil': 3 };
      return (order[a as keyof typeof order] || 4) - (order[b as keyof typeof order] || 4);
    });
  };

  const handleSearch = (term: string, difficulty: string) => {
    let filteredRecetas = [...recetas];

    // Filtrar por término de búsqueda
    if (term.trim()) {
      filteredRecetas = filteredRecetas.filter(receta =>
        receta.nombre.toLowerCase().includes(term.toLowerCase()) ||
        receta.ingredientes.some(ingrediente =>
          ingrediente.toLowerCase().includes(term.toLowerCase())
        ) ||
        receta.categoria.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Filtrar por dificultad
    if (difficulty) {
      filteredRecetas = filteredRecetas.filter(receta => 
        receta.dificultad.toLowerCase() === difficulty.toLowerCase()
      );
    }

    onSearch(filteredRecetas);
  };

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    handleSearch(value, selectedDifficulty);
  };

  const handleDifficultyChange = (value: string) => {
    setSelectedDifficulty(value);
    handleSearch(searchTerm, value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDifficulty('');
    onSearch(recetas);
  };

  const getDifficultyEmoji = (difficulty: string) => {
    switch (difficulty) {
      case 'fácil': return '🟢';
      case 'medio': return '🟡';
      case 'difícil': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="search-bar">
      <div className="search-container">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearchTermChange(e.target.value)}
          className="search-input"
        />
      </div>
      
      {showDifficultyFilter && (
        <div className="filters-container">
          <select
            value={selectedDifficulty}
            onChange={(e) => handleDifficultyChange(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas las dificultades</option>
            {getDifficultyLevels().map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {getDifficultyEmoji(difficulty)} {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </option>
            ))}
          </select>
          
          {(searchTerm || selectedDifficulty) && (
            <button 
              onClick={clearFilters}
              className="clear-filters-btn"
            >
              Limpiar Filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;