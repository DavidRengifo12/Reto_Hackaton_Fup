import React, { useState } from 'react'
import { Card, Col, Container, Form, Row, Button, InputGroup } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import supabase from '../Supabase'
import toast from 'react-hot-toast'
import { FiMail, FiLock } from 'react-icons/fi'

export default function Login() { //REAJUSTAR ESTILOS
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navegar = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        const emailTrim = email.trim()
        const passwordVal = password

        if (!emailTrim || !passwordVal) {
            toast.error('Email y password son requeridos')
            return
        }
        try {
            const {data, error} = await supabase.auth.signInWithPassword({
            email: emailTrim, 
            password: passwordVal
            })
            if(error){
                toast.error("Datos invalidos del email o password") 
                console.log(error)
                return
            }

            if(data?.user){
                const {data: perfil, error: errorPerfil} = await supabase
                .from('usuarios')
                .select('rol')
                .eq('id', data.user.id)
                .single()

                if(errorPerfil){
                    toast.error('Datos no validos')
                }

                toast.success('Inicio de sesion exitoso')

                if(perfil?.rol === "administrador") {
                    navegar('/dash-admin')
                }else{
                    navegar('/dash-user')
                }
            }
        } catch (error) {
            toast.error("Error con el login")
            console.log(error)
        }
    }

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6} xl={5}>
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Header className='bg-white border-0 pt-4'>
                <Card.Title as="div" className='text-center'>
                  <h3 className='fw-bold m-0'>Iniciar sesión</h3>
                  <div className="text-muted mt-1">Accede a tu cuenta para continuar</div>
                </Card.Title>
              </Card.Header>
              <Card.Body className='px-4 pb-4'>
                <Form onSubmit={handleLogin}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FiMail /></InputGroup.Text>
                      <Form.Control
                        type='email'
                        placeholder='tu@email.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FiLock /></InputGroup.Text>
                      <Form.Control
                        type='password'
                        placeholder='••••••••'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>

                  <div className="d-grid">
                    <Button type="submit" size='lg' variant='success'>Entrar</Button>
                  </div>
                </Form>

                <div className='text-center mt-3'>
                  ¿No tienes cuenta? <Link to="/register" className='text-success text-decoration-none fw-semibold'>Regístrate gratis</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
