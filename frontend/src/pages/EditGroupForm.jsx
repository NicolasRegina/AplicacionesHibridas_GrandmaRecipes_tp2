import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getGroupById, updateGroup } from "../api/groups";

const EditGroupForm = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    isPrivate: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const data = await getGroupById(id, token);
        setForm({
          name: data.name || "",
          description: data.description || "",
          image: data.image || "",
          isPrivate: data.isPrivate ?? true,
        });
      } catch (err) {
        setError("No se pudo cargar el grupo.");
      }
      setLoading(false);
    };
    fetchGroup();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.name.trim().length < 3 || form.name.trim().length > 50) {
      setError("El nombre debe tener entre 3 y 50 caracteres.");
      return;
    }
    if (
      form.description.trim().length < 10 ||
      form.description.trim().length > 300
    ) {
      setError("La descripción debe tener entre 10 y 300 caracteres.");
      return;
    }

    const groupData = {
      name: form.name.trim(),
      description: form.description.trim(),
      isPrivate: form.isPrivate,
    };
    if (form.image.trim()) groupData.image = form.image.trim();

    try {
      await updateGroup(id, groupData, token);
      setSuccess("Grupo actualizado exitosamente");
      setTimeout(() => navigate("/groups"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar el grupo");
    }
  };

  if (loading) return <p>Cargando datos del grupo...</p>;

  return (
    <div>
      <h2>Editar Grupo</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Nombre del grupo"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br />
        <textarea
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="image"
          placeholder="URL de imagen (opcional)"
          value={form.image}
          onChange={handleChange}
        />
        <br />
        <label>
          Privado
          <input
            type="checkbox"
            name="isPrivate"
            checked={form.isPrivate}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Actualizar Grupo</button>
      </form>
    </div>
  );
};

export default EditGroupForm;
