import { useState } from "react";

const categories = ["Desayuno", "Almuerzo", "Cena", "Postre", "Merienda", "Bebida", "Otro"];
const difficulties = ["Fácil", "Media", "Difícil"];

const RecipeSearchBar = ({ onSearch }) => {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ q, category, difficulty });
  };

  const handleClear = () => {
    setQ("");
    setCategory("");
    setDifficulty("");
    onSearch({ q: "", category: "", difficulty: "" });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input
        type="text"
        placeholder="Buscar por título, descripción o ingrediente..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">Todas las categorías</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
        <option value="">Todas las dificultades</option>
        {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
      <button type="submit">Buscar</button>
      <button type="button" onClick={handleClear}>Limpiar</button>
    </form>
  );
};

export default RecipeSearchBar;