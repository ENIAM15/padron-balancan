import { DIRECCIONES } from './catalogos';
import { normalizarTexto } from './texto';
import { sanitizarCeldaCSV } from './seguridad';

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

export const analizarContenidoCSV = (texto, nombreArchivo) => {
  const lineas = texto.split(/\r\n|\n/).filter((l) => l.trim() !== '');
  if (lineas.length < 2) {
    return { error: 'El archivo CSV no contiene filas de datos válidas.' };
  }

  const cabecerasRaw = lineas[0].split(',').map((h) => normalizarTexto(h.replace(/"/g, '')));

  // Detectar columnas prohibidas por la Ley de Protección de Datos Personales
  const palabrasProhibidas = ['CURP', 'RFC', 'TELEFONO', 'CELULAR', 'CALLE', 'DOMICILIO', 'INE', 'CORREO', 'DIAGNOSTICO'];
  const columnasBloqueadas = [];

  cabecerasRaw.forEach((col) => {
    if (palabrasProhibidas.some((prohibida) => col.includes(prohibida))) {
      columnasBloqueadas.push(col);
    }
  });

  const nuevosProcesados = [];
  for (let i = 1; i < lineas.length; i++) {
    const celdas = lineas[i].split(',').map((c) => c.replace(/"/g, '').trim());
    if (celdas.length < 4) continue;

    const direccionArchivo = celdas[1] || 'DIF Municipal';
    const dirValida =
      DIRECCIONES.find((d) => normalizarTexto(d.nombre) === normalizarTexto(direccionArchivo))?.nombre ||
      'DIF Municipal';
    const prefijo = DIRECCIONES.find((d) => d.nombre === dirValida)?.prefijo || 'GEN';

    nuevosProcesados.push({
      id: `CSV-${Date.now()}-${i}`,
      folio: `BAL-${prefijo}-CSV${String(i).padStart(3, '0')}`,
      periodo: sanitizarCeldaCSV(celdas[0] || '2026 - T3'),
      direccion: dirValida,
      programa: normalizarTexto(celdas[2] || 'PROGRAMA MUNICIPAL'),
      apellidoPaterno: normalizarTexto(celdas[3] || 'SIN APELLIDO'),
      apellidoMaterno: normalizarTexto(celdas[4] || ''),
      nombres: normalizarTexto(celdas[5] || 'SIN NOMBRE'),
      sexo: normalizarTexto(celdas[6]) === 'H' ? 'H' : 'M',
      localidad: sanitizarCeldaCSV(celdas[7] || 'Cabecera Municipal (Balancán)'),
      tipoApoyo: sanitizarCeldaCSV(celdas[8] || 'Especie'),
      montoEspecie: normalizarTexto(celdas[9] || 'APOYO ENTREGADO'),
      montoNumerico: Number(celdas[10]) || 0,
      protegido: normalizarTexto(celdas[11]) === 'SI'
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

export const generarSimulacionCSV = () => {
  const simulados = [
    {
      id: `SIM-${Date.now()}-1`,
      folio: 'BAL-DIF-901',
      periodo: '2026 - T3',
      direccion: 'DIF Municipal',
      programa: 'APOYO ALIMENTARIO DE EMERGENCIA',
      apellidoPaterno: 'MENDEZ',
      apellidoMaterno: 'ARIAS',
      nombres: 'TERESA DE JESUS',
      sexo: 'M',
      localidad: 'Villa El Triunfo',
      tipoApoyo: 'Especie',
      montoEspecie: '1 PAQUETE ALIMENTARIO',
      montoNumerico: 0,
      protegido: false
    },
    {
      id: `SIM-${Date.now()}-2`,
      folio: 'BAL-IAM-902',
      periodo: '2026 - T3',
      direccion: 'Atención a la Mujer',
      programa: 'ATENCION A MUJERES EN SITUACION DE RIESGO',
      apellidoPaterno: 'LOPEZ',
      apellidoMaterno: 'GOMEZ',
      nombres: 'MARIA FERNANDA',
      sexo: 'M',
      localidad: 'Cabecera Municipal (Balancán)',
      tipoApoyo: 'Económico',
      montoEspecie: '$2,500.00 MXN',
      montoNumerico: 2500,
      protegido: true
    },
    {
      id: `SIM-${Date.now()}-3`,
      folio: 'BAL-AGR-903',
      periodo: '2026 - T3',
      direccion: 'Fomento Agropecuario',
      programa: 'MECANIZACION AGRICOLA MUNICIPAL',
      apellidoPaterno: 'CHAN',
      apellidoMaterno: 'ACOSTA',
      nombres: 'LORENZO',
      sexo: 'H',
      localidad: 'Poblado San Pedro',
      tipoApoyo: 'Capacitación / Servicio',
      montoEspecie: '2 HECTAREAS DE RASTREO AGRICOLA',
      montoNumerico: 0,
      protegido: false
    }
  ];

  return {
    reporte: {
      nombreArchivo: 'Padron_Enviado_Por_Direcciones_Con_CURP.csv (Simulación)',
      totalFilas: simulados.length,
      columnasBloqueadas: ['CURP_BENEFICIARIO', 'TELEFONO_CELULAR', 'CALLE_Y_NUMERO_EXACTO', 'DIAGNOSTICO_CLINICO'],
      sanitizadoExitoso: true
    },
    datos: simulados
  };
};
