import { DIRECCIONES } from './catalogos';

// Función utilitaria para normalizar a MAYÚSCULAS sin acentos y sanitizar contra XSS/Inyección (Estándar TIC)
export const normalizarTexto = (texto) => {
  if (!texto) return '';
  return texto
    .toString()
    .replace(/<[^>]*>?/gm, '') // Eliminar cualquier etiqueta HTML o script
    .replace(/^[=+\-@]+/, '') // Prevenir inyección de fórmulas
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();
};

// Estilo auxiliar para obtener el badge de cada dirección
export const obtenerEstiloDireccion = (nombreDir) => {
  const norm = normalizarTexto(nombreDir || '');
  const encontrada = DIRECCIONES.find((d) => normalizarTexto(d.nombre) === norm);
  return encontrada ? encontrada.color : 'bg-gray-100 text-gray-800 border-gray-300';
};

// Generador automático de folio por Dirección Municipal
export const generarFolioAutomatico = (direccionNombre, registros = []) => {
  const norm = normalizarTexto(direccionNombre || '');
  const dirObj = DIRECCIONES.find((d) => normalizarTexto(d.nombre) === norm) || DIRECCIONES[0];
  const existentesDir = registros.filter((r) => normalizarTexto(r.direccion) === norm);
  const consecutivo = String(existentesDir.length + 1).padStart(3, '0');
  return `BAL-${dirObj.prefijo}-${consecutivo}`;
};
