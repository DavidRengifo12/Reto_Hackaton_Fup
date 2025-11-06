import React from 'react'
import { Container, Row, Col, Button, Card } from 'react-bootstrap'
import './styles/Styles.css'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-white">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 shadow-sm">
        <Container>
          <div className="navbar-brand d-flex align-items-center">
            <div 
              className="me-2 d-flex align-items-center justify-content-center"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#4CAF50',
                borderRadius: '6px'
              }}
            >
              <i className="fas fa-leaf text-white"></i>
            </div>
            <span className="fw-bold fs-4" style={{ color: '#2E2E2E' }}>EcoModa 360</span>
          </div>
          
          <div className="navbar-nav d-none d-lg-flex flex-row me-auto ms-5">
            <a className="nav-link px-3 fw-medium" href="#" style={{ color: '#002f19' }}>Inicio</a>
            <a className="nav-link px-3 fw-medium" href="#" style={{ color: '#002f19' }}>Servicios</a>
            <a className="nav-link px-3 fw-medium" href="#" style={{ color: '#002f19' }}>Contacto</a>
          </div>

          <div className="d-flex gap-2">
            <Button
              onClick={() => navigate('/login')}
              variant="link"
              className="text-decoration-none fw-medium"
              style={{ color: '#002f19' }}
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('/register')}
              className="px-4 py-2 fw-medium"
              style={{
                backgroundColor: '#002f19',
                border: 'none',
                borderRadius: '6px'
              }}
            >
              Sign up
            </Button>
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <section className="py-5" style={{ backgroundColor: '#F5F7FA' }}>
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={6} className="pe-lg-5">
              <h1 className="display-4 fw-bold mb-4" style={{ color: '#2E2E2E' }}>
                Reserva los mejores <span style={{ color: '#002f19' }}>computadores</span> con nosotros
              </h1>
              <p className="fs-5 text-muted mb-4">
                Has reservas de manera facil, rapida y segura.
              </p>
              <Button
                onClick={() => navigate('/register')}
                className="px-4 py-3 fw-medium"
                style={{
                  backgroundColor: '#002f19',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1.1rem'
                }}
              >
                Comenzar Ahora
              </Button>
            </Col>
            <Col lg={6} className="text-center">
              <div className="position-relative">
                <img
                  src="https://cdn.pixabay.com/photo/2020/01/26/20/14/computer-4795762_1280.jpg"
                  alt="Profesionales trabajando"
                  className="img-fluid rounded-3"
                  style={{
                    maxHeight: '400px',
                    objectFit: 'cover',
                    filter: 'brightness(1.1)'
                  }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3" style={{ color: '#2E2E2E' }}>
              Gestiona todo tu negocio desde una sola plataforma
            </h2>
            <p className="text-muted">Soluciones integrales para empresas modernas que buscan eficiencia y crecimiento</p>
          </div>
          
          <Row className="g-4">
            <Col md={4}>
              <Card className="border-0 text-center h-100 p-4">
                <div className="mb-3">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: '#E8F5E8'
                    }}
                  >
                    <i className="fas fa-users fa-2x" style={{ color: '#4CAF50' }}></i>
                  </div>
                </div>
                <Card.Body className="p-0">
                  <h5 className="fw-bold mb-3" style={{ color: '#2E2E2E' }}>Gestión de Usuarios</h5>
                  <p className="text-muted small">
                    Sistema completo de administración de usuarios con automatización de procesos y pagos
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="border-0 text-center h-100 p-4">
                <div className="mb-3">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: '#E8F5E8'
                    }}
                  >
                    <i className="fas fa-building fa-2x" style={{ color: '#4CAF50' }}></i>
                  </div>
                </div>
                <Card.Body className="p-0">
                  <h5 className="fw-bold mb-3" style={{ color: '#2E2E2E' }}>Análisis y Reportes</h5>
                  <p className="text-muted small">
                    Herramientas avanzadas de análisis para tomar decisiones basadas en datos reales
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="border-0 text-center h-100 p-4">
                <div className="mb-3">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: '#E8F5E8'
                    }}
                  >
                    <i className="fas fa-handshake fa-2x" style={{ color: '#4CAF50' }}></i>
                  </div>
                </div>
                <Card.Body className="p-0">
                  <h5 className="fw-bold mb-3" style={{ color: '#2E2E2E' }}>Colaboración en Equipo</h5>
                  <p className="text-muted small">
                    Facilita la comunicación y colaboración entre equipos de trabajo distribuidos
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Security Section */}
      <section className="py-5" style={{ backgroundColor: '#F5F7FA' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="text-center">
                <div 
                  className="d-inline-block p-4 rounded-3"
                  style={{ backgroundColor: '#E8F5E8' }}
                >
                  <i className="fas fa-shield-alt fa-4x" style={{ color: '#4CAF50' }}></i>
                  <div className="mt-3">
                    <i className="fas fa-user-check fa-2x" style={{ color: '#4CAF50' }}></i>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <h2 className="fw-bold mb-4" style={{ color: '#2E2E2E' }}>
                Seguridad y confiabilidad garantizada
              </h2>
              <p className="text-muted mb-4">
                Protegemos tu información con los más altos estándares de seguridad. Encriptación de extremo a extremo, 
                autenticación de dos factores y respaldos automáticos para garantizar que tus datos estén siempre seguros 
                y disponibles cuando los necesites.
              </p>
              <Button
                className="px-4 py-2 fw-medium"
                style={{
                  backgroundColor: '#4CAF50',
                  border: 'none',
                  borderRadius: '6px'
                }}
              >
                Learn More
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h2 className="fw-bold mb-3" style={{ color: '#2E2E2E' }}>
                Impulsando el <span style={{ color: '#4CAF50' }}>crecimiento empresarial</span>
              </h2>
              <p className="text-muted mb-4">Resultados que hablan por sí solos gracias a nuestro compromiso con la excelencia</p>
            </Col>
            <Col lg={6}>
              <Row className="g-4">
                <Col sm={6}>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-users fa-2x me-3" style={{ color: '#4CAF50' }}></i>
                    <div>
                      <h4 className="fw-bold mb-0" style={{ color: '#2E2E2E' }}>2,245,341</h4>
                      <small className="text-muted">Usuarios Activos</small>
                    </div>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-hand-holding-heart fa-2x me-3" style={{ color: '#4CAF50' }}></i>
                    <div>
                      <h4 className="fw-bold mb-0" style={{ color: '#2E2E2E' }}>46,328</h4>
                      <small className="text-muted">Empresas</small>
                    </div>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-calendar-check fa-2x me-3" style={{ color: '#4CAF50' }}></i>
                    <div>
                      <h4 className="fw-bold mb-0" style={{ color: '#2E2E2E' }}>828,867</h4>
                      <small className="text-muted">Proyectos Completados</small>
                    </div>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-credit-card fa-2x me-3" style={{ color: '#4CAF50' }}></i>
                    <div>
                      <h4 className="fw-bold mb-0" style={{ color: '#2E2E2E' }}>1,926,436</h4>
                      <small className="text-muted">Transacciones</small>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Policies Section */}
      <section className="py-5" style={{ backgroundColor: '#F5F7FA' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="text-center">
                <div 
                  className="d-inline-block p-4 rounded-3"
                  style={{ backgroundColor: '#E8F5E8' }}
                >
                  <i className="fas fa-mobile-alt fa-4x" style={{ color: '#4CAF50' }}></i>
                  <div className="position-relative mt-3">
                    <i className="fas fa-lock fa-2x" style={{ color: '#4CAF50' }}></i>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <h2 className="fw-bold mb-4" style={{ color: '#2E2E2E' }}>
                Transparencia y compromiso
              </h2>
              <p className="text-muted mb-4">
                Creemos en la transparencia total con nuestros usuarios. Nuestras políticas están diseñadas 
                para proteger tu privacidad y garantizar el mejor servicio posible. Cumplimos con todas las 
                regulaciones internacionales de protección de datos y mantenemos los más altos estándares 
                éticos en todas nuestras operaciones.
              </p>
              <Button
                className="px-4 py-2 fw-medium"
                style={{
                  backgroundColor: '#4CAF50',
                  border: 'none',
                  borderRadius: '6px'
                }}
              >
                Conoce más
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-5">
        <Container>
          <div className="text-center">
            <h2 className="fw-bold mb-4" style={{ color: '#2E2E2E' }}>
              ¿Listo para comenzar? Contáctanos
            </h2>
            <Button
              className="px-5 py-3 fw-medium"
              style={{
                backgroundColor: '#4CAF50',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1.1rem'
              }}
            >
              Contáctanos →
            </Button>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-4" style={{ backgroundColor: '#263238' }}>
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <div className="d-flex align-items-center text-white">
                <div 
                  className="me-2 d-flex align-items-center justify-content-center"
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#4CAF50',
                    borderRadius: '6px'
                  }}
                >
                  <i className="fas fa-leaf"></i>
                </div>
                <span className="fw-bold fs-5">TechPlatform</span>
              </div>
              <p className="text-muted small mt-2 mb-0">Copyright © 2024 TechPlatform ltd.</p>
            </Col>
            <Col md={3}>
              <h6 className="text-white fw-bold mb-2">Empresa</h6>
              <div className="d-flex flex-column">
                <a href="#" className="text-muted text-decoration-none small mb-1">Acerca de nosotros</a>
                <a href="#" className="text-muted text-decoration-none small mb-1">Carreras</a>
                <a href="#" className="text-muted text-decoration-none small">Blog</a>
              </div>
            </Col>
            <Col md={3}>
              <h6 className="text-white fw-bold mb-2">Soporte</h6>
              <div className="d-flex flex-column">
                <a href="#" className="text-muted text-decoration-none small mb-1">Términos de servicio</a>
                <a href="#" className="text-muted text-decoration-none small mb-1">Política de privacidad</a>
                <a href="#" className="text-muted text-decoration-none small">Centro de ayuda</a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* Back to V1 Button */}
      <div className="position-fixed bottom-0 end-0 p-3">
        <Button
          onClick={() => navigate('/')}
          variant="outline-primary"
          className="rounded-circle"
          style={{ width: '50px', height: '50px' }}
        >
          <i className="fas fa-arrow-left"></i>
        </Button>
      </div>
    </div>
  )
}

export default LandingPage;
