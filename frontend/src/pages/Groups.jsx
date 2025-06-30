import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getGroups, deleteGroup } from "../api/groups";
import { useNavigate } from "react-router-dom";

const Groups = () => {
  const { token, user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await getGroups(token);
      setGroups(data); // tu endpoint devuelve un array
    } catch (error) {
      alert("Error al cargar grupos");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas borrar el grupo?")) {
      try {
        await deleteGroup(id, token);
        fetchGroups();
      } catch {
        alert("Error al borrar grupo");
      }
    }
  };

  return (
    <div className="container py-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="display-5 fw-bold text-dark mb-0">
              Mis Grupos
            </h1>
            <button 
              className="btn btn-success btn-lg"
              onClick={() => navigate("/groups/new")}
            >
              ➕ Nuevo Grupo
            </button>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2 text-muted">Cargando grupos...</p>
            </div>
          )}
        </div>
      </div>

      {/* Groups Grid */}
      {!loading && (
        <div className="row">
          {groups.length > 0 ? (
            groups.map((grupo) => {
              // Buscá el member actual (puede ser null si no es miembro)
              const member = grupo.members.find((m) => m.user?._id === user._id);
              const isAdmin = member && member.role === "admin";
              const isCreator = grupo.creator?._id === user._id;

              return (
                <div key={grupo._id} className="col-12 col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 shadow-sm border-0">
                    {/* Group Image/Icon */}
                    <div className="card-img-top bg-success bg-opacity-10 d-flex align-items-center justify-content-center" style={{ height: '150px' }}>
                      {grupo.image ? (
                        <img 
                          src={grupo.image} 
                          alt={grupo.name}
                          className="img-fluid rounded-top"
                          style={{ maxHeight: '150px', objectFit: 'cover', width: '100%' }}
                        />
                      ) : (
                        <div className="text-center">
                          <i className="text-success mb-2" style={{ fontSize: '3rem' }}></i>
                        </div>
                      )}
                    </div>
                    
                    {/* Card Body */}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-bold text-success mb-2">{grupo.name}</h5>
                      
                      {/* Group Info */}
                      <div className="mb-3">
                        <span className="badge bg-secondary me-2">
                          👤 {grupo.members?.length || 0} miembros
                        </span>
                        {isCreator && (
                          <span className="badge bg-warning text-dark">
                            👑 Creador
                          </span>
                        )}
                        {isAdmin && !isCreator && (
                          <span className="badge bg-info">
                            🛡️ Admin
                          </span>
                        )}
                      </div>
                      
                      {grupo.description && (
                        <p className="card-text text-muted small mb-3" style={{ flexGrow: 1 }}>
                          {grupo.description.length > 100 
                            ? `${grupo.description.substring(0, 100)}...` 
                            : grupo.description
                          }
                        </p>
                      )}
                      
                      {/* Creator Info */}
                      <div className="mb-3">
                        <small className="text-muted">
                          👤 Creado por: {grupo.creator?.name || 'Anónimo'}
                        </small>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="mt-auto">
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-outline-success flex-fill"
                            onClick={() => navigate(`/groups/${grupo._id}`)}
                          >
                            Ver Detalle
                          </button>
                          
                          {(isAdmin || isCreator) && (
                            <button 
                              className="btn btn-warning btn-sm"
                              onClick={() => navigate(`/groups/${grupo._id}/edit`)}
                              title="Editar grupo"
                            >
                              ✏️
                            </button>
                          )}
                          
                          {isCreator && (
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(grupo._id)}
                              title="Eliminar grupo"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12">
              <div className="text-center py-5">
                👥
                <h3 className="text-muted mb-3">No hay grupos disponibles</h3>
                <p className="text-muted mb-4">
                  Crea tu primer grupo para comenzar a compartir recetas con familiares y amigos.
                </p>
                <button 
                  className="btn btn-success btn-lg"
                  onClick={() => navigate("/groups/new")}
                >
                  ➕ Crear Primer Grupo
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Groups;
