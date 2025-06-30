import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getGroupById, deleteGroup } from "../api/groups";

const GroupDetail = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const data = await getGroupById(id, token);
        setGroup(data);
      } catch (err) {
        setError("No se pudo cargar el grupo.");
      }
    };
    fetchGroup();
  }, [id, token]);

  const handleDelete = async () => {
    if (window.confirm("¿Seguro que deseas eliminar este grupo?")) {
      try {
        await deleteGroup(group._id, token);
        navigate("/groups");
      } catch (err) {
        setError("No tienes permiso para eliminar este grupo.");
      }
    }
  };

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger text-center" role="alert">
          ⚠️ {error}
        </div>
      </div>
    );
  }
  
  if (!group) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-muted">Cargando grupo...</p>
        </div>
      </div>
    );
  }

  // Verificar permisos
  const member = group.members.find((m) => m.user?._id === user._id);
  const isAdmin = member && member.role === "admin";
  const isCreator = group.creator?._id === user._id;

  return (
    <div className="container py-4">
      <div className="row">
        {/* Header con botón de volver */}
        <div className="col-12 mb-3">
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate("/groups")}
          >
            ← Volver a Grupos
          </button>
        </div>
        
        {/* Información principal del grupo */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0 mb-4">
            <div className="row g-0">
              {/* Imagen del grupo */}
              <div className="col-md-4">
                <div className="bg-success bg-opacity-10 h-100 d-flex align-items-center justify-content-center" style={{ minHeight: '250px' }}>
                  {group.image ? (
                    <img
                      src={group.image}
                      alt={group.name}
                      className="img-fluid rounded-start h-100 w-100"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="text-center">
                      <div style={{ fontSize: '4rem' }}>👥</div>
                      <small className="text-muted">Sin imagen</small>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Información del grupo */}
              <div className="col-md-8">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h1 className="card-title text-success mb-0">{group.name}</h1>
                    <div>
                      {isCreator && (
                        <span className="badge bg-warning text-dark me-2">
                          👑 Creador
                        </span>
                      )}
                      {isAdmin && !isCreator && (
                        <span className="badge bg-info me-2">
                          🛡️ Admin
                        </span>
                      )}
                      <span className={`badge ${group.isPrivate ? 'bg-secondary' : 'bg-success'}`}>
                        {group.isPrivate ? '🔒 Privado' : '🌐 Público'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">📝 Descripción</h6>
                    <p className="card-text">{group.description}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">👤 Creador</h6>
                    <p className="card-text">{group.creator?.name || 'Desconocido'}</p>
                  </div>
                  
                  <div className="mb-3">
                    <span className="badge bg-secondary">
                      👥 {group.members?.length || 0} miembros
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar con miembros y acciones */}
        <div className="col-12 col-lg-4">
          {/* Lista de miembros */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">👥 Miembros del Grupo</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {group.members.map((m) => (
                  <div key={m.user?._id || m.user} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <span className="fw-medium">{m.user?.name || 'Usuario desconocido'}</span>
                    </div>
                    <div>
                      <span className={`badge ${
                        m.role === 'admin' ? 'bg-warning text-dark' : 
                        m.role === 'creator' ? 'bg-primary' : 'bg-secondary'
                      }`}>
                        {m.role === 'admin' ? '🛡️ Admin' : 
                         m.role === 'creator' ? '👑 Creador' : '👤 Miembro'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Botones de acción */}
          {(isCreator || isAdmin) && (
            <div className="card shadow-sm border-0">
              <div className="card-header bg-light">
                <h5 className="mb-0">⚙️ Acciones</h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  {isAdmin && (
                    <button 
                      className="btn btn-warning"
                      onClick={() => navigate(`/groups/${group._id}/edit`)}
                    >
                      ✏️ Editar Grupo
                    </button>
                  )}
                  {isCreator && (
                    <button 
                      className="btn btn-danger"
                      onClick={handleDelete}
                    >
                      🗑️ Eliminar Grupo
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
