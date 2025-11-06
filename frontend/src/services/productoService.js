/**
 * Servicio para gestionar productos en Supabase
 * Funcionalidades: CRUD completo de productos, validación de duplicados
 */
import supabase from '../Supabase';

/**
 * Obtiene todos los productos
 * @returns {Promise<Array>} Lista de productos
 */
export const obtenerProductos = async () => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};

/**
 * Obtiene un producto por ID
 * @param {string} id - ID del producto
 * @returns {Promise<Object>} Producto encontrado
 */
export const obtenerProductoPorId = async (id) => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error al obtener producto:', error);
    throw error;
  }
};

/**
 * Crea un nuevo producto con validación de duplicados
 * Valida por nombre o referencia
 * @param {Object} producto - Datos del producto
 * @returns {Promise<Object>} Producto creado
 */
export const crearProducto = async (producto) => {
  try {
    // Validar duplicados por nombre
    if (producto.nombre) {
      const { data: existeNombre } = await supabase
        .from('productos')
        .select('id')
        .eq('nombre', producto.nombre.trim())
        .single();

      if (existeNombre) {
        throw new Error('Ya existe un producto con este nombre');
      }
    }

    // Validar duplicados por referencia si existe
    if (producto.referencia) {
      const { data: existeRef } = await supabase
        .from('productos')
        .select('id')
        .eq('referencia', producto.referencia.trim())
        .single();

      if (existeRef) {
        throw new Error('Ya existe un producto con esta referencia');
      }
    }

    const { data, error } = await supabase
      .from('productos')
      .insert([{
        nombre: producto.nombre?.trim(),
        tipo_ropa: producto.tipo_ropa,
        talla: producto.talla,
        genero: producto.genero,
        precio: producto.precio,
        cantidad: producto.cantidad || 0,
        referencia: producto.referencia?.trim() || null,
        descripcion: producto.descripcion?.trim() || null,
        ventas_mensuales: 0,
        rotacion_mensual: 0
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
};

/**
 * Actualiza un producto existente
 * @param {string} id - ID del producto
 * @param {Object} producto - Datos a actualizar
 * @returns {Promise<Object>} Producto actualizado
 */
export const actualizarProducto = async (id, producto) => {
  try {
    // Validar duplicados si se cambia el nombre
    if (producto.nombre) {
      const { data: existeNombre } = await supabase
        .from('productos')
        .select('id')
        .eq('nombre', producto.nombre.trim())
        .neq('id', id)
        .single();

      if (existeNombre) {
        throw new Error('Ya existe otro producto con este nombre');
      }
    }

    // Validar duplicados si se cambia la referencia
    if (producto.referencia) {
      const { data: existeRef } = await supabase
        .from('productos')
        .select('id')
        .eq('referencia', producto.referencia.trim())
        .neq('id', id)
        .single();

      if (existeRef) {
        throw new Error('Ya existe otro producto con esta referencia');
      }
    }

    const { data, error } = await supabase
      .from('productos')
      .update({
        nombre: producto.nombre?.trim(),
        tipo_ropa: producto.tipo_ropa,
        talla: producto.talla,
        genero: producto.genero,
        precio: producto.precio,
        cantidad: producto.cantidad,
        referencia: producto.referencia?.trim() || null,
        descripcion: producto.descripcion?.trim() || null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

/**
 * Elimina un producto
 * @param {string} id - ID del producto
 * @returns {Promise<void>}
 */
export const eliminarProducto = async (id) => {
  try {
    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};

/**
 * Actualiza el stock de un producto
 * @param {string} id - ID del producto
 * @param {number} cantidad - Nueva cantidad en stock
 * @returns {Promise<Object>} Producto actualizado
 */
export const actualizarStock = async (id, cantidad) => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .update({ cantidad })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    throw error;
  }
};

/**
 * Obtiene productos filtrados por categoría, género, talla
 * @param {Object} filtros - Objeto con filtros (tipo_ropa, genero, talla)
 * @returns {Promise<Array>} Lista de productos filtrados
 */
export const obtenerProductosFiltrados = async (filtros = {}) => {
  try {
    let query = supabase.from('productos').select('*');

    if (filtros.tipo_ropa) {
      query = query.eq('tipo_ropa', filtros.tipo_ropa);
    }

    if (filtros.genero) {
      query = query.eq('genero', filtros.genero);
    }

    if (filtros.talla) {
      query = query.eq('talla', filtros.talla);
    }

    // Solo productos con stock disponible
    if (filtros.soloDisponibles) {
      query = query.gt('cantidad', 0);
    }

    const { data, error } = await query.order('nombre', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener productos filtrados:', error);
    throw error;
  }
};

/**
 * Busca productos por nombre o referencia
 * @param {string} termino - Término de búsqueda
 * @returns {Promise<Array>} Lista de productos encontrados
 */
export const buscarProductos = async (termino) => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .or(`nombre.ilike.%${termino}%,referencia.ilike.%${termino}%`)
      .order('nombre', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al buscar productos:', error);
    throw error;
  }
};

