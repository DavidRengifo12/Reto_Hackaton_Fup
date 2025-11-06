/**
 * Componente de reportes y análisis detallados
 * Muestra estadísticas avanzadas y exportación de datos
 */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Spinner } from 'react-bootstrap';
import { obtenerVentas, obtenerVentasMesActual } from '../../services/ventaService';
import { obtenerVentasPorCategoria, obtenerVentasPorGenero, obtenerVentasPorTalla, 
         obtenerProductosMasVendidos, obtenerProductosBajaRotacion } from '../../services/kpiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const COLOR_PRINCIPAL = '#002f19';
const COLORES_GRAFICO = ['#002f19', '#005a2c', '#00884d', '#00b366', '#00e680'];

export default function Reportes() {
  const [ventas, setVentas] = useState([]);
  const [ventasPorCategoria, setVentasPorCategoria] = useState([]);
  const [ventasPorGenero, setVentasPorGenero] = useState([]);
  const [ventasPorTalla, setVentasPorTalla] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [productosBajaRotacion, setProductosBajaRotacion] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState('mes');

  useEffect(() => {
    cargarReportes();
  }, [filtroFecha]);

  const cargarReportes = async () => {
    try {
      setCargando(true);
      
      let ventasData = [];
      if (filtroFecha === 'mes') {
        ventasData = await obtenerVentasMesActual();
      } else {
        ventasData = await obtenerVentas();
      }

      setVentas(ventasData);

      const [
        porCategoria,
        porGenero,
        porTalla,
        masVendidos,
        bajaRotacion
      ] = await Promise.all([
        obtenerVentasPorCategoria(),
        obtenerVentasPorGenero(),
        obtenerVentasPorTalla(),
        obtenerProductosMasVendidos(15),
        obtenerProductosBajaRotacion(5)
      ]);

      setVentasPorCategoria(porCategoria);
      setVentasPorGenero(porGenero);
      setVentasPorTalla(porTalla);
      setProductosMasVendidos(masVendidos);
      setProductosBajaRotacion(bajaRotacion);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setCargando(false);
    }
  };

  const calcularTotalVentas = () => {
    return ventas.reduce((total, venta) => total + (venta.total || 0), 0);
  };

  const calcularCantidadVentas = () => {
    return ventas.length;
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
            <h2 style={{ color: COLOR_PRINCIPAL }}>Reportes y Análisis</h2>
            <Form.Select
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              style={{ maxWidth: '200px' }}
            >
              <option value="mes">Mes Actual</option>
              <option value="todos">Todos</option>
            </Form.Select>
          </div>
        </Col>
      </Row>

      {/* Resumen */}
      <Row className="g-4 mb-4">
        <Col xs={12} md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title style={{ color: COLOR_PRINCIPAL }}>Total de Ventas</Card.Title>
              <h3>${calcularTotalVentas().toLocaleString('es-CO')}</h3>
              <small className="text-muted">Cantidad: {calcularCantidadVentas()} ventas</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title style={{ color: COLOR_PRINCIPAL }}>Promedio por Venta</Card.Title>
              <h3>
                ${calcularCantidadVentas() > 0 
                  ? (calcularTotalVentas() / calcularCantidadVentas()).toLocaleString('es-CO', { maximumFractionDigits: 2 })
                  : '0'}
              </h3>
              <small className="text-muted">Promedio calculado</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row className="g-4 mb-4">
        <Col xs={12} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Header style={{ backgroundColor: COLOR_PRINCIPAL, color: 'white' }}>
              <h5 className="mb-0">Ventas por Categoría</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ventasPorCategoria}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill={COLOR_PRINCIPAL} name="Total Ventas" />
                  <Bar dataKey="cantidad" fill="#00b366" name="Cantidad" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Header style={{ backgroundColor: COLOR_PRINCIPAL, color: 'white' }}>
              <h5 className="mb-0">Ventas por Género</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ventasPorGenero}
                    dataKey="total"
                    nameKey="nombre"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {ventasPorGenero.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORES_GRAFICO[index % COLORES_GRAFICO.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col xs={12} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Header style={{ backgroundColor: COLOR_PRINCIPAL, color: 'white' }}>
              <h5 className="mb-0">Ventas por Talla</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ventasPorTalla}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cantidad" fill={COLOR_PRINCIPAL} name="Cantidad Vendida" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Header style={{ backgroundColor: COLOR_PRINCIPAL, color: 'white' }}>
              <h5 className="mb-0">Top 10 Productos Más Vendidos</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover size="sm">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Ventas</th>
                      <th>Rotación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosMasVendidos.slice(0, 10).map(producto => (
                      <tr key={producto.id}>
                        <td>{producto.nombre}</td>
                        <td><Badge bg="success">{producto.ventas_mensuales}</Badge></td>
                        <td>{producto.rotacion_mensual}%</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Productos con baja rotación */}
      {productosBajaRotacion.length > 0 && (
        <Row className="mb-4">
          <Col xs={12}>
            <Card className="shadow-sm border-0">
              <Card.Header style={{ backgroundColor: '#dc3545', color: 'white' }}>
                <h5 className="mb-0">⚠️ Productos con Baja Rotación</h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Tipo</th>
                        <th>Talla</th>
                        <th>Género</th>
                        <th>Stock</th>
                        <th>Ventas Mensuales</th>
                        <th>Rotación Mensual</th>
                        <th>Acción Sugerida</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productosBajaRotacion.map(producto => (
                        <tr key={producto.id}>
                          <td><strong>{producto.nombre}</strong></td>
                          <td>{producto.tipo_ropa}</td>
                          <td><Badge bg="secondary">{producto.talla}</Badge></td>
                          <td>{producto.genero}</td>
                          <td><Badge bg={producto.cantidad > 0 ? 'warning' : 'danger'}>{producto.cantidad}</Badge></td>
                          <td>{producto.ventas_mensuales}</td>
                          <td><Badge bg="danger">{producto.rotacion_mensual}%</Badge></td>
                          <td>
                            {producto.cantidad > 0 ? (
                              <Badge bg="warning">Considerar descuento</Badge>
                            ) : (
                              <Badge bg="info">Sin stock</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Historial de ventas recientes */}
      <Row>
        <Col xs={12}>
          <Card className="shadow-sm border-0">
            <Card.Header style={{ backgroundColor: COLOR_PRINCIPAL, color: 'white' }}>
              <h5 className="mb-0">Historial de Ventas</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Usuario</th>
                      <th>Productos</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventas.slice(0, 20).map(venta => (
                      <tr key={venta.id}>
                        <td>
                          {venta.fecha 
                            ? format(new Date(venta.fecha), 'dd/MM/yyyy HH:mm', { locale: es })
                            : 'N/A'}
                        </td>
                        <td>{venta.usuarios?.nombre || 'Usuario'}</td>
                        <td>
                          {venta.detalle_compras?.length || 0} producto{venta.detalle_compras?.length !== 1 ? 's' : ''}
                        </td>
                        <td><strong>${venta.total?.toLocaleString('es-CO') || '0'}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

