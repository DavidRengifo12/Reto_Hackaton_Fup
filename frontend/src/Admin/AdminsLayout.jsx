import { Nav } from "react-bootstrap";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { logout } = useAuth();
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
        className="d-flex flex-column bg-success text-white p-3"
        style={{ width: 260 }}
      >
        <div className="mb-4">
          <h4 className="m-0">Panel Admin</h4>
          <small className="text-muted">Gestión del sistema</small>
        </div>

        <Nav className="flex-column gap-2">
          <Nav.Link as={Link} to="/dash-admin/equipo-computo" className="text-white">
            Gestión de equipos
          </Nav.Link>
          <Nav.Link as={Link} to="/dash-admin/chat" className="text-white">
            Chat
          </Nav.Link>
        </Nav>

        <div className="mt-auto">
          <button className="btn btn-outline-light w-100" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-grow-1 p-4" style={{ backgroundColor: "#f5f6f8" }}>
        <Outlet />
      </main>
    </div>
  );
}
