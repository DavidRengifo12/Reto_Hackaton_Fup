import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NavbarR from "./components/NavbarR";
import { Authprovider, useAuth } from "./context/AuthContext";
import ToastProvider from "./components/ToastProvider";

import LandingPage from "./components/LandingPage";
import AdminLayout from "./Admin/AdminsLayout";

// Páginas Admin
import Dashboard from "./pages/admin/Dashboard";
import GestionProductos from "./pages/admin/GestionProductos";
import GestionAdministradores from "./pages/admin/GestionAdministradores";
import Reportes from "./pages/admin/Reportes";

// Páginas Usuario
import CatalogoProductos from "./pages/usuario/CatalogoProductos";
import Carrito from "./pages/usuario/Carrito";

const Rutas = () => {
  return (
    <>
      <Authprovider>
        <BrowserRouter>
          <ToastProvider />
          <RutasWeb />
        </BrowserRouter>
      </Authprovider>
    </>
  );
};

const RutasWeb = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      {/* Rutas Admin */}
      <Route
        path="/dash-admin"
        element={
          isAuthenticated && user?.rol === "administrador" ? (
            <AdminLayout />
          ) : (
            <Navigate to="/" />
          )
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<GestionProductos />} />
        <Route path="administradores" element={<GestionAdministradores />} />
        <Route path="reportes" element={<Reportes />} />
      </Route>

      {/* Rutas Usuario */}
      <Route
        path="/dash-user"
        element={
          isAuthenticated && user?.rol === "usuario" ? (
            <NavbarR />
          ) : (
            <Navigate to="/" />
          )
        }
      >
        <Route index element={<CatalogoProductos />} />
        <Route path="catalogo" element={<CatalogoProductos />} />
        <Route path="carrito" element={<Carrito />} />
      </Route>
    </Routes>
  );
};

export default Rutas;
