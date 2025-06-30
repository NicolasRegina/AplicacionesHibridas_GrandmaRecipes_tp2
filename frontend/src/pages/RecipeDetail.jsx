import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRecipeById, deleteRecipe } from "../api/recipes";

const RecipeDetail = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id, token);
        setRecipe(data);
      } catch (err) {
        setError("No se pudo cargar la receta.");
      }
    };
    fetchRecipe();
  }, [id, token]);

  const handleDelete = async () => {
    if (window.confirm("¿Seguro que deseas eliminar esta receta?")) {
      try {
        await deleteRecipe(recipe._id, token);
        navigate("/recipes");
      } catch (err) {
        setError("No tienes permiso para eliminar esta receta.");
      }
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!recipe) return <p>Cargando...</p>;

  return (
    <div>
      <h2>{recipe.title}</h2>
      <img
        src={recipe.image || "/img/default-recipe.jpg"}
        alt={recipe.title}
        style={{ maxWidth: "300px" }}
      />
      <p>
        <b>Descripción:</b> {recipe.description}
      </p>
      <p>
        <b>Autor:</b> {recipe.author?.name}
      </p>
      <p>
        <b>Categoría:</b> {recipe.category}
      </p>
      <p>
        <b>Dificultad:</b> {recipe.difficulty}
      </p>
      <p>
        <b>Porciones:</b> {recipe.servings}
      </p>
      <p>
        <b>Tiempo de preparación:</b> {recipe.prepTime} min
      </p>
      <p>
        <b>Tiempo de cocción:</b> {recipe.cookTime} min
      </p>
      <p>
        <b>Grupo:</b> {recipe.group?.name || "Sin grupo"}
      </p>
      <p>
        <b>Privacidad:</b> {recipe.isPrivate ? "Privada" : "Pública"}
      </p>
      <p>
        <b>Tags:</b>{" "}
        {recipe.tags && recipe.tags.length > 0 ? recipe.tags.join(", ") : "—"}
      </p>

      <h4>Ingredientes</h4>
      <ul>
        {recipe.ingredients.map((ing, idx) => (
          <li key={idx}>
            {ing.quantity} {ing.unit} {ing.name}
          </li>
        ))}
      </ul>

      <h4>Pasos</h4>
      <ol>
        {recipe.steps.map((step, idx) => (
          <li key={idx}>{step.description}</li>
        ))}
      </ol>

      {user && recipe.author?._id === user._id && (
        <>
          <button onClick={() => navigate(`/recipes/${recipe._id}/edit`)}>
            Editar
          </button>
          <button onClick={handleDelete}>Eliminar</button>
        </>
      )}
      <button onClick={() => navigate("/recipes")}>Volver</button>
    </div>
  );
};

export default RecipeDetail;
