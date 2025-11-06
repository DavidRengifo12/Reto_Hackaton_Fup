import React, { useState, useEffect } from 'react'
import { Button, Nav, Navbar, Badge } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiHome, FiLogOut, FiUser, FiPackage } from 'react-icons/fi'
import { obtenerCarrito } from '../services/carritoService'
import toast from 'react-hot-toast'

const COLOR_PRINCIPAL = '#002f19';

export default function NavbarR() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [cantidadCarrito, setCantidadCarrito] = useState(0)

  useEffect(() => {
    if (user) {
      cargarCantidadCarrito()
      
      // Escuchar eventos de actualización del carrito
      const handleCarritoActualizado = () => {
        cargarCantidadCarrito()
      }
      
      window.addEventListener('carritoActualizado', handleCarritoActualizado)
      
      return () => {
        window.removeEventListener('carritoActualizado', handleCarritoActualizado)
      }
    }
  }, [user])

  const cargarCantidadCarrito = async () => {
    try {
      if (user) {
        const carrito = await obtenerCarrito(user.id)
        const cantidad = carrito.reduce((total, item) => total + item.cantidad, 0)
        setCantidadCarrito(cantidad)
      }
    } catch (error) {
      console.error('Error al cargar carrito:', error)
    }
  }

  const handleLogout = async (e) => {
    e.preventDefault()
    try {
      await logout()
      navigate('/')
    } catch (error) {
      toast.error('Error al cerrar sesión')
      console.log(error)
    }
  }

  return (
    <>
      <div>
        <header className='bg-transparent'>
          <Navbar expand="lg" fixed="top" className="py-3 shadow-sm" style={{ backgroundColor: COLOR_PRINCIPAL }}>
            <div className="container">
              <Navbar.Brand className='text-white'>
                <h4 className='m-0 d-flex align-items-center'>
                  <FiPackage className="me-2" />
                  Retail Store
                </h4>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'white' }} />

              <Navbar.Collapse id='basic-navbar-nav'>
                <Nav className='mx-auto gap-3 align-items-center'>
                  {user?.rol === 'usuario' && (
                    <>
                      <Nav.Link as={Link} to='/dash-user/catalogo' className="text-white fw-bold d-flex align-items-center">
                        <FiHome className="me-1" />
                        Catálogo
                      </Nav.Link>
                      <Nav.Link as={Link} to='/dash-user/carrito' className="text-white fw-bold d-flex align-items-center position-relative">
                        <FiShoppingCart className="me-1" />
                        Carrito
                        {cantidadCarrito > 0 && (
                          <Badge 
                            bg="danger" 
                            className="position-absolute top-0 start-100 translate-middle rounded-pill"
                            style={{ fontSize: '0.7rem' }}
                          >
                            {cantidadCarrito}
                          </Badge>
                        )}
                      </Nav.Link>
                    </>
                  )}
                </Nav>

                <Nav className='gap-3 align-items-center'>
                  {user && (
                    <Nav.Link className="text-white d-flex align-items-center">
                      <FiUser className="me-1" />
                      {user.nombre}
                    </Nav.Link>
                  )}
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={handleLogout}
                    className="d-flex align-items-center"
                  >
                    <FiLogOut className="me-1" />
                    Salir
                  </Button>
                </Nav>
              </Navbar.Collapse>
            </div>
          </Navbar>
        </header>
        <div style={{ paddingTop: '100px' }}>
          <Outlet />
        </div>
      </div>
    </>
  )
}
