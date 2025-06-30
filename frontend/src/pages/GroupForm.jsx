import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createGroup } from "../api/groups";

const GroupForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    isPrivate: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

    // Validaciones frontend según Joi/backend
    if (form.name.trim().length < 3 || form.name.trim().length > 50) {
      setError("El nombre debe tener entre 3 y 50 caracteres.");
      return;
    }
    if (form.description.trim().length < 10 || form.description.trim().length > 300) {
      setError("La descripción debe tener entre 10 y 300 caracteres.");
      return;
    }

    // Opcionalmente, no enviar campo image si está vacío (deja que backend ponga el default)
    const groupData = {
      name: form.name.trim(),
      description: form.description.trim(),
      isPrivate: form.isPrivate,
    };
    if (form.image.trim()) groupData.image = form.image.trim();

    try {
      await createGroup(groupData, token);
      setSuccess("Grupo creado exitosamente");
      setTimeout(() => navigate("/groups"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear el grupo");
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4 text-success">
                Crear Nuevo Grupo
              </h2>
              
              {error && (
                <div className="alert alert-danger text-center" role="alert">
                  ⚠️ {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success text-center" role="alert">
                  ✅ {success}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Nombre del Grupo
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="name"
                    placeholder="Ingresa el nombre del grupo"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-text">
                    Entre 3 y 50 caracteres
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Descripción
                  </label>
                  <textarea
                    className="form-control form-control-lg"
                    name="description"
                    rows="4"
                    placeholder="Describe el propósito del grupo"
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-text">
                    Entre 10 y 300 caracteres
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Imagen del Grupo (Opcional)
                  </label>
                  <input
                    type="url"
                    className="form-control form-control-lg"
                    name="image"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={form.image}
                    onChange={handleChange}
                  />
                  <div className="form-text">
                    URL de una imagen para representar el grupo
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="isPrivate"
                      id="isPrivate"
                      checked={form.isPrivate}
                      onChange={handleChange}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="isPrivate">
                      🔒 Grupo Privado
                    </label>
                    <div className="form-text">
                      Los grupos privados requieren invitación para unirse
                    </div>
                  </div>
                </div>
                
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-success btn-lg"
                  >
                    ✨ Crear Grupo
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/groups")}
                  >
                    ← Volver a Grupos
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupForm;