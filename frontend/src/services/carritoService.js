/**
 * Servicio para gestionar el carrito de compras en Supabase
 * Funcionalidades: Agregar, eliminar, actualizar items del carrito
 */
import supabase from '../Supabase';

/**
 * Obtiene el carrito de un usuario
 * @param {string} usuarioId - ID del usuario
 * @returns {Promise<Array>} Lista de items en el carrito
 */
export const obtenerCarrito = async (usuarioId) => {
  try {
    const { data, error } = await supabase
      .from('carrito')
      .select(`
        *,
        productos (*)
      `)
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    throw error;
  }
};

/**
 * Agrega un producto al carrito
 * @param {string} usuarioId - ID del usuario
 * @param {string} productoId - ID del producto
 * @param {number} cantidad - Cantidad a agregar
 * @returns {Promise<Object>} Item agregado al carrito
 */
export const agregarAlCarrito = async (usuarioId, productoId, cantidad = 1) => {
  try {
    // Verificar si el producto ya está en el carrito
    const { data: itemExistente } = await supabase
      .from('carrito')
      .select('*')
      .eq('usuario_id', usuarioId)
      .eq('producto_id', productoId)
      .single();

    if (itemExistente) {
      // Si ya existe, actualizar la cantidad
      const nuevaCantidad = itemExistente.cantidad + cantidad;
      const { data, error } = await supabase
        .from('carrito')
        .update({ cantidad: nuevaCantidad })
        .eq('id', itemExistente.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Si no existe, crear nuevo item
      const { data, error } = await supabase
        .from('carrito')
        .insert([{
          usuario_id: usuarioId,
          producto_id: productoId,
          cantidad: cantidad
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    throw error;
  }
};

/**
 * Actualiza la cantidad de un item en el carrito
 * @param {string} itemId - ID del item del carrito
 * @param {number} cantidad - Nueva cantidad
 * @returns {Promise<Object>} Item actualizado
 */
export const actualizarCantidadCarrito = async (itemId, cantidad) => {
  try {
    if (cantidad <= 0) {
      // Si la cantidad es 0 o menor, eliminar el item
      return await eliminarDelCarrito(itemId);
    }

    const { data, error } = await supabase
      .from('carrito')
      .update({ cantidad })
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error al actualizar cantidad del carrito:', error);
    throw error;
  }
};

/**
 * Elimina un item del carrito
 * @param {string} itemId - ID del item del carrito
 * @returns {Promise<void>}
 */
export const eliminarDelCarrito = async (itemId) => {
  try {
    const { error } = await supabase
      .from('carrito')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    throw error;
  }
};

/**
 * Limpia todo el carrito de un usuario
 * @param {string} usuarioId - ID del usuario
 * @returns {Promise<void>}
 */
export const limpiarCarrito = async (usuarioId) => {
  try {
    const { error } = await supabase
      .from('carrito')
      .delete()
      .eq('usuario_id', usuarioId);

    if (error) throw error;
  } catch (error) {
    console.error('Error al limpiar carrito:', error);
    throw error;
  }
};

