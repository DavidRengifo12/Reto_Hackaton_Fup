/**
 * Componente para gestionar administradores
 * Permite crear nuevos administradores desde el panel
 */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Badge, Spinner, Alert } from 'react-bootstrap';
import { FiPlus, FiUser, FiMail, FiPhone, FiShield } from 'react-icons/fi';
import { obtenerUsuariosPorRol, crearAdministrador } from '../../services/usuarioService';
import toast from 'react-hot-toast';

const COLOR_PRINCIPAL = '#002f19';

export default function GestionAdministradores() {
  const [administradores, setAdministradores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    password: '',
    phone: ''
  });

  useEffect(() => {
    cargarAdministradores();
  }, []);

  const cargarAdministradores = async () => {
    try {
      setCargando(true);
      const datos = await obtenerUsuariosPorRol('administrador');
      setAdministradores(datos);
    } catch (error) {
      toast.error('Error al cargar administradores');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const abrirModal = () => {
    setFormulario({
      nombre: '',
      email: '',
      password: '',
      phone: ''
    });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setFormulario({
      nombre: '',
      email: '',
      password: '',
      phone: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validaciones
      if (!formulario.nombre || !formulario.email || !formulario.password) {
        toast.error('Por favor complete todos los campos obligatorios');
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formulario.email)) {
        toast.error('Por favor ingrese un email válido');
        return;
      }

      // Validar longitud de contraseña
      if (formulario.password.length < 6) {
        toast.error('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      await crearAdministrador(formulario);
      toast.success('Administrador creado correctamente');
      cerrarModal();
      cargarAdministradores();
    } catch (error) {
      const mensaje = error.message || 'Error al crear el administrador';
      toast.error(mensaje);
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
            <h2 style={{ color: COLOR_PRINCIPAL }}>Gestión de Administradores</h2>
            <Button 
              onClick={abrirModal}
              style={{ backgroundColor: COLOR_PRINCIPAL, borderColor: COLOR_PRINCIPAL }}
            >
              <FiPlus className="me-2" />
              Nuevo Administrador
            </Button>
          </div>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Body>
          {administradores.length === 0 ? (
            <Alert variant="info" className="text-center">
              <FiShield size={48} className="mb-3" />
              <p>No hay administradores registrados. Crea uno nuevo para comenzar.</p>
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead style={{ backgroundColor: COLOR_PRINCIPAL, color: 'white' }}>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {administradores.map(admin => (
                    <tr key={admin.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <FiUser className="me-2" />
                          <strong>{admin.nombre}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FiMail className="me-2" />
                          {admin.email}
                        </div>
                      </td>
                      <td>
                        {admin.phone ? (
                          <div className="d-flex align-items-center">
                            <FiPhone className="me-2" />
                            {admin.phone}
                          </div>
                        ) : (
                          <span className="text-muted">No registrado</span>
                        )}
                      </td>
                      <td>
                        <Badge bg="success" style={{ backgroundColor: COLOR_PRINCIPAL }}>
                          <FiShield className="me-1" />
                          {admin.rol}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal de Crear Administrador */}
      <Modal show={mostrarModal} onHide={cerrarModal}>
        <Modal.Header closeButton style={{ backgroundColor: COLOR_PRINCIPAL, color: 'white' }}>
          <Modal.Title>Nuevo Administrador</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={handleInputChange}
                required
                placeholder="Nombre del administrador"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formulario.email}
                onChange={handleInputChange}
                required
                placeholder="admin@ejemplo.com"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formulario.password}
                onChange={handleInputChange}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
              />
              <Form.Text className="text-muted">
                La contraseña debe tener al menos 6 caracteres
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formulario.phone}
                onChange={handleInputChange}
                placeholder="Opcional"
              />
            </Form.Group>

            <Alert variant="info" className="mt-3">
              <strong>Nota:</strong> El nuevo administrador podrá iniciar sesión con el email y contraseña proporcionados.
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cerrarModal}>
              Cancelar
            </Button>
            <Button type="submit" style={{ backgroundColor: COLOR_PRINCIPAL, borderColor: COLOR_PRINCIPAL }}>
              Crear Administrador
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

