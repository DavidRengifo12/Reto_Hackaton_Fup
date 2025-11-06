import React, { useState } from 'react'
import { Button, Card, Col, Container, Form, Row, InputGroup } from 'react-bootstrap'
import supabase from '../Supabase'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi'

export default function Register() { //REAJUSTAR ESTILOS
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [rol] = useState("usuario")

  const navegar = useNavigate()


  const handleregister = async (e) => {
    e.preventDefault()
    try {
        const {data, error} = await supabase.auth.signUp({
        email,
        password,
        options:{
          data:{
            nombre, 
            phone,
            rol
          }
        }
      })
      if(error){
        toast.error("Error al resgitrarlo datos no validos")
      }

      if(data.user){
        toast.success('Registro exitoso')
        navegar('/dash-user')
      }

      setNombre("")
      setEmail("")
      setPassword("")
      setPhone("")
    } catch (error) {
      toast.error("Error con el registro")
      console.log(error)
    }
  }



  return (
    <div className='min-vh-100 d-flex align-items-center' style={{ background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <Container>
        <Row className='justify-content-center'>
          <Col xs={12} md={8} lg={6} xl={5}>
            <Card className='shadow-lg border-0 rounded-4'>
              <Card.Header className='bg-white border-0 pt-4'>
                <Card.Title as='div' className='text-center'>
                  <h3 className='fw-bold m-0'>Crear cuenta</h3>
                  <div className='text-muted mt-1'>Regístrate para comenzar</div>
                </Card.Title>
              </Card.Header>
              <Card.Body className='px-4 pb-4'>
                <Form onSubmit={handleregister}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Nombre y apellidos</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FiUser /></InputGroup.Text>
                      <Form.Control
                        type='text'
                        placeholder='Nombre completo'
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Label>Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FiMail /></InputGroup.Text>
                      <Form.Control
                        type='email'
                        placeholder='tu@email.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Label>Teléfono</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FiPhone /></InputGroup.Text>
                      <Form.Control
                        type='text'
                        placeholder='Ej: 3001234567'
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
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
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <div className='d-grid'>
                    <Button type='submit' size='lg' variant='success'>Registrarme</Button>
                  </div>
                </Form>

                <div className='text-center mt-3'>
                  ¿Ya tienes cuenta? <Link to='/login' className='text-success text-decoration-none fw-semibold'>Inicia sesión</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
