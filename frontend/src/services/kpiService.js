/**
 * Servicio para calcular y obtener KPIs (Indicadores Clave de Rendimiento)
 * Funcionalidades: Cálculo de métricas, rotación, estadísticas
 */
import supabase from '../Supabase';
import { obtenerVentasMesActual } from './ventaService';

/**
 * Obtiene todos los KPIs actualizados
 * @returns {Promise<Object>} Objeto con todos los KPIs
 */
export const obtenerKPIs = async () => {
  try {
    const ventas = await obtenerVentasMesActual();
    const productos = await obtenerProductosConStock();

    const ventasTotal = ventas.reduce((suma, venta) => suma + (venta.total || 0), 0);
    const cantidadVentas = ventas.length;
    const stockTotal = productos.reduce((suma, prod) => suma + (prod.cantidad || 0), 0);
    const productosConStockBajo = productos.filter(p => (p.cantidad || 0) < 10).length;

    // Calcular rotación mensual promedio
    const rotacionPromedio = productos.length > 0
      ? productos.reduce((suma, prod) => suma + (prod.rotacion_mensual || 0), 0) / productos.length
      : 0;

    const kpis = {
      ventasTotal,
      cantidadVentas,
      stockTotal,
      productosConStockBajo,
      rotacionPromedio: Math.round(rotacionPromedio * 100) / 100,
      productosTotal: productos.length
    };

    // Guardar KPIs en la base de datos
    await guardarKPIs(kpis);

    return kpis;
  } catch (error) {
    console.error('Error al obtener KPIs:', error);
    throw error;
  }
};

/**
 * Obtiene productos con su stock actual
 * @returns {Promise<Array>} Lista de productos
 */
const obtenerProductosConStock = async () => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
};

/**
 * Guarda los KPIs en la tabla kpi
 * @param {Object} kpis - Objeto con los KPIs
 * @returns {Promise<void>}
 */
const guardarKPIs = async (kpis) => {
  try {
    // Obtener el último registro de KPI
    const { data: kpiExistente } = await supabase
      .from('kpi')
      .select('*')
      .order('fecha', { ascending: false })
      .limit(1)
      .single();

    const fechaActual = new Date().toISOString().split('T')[0]; // Solo la fecha

    if (kpiExistente && kpiExistente.fecha === fechaActual) {
      // Actualizar el registro existente del día
      await supabase
        .from('kpi')
        .update({
          ventas_total: kpis.ventasTotal,
          cantidad_ventas: kpis.cantidadVentas,
          stock_total: kpis.stockTotal,
          productos_stock_bajo: kpis.productosConStockBajo,
          rotacion_promedio: kpis.rotacionPromedio,
          productos_total: kpis.productosTotal
        })
        .eq('id', kpiExistente.id);
    } else {
      // Crear nuevo registro
      await supabase
        .from('kpi')
        .insert([{
          fecha: fechaActual,
          ventas_total: kpis.ventasTotal,
          cantidad_ventas: kpis.cantidadVentas,
          stock_total: kpis.stockTotal,
          productos_stock_bajo: kpis.productosConStockBajo,
          rotacion_promedio: kpis.rotacionPromedio,
          productos_total: kpis.productosTotal
        }]);
    }
  } catch (error) {
    console.error('Error al guardar KPIs:', error);
    // No lanzar error para no interrumpir el flujo
  }
};

/**
 * Obtiene estadísticas de productos más vendidos
 * @param {number} limite - Número de productos a retornar
 * @returns {Promise<Array>} Lista de productos más vendidos
 */
export const obtenerProductosMasVendidos = async (limite = 10) => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('ventas_mensuales', { ascending: false })
      .limit(limite);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener productos más vendidos:', error);
    throw error;
  }
};

/**
 * Obtiene estadísticas de ventas por categoría
 * @returns {Promise<Array>} Lista de categorías con totales
 */
export const obtenerVentasPorCategoria = async () => {
  try {
    const ventas = await obtenerVentasMesActual();
    const categorias = {};

    ventas.forEach(venta => {
      venta.detalle_compras?.forEach(detalle => {
        const categoria = detalle.productos?.tipo_ropa || 'Sin categoría';
        if (!categorias[categoria]) {
          categorias[categoria] = { nombre: categoria, total: 0, cantidad: 0 };
        }
        categorias[categoria].total += detalle.subtotal || 0;
        categorias[categoria].cantidad += detalle.cantidad || 0;
      });
    });

    return Object.values(categorias);
  } catch (error) {
    console.error('Error al obtener ventas por categoría:', error);
    return [];
  }
};

/**
 * Obtiene estadísticas de ventas por género
 * @returns {Promise<Array>} Lista de géneros con totales
 */
export const obtenerVentasPorGenero = async () => {
  try {
    const ventas = await obtenerVentasMesActual();
    const generos = {};

    ventas.forEach(venta => {
      venta.detalle_compras?.forEach(detalle => {
        const genero = detalle.productos?.genero || 'Sin género';
        if (!generos[genero]) {
          generos[genero] = { nombre: genero, total: 0, cantidad: 0 };
        }
        generos[genero].total += detalle.subtotal || 0;
        generos[genero].cantidad += detalle.cantidad || 0;
      });
    });

    return Object.values(generos);
  } catch (error) {
    console.error('Error al obtener ventas por género:', error);
    return [];
  }
};

/**
 * Obtiene estadísticas de ventas por talla
 * @returns {Promise<Array>} Lista de tallas con totales
 */
export const obtenerVentasPorTalla = async () => {
  try {
    const ventas = await obtenerVentasMesActual();
    const tallas = {};

    ventas.forEach(venta => {
      venta.detalle_compras?.forEach(detalle => {
        const talla = detalle.productos?.talla || 'Sin talla';
        if (!tallas[talla]) {
          tallas[talla] = { nombre: talla, total: 0, cantidad: 0 };
        }
        tallas[talla].total += detalle.subtotal || 0;
        tallas[talla].cantidad += detalle.cantidad || 0;
      });
    });

    return Object.values(tallas);
  } catch (error) {
    console.error('Error al obtener ventas por talla:', error);
    return [];
  }
};

/**
 * Obtiene evolución mensual de ventas
 * @param {number} meses - Número de meses a retornar
 * @returns {Promise<Array>} Lista de meses con totales
 */
export const obtenerEvolucionMensual = async (meses = 6) => {
  try {
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - meses);
    fechaInicio.setDate(1);
    fechaInicio.setHours(0, 0, 0, 0);

    const { data: ventas, error } = await supabase
      .from('ventas')
      .select('*')
      .gte('fecha', fechaInicio.toISOString())
      .order('fecha', { ascending: true });

    if (error) throw error;

    const mesesVentas = {};
    ventas.forEach(venta => {
      const fecha = new Date(venta.fecha);
      const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      const nombreMes = fecha.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
      
      if (!mesesVentas[mes]) {
        mesesVentas[mes] = { mes: nombreMes, total: 0, cantidad: 0 };
      }
      mesesVentas[mes].total += venta.total || 0;
      mesesVentas[mes].cantidad += 1;
    });

    return Object.values(mesesVentas);
  } catch (error) {
    console.error('Error al obtener evolución mensual:', error);
    return [];
  }
};

/**
 * Obtiene productos con baja rotación
 * @param {number} umbral - Umbral de rotación mensual
 * @returns {Promise<Array>} Lista de productos con baja rotación
 */
export const obtenerProductosBajaRotacion = async (umbral = 5) => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .lt('rotacion_mensual', umbral)
      .order('rotacion_mensual', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener productos de baja rotación:', error);
    throw error;
  }
};

