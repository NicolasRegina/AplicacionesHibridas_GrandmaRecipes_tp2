import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Inicio</Link>
      {user ? (
        <>
          <Link to="/recipes">Recetas</Link>
          <Link to="/groups">Grupos</Link>
          <button onClick={logout}>Cerrar Sesión</button>
        </>
      ) : (
        <>
          <Link to="/login">Ingresar</Link>
          <Link to="/register">Registrarse</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
