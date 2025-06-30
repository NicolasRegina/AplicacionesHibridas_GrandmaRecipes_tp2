import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        {/* Brand/Logo */}
        <Link className="navbar-brand fw-bold d-flex align-items-center text-light" to="/">
          <img 
            src={logo} 
            alt="Grandma Recipes Logo" 
            height="40" 
            className="me-2"
          />
          <span style={{ opacity: 0.9 }}>Recetario de la Abuela</span>
        </Link>

        {/* Toggle button for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link text-light fw-medium" to="/" style={{ opacity: 0.95 }}>
                <i className="bi bi-house-door me-1"></i>Inicio
              </Link>
            </li>

            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-light fw-medium" to="/recipes" style={{ opacity: 0.95 }}>
                    <i className="bi bi-book me-1"></i>Recetas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-light fw-medium" to="/groups" style={{ opacity: 0.95 }}>
                    <i className="bi bi-people me-1"></i>Grupos
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Right side navigation */}
          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center text-light fw-medium"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ opacity: 0.95 }}
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    {user.name || "Usuario"}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person me-2"></i>Mi Perfil
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={logout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>Cerrar
                        Sesión
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-light fw-medium" to="/login" style={{ opacity: 0.95 }}>
                    <i className="bi bi-box-arrow-in-right me-1"></i>Ingresar
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-light ms-2 fw-medium" to="/register" style={{ opacity: 0.95 }}>
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
