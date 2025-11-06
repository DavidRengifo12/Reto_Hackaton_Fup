/**
 * Servicio para gestionar usuarios en Supabase
 * Funcionalidades: Crear administradores, obtener usuarios
 */
import supabase from '../Supabase';

/**
 * Obtiene todos los usuarios
 * @returns {Promise<Array>} Lista de usuarios
 */
export const obtenerUsuarios = async () => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

/**
 * Crea un nuevo administrador
 * @param {Object} datosUsuario - Datos del usuario (email, password, nombre, phone)
 * @returns {Promise<Object>} Usuario creado
 */
export const crearAdministrador = async (datosUsuario) => {
  try {
    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: datosUsuario.email.trim(),
      password: datosUsuario.password,
      options: {
        data: {
          nombre: datosUsuario.nombre.trim(),
          phone: datosUsuario.phone?.trim() || null
        }
      }
    });

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error('No se pudo crear el usuario en autenticación');
    }

    // Crear registro en la tabla usuarios
    const { data: usuario, error: usuarioError } = await supabase
      .from('usuarios')
      .insert([{
        id: authData.user.id,
        email: datosUsuario.email.trim(),
        nombre: datosUsuario.nombre.trim(),
        phone: datosUsuario.phone?.trim() || null,
        rol: 'administrador'
      }])
      .select()
      .single();

    if (usuarioError) {
      // Si falla la creación en usuarios, intentar eliminar el usuario de auth
      await supabase.auth.admin.deleteUser(authData.user.id).catch(() => {});
      throw usuarioError;
    }

    return usuario;
  } catch (error) {
    console.error('Error al crear administrador:', error);
    throw error;
  }
};

/**
 * Obtiene un usuario por ID
 * @param {string} id - ID del usuario
 * @returns {Promise<Object>} Usuario encontrado
 */
export const obtenerUsuarioPorId = async (id) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
};

/**
 * Obtiene usuarios por rol
 * @param {string} rol - Rol a filtrar ('administrador' o 'usuario')
 * @returns {Promise<Array>} Lista de usuarios con ese rol
 */
export const obtenerUsuariosPorRol = async (rol) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('rol', rol)
      .order('nombre', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener usuarios por rol:', error);
    throw error;
  }
};

