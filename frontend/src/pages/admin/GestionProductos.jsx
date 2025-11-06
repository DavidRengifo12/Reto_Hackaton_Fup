/**
 * Componente para gestión completa de productos (CRUD)
 * Permite crear, editar, eliminar y visualizar productos
 */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Badge, Spinner, Alert } from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash2, FiPackage } from 'react-icons/fi';
import { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto } from '../../services/productoService';
import toast from 'react-hot-toast';

const COLOR_PRINCIPAL = '#002f19';

const TIPOS_ROPA = ['Camiseta', 'Pantalón', 'Vestido', 'Chaqueta', 'Falda', 'Short', 'Abrigo', 'Otro'];
const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const GENEROS = ['Masculino', 'Femenino', 'Unisex', 'Niño', 'Niña'];

export default function GestionProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [formulario, setFormulario] = useState({
    nombre: '',
    tipo_ropa: '',
    talla: '',
    genero: '',
    precio: '',
    cantidad: '',
    referencia: '',
    descripcion: ''
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const datos = await obtenerProductos();
      setProductos(datos);
    } catch (error) {
      toast.error('Error al cargar productos');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setProductoSeleccionado(null);
    setFormulario({
      nombre: '',
      tipo_ropa: '',
      talla: '',
      genero: '',
      precio: '',
      cantidad: '',
      referencia: '',
      descripcion: ''
    });
    setMostrarModal(true);
  };

  const abrirModalEditar = (producto) => {
    setModoEdicion(true);
    setProductoSeleccionado(producto);
    setFormulario({
      nombre: producto.nombre || '',
      tipo_ropa: producto.tipo_ropa || '',
      talla: producto.talla || '',
      genero: producto.genero || '',
      precio: producto.precio || '',
      cantidad: producto.cantidad || '',
      referencia: producto.referencia || '',
      descripcion: producto.descripcion || ''
    });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setFormulario({
      nombre: '',
      tipo_ropa: '',
      talla: '',
      genero: '',
      precio: '',
      cantidad: '',
      referencia: '',
      descripcion: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validaciones
      if (!formulario.nombre || !formulario.tipo_ropa || !formulario.talla || 
          !formulario.genero || !formulario.precio || formulario.cantidad === '') {
        toast.error('Por favor complete todos los campos obligatorios');
        return;
      }

      if (isNaN(parseFloat(formulario.precio)) || parseFloat(formulario.precio) <= 0) {
        toast.error('El precio debe ser un número válido mayor a 0');
        return;
      }

      if (isNaN(parseInt(formulario.cantidad)) || parseInt(formulario.cantidad) < 0) {
        toast.error('La cantidad debe ser un número válido mayor o igual a 0');
        return;
      }

      const datosProducto = {
        ...formulario,
        precio: parseFloat(formulario.precio),
        cantidad: parseInt(formulario.cantidad)
      };

      if (modoEdicion) {
        await actualizarProducto(productoSeleccionado.id, datosProducto);
        toast.success('Producto actualizado correctamente');
      } else {
        await crearProducto(datosProducto);
        toast.success('Producto creado correctamente');
      }

      cerrarModal();
      cargarProductos();
    } catch (error) {
      const mensaje = error.message || 'Error al guardar el producto';
      toast.error(mensaje);
      console.error(error);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este producto?')) {
      return;
    }

    try {
      await eliminarProducto(id);
      toast.success('Producto eliminado correctamente');
      cargarProductos();
    } catch (error) {
      toast.error('Error al eliminar el producto');
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: value
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
          <div className="d-flex justify-content-between align-items-center">
            <h2 style={{ color: COLOR_PRINCIPAL }}>Gestión de Productos</h2>
            <Button 
              onClick={abrirModalCrear}
              style={{ backgroundColor: COLOR_PRINCIPAL, borderColor: COLOR_PRINCIPAL }}
            >
              <FiPlus className="me-2" />
              Nuevo Producto
            </Button>
          </div>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Body>
          {productos.length === 0 ? (
            <Alert variant="info" className="text-center">
              <FiPackage size={48} className="mb-3" />
              <p>No hay productos registrados. Crea uno nuevo para comenzar.</p>
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead style={{ backgroundColor: COLOR_PRINCIPAL, color: 'white' }}>
                  <tr>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Talla</th>
                    <th>Género</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Ventas Mensuales</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(producto => (
                    <tr key={producto.id}>
                      <td>
                        <strong>{producto.nombre}</strong>
                        {producto.referencia && (
                          <div className="text-muted small">Ref: {producto.referencia}</div>
                        )}
                      </td>
                      <td>{producto.tipo_ropa}</td>
                      <td><Badge bg="secondary">{producto.talla}</Badge></td>
                      <td>{producto.genero}</td>
                      <td>${producto.precio?.toLocaleString('es-CO')}</td>
                      <td>
                        <Badge bg={producto.cantidad > 10 ? 'success' : producto.cantidad > 0 ? 'warning' : 'danger'}>
                          {producto.cantidad}
                        </Badge>
                      </td>
                      <td>{producto.ventas_mensuales || 0}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => abrirModalEditar(producto)}
                        >
                          <FiEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleEliminar(producto.id)}
                        >
                          <FiTrash2 />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal de Crear/Editar */}
      <Modal show={mostrarModal} onHide={cerrarModal} size="lg">
        <Modal.Header closeButton style={{ backgroundColor: COLOR_PRINCIPAL, color: 'white' }}>
          <Modal.Title>
            {modoEdicion ? 'Editar Producto' : 'Nuevo Producto'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Producto <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Camiseta básica"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Referencia</Form.Label>
                  <Form.Control
                    type="text"
                    name="referencia"
                    value={formulario.referencia}
                    onChange={handleInputChange}
                    placeholder="Código de referencia único"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Ropa <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="tipo_ropa"
                    value={formulario.tipo_ropa}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione...</option>
                    {TIPOS_ROPA.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Talla <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="talla"
                    value={formulario.talla}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione...</option>
                    {TALLAS.map(talla => (
                      <option key={talla} value={talla}>{talla}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Género <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="genero"
                    value={formulario.genero}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione...</option>
                    {GENEROS.map(genero => (
                      <option key={genero} value={genero}>{genero}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="precio"
                    value={formulario.precio}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cantidad en Stock <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="cantidad"
                    value={formulario.cantidad}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={formulario.descripcion}
                onChange={handleInputChange}
                placeholder="Descripción del producto..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cerrarModal}>
              Cancelar
            </Button>
            <Button type="submit" style={{ backgroundColor: COLOR_PRINCIPAL, borderColor: COLOR_PRINCIPAL }}>
              {modoEdicion ? 'Actualizar' : 'Crear'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

