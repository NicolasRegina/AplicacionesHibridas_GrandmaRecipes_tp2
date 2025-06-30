import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../api/auth";
import EditProfileForm from "../components/EditProfileForm";

const Profile = () => {
  const { user, token, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (token) {
          const profileData = await getProfile(token);
          setProfile(profileData);
        }
      } catch (err) {
        setError("Error al cargar el perfil");
        console.error(err);
      }
    };

    fetchProfile();
  }, [token]);

  const handleEditSuccess = (updatedUser) => {
    setProfile(updatedUser);
    setIsEditing(false);
    setSuccess("Perfil actualizado exitosamente");
    // Limpiar mensaje de éxito después de 3 segundos
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  if (loading) return <div>Cargando...</div>;
  if (!user) return <div>Debes iniciar sesión para ver tu perfil</div>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>Mi Perfil</h2>
      
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      
      {profile && (
        <div style={{ 
          border: "1px solid #ddd", 
          borderRadius: "8px", 
          padding: "20px",
          backgroundColor: "#f9f9f9"
        }}>
          {/* Imagen de perfil */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <img 
              src={profile.profilePicture || "/img/default-profile.png"} 
              alt="Foto de perfil"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #ddd"
              }}
            />
          </div>

          {/* Información del usuario */}
          <div style={{ marginBottom: "15px" }}>
            <strong>Nombre:</strong> {profile.name}
          </div>
          
          <div style={{ marginBottom: "15px" }}>
            <strong>Email:</strong> {profile.email}
          </div>
          
          <div style={{ marginBottom: "15px" }}>
            <strong>Biografía:</strong> 
            <p style={{ marginTop: "5px", color: "#666" }}>
              {profile.bio || "Sin biografía"}
            </p>
          </div>
          
          <div style={{ marginBottom: "15px" }}>
            <strong>Miembro desde:</strong> {new Date(profile.createdAt).toLocaleDateString()}
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <strong>Grupos:</strong> {profile.groups?.length || 0} grupos
          </div>

          {/* Botón de editar */}
          <div style={{ textAlign: "center" }}>
            <button 
              onClick={() => setIsEditing(true)}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              Editar Perfil
            </button>
          </div>
        </div>
      )}

      {/* Modal/Vista de edición */}
      {isEditing && (
        <EditProfileForm
          profile={profile}
          token={token}
          onSuccess={handleEditSuccess}
          onCancel={handleEditCancel}
        />
      )}
    </div>
  );
};

export default Profile;
