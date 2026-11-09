import { DIRECCIONES } from './catalogos';
import { normalizarTexto } from './texto';
import { sanitizarCeldaCSV } from './seguridad';
import { DATOS_ATENCION_CIUDADANA_CEMENTO } from './datosAtencionCiudadana';

// Normalizador inteligente de localidades del Municipio de Balancán
export const normalizarLocalidadBalancan = (comunidadRaw) => {
  if (!comunidadRaw) return 'Cabecera Municipal (Balancán)';
  const u = normalizarTexto(comunidadRaw);

  if (
    u.includes('CABECERA') ||
    u.includes('SAN JOAQUIN') ||
    u.includes('GUADALUPE CABECERA') ||
    u.includes('BRIGADA') ||
    u.includes('FLORES')
  ) {
    return 'Cabecera Municipal (Balancán)';
  }
  if (u.includes('HULERIA')) return 'Poblado Hulería';
  if (u.includes('MACTUN')) return 'Poblado Mactún';
  if (u.includes('NETZAHUALCOYOTL') || u.includes('SANTA ANA')) {
    return 'Poblado Netzahualcóyotl (Santa Ana)';
  }
  if (u.includes('AGRICULTORES')) return 'Ejido Agricultores 1ra Sección';
  if (u.includes('ANEXO')) return 'Ejido Anexo Balancán';
  if (u.includes('APATZINGAN')) return 'Ejido Apatzingán';
  if (u.includes('CHACABITA')) return 'Ejido Chacabita';
  if (u.includes('JAHUACTAL')) return 'Ejido Jahuactal';
  if (u.includes('PALMAS')) return 'Ejido Las Palmas';
  if (u.includes('SAN JUAN')) return 'Ejido San Juan';
  if (u.includes('VICENTE GUERRERO')) return 'Ejido Vicente Guerrero';
  if (u.includes('ARENAL')) return 'Poblado Arenal';
  if (u.includes('MULTE')) return 'Poblado Multé';
  if (u.includes('TRIUNFO')) return 'Villa El Triunfo';
  if (u.includes('OJO DE AGUA')) return 'Ejido Ojo de Agua';
  if (u.includes('PLAN DE GUADALUPE')) return 'Col. Plan de Guadalupe';
  if (u.includes('SAN PEDRO')) return 'Poblado San Pedro';
  if (u.includes('QUETZALCOATL')) return 'Villa Quetzalcóatl';
  if (u.includes('LEONA VICARIO')) return 'Ranchería Leona Vicario';
  if (u.includes('MISSICAB')) return 'Ranchería Missicab';
  if (u.includes('CONSTITUCION')) return 'Ejido Constitución';

  return sanitizarCeldaCSV(comunidadRaw);
};

export const exportarDatosAbiertosCSV = (registrosFiltrados, tabDireccion, mostrarMensaje) => {
  if (registrosFiltrados.length === 0) {
    mostrarMensaje('Sin registros', 'No hay datos en el filtro actual para exportar.', 'alerta');
    return;
  }

  const encabezados = [
    'FOLIO',
    'PERIODO',
    'DIRECCION_MUNICIPAL',
    'PROGRAMA_SOCIAL',
    'BENEFICIARIO',
    'SEXO',
    'LOCALIDAD_COMUNIDAD',
    'TIPO_DE_APOYO',
    'MONTO_O_ESPECIE'
  ];

  const filas = registrosFiltrados.map((r) => {
    const nombrePublico = r.protegido
      ? 'BENEFICIARIO PROTEGIDO (ART. 124 LEY TRANSPARENCIA TABASCO)'
      : `${r.apellidoPaterno} ${r.apellidoMaterno} ${r.nombres}`;

    return [
      `"${sanitizarCeldaCSV(r.folio)}"`,
      `"${sanitizarCeldaCSV(r.periodo)}"`,
      `"${sanitizarCeldaCSV(r.direccion)}"`,
      `"${sanitizarCeldaCSV(r.programa)}"`,
      `"${sanitizarCeldaCSV(nombrePublico)}"`,
      `"${sanitizarCeldaCSV(r.sexo)}"`,
      `"${sanitizarCeldaCSV(r.localidad)}"`,
      `"${sanitizarCeldaCSV(r.tipoApoyo)}"`,
      `"${sanitizarCeldaCSV(r.montoEspecie)}"`
    ].join(',');
  });

  const csvContent = '\uFEFF' + [encabezados.join(','), ...filas].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Padron_Beneficiarios_Balancan_${tabDireccion.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  mostrarMensaje(
    'Descarga de Datos Abiertos Exitosa',
    `Se exportaron ${registrosFiltrados.length} registros verificados y sanitizados en formato CSV.`,
    'exito'
  );
};

export const descargarPlantillaOficialDirecciones = (mostrarMensaje) => {
  const encabezados = [
    'PERIODO',
    'DIRECCION',
    'PROGRAMA',
    'APELLIDO_PATERNO',
    'APELLIDO_MATERNO',
    'NOMBRES',
    'SEXO',
    'LOCALIDAD',
    'TIPO_APOYO',
    'MONTO_O_ESPECIE',
    'MONTO_NUMERICO',
    'CASO_SENSIBLE_PROTEGIDO'
  ];

  const ejemplos = [
    '2026 - T1,Atención Ciudadana,ENTREGA DE CEMENTO,ORDOÑEZ,DEHESA,ROSA BEATRIZ,M,Cabecera Municipal (Balancán),Especie,PAQUETE DE CEMENTO,1800,NO',
    '2026 - T3,DIF Municipal,APOYO ALIMENTARIO,GARCIA,LOPEZ,MARIA LUISA,M,Villa El Triunfo,Especie,1 DESPENSA BASICA,0,NO',
    '2026 - T3,DECUR,ESTIMULO DEPORTIVO MUNICIPAL,HERNANDEZ,PEREZ,JOSE ALBERTO,H,Cabecera Municipal (Balancán),Económico,$1500.00 MXN,1500,NO',
    '2026 - T3,Atención a la Mujer,APOYO INTEGRAL PREVENTIVO,MARTINEZ,CRUZ,ELENA,M,Poblado Mactún,Económico,$2000.00 MXN,2000,SI'
  ];

  const csvContent = '\uFEFF' + [encabezados.join(','), ...ejemplos].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'PLANTILLA_OFICIAL_PADRON_BALANCAN_TIC.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  mostrarMensaje(
    'Plantilla Oficial Descargada',
    'Entregue este archivo a los enlaces de cada Dirección Municipal para homologar su captura.',
    'exito'
  );
};

/**
 * PARSER INTELIGENTE DE ARCHIVOS CSV/EXCEL
 * - Compatible con la plantilla oficial TIC y con formatos libres de Direcciones (ej. Atención Ciudadana)
 * - Identifica y bloquea automáticamente columnas prohibidas (CURP, INE, Calle, CP, etc.)
 */
export const analizarContenidoCSV = (texto, nombreArchivo, opciones = {}) => {
  const lineas = texto.split(/\r\n|\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  if (lineas.length < 2) {
    return { error: 'El archivo CSV no contiene filas de datos válidas.' };
  }

  // 1. Detectar en qué fila inician los encabezados reales
  let headerIndex = -1;
  const palabrasClaveEncabezado = [
    'NOMBRE',
    'APELLIDO',
    'RECIBO',
    'CONSEC',
    'CURP',
    'BENEFICIARIO',
    'COMUNIDAD',
    'LOCALIDAD',
    'FOLIO',
    'GENERO',
    'SEXO',
    'PROGRAMA'
  ];

  for (let i = 0; i < Math.min(lineas.length, 25); i++) {
    const tokens = lineas[i].toUpperCase().split(',');
    let coincidencias = 0;
    tokens.forEach((t) => {
      if (palabrasClaveEncabezado.some((kw) => t.includes(kw))) {
        coincidencias++;
      }
    });
    if (coincidencias >= 2) {
      headerIndex = i;
      break;
    }
  }

  if (headerIndex === -1) {
    headerIndex = 0; // Fallback a la primera fila
  }

  const cabecerasRaw = lineas[headerIndex].split(',').map((h) => h.replace(/"/g, '').trim());

  // 2. Detectar y aislar columnas prohibidas por la Ley de Datos Personales
  const palabrasProhibidas = [
    'CURP',
    'RFC',
    'IDENTIFICACION',
    'TELEFONO',
    'CELULAR',
    'CALLE',
    'DOMICILIO',
    'INE',
    'DIRECCION', // Calle en formatos municipales
    'CP',
    'CODIGO POSTAL',
    'EDAD',
    'DIAGNOSTICO'
  ];

  const columnasBloqueadas = [];
  const indicesProhibidos = new Set();

  cabecerasRaw.forEach((col, idx) => {
    const colNorm = normalizarTexto(col);
    // Si la columna dice "DIRECCION", verificar si es dirección municipal o calle
    if (colNorm === 'DIRECCION' || colNorm === 'DIRECCION_PARTICULAR' || colNorm === 'DOMICILIO') {
      // Si hay otra columna de dirección municipal o si tiene CP/CALLE al lado, es calle
      columnasBloqueadas.push(col + ' (DOMICILIO PARTICULAR)');
      indicesProhibidos.add(idx);
      return;
    }

    if (palabrasProhibidas.some((prohibida) => colNorm.includes(prohibida))) {
      columnasBloqueadas.push(col);
      indicesProhibidos.add(idx);
    }
  });

  // 3. Mapeo dinámico de columnas encontradas
  let reciboIdx = -1;
  let nombresIdx = -1;
  let paternoIdx = -1;
  let maternoIdx = -1;
  let comunidadIdx = -1;
  let comunidad2Idx = -1;
  let generoIdx = -1;
  let montoIdx = -1;
  let programaIdx = -1;
  let periodoIdx = -1;
  let direccionMunicipalIdx = -1;
  let tipoApoyoIdx = -1;
  let protegidoIdx = -1;

  cabecerasRaw.forEach((h, idx) => {
    const norm = normalizarTexto(h);
    if (indicesProhibidos.has(idx)) return;

    if (norm.includes('RECIBO') || norm === 'FOLIO') reciboIdx = idx;
    else if (norm.includes('PATERNO')) paternoIdx = idx;
    else if (norm.includes('MATERNO')) maternoIdx = idx;
    else if (norm.includes('NOMBRE') && !norm.includes('APELLIDO')) nombresIdx = idx;
    else if (norm.includes('COMUNIDAD 2') || norm.includes('COLONIA')) comunidad2Idx = idx;
    else if (norm.includes('COMUNIDAD') || norm.includes('LOCALIDAD')) comunidadIdx = idx;
    else if (norm.includes('GENERO') || norm.includes('SEXO')) generoIdx = idx;
    else if (norm.includes('MONTO') || norm.includes('CANTIDAD')) montoIdx = idx;
    else if (norm.includes('PROGRAMA')) programaIdx = idx;
    else if (norm.includes('PERIODO') || norm.includes('TRIMESTRE')) periodoIdx = idx;
    else if (norm.includes('DEPENDENCIA') || norm.includes('DIRECCION_MUNICIPAL')) direccionMunicipalIdx = idx;
    else if (norm.includes('TIPO')) tipoApoyoIdx = idx;
    else if (norm.includes('PROTEGIDO') || norm.includes('SENSIBLE')) protegidoIdx = idx;
  });

  // Determinar dirección municipal por defecto
  let dirPredeterminada = opciones.direccion || 'Atención Ciudadana';
  const textoPrevio = lineas.slice(0, headerIndex).join(' ').toUpperCase();
  if (textoPrevio.includes('ATENCION CIUDADANA')) dirPredeterminada = 'Atención Ciudadana';
  else if (textoPrevio.includes('DIF')) dirPredeterminada = 'DIF Municipal';
  else if (textoPrevio.includes('MUJER')) dirPredeterminada = 'Atención a la Mujer';
  else if (textoPrevio.includes('DECUR')) dirPredeterminada = 'DECUR';
  else if (textoPrevio.includes('AGROPECUARIO') || textoPrevio.includes('FOMENTO')) dirPredeterminada = 'Fomento Económico';
  else if (textoPrevio.includes('DESARROLLO')) dirPredeterminada = 'Desarrollo Municipal';

  // Determinar programa por defecto
  let progPredeterminado = opciones.programa || 'ENTREGA DE CEMENTO';
  if (textoPrevio.includes('CEMENTO')) progPredeterminado = 'ENTREGA DE CEMENTO';

  const dirValidaObj = DIRECCIONES.find((d) => normalizarTexto(d.nombre) === normalizarTexto(dirPredeterminada)) || DIRECCIONES[2];
  const prefijo = dirValidaObj.prefijo;

  // 4. Procesar filas de datos
  const nuevosProcesados = [];
  for (let i = headerIndex + 1; i < lineas.length; i++) {
    const celdas = lineas[i].split(',').map((c) => c.replace(/"/g, '').trim());
    if (celdas.length < 3) continue;

    // Extraer folio / recibo
    const reciboRaw = reciboIdx !== -1 ? celdas[reciboIdx] : '';
    const folio = reciboRaw
      ? `BAL-${prefijo}-${sanitizarCeldaCSV(reciboRaw)}`
      : `BAL-${prefijo}-CSV${String(i).padStart(3, '0')}`;

    // Extraer nombres y apellidos
    const nombres = nombresIdx !== -1 ? normalizarTexto(celdas[nombresIdx]) : 'SIN NOMBRE';
    const apellidoPaterno = paternoIdx !== -1 ? normalizarTexto(celdas[paternoIdx]) : 'SIN APELLIDO';
    const apellidoMaterno = maternoIdx !== -1 ? normalizarTexto(celdas[maternoIdx]) : '';

    if (!nombres || nombres === 'SIN NOMBRE') continue; // Ignorar filas vacías o subtotales

    // Extraer localidad/comunidad
    const com1 = comunidadIdx !== -1 ? celdas[comunidadIdx] : '';
    const com2 = comunidad2Idx !== -1 ? celdas[comunidad2Idx] : '';
    const comunidadElegida = com2 && com2.trim().length > 0 ? com2 : com1;
    const localidadLimpia = normalizarLocalidadBalancan(comunidadElegida);

    // Extraer sexo
    const generoRaw = generoIdx !== -1 ? normalizarTexto(celdas[generoIdx]) : 'M';
    const sexo = generoRaw === 'H' || generoRaw === 'HOMBRE' ? 'H' : 'M';

    // Extraer monto
    const montoRaw = montoIdx !== -1 ? Number(celdas[montoIdx].replace(/[^0-9.]/g, '')) : 0;
    const montoNumerico = montoRaw || (opciones.montoNumerico ?? 1800);

    nuevosProcesados.push({
      id: `CSV-${Date.now()}-${i}`,
      folio,
      periodo: periodoIdx !== -1 && celdas[periodoIdx] ? sanitizarCeldaCSV(celdas[periodoIdx]) : (opciones.periodo || '2026 - T1'),
      direccion: dirValidaObj.nombre,
      programa: programaIdx !== -1 && celdas[programaIdx] ? normalizarTexto(celdas[programaIdx]) : progPredeterminado,
      apellidoPaterno,
      apellidoMaterno,
      nombres,
      sexo,
      localidad: localidadLimpia,
      tipoApoyo: tipoApoyoIdx !== -1 && celdas[tipoApoyoIdx] ? sanitizarCeldaCSV(celdas[tipoApoyoIdx]) : (opciones.tipoApoyo || 'Especie'),
      montoEspecie: opciones.montoEspecie || (progPredeterminado.includes('CEMENTO') ? 'PAQUETE DE CEMENTO (10 BULTOS)' : 'APOYO ENTREGADO'),
      montoNumerico,
      protegido: protegidoIdx !== -1 ? normalizarTexto(celdas[protegidoIdx]) === 'SI' : false
    });
  }

  return {
    reporte: {
      nombreArchivo,
      totalFilas: nuevosProcesados.length,
      columnasBloqueadas,
      sanitizadoExitoso: true
    },
    datos: nuevosProcesados
  };
};

// Generador de simulación del padrón real de Atención Ciudadana (100 beneficiarios de cemento)
export const generarSimulacionAtencionCiudadana = () => {
  return {
    reporte: {
      nombreArchivo: 'PADRON_ENTREGA_CEMENTO_ATENCION_CIUDADANA_2026.csv (Oficial)',
      totalFilas: DATOS_ATENCION_CIUDADANA_CEMENTO.length,
      columnasBloqueadas: [
        'CURP (DISOCIADO)',
        'NO. DE IDENTIFICACION / INE (BLOQUEADO)',
        'DIRECCION / CALLE Y NUMERO (BLOQUEADO)',
        'CODIGO POSTAL CP (BLOQUEADO)',
        'EDAD (CONFIDENCIAL)'
      ],
      sanitizadoExitoso: true
    },
    datos: DATOS_ATENCION_CIUDADANA_CEMENTO
  };
};

export const generarSimulacionCSV = () => {
  return generarSimulacionAtencionCiudadana();
};
