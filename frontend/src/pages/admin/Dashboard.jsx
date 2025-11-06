/**
 * Dashboard principal del administrador
 * Muestra KPIs, gráficos y métricas clave del negocio
 */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { obtenerKPIs, obtenerProductosMasVendidos, obtenerVentasPorCategoria, 
         obtenerVentasPorGenero, obtenerEvolucionMensual, obtenerProductosBajaRotacion } from '../../services/kpiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
         PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLOR_PRINCIPAL = '#002f19';
const COLORES_GRAFICO = ['#002f19', '#005a2c', '#00884d', '#00b366', '#00e680'];

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [ventasPorCategoria, setVentasPorCategoria] = useState([]);
  const [ventasPorGenero, setVentasPorGenero] = useState([]);
  const [evolucionMensual, setEvolucionMensual] = useState([]);
  const [productosBajaRotacion, setProductosBajaRotacion] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      
      const [
        kpisData,
        masVendidos,
        porCategoria,
        porGenero,
        evolucion,
        bajaRotacion
      ] = await Promise.all([
        obtenerKPIs(),
        obtenerProductosMasVendidos(10),
        obtenerVentasPorCategoria(),
        obtenerVentasPorGenero(),
        obtenerEvolucionMensual(6),
        obtenerProductosBajaRotacion(5)
      ]);

      setKpis(kpisData);
      setProductosMasVendidos(masVendidos);
      setVentasPorCategoria(porCategoria);
      setVentasPorGenero(porGenero);
      setEvolucionMensual(evolucion);
      setProductosBajaRotacion(bajaRotacion);
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setCargando(false);
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
      <h2 className="mb-4" style={{ color: COLOR_PRINCIPAL }}>Dashboard Administrativo</h2>

      {/* Tarjetas KPI */}
      <Row className="g-4 mb-4">
        <Col xs={12} sm={6} md={4} lg={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Text className="text-muted mb-1">Ventas Totales</Card.Text>
                  <Card.Title className="mb-0" style={{ color: COLOR_PRINCIPAL }}>
                    ${kpis?.ventasTotal?.toLocaleString('es-CO') || '0'}
                  </Card.Title>
                </div>
                <div style={{ fontSize: '2rem', color: COLOR_PRINCIPAL }}>💰</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={4} lg={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Text className="text-muted mb-1">Cantidad de Ventas</Card.Text>
                  <Card.Title className="mb-0" style={{ color: COLOR_PRINCIPAL }}>
                    {kpis?.cantidadVentas || 0}
                  </Card.Title>
                </div>
                <div style={{ fontSize: '2rem', color: COLOR_PRINCIPAL }}>📊</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={4} lg={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Text className="text-muted mb-1">Stock Total</Card.Text>
                  <Card.Title className="mb-0" style={{ color: COLOR_PRINCIPAL }}>
                    {kpis?.stockTotal || 0}
                  </Card.Title>
                </div>
                <div style={{ fontSize: '2rem', color: COLOR_PRINCIPAL }}>📦</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={4} lg={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Text className="text-muted mb-1">Rotación Promedio</Card.Text>
                  <Card.Title className="mb-0" style={{ color: COLOR_PRINCIPAL }}>
                    {kpis?.rotacionPromedio || 0}%
                  </Card.Title>
                </div>
                <div style={{ fontSize: '2rem', color: COLOR_PRINCIPAL }}>🔄</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row className="g-4 mb-4">
        {/* Evolución Mensual */}
        <Col xs={12} lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Header style={{ backgroundColor: COLOR_PRINCIPAL, color: 'white' }}>
              <h5 className="mb-0">Evolución Mensual de Ventas</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolucionMensual}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke={COLOR_PRINCIPAL} strokeWidth={2} name="Total Ventas" />
                  <Line type="monotone" dataKey="cantidad" stroke="#00b366" strokeWidth={2} name="Cantidad Ventas" />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Ventas por Género */}
        <Col xs={12} lg={4}>
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
        {/* Ventas por Categoría */}
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
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Productos Más Vendidos */}
        <Col xs={12} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Header style={{ backgroundColor: COLOR_PRINCIPAL, color: 'white' }}>
              <h5 className="mb-0">Productos Más Vendidos</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productosMasVendidos.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ventas_mensuales" fill={COLOR_PRINCIPAL} name="Ventas Mensuales" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Productos con Baja Rotación */}
      {productosBajaRotacion.length > 0 && (
        <Row className="mb-4">
          <Col xs={12}>
            <Card className="shadow-sm border-0">
              <Card.Header style={{ backgroundColor: '#dc3545', color: 'white' }}>
                <h5 className="mb-0">⚠️ Productos con Baja Rotación</h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Rotación Mensual</th>
                        <th>Stock</th>
                        <th>Ventas Mensuales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productosBajaRotacion.map(producto => (
                        <tr key={producto.id}>
                          <td>{producto.nombre}</td>
                          <td>{producto.rotacion_mensual}%</td>
                          <td>{producto.cantidad}</td>
                          <td>{producto.ventas_mensuales}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

