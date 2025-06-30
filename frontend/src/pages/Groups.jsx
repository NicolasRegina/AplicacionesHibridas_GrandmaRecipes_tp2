import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getGroups, deleteGroup } from "../api/groups";
import { useNavigate } from "react-router-dom";

const Groups = () => {
  const { token } = useAuth();
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
    <div>
      <h2>Grupos</h2>
      <button onClick={() => navigate("/groups/new")}>Crear Nuevo Grupo</button>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul>
          {groups.map((grupo) => (
            <li key={grupo._id}>
              <b>{grupo.name}</b> - {grupo.description}
              <button onClick={() => navigate(`/groups/${grupo._id}/edit`)}>
                Editar
              </button>
              <button onClick={() => handleDelete(grupo._id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Groups;
