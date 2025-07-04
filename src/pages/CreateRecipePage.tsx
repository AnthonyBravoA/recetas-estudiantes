import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import type { RecipeFormData, RecipeFormErrors } from '../types/Recipe';

const CreateRecipePage: React.FC = () => {
  const navigate = useNavigate();
  const { addReceta } = useRecipes();
  const nombreInputRef = useRef<HTMLInputElement>(null);

  
  const [formData, setFormData] = useState<RecipeFormData>({
    nombre: '',
    ingredientes: '',
    pasos: '',
    tiempo: 10,
    dificultad: 'fácil',
    categoria: '',
    porciones: 1
  });

  const [errors, setErrors] = useState<RecipeFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  React.useEffect(() => {
    if (nombreInputRef.current) {
      nombreInputRef.current.focus();
    }
  }, []);

  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tiempo' || name === 'porciones' ? Number(value) : value
    }));

    
    if (errors[name as keyof RecipeFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Función de validación
  const validateForm = (): boolean => {
    const newErrors: RecipeFormErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.ingredientes.trim()) {
      newErrors.ingredientes = 'Los ingredientes son obligatorios';
    }

    if (!formData.pasos.trim()) {
      newErrors.pasos = 'Los pasos son obligatorios';
    }

    if (!formData.categoria.trim()) {
      newErrors.categoria = 'La categoría es obligatoria';
    }

    if (formData.tiempo < 1) {
      newErrors.tiempo = 'El tiempo debe ser mayor a 0';
    }

    if (formData.porciones < 1) {
      newErrors.porciones = 'Las porciones deben ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      
      await new Promise(resolve => setTimeout(resolve, 1000));

    
      const nuevaReceta = {
        nombre: formData.nombre.trim(),
        imagen: '/placeholder-recipe.svg',
        ingredientes: formData.ingredientes
          .split('\n')
          .map(ing => ing.trim())
          .filter(ing => ing.length > 0),
        pasos: formData.pasos
          .split('\n')
          .map(paso => paso.trim())
          .filter(paso => paso.length > 0),
        tiempo: formData.tiempo,
        dificultad: formData.dificultad as 'fácil' | 'medio' | 'difícil',
        categoria: formData.categoria.trim().toLowerCase(),
        porciones: formData.porciones,
        valoracion: 4.0 
      };

      addReceta(nuevaReceta);
      
      
      alert('¡Receta creada exitosamente! 🎉');
      navigate('/recetas');
      
    } catch {
      alert('Error al crear la receta. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-recipe-page">
      <div className="page-header">
        <h1 className="page-title">➕ Crear Nueva Receta</h1>
        <p className="page-subtitle">
          Comparte tu receta favorita con otros estudiantes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-section">
          <h3 className="form-section-title">📝 Información Básica</h3>
          
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              Nombre de la receta *
            </label>
            <input
              ref={nombreInputRef}
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className={`form-input ${errors.nombre ? 'error' : ''}`}
              placeholder="ej. Pasta con salsa de tomate"
            />
            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tiempo" className="form-label">
                Tiempo (minutos) *
              </label>
              <input
                type="number"
                id="tiempo"
                name="tiempo"
                min="1"
                max="300"
                value={formData.tiempo}
                onChange={handleInputChange}
                className={`form-input ${errors.tiempo ? 'error' : ''}`}
              />
              {errors.tiempo && <span className="error-message">{errors.tiempo}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="porciones" className="form-label">
                Porciones *
              </label>
              <input
                type="number"
                id="porciones"
                name="porciones"
                min="1"
                max="20"
                value={formData.porciones}
                onChange={handleInputChange}
                className={`form-input ${errors.porciones ? 'error' : ''}`}
              />
              {errors.porciones && <span className="error-message">{errors.porciones}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dificultad" className="form-label">
                Dificultad *
              </label>
              <select
                id="dificultad"
                name="dificultad"
                value={formData.dificultad}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="fácil">🟢 Fácil</option>
                <option value="medio">🟡 Medio</option>
                <option value="difícil">🔴 Difícil</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="categoria" className="form-label">
                Categoría *
              </label>
              <input
                type="text"
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className={`form-input ${errors.categoria ? 'error' : ''}`}
                placeholder="ej. italiana, mexicana, saludable"
              />
              {errors.categoria && <span className="error-message">{errors.categoria}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">🛒 Ingredientes</h3>
          <div className="form-group">
            <label htmlFor="ingredientes" className="form-label">
              Lista de ingredientes (uno por línea) *
            </label>
            <textarea
              id="ingredientes"
              name="ingredientes"
              value={formData.ingredientes}
              onChange={handleInputChange}
              className={`form-textarea ${errors.ingredientes ? 'error' : ''}`}
              rows={6}
              placeholder="ej.&#10;200g pasta&#10;1 lata tomate triturado&#10;2 dientes de ajo&#10;Aceite de oliva"
            />
            {errors.ingredientes && <span className="error-message">{errors.ingredientes}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">👨‍🍳 Preparación</h3>
          <div className="form-group">
            <label htmlFor="pasos" className="form-label">
              Pasos de preparación (uno por línea) *
            </label>
            <textarea
              id="pasos"
              name="pasos"
              value={formData.pasos}
              onChange={handleInputChange}
              className={`form-textarea ${errors.pasos ? 'error' : ''}`}
              rows={8}
              placeholder="ej.&#10;Hervir agua con sal&#10;Cocinar la pasta según instrucciones&#10;En una sartén, calentar aceite&#10;Sofreír el ajo picado"
            />
            {errors.pasos && <span className="error-message">{errors.pasos}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/recetas')}
            className="form-button secondary"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="form-button primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? '⏳ Creando...' : '✅ Crear Receta'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipePage;