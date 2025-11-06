/**
 * Servicio para gestionar ventas en Supabase
 * Funcionalidades: Procesar ventas, registrar compras, obtener historial
 */
import supabase from '../Supabase';
import { limpiarCarrito } from './carritoService';
import { actualizarStock } from './productoService';

/**
 * Crea una nueva venta desde el carrito
 * @param {string} usuarioId - ID del usuario
 * @param {Array} itemsCarrito - Items del carrito con productos
 * @returns {Promise<Object>} Venta creada
 */
export const procesarVenta = async (usuarioId, itemsCarrito) => {
  try {
    if (!itemsCarrito || itemsCarrito.length === 0) {
      throw new Error('El carrito está vacío');
    }

    // Calcular total de la venta
    const total = itemsCarrito.reduce((suma, item) => {
      const precioProducto = item.productos?.precio || 0;
      return suma + (precioProducto * item.cantidad);
    }, 0);

    // Crear la venta
    const { data: venta, error: errorVenta } = await supabase
      .from('ventas')
      .insert([{
        usuario_id: usuarioId,
        total: total,
        fecha: new Date().toISOString()
      }])
      .select()
      .single();

    if (errorVenta) throw errorVenta;

    // Crear los detalles de la venta
    const detallesVenta = itemsCarrito.map(item => ({
      venta_id: venta.id,
      producto_id: item.producto_id,
      cantidad: item.cantidad,
      precio_unitario: item.productos?.precio || 0,
      subtotal: (item.productos?.precio || 0) * item.cantidad
    }));

    const { error: errorDetalles } = await supabase
      .from('detalle_compras')
      .insert(detallesVenta);

    if (errorDetalles) throw errorDetalles;

    // Actualizar stock de productos y ventas mensuales
    for (const item of itemsCarrito) {
      const producto = item.productos;
      if (producto) {
        // Actualizar stock
        const nuevoStock = producto.cantidad - item.cantidad;
        await actualizarStock(producto.id, nuevoStock);

        // Actualizar ventas mensuales del producto
        const { data: productoActual } = await supabase
          .from('productos')
          .select('ventas_mensuales')
          .eq('id', producto.id)
          .single();

        if (productoActual) {
          const nuevasVentasMensuales = (productoActual.ventas_mensuales || 0) + item.cantidad;
          await supabase
            .from('productos')
            .update({ ventas_mensuales: nuevasVentasMensuales })
            .eq('id', producto.id);
        }
      }
    }

    // Limpiar el carrito
    await limpiarCarrito(usuarioId);

    // Registrar en logs
    await registrarLog('venta', `Venta procesada: ${venta.id} - Total: $${total}`);

    return venta;
  } catch (error) {
    console.error('Error al procesar venta:', error);
    throw error;
  }
};

/**
 * Obtiene todas las ventas
 * @param {Object} filtros - Filtros opcionales (fechaDesde, fechaHasta)
 * @returns {Promise<Array>} Lista de ventas
 */
export const obtenerVentas = async (filtros = {}) => {
  try {
    let query = supabase
      .from('ventas')
      .select(`
        *,
        usuarios (*),
        detalle_compras (
          *,
          productos (*)
        )
      `)
      .order('fecha', { ascending: false });

    if (filtros.fechaDesde) {
      query = query.gte('fecha', filtros.fechaDesde);
    }

    if (filtros.fechaHasta) {
      query = query.lte('fecha', filtros.fechaHasta);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    throw error;
  }
};

/**
 * Obtiene ventas de un usuario específico
 * @param {string} usuarioId - ID del usuario
 * @returns {Promise<Array>} Lista de ventas del usuario
 */
export const obtenerVentasPorUsuario = async (usuarioId) => {
  try {
    const { data, error } = await supabase
      .from('ventas')
      .select(`
        *,
        detalle_compras (
          *,
          productos (*)
        )
      `)
      .eq('usuario_id', usuarioId)
      .order('fecha', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener ventas del usuario:', error);
    throw error;
  }
};

/**
 * Obtiene ventas del mes actual
 * @returns {Promise<Array>} Lista de ventas del mes
 */
export const obtenerVentasMesActual = async () => {
  try {
    const fechaInicio = new Date();
    fechaInicio.setDate(1);
    fechaInicio.setHours(0, 0, 0, 0);

    const fechaFin = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + 1);
    fechaFin.setDate(0);
    fechaFin.setHours(23, 59, 59, 999);

    return await obtenerVentas({
      fechaDesde: fechaInicio.toISOString(),
      fechaHasta: fechaFin.toISOString()
    });
  } catch (error) {
    console.error('Error al obtener ventas del mes:', error);
    throw error;
  }
};

/**
 * Registra un log en la tabla de logs
 * @param {string} tipo - Tipo de log
 * @param {string} mensaje - Mensaje del log
 * @returns {Promise<void>}
 */
const registrarLog = async (tipo, mensaje) => {
  try {
    await supabase
      .from('logs')
      .insert([{
        tipo: tipo,
        mensaje: mensaje,
        fecha: new Date().toISOString()
      }]);
  } catch (error) {
    console.error('Error al registrar log:', error);
    // No lanzar error para no interrumpir el flujo principal
  }
};

