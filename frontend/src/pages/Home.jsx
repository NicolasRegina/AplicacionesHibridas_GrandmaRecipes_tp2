import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Bienvenido a Grandma Recipes</h1>
      <p>Comparte y gestiona recetas familiares y de amigos.</p>
      <div style={{ marginTop: "2rem" }}>
        <button
          style={{ fontSize: "1.5rem", margin: "1rem", padding: "1rem 2rem" }}
          onClick={() => navigate("/recipes")}
        >
          Recetas
        </button>
        <button
          style={{ fontSize: "1.5rem", margin: "1rem", padding: "1rem 2rem" }}
          onClick={() => navigate("/groups")}
        >
          Grupos
        </button>
      </div>
    </div>
  );
};

export default Home;
