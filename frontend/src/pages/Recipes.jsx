import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getRecipes, deleteRecipe } from "../api/recipes";
import { useNavigate } from "react-router-dom";

const Recipes = () => {
  const { token } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const data = await getRecipes(token);
      setRecipes(data.recipes || data); // según tu API, ajusta esto si es necesario
    } catch (error) {
      alert("Error al cargar recetas");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas borrar la receta?")) {
      try {
        await deleteRecipe(id, token);
        fetchRecipes();
      } catch {
        alert("Error al borrar receta");
      }
    }
  };

  return (
    <div>
      <h2>Recetas</h2>
      <button onClick={() => navigate("/recipes/new")}>
        Crear Nueva Receta
      </button>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul>
          {recipes.map((receta) => (
            <li key={receta._id}>
              <b>{receta.title}</b> - {receta.category}
              <button onClick={() => navigate(`/recipes/${receta._id}/edit`)}>
                Editar
              </button>
              <button onClick={() => handleDelete(receta._id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Recipes;
