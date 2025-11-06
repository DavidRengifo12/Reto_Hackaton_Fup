/**
 * Catálogo de productos para usuarios
 * Permite buscar, filtrar y visualizar productos disponibles
 */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Spinner, InputGroup, Alert } from 'react-bootstrap';
import { FiSearch, FiShoppingCart, FiFilter } from 'react-icons/fi';
import { obtenerProductosFiltrados, buscarProductos } from '../../services/productoService';
import { agregarAlCarrito } from '../../services/carritoService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const COLOR_PRINCIPAL = '#002f19';

const TIPOS_ROPA = ['Camiseta', 'Pantalón', 'Vestido', 'Chaqueta', 'Falda', 'Short', 'Abrigo', 'Otro'];
const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const GENEROS = ['Masculino', 'Femenino', 'Unisex', 'Niño', 'Niña'];

export default function CatalogoProductos() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtros, setFiltros] = useState({
    tipo_ropa: '',
    genero: '',
    talla: '',
    soloDisponibles: true
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [productos, filtros, terminoBusqueda]);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const datos = await obtenerProductosFiltrados({ soloDisponibles: true });
      setProductos(datos);
      setProductosFiltrados(datos);
    } catch (error) {
      toast.error('Error al cargar productos');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const aplicarFiltros = () => {
    let productosFiltrados = [...productos];

    // Filtrar por término de búsqueda
    if (terminoBusqueda.trim()) {
      const terminoLower = terminoBusqueda.toLowerCase();
      productosFiltrados = productosFiltrados.filter(p =>
        p.nombre?.toLowerCase().includes(terminoLower) ||
        p.referencia?.toLowerCase().includes(terminoLower) ||
        p.descripcion?.toLowerCase().includes(terminoLower)
      );
    }

    // Aplicar filtros
    if (filtros.tipo_ropa) {
      productosFiltrados = productosFiltrados.filter(p => p.tipo_ropa === filtros.tipo_ropa);
    }
    if (filtros.genero) {
      productosFiltrados = productosFiltrados.filter(p => p.genero === filtros.genero);
    }
    if (filtros.talla) {
      productosFiltrados = productosFiltrados.filter(p => p.talla === filtros.talla);
    }
    if (filtros.soloDisponibles) {
      productosFiltrados = productosFiltrados.filter(p => p.cantidad > 0);
    }

    setProductosFiltrados(productosFiltrados);
  };

  const handleAgregarCarrito = async (producto) => {
    if (!user) {
      toast.error('Debe iniciar sesión para agregar productos al carrito');
      navigate('/login');
      return;
    }

    if (producto.cantidad <= 0) {
      toast.error('Este producto no está disponible en stock');
      return;
    }

    try {
      await agregarAlCarrito(user.id, producto.id, 1);
      toast.success(`${producto.nombre} agregado al carrito`);
      
      // Emitir evento personalizado para actualizar el navbar
      window.dispatchEvent(new CustomEvent('carritoActualizado'));
      
      // Recargar productos para actualizar stock
      cargarProductos();
    } catch (error) {
      toast.error('Error al agregar al carrito');
      console.error(error);
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      tipo_ropa: '',
      genero: '',
      talla: '',
      soloDisponibles: true
    });
    setTerminoBusqueda('');
  };

  const handleFiltroChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
          <h2 style={{ color: COLOR_PRINCIPAL }}>Catálogo de Productos</h2>
          <p className="text-muted">Explora nuestra colección de ropa</p>
        </Col>
      </Row>

      {/* Barra de búsqueda y filtros */}
      <Row className="mb-4">
        <Col xs={12} md={8}>
          <InputGroup>
            <InputGroup.Text style={{ backgroundColor: COLOR_PRINCIPAL, color: 'white' }}>
              <FiSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre, referencia o descripción..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col xs={12} md={4}>
          <Button
            variant="outline-secondary"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="w-100"
          >
            <FiFilter className="me-2" />
            {mostrarFiltros ? 'Ocultar' : 'Mostrar'} Filtros
          </Button>
        </Col>
      </Row>

      {/* Panel de filtros */}
      {mostrarFiltros && (
        <Card className="mb-4 shadow-sm border-0">
          <Card.Header style={{ backgroundColor: COLOR_PRINCIPAL, color: 'white' }}>
            <strong>Filtros de Búsqueda</strong>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Ropa</Form.Label>
                  <Form.Select
                    name="tipo_ropa"
                    value={filtros.tipo_ropa}
                    onChange={handleFiltroChange}
                  >
                    <option value="">Todos</option>
                    {TIPOS_ROPA.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Género</Form.Label>
                  <Form.Select
                    name="genero"
                    value={filtros.genero}
                    onChange={handleFiltroChange}
                  >
                    <option value="">Todos</option>
                    {GENEROS.map(genero => (
                      <option key={genero} value={genero}>{genero}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Talla</Form.Label>
                  <Form.Select
                    name="talla"
                    value={filtros.talla}
                    onChange={handleFiltroChange}
                  >
                    <option value="">Todas</option>
                    {TALLAS.map(talla => (
                      <option key={talla} value={talla}>{talla}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="soloDisponibles"
                    checked={filtros.soloDisponibles}
                    onChange={handleFiltroChange}
                    label="Solo productos disponibles"
                  />
                </Form.Group>
                <Button variant="outline-secondary" size="sm" onClick={limpiarFiltros}>
                  Limpiar Filtros
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Resultados */}
      <Row>
        <Col>
          <p className="text-muted mb-3">
            {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''} encontrado{productosFiltrados.length !== 1 ? 's' : ''}
          </p>
        </Col>
      </Row>

      {/* Grid de productos */}
      {productosFiltrados.length === 0 ? (
        <Alert variant="info" className="text-center">
          <p>No se encontraron productos con los filtros seleccionados.</p>
          <Button variant="outline-primary" onClick={limpiarFiltros}>
            Limpiar Filtros
          </Button>
        </Alert>
      ) : (
        <Row className="g-4">
          {productosFiltrados.map(producto => (
            <Col xs={12} sm={6} md={4} lg={3} key={producto.id}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="d-flex flex-column">
                  <div className="mb-3">
                    <Badge 
                      bg={producto.cantidad > 10 ? 'success' : producto.cantidad > 0 ? 'warning' : 'danger'}
                      className="mb-2"
                    >
                      Stock: {producto.cantidad}
                    </Badge>
                    {producto.referencia && (
                      <Badge bg="secondary" className="ms-2">
                        {producto.referencia}
                      </Badge>
                    )}
                  </div>
                  
                  <Card.Title className="h6 mb-2" style={{ color: COLOR_PRINCIPAL }}>
                    {producto.nombre}
                  </Card.Title>
                  
                  <div className="mb-2">
                    <small className="text-muted d-block">{producto.tipo_ropa}</small>
                    <small className="text-muted d-block">
                      {producto.genero} - Talla: <strong>{producto.talla}</strong>
                    </small>
                  </div>

                  {producto.descripcion && (
                    <Card.Text className="small text-muted mb-2 flex-grow-1">
                      {producto.descripcion.length > 100
                        ? `${producto.descripcion.substring(0, 100)}...`
                        : producto.descripcion}
                    </Card.Text>
                  )}

                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <strong className="h5 mb-0" style={{ color: COLOR_PRINCIPAL }}>
                        ${producto.precio?.toLocaleString('es-CO')}
                      </strong>
                    </div>
                    
                    <Button
                      variant="primary"
                      className="w-100"
                      style={{ backgroundColor: COLOR_PRINCIPAL, borderColor: COLOR_PRINCIPAL }}
                      onClick={() => handleAgregarCarrito(producto)}
                      disabled={producto.cantidad <= 0}
                    >
                      <FiShoppingCart className="me-2" />
                      {producto.cantidad > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

