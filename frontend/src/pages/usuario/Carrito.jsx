/**
 * Componente de carrito de compras para usuarios
 * Permite visualizar, modificar y procesar el carrito
 */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Spinner, Alert, Form } from 'react-bootstrap';
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiCheck } from 'react-icons/fi';
import { obtenerCarrito, actualizarCantidadCarrito, eliminarDelCarrito } from '../../services/carritoService';
import { procesarVenta } from '../../services/ventaService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const COLOR_PRINCIPAL = '#002f19';

export default function Carrito() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    if (user) {
      cargarCarrito();
    } else {
      navigate('/login');
    }
  }, [user]);

  const cargarCarrito = async () => {
    try {
      setCargando(true);
      const datos = await obtenerCarrito(user.id);
      setCarrito(datos || []);
      
      // Emitir evento para actualizar el navbar
      window.dispatchEvent(new CustomEvent('carritoActualizado'));
    } catch (error) {
      toast.error('Error al cargar el carrito');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const actualizarCantidad = async (itemId, cantidadActual, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      return;
    }

    // Verificar stock disponible
    const item = carrito.find(i => i.id === itemId);
    if (item && item.productos && nuevaCantidad > item.productos.cantidad) {
      toast.error(`Solo hay ${item.productos.cantidad} unidades disponibles en stock`);
      return;
    }

    try {
      await actualizarCantidadCarrito(itemId, nuevaCantidad);
      toast.success('Cantidad actualizada');
      cargarCarrito();
      // El evento ya se emite en cargarCarrito
    } catch (error) {
      toast.error('Error al actualizar la cantidad');
      console.error(error);
    }
  };

  const eliminarItem = async (itemId) => {
    try {
      await eliminarDelCarrito(itemId);
      toast.success('Producto eliminado del carrito');
      cargarCarrito();
      // El evento ya se emite en cargarCarrito
    } catch (error) {
      toast.error('Error al eliminar el producto');
      console.error(error);
    }
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => {
      const precio = item.productos?.precio || 0;
      return total + (precio * item.cantidad);
    }, 0);
  };

  const calcularTotalItems = () => {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
  };

  const handleProcesarVenta = async () => {
    if (carrito.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    // Validar stock de todos los items
    for (const item of carrito) {
      if (!item.productos) {
        toast.error('Error: algunos productos no están disponibles');
        return;
      }
      if (item.cantidad > item.productos.cantidad) {
        toast.error(`No hay suficiente stock de ${item.productos.nombre}`);
        return;
      }
    }

    if (!window.confirm('¿Confirma la compra de estos productos?')) {
      return;
    }

    try {
      setProcesando(true);
      await procesarVenta(user.id, carrito);
      
      // Emitir evento para actualizar el navbar
      window.dispatchEvent(new CustomEvent('carritoActualizado'));
      
      toast.success('¡Compra realizada exitosamente!');
      navigate('/dash-user/catalogo');
    } catch (error) {
      toast.error('Error al procesar la venta');
      console.error(error);
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" style={{ color: COLOR_PRINCIPAL }} />
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 style={{ color: COLOR_PRINCIPAL }}>
            <FiShoppingCart className="me-2" />
            Carrito de Compras
          </h2>
        </Col>
      </Row>

      {carrito.length === 0 ? (
        <Alert variant="info" className="text-center">
          <FiShoppingCart size={64} className="mb-3" style={{ color: COLOR_PRINCIPAL }} />
          <h4>Tu carrito está vacío</h4>
          <p>Agrega productos desde el catálogo</p>
          <Button
            variant="primary"
            style={{ backgroundColor: COLOR_PRINCIPAL, borderColor: COLOR_PRINCIPAL }}
            onClick={() => navigate('/dash-user/catalogo')}
          >
            Ver Catálogo
          </Button>
        </Alert>
      ) : (
        <Row>
          <Col xs={12} lg={8}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header style={{ backgroundColor: COLOR_PRINCIPAL, color: 'white' }}>
                <h5 className="mb-0">Productos en el Carrito</h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Precio Unitario</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carrito.map(item => {
                        const producto = item.productos;
                        const precio = producto?.precio || 0;
                        const subtotal = precio * item.cantidad;

                        return (
                          <tr key={item.id}>
                            <td>
                              <div>
                                <strong>{producto?.nombre || 'Producto no disponible'}</strong>
                                <br />
                                <small className="text-muted">
                                  {producto?.tipo_ropa} - {producto?.genero} - Talla: {producto?.talla}
                                </small>
                                {producto?.cantidad < item.cantidad && (
                                  <Badge bg="danger" className="ms-2">
                                    Stock insuficiente
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td>${precio.toLocaleString('es-CO')}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => actualizarCantidad(item.id, item.cantidad, item.cantidad - 1)}
                                  disabled={item.cantidad <= 1}
                                >
                                  <FiMinus />
                                </Button>
                                <Form.Control
                                  type="number"
                                  min="1"
                                  max={producto?.cantidad || 1}
                                  value={item.cantidad}
                                  onChange={(e) => {
                                    const nuevaCantidad = parseInt(e.target.value) || 1;
                                    actualizarCantidad(item.id, item.cantidad, nuevaCantidad);
                                  }}
                                  className="mx-2"
                                  style={{ width: '80px', textAlign: 'center' }}
                                />
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => actualizarCantidad(item.id, item.cantidad, item.cantidad + 1)}
                                  disabled={item.cantidad >= (producto?.cantidad || 0)}
                                >
                                  <FiPlus />
                                </Button>
                              </div>
                              <small className="text-muted">
                                Stock: {producto?.cantidad || 0}
                              </small>
                            </td>
                            <td>
                              <strong>${subtotal.toLocaleString('es-CO')}</strong>
                            </td>
                            <td>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => eliminarItem(item.id)}
                              >
                                <FiTrash2 />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} lg={4}>
            <Card className="shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
              <Card.Header style={{ backgroundColor: COLOR_PRINCIPAL, color: 'white' }}>
                <h5 className="mb-0">Resumen de Compra</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total de productos:</span>
                    <strong>{calcularTotalItems()}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <strong>${calcularTotal().toLocaleString('es-CO')}</strong>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <h5>Total:</h5>
                    <h5 style={{ color: COLOR_PRINCIPAL }}>
                      ${calcularTotal().toLocaleString('es-CO')}
                    </h5>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-100"
                  style={{ backgroundColor: COLOR_PRINCIPAL, borderColor: COLOR_PRINCIPAL }}
                  onClick={handleProcesarVenta}
                  disabled={procesando || carrito.length === 0}
                >
                  {procesando ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <FiCheck className="me-2" />
                      Finalizar Compra
                    </>
                  )}
                </Button>

                <Button
                  variant="outline-secondary"
                  className="w-100 mt-2"
                  onClick={() => navigate('/dash-user/catalogo')}
                >
                  Continuar Comprando
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

