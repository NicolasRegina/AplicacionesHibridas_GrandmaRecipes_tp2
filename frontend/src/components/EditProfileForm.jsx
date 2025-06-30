import { useState } from "react";
import { updateProfile } from "../api/auth";

const EditProfileForm = ({ profile, token, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    name: profile.name || "",
    bio: profile.bio || "",
    profilePicture: profile.profilePicture || ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const updatedUser = await updateProfile(form, token);
      onSuccess(updatedUser.user); // El backend devuelve { message, user }
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "8px",
        width: "90%",
        maxWidth: "500px",
        maxHeight: "80vh",
        overflow: "auto"
      }}>
        <h3 style={{ marginBottom: "20px" }}>Editar Perfil</h3>
        
        {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Nombre:
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={50}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px"
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Biografía:
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              maxLength={200}
              rows={4}
              placeholder="Cuéntanos algo sobre ti..."
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                resize: "vertical"
              }}
            />
            <small style={{ color: "#666" }}>
              {form.bio.length}/200 caracteres
            </small>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              URL de Foto de Perfil:
            </label>
            <input
              type="url"
              name="profilePicture"
              value={form.profilePicture}
              onChange={handleChange}
              placeholder="https://ejemplo.com/mi-foto.jpg"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px"
              }}
            />
            {form.profilePicture && (
              <div style={{ marginTop: "10px", textAlign: "center" }}>
                <img 
                  src={form.profilePicture} 
                  alt="Vista previa"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #ddd"
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button 
              type="button"
              onClick={onCancel}
              disabled={loading}
              style={{
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "14px"
              }}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? "#ccc" : "#28a745",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "14px"
              }}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;
