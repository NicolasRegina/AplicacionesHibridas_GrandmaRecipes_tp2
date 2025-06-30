import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getRecipes, searchRecipes, deleteRecipe } from "../api/recipes";
import { useNavigate } from "react-router-dom";
import RecipeSearchBar from "../components/RecipeSearchBar";

const Recipes = () => {
  const { token, user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const data = await getRecipes(token);
      // El backend devuelve {recipes, totalPages, currentPage, totalRecipes}
      const recipesArray = data.recipes || data;
      setRecipes(Array.isArray(recipesArray) ? recipesArray : []);
      setError("");
    } catch (err) {
      console.error("Error al cargar recetas:", err);
      setError("No se pudieron cargar las recetas.");
      setRecipes([]);
    }
    setLoading(false);
  };

  const handleSearch = async (params) => {
    setLoading(true);
    try {
      if (!params.q && !params.category && !params.difficulty) {
        fetchRecipes();
        return;
      }
      const data = await searchRecipes(params, token);
      // Para la búsqueda, el backend devuelve directamente el array
      setRecipes(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Error en búsqueda:", err);
      setError("No se pudo realizar la búsqueda.");
      setRecipes([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipes();
    // eslint-disable-next-line
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
      <button onClick={() => navigate("/recipes/new")}>Crear receta</button>
      <RecipeSearchBar onSearch={handleSearch} />
      {error && <p style={{color:"red"}}>{error}</p>}
      {loading && <p>Cargando...</p>}
      <ul>
        {Array.isArray(recipes) && recipes.map((receta) => (
          <li key={receta._id}>
            <b>{receta.title}</b> - {receta.category}
            <button onClick={() => navigate(`/recipes/${receta._id}`)}>Ver detalle</button>
            {user && receta.author?._id === user._id && (
              <>
                <button onClick={() => navigate(`/recipes/${receta._id}/edit`)}>Editar</button>
                <button onClick={() => handleDelete(receta._id)}>Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recipes;