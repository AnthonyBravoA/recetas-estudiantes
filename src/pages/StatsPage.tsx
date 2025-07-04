import React from 'react';
import { Link } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';

const StatsPage: React.FC = () => {
  const { recetas, favoritos } = useRecipes();


  const totalRecetas = recetas.length;
  const tiempoPromedio = Math.round(recetas.reduce((acc, r) => acc + r.tiempo, 0) / recetas.length);
  const valoracionPromedio = (recetas.reduce((acc, r) => acc + r.valoracion, 0) / recetas.length).toFixed(1);

  
  const recetasPorCategoria = recetas.reduce((acc, receta) => {
    acc[receta.categoria] = (acc[receta.categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoriasSorted = Object.entries(recetasPorCategoria)
    .sort(([,a], [,b]) => b - a);

  
  const recetasPorDificultad = recetas.reduce((acc, receta) => {
    acc[receta.dificultad] = (acc[receta.dificultad] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  
  const recetaMasPopular = recetas.reduce((max, receta) => 
    receta.valoracion > max.valoracion ? receta : max
  );

  
  const recetaMasRapida = recetas.reduce((min, receta) => 
    receta.tiempo < min.tiempo ? receta : min
  );

  
  const categoriaMasPopular = categoriasSorted[0];

  const getDifficultyEmoji = (difficulty: string) => {
    switch (difficulty) {
      case 'fácil': return '🟢';
      case 'medio': return '🟡';
      case 'difícil': return '🔴';
      default: return '⚪';
    }
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      'italiana': '🇮🇹',
      'mexicana': '🇲🇽',
      'asiática': '🥢',
      'americana': '🇺🇸',
      'saludable': '🥗',
      'postres': '🍰',
      'vegetariana': '🌱',
      'vegana': '🌿'
    };
    return emojis[category] || '🍽️';
  };

  return (
    <div className="stats-page">
      <div className="page-header">
        <h1 className="page-title">📊 Estadísticas de Recetas</h1>
        <p className="page-subtitle">
          Análisis completo de nuestra colección de recetas
        </p>
      </div>

      <section className="stats-section">
        <h2 className="section-title">📈 Resumen General</h2>
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">{totalRecetas}</span>
            <span className="stat-label">Total de Recetas</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{favoritos.length}</span>
            <span className="stat-label">Recetas Favoritas</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{tiempoPromedio}</span>
            <span className="stat-label">Min Promedio</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{valoracionPromedio}</span>
            <span className="stat-label">⭐ Valoración Promedio</span>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <h2 className="section-title">🍽️ Recetas por Categoría</h2>
        <div className="category-stats">
          {categoriasSorted.map(([categoria, cantidad]) => {
            const porcentaje = Math.round((cantidad / totalRecetas) * 100);
            return (
              <div key={categoria} className="category-stat-item">
                <div className="category-header">
                  <span className="category-name">
                    {getCategoryEmoji(categoria)} {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                  </span>
                  <span className="category-count">{cantidad} recetas ({porcentaje}%)</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${porcentaje}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="stats-section">
        <h2 className="section-title">⚡ Recetas por Dificultad</h2>
        <div className="stats-container">
          {Object.entries(recetasPorDificultad).map(([dificultad, cantidad]) => {
            const porcentaje = Math.round((cantidad / totalRecetas) * 100);
            return (
              <div key={dificultad} className="stat-item">
                <span className="stat-number">{cantidad}</span>
                <span className="stat-label">
                  {getDifficultyEmoji(dificultad)} {dificultad.charAt(0).toUpperCase() + dificultad.slice(1)} ({porcentaje}%)
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="stats-section">
        <h2 className="section-title">🏆 Recetas Destacadas</h2>
        <div className="highlighted-recipes">
          <div className="highlight-card">
            <h3>⭐ Receta Más Popular</h3>
            <div className="recipe-highlight">
              <h4>{recetaMasPopular.nombre}</h4>
              <p>Valoración: {recetaMasPopular.valoracion}/5 ⭐</p>
              <p>Categoría: {getCategoryEmoji(recetaMasPopular.categoria)} {recetaMasPopular.categoria}</p>
              <Link to={`/receta/${recetaMasPopular.id}`} className="cta-button primary">
                Ver Receta
              </Link>
            </div>
          </div>

          <div className="highlight-card">
            <h3>⚡ Receta Más Rápida</h3>
            <div className="recipe-highlight">
              <h4>{recetaMasRapida.nombre}</h4>
              <p>Tiempo: {recetaMasRapida.tiempo} minutos ⏱️</p>
              <p>Dificultad: {getDifficultyEmoji(recetaMasRapida.dificultad)} {recetaMasRapida.dificultad}</p>
              <Link to={`/receta/${recetaMasRapida.id}`} className="cta-button primary">
                Ver Receta
              </Link>
            </div>
          </div>

          <div className="highlight-card">
            <h3>🔥 Categoría Más Popular</h3>
            <div className="recipe-highlight">
              <h4>{getCategoryEmoji(categoriaMasPopular[0])} {categoriaMasPopular[0].charAt(0).toUpperCase() + categoriaMasPopular[0].slice(1)}</h4>
              <p>{categoriaMasPopular[1]} recetas</p>
              <p>{Math.round((categoriaMasPopular[1] / totalRecetas) * 100)}% del total</p>
              <Link to="/recetas" className="cta-button primary">
                Explorar Categoría
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Acciones */}
      <section className="stats-actions">
        <div className="hero-buttons">
          <Link to="/recetas" className="cta-button primary">
            Ver Todas las Recetas
          </Link>
          <Link to="/crear" className="cta-button secondary">
            Crear Nueva Receta
          </Link>
          <Link to="/favoritas" className="cta-button secondary">
            Ver Mis Favoritas
          </Link>
        </div>
      </section>
    </div>
  );
};

export default StatsPage;