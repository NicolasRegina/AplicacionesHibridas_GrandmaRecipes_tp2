import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRecipeById, updateRecipe } from "../api/recipes";

const initialIngredient = { name: "", quantity: "", unit: "" };
const initialStep = { number: 1, description: "" };

const EditRecipeForm = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    ingredients: [{ ...initialIngredient }],
    steps: [{ ...initialStep }],
    prepTime: 1,
    cookTime: 0,
    servings: 1,
    difficulty: "Fácil",
    category: "Desayuno",
    tags: [],
    image: "",
    group: "",
    isPrivate: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id, token);
        setForm({
          title: data.title || "",
          description: data.description || "",
          ingredients: data.ingredients.length
            ? data.ingredients
            : [{ ...initialIngredient }],
          steps: data.steps.length ? data.steps : [{ ...initialStep }],
          prepTime: data.prepTime || 1,
          cookTime: data.cookTime || 0,
          servings: data.servings || 1,
          difficulty: data.difficulty || "Fácil",
          category: data.category || "Desayuno",
          tags: data.tags || [],
          image: data.image || "",
          group:
            typeof data.group === "object" ? data.group._id : data.group || "",
          isPrivate: data.isPrivate ?? false,
        });
      } catch (err) {
        setError("No se pudo cargar la receta.");
      }
      setLoading(false);
    };
    fetchRecipe();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Ingredientes
  const handleIngredientChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...form.ingredients];
    updated[index][name] = value;
    setForm({ ...form, ingredients: updated });
  };

  const addIngredient = () => {
    setForm({
      ...form,
      ingredients: [...form.ingredients, { ...initialIngredient }],
    });
  };
  if (loading) return <p>Cargando datos de la receta...</p>;

  const removeIngredient = (index) => {
    const updated = form.ingredients.filter((_, i) => i !== index);
    setForm({ ...form, ingredients: updated });
  };

  // Pasos
  const handleStepChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...form.steps];
    updated[index][name] = value;
    setForm({ ...form, steps: updated });
  };

  const addStep = () => {
    setForm({
      ...form,
      steps: [
        ...form.steps,
        { number: form.steps.length + 1, description: "" },
      ],
    });
  };

  const removeStep = (index) => {
    const updated = form.steps
      .filter((_, i) => i !== index)
      .map((item, idx) => ({ ...item, number: idx + 1 }));
    setForm({ ...form, steps: updated });
  };

  // Tags
  const handleTagsChange = (e) => {
    setForm({
      ...form,
      tags: e.target.value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.title.length < 3 || form.title.length > 100) {
      setError("El título debe tener entre 3 y 100 caracteres.");
      return;
    }
    if (form.description.length < 10 || form.description.length > 500) {
      setError("La descripción debe tener entre 10 y 500 caracteres.");
      return;
    }
    if (form.ingredients.length < 1) {
      setError("Debe haber al menos un ingrediente.");
      return;
    }
    if (form.steps.length < 1) {
      setError("Debe haber al menos un paso.");
      return;
    }

    const cleanIngredients = form.ingredients.map(({ _id, ...rest }) => rest);
    const cleanSteps = form.steps.map(({ _id, ...rest }) => rest);

    const dataToSend = {
      ...form,
      ingredients: cleanIngredients,
      steps: cleanSteps,
    };

    try {
      await updateRecipe(id, dataToSend, token);
      setSuccess("Receta actualizada exitosamente");
      setTimeout(() => navigate("/recipes"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar la receta");
    }
  };

  return (
    <div>
      <h2>Editar Receta</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Título"
          value={form.title}
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

        <h4>Ingredientes</h4>
        {form.ingredients.map((ing, idx) => (
          <div key={idx}>
            <input
              name="name"
              placeholder="Ingrediente"
              value={ing.name}
              onChange={(e) => handleIngredientChange(idx, e)}
              required
            />
            <input
              name="quantity"
              placeholder="Cantidad"
              value={ing.quantity}
              onChange={(e) => handleIngredientChange(idx, e)}
              required
            />
            <input
              name="unit"
              placeholder="Unidad"
              value={ing.unit}
              onChange={(e) => handleIngredientChange(idx, e)}
            />
            <button
              type="button"
              onClick={() => removeIngredient(idx)}
              disabled={form.ingredients.length === 1}
            >
              Eliminar
            </button>
          </div>
        ))}
        <button type="button" onClick={addIngredient}>
          + Ingrediente
        </button>
        <br />

        <h4>Pasos</h4>
        {form.steps.map((step, idx) => (
          <div key={idx}>
            <span>Paso {idx + 1}</span>
            <textarea
              name="description"
              placeholder="Descripción del paso"
              value={step.description}
              onChange={(e) => handleStepChange(idx, e)}
              required
            />
            <button
              type="button"
              onClick={() => removeStep(idx)}
              disabled={form.steps.length === 1}
            >
              Eliminar
            </button>
          </div>
        ))}
        <button type="button" onClick={addStep}>
          + Paso
        </button>
        <br />

        <input
          name="prepTime"
          type="number"
          min="1"
          placeholder="Tiempo de preparación (min)"
          value={form.prepTime}
          onChange={handleChange}
          required
        />
        <input
          name="cookTime"
          type="number"
          min="0"
          placeholder="Tiempo de cocción (min)"
          value={form.cookTime}
          onChange={handleChange}
          required
        />
        <input
          name="servings"
          type="number"
          min="1"
          placeholder="Porciones"
          value={form.servings}
          onChange={handleChange}
          required
        />
        <br />

        <label>
          Dificultad:
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
          >
            <option value="Fácil">Fácil</option>
            <option value="Media">Media</option>
            <option value="Difícil">Difícil</option>
          </select>
        </label>
        <label>
          Categoría:
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="Desayuno">Desayuno</option>
            <option value="Almuerzo">Almuerzo</option>
            <option value="Cena">Cena</option>
            <option value="Postre">Postre</option>
            <option value="Merienda">Merienda</option>
            <option value="Bebida">Bebida</option>
            <option value="Otro">Otro</option>
          </select>
        </label>
        <br />

        <input
          name="tags"
          placeholder="Tags (separados por coma)"
          value={form.tags.join(", ")}
          onChange={handleTagsChange}
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
          Privada
          <input
            type="checkbox"
            name="isPrivate"
            checked={form.isPrivate}
            onChange={handleChange}
          />
        </label>
        <br />

        <button type="submit">Actualizar Receta</button>
      </form>
    </div>
  );
};

export default EditRecipeForm;
