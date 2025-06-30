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

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!group) return <p>Cargando...</p>;

  return (
    <div>
      <h2>{group.name}</h2>
      <img
        src={group.image || "/img/default-group.jpg"}
        alt={group.name}
        style={{ maxWidth: "300px" }}
      />
      <p>
        <b>Descripción:</b> {group.description}
      </p>
      <p>
        <b>Privacidad:</b> {group.isPrivate ? "Privado" : "Público"}
      </p>
      <p>
        <b>Creador:</b> {group.creator?.name}
      </p>
      <h4>Miembros</h4>
      <ul>
        {group.members.map((m) => (
          <li key={m.user?._id || m.user}>
            {m.user?.name} ({m.role})
          </li>
        ))}
      </ul>
      {user && group.creator?._id === user._id && (
        <>
          <button onClick={() => navigate(`/groups/${group._id}/edit`)}>
            Editar
          </button>
          <button onClick={handleDelete}>Eliminar</button>
        </>
      )}
      <button onClick={() => navigate("/groups")}>Volver</button>
    </div>
  );
};

export default GroupDetail;
