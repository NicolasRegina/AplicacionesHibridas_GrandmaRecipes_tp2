import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

const ModerationRecipes = () => {
  const [pendingRecipes, setPendingRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({})

  // Obtener recetas pendientes
  const fetchPendingRecipes = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/recipes/moderation/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPendingRecipes(data)
      } else {
        toast.error('Error al cargar recetas pendientes')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  // Aprobar receta
  const handleApprove = async (recipeId) => {
    setActionLoading(prev => ({ ...prev, [recipeId]: true }))
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/recipes/moderation/${recipeId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Receta aprobada exitosamente')
        setPendingRecipes(prev => prev.filter(recipe => recipe._id !== recipeId))
      } else {
        const error = await response.json()
        toast.error(error.message || 'Error al aprobar receta')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error de conexión')
    } finally {
      setActionLoading(prev => ({ ...prev, [recipeId]: false }))
    }
  }

  // Rechazar receta
  const handleReject = async (recipeId, rejectionReason) => {
    setActionLoading(prev => ({ ...prev, [recipeId]: true }))
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/recipes/moderation/${recipeId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rejectionReason })
      })

      if (response.ok) {
        toast.success('Receta rechazada')
        setPendingRecipes(prev => prev.filter(recipe => recipe._id !== recipeId))
      } else {
        const error = await response.json()
        toast.error(error.message || 'Error al rechazar receta')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error de conexión')
    } finally {
      setActionLoading(prev => ({ ...prev, [recipeId]: false }))
    }
  }

  // Manejar rechazo con razón
  const handleRejectWithReason = (recipeId) => {
    const reason = prompt('Ingrese la razón del rechazo (opcional):')
    if (reason !== null) { // Usuario no canceló
      handleReject(recipeId, reason)
    }
  }

  useEffect(() => {
    fetchPendingRecipes()
  }, [])

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>🔍 Moderación de Recetas</h2>
            <span className="badge bg-warning text-dark fs-6">
              {pendingRecipes.length} pendientes
            </span>
          </div>

          {pendingRecipes.length === 0 ? (
            <div className="card shadow-sm border-0">
              <div className="card-body text-center py-5">
                <div style={{ fontSize: '3rem' }}>✅</div>
                <h5 className="text-muted mb-3">No hay recetas pendientes</h5>
                <p className="text-muted">Todas las recetas han sido revisadas.</p>
              </div>
            </div>
          ) : (
            <div className="row">
              {pendingRecipes.map((recipe) => (
                <div key={recipe._id} className="col-12 col-lg-6 mb-4">
                  <div className="card shadow-sm border-0 h-100">
                    {/* Header de la receta */}
                    <div className="card-header bg-warning bg-opacity-25">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 fw-bold">⏳ Pendiente de Revisión</h6>
                        <small className="text-muted">
                          {new Date(recipe.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </div>

                    {/* Imagen de la receta */}
                    <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                      {recipe.image ? (
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="img-fluid rounded-top w-100 h-100"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="text-center text-muted">
                          <div style={{ fontSize: '3rem' }}>🍽️</div>
                          <small>Sin imagen</small>
                        </div>
                      )}
                    </div>

                    {/* Información de la receta */}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-success">{recipe.title}</h5>
                      
                      <p className="card-text text-muted mb-3">
                        {recipe.description.length > 150 
                          ? `${recipe.description.substring(0, 150)}...` 
                          : recipe.description
                        }
                      </p>

                      <div className="mb-2">
                        <small className="text-muted">
                          👤 <strong>Autor:</strong> {recipe.author?.name || 'Desconocido'}
                        </small>
                      </div>

                      <div className="mb-2">
                        <small className="text-muted">
                          📂 <strong>Categoría:</strong> {recipe.category}
                        </small>
                      </div>

                      <div className="mb-2">
                        <small className="text-muted">
                          ⚡ <strong>Dificultad:</strong> {recipe.difficulty}
                        </small>
                      </div>

                      <div className="mb-2">
                        <small className="text-muted">
                          ⏱️ <strong>Tiempo:</strong> {recipe.prepTime + recipe.cookTime} min
                        </small>
                      </div>

                      <div className="mb-2">
                        <small className="text-muted">
                          🍽️ <strong>Porciones:</strong> {recipe.servings}
                        </small>
                      </div>

                      {recipe.group && (
                        <div className="mb-2">
                          <small className="text-muted">
                            👥 <strong>Grupo:</strong> {recipe.group.name}
                          </small>
                        </div>
                      )}

                      <div className="mb-3">
                        <small className="text-muted">
                          🔒 <strong>Tipo:</strong> {recipe.isPrivate ? 'Privada' : 'Pública'}
                        </small>
                      </div>

                      {/* Botones de acción */}
                      <div className="mt-auto">
                        <div className="d-grid gap-2">
                          <button
                            className="btn btn-success"
                            onClick={() => handleApprove(recipe._id)}
                            disabled={actionLoading[recipe._id]}
                          >
                            {actionLoading[recipe._id] ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Procesando...
                              </>
                            ) : (
                              <>✅ Aprobar Receta</>
                            )}
                          </button>
                          
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleRejectWithReason(recipe._id)}
                            disabled={actionLoading[recipe._id]}
                          >
                            ❌ Rechazar Receta
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModerationRecipes
