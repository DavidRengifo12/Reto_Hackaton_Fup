import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NavbarR from "./components/NavbarR";
import { Authprovider, useAuth } from "./context/AuthContext";
import ToastProvider from "./components/ToastProvider";

import LandingPage from "./components/LandingPage";
import AdminLayout from "./Admin/AdminsLayout";



const Rutas =() => { //PROTEGER LAS RUTAS CON AUTHCONTEXT
  return (
    <>
    <Authprovider>
     <BrowserRouter>
        <ToastProvider />
        <RutasWeb />
     </BrowserRouter> 
     </Authprovider>
    </>
  )
}

const RutasWeb = () => {
  const {isAuthenticated, user} = useAuth()
  return(
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      
      <Route path="/dash-admin" element={isAuthenticated && user.rol === "administrador" ? <AdminLayout />: <Navigate to= '/' />}>
         
      </Route>

      <Route path="/dash-user" element={isAuthenticated && user.rol === 'usuario' ? <NavbarR /> : <Navigate to='/' />}>
        
      </Route>


    </Routes>
  )
}

export default Rutas
