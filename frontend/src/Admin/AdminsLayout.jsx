import { Nav } from "react-bootstrap";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiLayout, FiPackage, FiUsers, FiBarChart2, FiLogOut, FiHome } from "react-icons/fi";

const COLOR_PRINCIPAL = '#002f19';

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/");
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <aside
        className="d-flex flex-column text-white p-3"
        style={{ width: 260, backgroundColor: COLOR_PRINCIPAL }}
      >
        <div className="mb-4">
          <h4 className="m-0 mb-1">Panel Administrador</h4>
          <small className="text-white-50">Gestión del sistema retail</small>
          {user && (
            <div className="mt-2">
              <small className="text-white-50">Usuario: {user.nombre}</small>
            </div>
          )}
        </div>

        <Nav className="flex-column gap-2">
          <Nav.Link as={Link} to="/dash-admin" className="text-white d-flex align-items-center">
            <FiLayout className="me-2" />
            Dashboard
          </Nav.Link>
          <Nav.Link as={Link} to="/dash-admin/productos" className="text-white d-flex align-items-center">
            <FiPackage className="me-2" />
            Gestión de Productos
          </Nav.Link>
          <Nav.Link as={Link} to="/dash-admin/administradores" className="text-white d-flex align-items-center">
            <FiUsers className="me-2" />
            Administradores
          </Nav.Link>
          <Nav.Link as={Link} to="/dash-admin/reportes" className="text-white d-flex align-items-center">
            <FiBarChart2 className="me-2" />
            Reportes
          </Nav.Link>
        </Nav>

        <div className="mt-auto">
          <button 
            className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center" 
            onClick={handleLogout}
          >
            <FiLogOut className="me-2" />
            Cerrar sesión
          </button>
          <Link 
            to="/" 
            className="btn btn-outline-light w-100 mt-2 d-flex align-items-center justify-content-center"
          >
            <FiHome className="me-2" />
            Volver al inicio
          </Link>
        </div>
      </aside>

      <main className="flex-grow-1 p-4" style={{ backgroundColor: "#f5f6f8" }}>
        <Outlet />
      </main>
    </div>
  );
}
