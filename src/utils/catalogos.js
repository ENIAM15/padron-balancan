// ==========================================
// CATÁLOGOS OFICIALES DEL MUNICIPIO DE BALANCÁN
// ==========================================
export const DIRECCIONES = [
  { id: 'DIF Municipal', nombre: 'DIF Municipal', prefijo: 'DIF', color: 'bg-rose-100 text-rose-800 border-rose-300', badgeColor: '#9f1239' },
  { id: 'Atención a la Mujer', nombre: 'Atención a la Mujer', prefijo: 'IAM', color: 'bg-purple-100 text-purple-800 border-purple-300', badgeColor: '#6b21a8' },
  { id: 'Atención Ciudadana', nombre: 'Atención Ciudadana', prefijo: 'ATC', color: 'bg-teal-100 text-teal-800 border-teal-300', badgeColor: '#0f766e' },
  { id: 'DECUR', nombre: 'DECUR', prefijo: 'DEC', color: 'bg-amber-100 text-amber-800 border-amber-300', badgeColor: '#92400e' },
  { id: 'Desarrollo Municipal', nombre: 'Desarrollo Municipal', prefijo: 'DES', color: 'bg-blue-100 text-blue-800 border-blue-300', badgeColor: '#1e40af' },
  { id: 'Fomento Económico', nombre: 'Fomento Económico', prefijo: 'FOM', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', badgeColor: '#065f46' }
];

export const LOCALIDADES_BALANCAN = [
  'Cabecera Municipal (Balancán)',
  'Villa El Triunfo',
  'Villa Quetzalcóatl',
  'Poblado Mactún',
  'Ranchería El Águila',
  'Poblado San Pedro',
  'Poblado Multé',
  'Poblado Netzahualcóyotl (Santa Ana)',
  'Poblado Arenal',
  'Ejido Capitán Felipe Castellanos',
  'Ejido General Luis Felipe Domínguez',
  'Ranchería Leona Vicario',
  'Ejido Apatzingán',
  'Ejido Chacabita',
  'Ejido Jahuactal',
  'Ejido San Juan',
  'Ejido Vicente Guerrero',
  'Ejido Las Palmas',
  'Ejido Ojo de Agua',
  'Ejido Agricultores 1ra Sección',
  'Ejido Anexo Balancán',
  'Ejido Arroyo El Triunfo 1ra Sección',
  'Ranchería Missicab',
  'Poblado Hulería',
  'Ejido Constitución',
  'Col. Plan de Guadalupe'
];

export const PERIODOS = [
  '2026 - T1',
  '2026 - T2',
  '2026 - T3',
  '2026 - T4',
  '2025 - T4'
];

export const TIPOS_APOYO = [
  'Económico',
  'Especie',
  'Capacitación / Servicio'
];

// Datos semilla realistas para demostración inmediata en Balancán (con costos unitarios valorizados)
export const DATOS_SEMILLA = [
  { folio: 'BAL-DIF-001', periodo: '2026 - T3', direccion: 'DIF Municipal', programa: 'APOYO ALIMENTARIO A GRUPOS VULNERABLES', apellidoPaterno: 'PEREZ', apellidoMaterno: 'LOPEZ', nombres: 'MARIA DEL CARMEN', sexo: 'M', localidad: 'Villa El Triunfo', tipoApoyo: 'Especie', montoEspecie: '1 CANASTA BASICA NUTRICIONAL', montoNumerico: 650, protegido: false },
  { folio: 'BAL-DIF-002', periodo: '2026 - T3', direccion: 'DIF Municipal', programa: 'APARATOS FUNCIONALES Y ORTOPEDICOS', apellidoPaterno: 'DOMINGUEZ', apellidoMaterno: 'CHABLE', nombres: 'JOSE MANUEL', sexo: 'H', localidad: 'Cabecera Municipal (Balancán)', tipoApoyo: 'Especie', montoEspecie: '1 SILLA DE RUEDAS ESTANDAR', montoNumerico: 3200, protegido: false },
  { folio: 'BAL-IAM-001', periodo: '2026 - T3', direccion: 'Atención a la Mujer', programa: 'REFUGIO Y ASISTENCIA INTEGRAL PREVENTIVA', apellidoPaterno: 'GONZALEZ', apellidoMaterno: 'MENDEZ', nombres: 'LAURA ELENA', sexo: 'M', localidad: 'Villa Quetzalcóatl', tipoApoyo: 'Económico', montoEspecie: '$2,500.00 MXN', montoNumerico: 2500, protegido: true },
  { folio: 'BAL-IAM-002', periodo: '2026 - T3', direccion: 'Atención a la Mujer', programa: 'MUJERES EMPRENDEDORAS DE BALANCAN', apellidoPaterno: 'HERNANDEZ', apellidoMaterno: 'CRUZ', nombres: 'ROSAURA', sexo: 'M', localidad: 'Poblado Mactún', tipoApoyo: 'Especie', montoEspecie: '1 KIT DE INSUMOS DE REPOSTERIA', montoNumerico: 1500, protegido: false },
  { folio: 'BAL-DEC-001', periodo: '2026 - T3', direccion: 'DECUR', programa: 'BECAS AL TALENTO DEPORTIVO Y CULTURAL', apellidoPaterno: 'GOMEZ', apellidoMaterno: 'SANCHEZ', nombres: 'JUAN CARLOS', sexo: 'H', localidad: 'Cabecera Municipal (Balancán)', tipoApoyo: 'Económico', montoEspecie: '$1,500.00 MXN', montoNumerico: 1500, protegido: false },
  { folio: 'BAL-DEC-002', periodo: '2026 - T3', direccion: 'DECUR', programa: 'EQUIPAMIENTO DEPORTIVO COMUNITARIO', apellidoPaterno: 'LANDERO', apellidoMaterno: 'CHAN', nombres: 'CARLOS MARIO', sexo: 'H', localidad: 'Poblado San Pedro', tipoApoyo: 'Especie', montoEspecie: '1 LOTE DE BALONES Y REDES DEPORTIVAS', montoNumerico: 2200, protegido: false },
  { folio: 'BAL-DES-001', periodo: '2026 - T2', direccion: 'Desarrollo Municipal', programa: 'MEJORAMIENTO DE VIVIENDA DIGNA', apellidoPaterno: 'RAMIREZ', apellidoMaterno: 'TORRES', nombres: 'LUCIA', sexo: 'M', localidad: 'Ranchería El Águila', tipoApoyo: 'Especie', montoEspecie: '10 LAMINAS DE ZINC Y CEMENTO', montoNumerico: 4500, protegido: false },
  { folio: 'BAL-DES-002', periodo: '2026 - T3', direccion: 'Desarrollo Municipal', programa: 'IMPULSO AL AUTOEMPLEO LOCAL', apellidoPaterno: 'MORALES', apellidoMaterno: 'JIMENEZ', nombres: 'PEDRO PABLO', sexo: 'H', localidad: 'Poblado Multé', tipoApoyo: 'Económico', montoEspecie: '$3,000.00 MXN', montoNumerico: 3000, protegido: false },
  { folio: 'BAL-FOM-001', periodo: '2026 - T3', direccion: 'Fomento Económico', programa: 'INSUMOS AGRICOLAS Y SEMILLA MEJORADA', apellidoPaterno: 'BAUTISTA', apellidoMaterno: 'MAY', nombres: 'CANDELARIO', sexo: 'H', localidad: 'Poblado Netzahualcóyotl (Santa Ana)', tipoApoyo: 'Especie', montoEspecie: '2 BULTOS DE SEMILLA DE MAIZ CERTIFICADA', montoNumerico: 2600, protegido: false },
  { folio: 'BAL-FOM-002', periodo: '2026 - T2', direccion: 'Fomento Económico', programa: 'APOYO A PEQUEÑOS PRODUCTORES GANADEROS', apellidoPaterno: 'ZACARIAS', apellidoMaterno: 'LOPEZ', nombres: 'VICTORIANO', sexo: 'H', localidad: 'Ejido Capitán Felipe Castellanos', tipoApoyo: 'Económico', montoEspecie: '$4,000.00 MXN', montoNumerico: 4000, protegido: false },
  { folio: 'BAL-FOM-003', periodo: '2026 - T3', direccion: 'Fomento Económico', programa: 'HUERTOS FAMILIARES SUSTENTABLES', apellidoPaterno: 'CAMBRANO', apellidoMaterno: 'DIAZ', nombres: 'JUANA FRANCISCA', sexo: 'M', localidad: 'Ranchería Leona Vicario', tipoApoyo: 'Capacitación / Servicio', montoEspecie: 'TALLER TECNICO Y PAQUETE DE SEMILLAS HORTICOLAS', montoNumerico: 0, protegido: false },
  { folio: 'BAL-DIF-003', periodo: '2026 - T2', direccion: 'DIF Municipal', programa: 'DESAYUNOS ESCOLARES PRIMERA INFANCIA', apellidoPaterno: 'CORNELIO', apellidoMaterno: 'VALENCIA', nombres: 'MARTHA PATRICIA', sexo: 'M', localidad: 'Ejido General Luis Felipe Domínguez', tipoApoyo: 'Especie', montoEspecie: 'DOTACION MENSUAL DESAYUNO CALIENTE', montoNumerico: 450, protegido: false },
  { folio: 'BAL-IAM-003', periodo: '2026 - T2', direccion: 'Atención a la Mujer', programa: 'ASESORIA JURIDICA Y PSICOLOGICA INTEGRAL', apellidoPaterno: 'VAZQUEZ', apellidoMaterno: 'PERALTA', nombres: 'ANA SOFIA', sexo: 'M', localidad: 'Cabecera Municipal (Balancán)', tipoApoyo: 'Capacitación / Servicio', montoEspecie: 'ACOMPAÑAMIENTO LEGAL INTEGRAL', montoNumerico: 0, protegido: true },
  { folio: 'BAL-DEC-003', periodo: '2026 - T2', direccion: 'DECUR', programa: 'IMPULSO A ARTESANOS Y CULTURA MAYA', apellidoPaterno: 'PECH', apellidoMaterno: 'dzib', nombres: 'TEODORA', sexo: 'M', localidad: 'Poblado Mactún', tipoApoyo: 'Económico', montoEspecie: '$2,000.00 MXN', montoNumerico: 2000, protegido: false },
  { folio: 'BAL-DES-003', periodo: '2026 - T3', direccion: 'Desarrollo Municipal', programa: 'PROGRAMA DE BACHEO Y EMPLEO TEMPORAL', apellidoPaterno: 'CASTILLO', apellidoMaterno: 'MENDOZA', nombres: 'ROBERTO', sexo: 'H', localidad: 'Villa El Triunfo', tipoApoyo: 'Económico', montoEspecie: '$1,800.00 MXN', montoNumerico: 1800, protegido: false },
  { folio: 'BAL-FOM-004', periodo: '2026 - T3', direccion: 'Fomento Económico', programa: 'FOMENTO APICOLA Y MELIFERO', apellidoPaterno: 'OSORIO', apellidoMaterno: 'GARCIA', nombres: 'RIGOBERTO', sexo: 'H', localidad: 'Ejido Apatzingán', tipoApoyo: 'Especie', montoEspecie: '3 NUCLEOS DE ABEJAS REINAS Y CAJAS', montoNumerico: 3800, protegido: false }
];
