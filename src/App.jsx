import React, { useState, useEffect, useMemo } from 'react';
import {
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { FileSpreadsheet, RefreshCw } from 'lucide-react';

import { appId, auth, db } from './config/firebase';
import { DATOS_SEMILLA } from './utils/catalogos';
import { normalizarTexto, generarFolioAutomatico } from './utils/texto';
import {
  exportarDatosAbiertosCSV,
  descargarPlantillaOficialDirecciones,
  analizarContenidoCSV,
  generarSimulacionCSV
} from './utils/csv';
import {
  obtenerConfigWordPress,
  obtenerSesionActiva,
  renovarActividadSesion,
  cerrarSesionSegura,
  obtenerBitacoraSeguridad,
  registrarEventoSeguridad
} from './utils/seguridad';

import NavbarInstitucional from './components/NavbarInstitucional';
import FooterInstitucional from './components/FooterInstitucional';
import NotificacionToast from './components/NotificacionToast';
import ModalConfirmacion from './components/ModalConfirmacion';
import ModalLoginTIC from './components/ModalLoginTIC';
import VistaPublica from './pages/VistaPublica';
import PanelAdmin from './pages/PanelAdmin';

const STORAGE_PADRON_LOCAL_KEY = 'balancan_padron_registros_v1';

export default function PortalPadronBalancan() {
  // Estados de Autenticación y Base de Datos
  const [user, setUser] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modoOffline, setModoOffline] = useState(false);

  // Estados de Seguridad TIC
  const [sesionActiva, setSesionActiva] = useState(() => obtenerSesionActiva());
  const [modalLoginAbierto, setModalLoginAbierto] = useState(false);
  const [bitacoraSeguridad, setBitacoraSeguridad] = useState(() => obtenerBitacoraSeguridad());

  // Estados de Navegación (Vista Pública vs Panel Admin TIC)
  const [vistaActual, setVistaActual] = useState('publica'); // 'publica' | 'admin'
  const [subVistaAdmin, setSubVistaAdmin] = useState('captura'); // 'captura' | 'csv' | 'padron' | 'seguridad'

  // Estados de Filtros en Vista Pública
  const [tabDireccion, setTabDireccion] = useState('TODAS');
  const [busqueda, setBusqueda] = useState('');
  const [filtroLocalidad, setFiltroLocalidad] = useState('TODAS');
  const [filtroPeriodo, setFiltroPeriodo] = useState('TODOS');
  const [filtroTipoApoyo, setFiltroTipoApoyo] = useState('TODOS');
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);

  // Estados de Formulario en Panel Admin
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEdicion, setIdEdicion] = useState(null);
  const [formBeneficiario, setFormBeneficiario] = useState({
    folio: '',
    periodo: '2026 - T3',
    direccion: 'DIF Municipal',
    programa: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    nombres: '',
    sexo: 'M',
    localidad: 'Cabecera Municipal (Balancán)',
    tipoApoyo: 'Especie',
    montoEspecie: '',
    montoNumerico: 0,
    protegido: false
  });

  // Estados para el Importador CSV y Validador de Datos Personales
  const [reporteCSV, setReporteCSV] = useState(null);
  const [datosCSVPrevia, setDatosCSVPrevia] = useState([]);

  // Notificaciones tipo Toast / Modal sin usar alert()
  const [notificacion, setNotificacion] = useState(null);
  const [modalConfirmacion, setModalConfirmacion] = useState(null);

  const mostrarMensaje = (titulo, texto, tipo = 'exito') => {
    setNotificacion({ titulo, texto, tipo });
    setTimeout(() => {
      setNotificacion(null);
    }, 5000);
  };

  const registrarAuditoria = (accion, detalle, nivel = 'info') => {
    const usuario = sesionActiva?.usuario || 'admin_tic';
    registrarEventoSeguridad(accion, usuario, detalle, nivel);
    setBitacoraSeguridad(obtenerBitacoraSeguridad());
  };

  // ==========================================
  // VIGILANTE DE INACTIVIDAD DE SESIÓN ADMIN (15 MIN)
  // ==========================================
  useEffect(() => {
    if (!sesionActiva) {
      if (vistaActual === 'admin') {
        setVistaActual('publica');
      }
      return;
    }

    const manejarActividad = () => {
      const renovada = renovarActividadSesion();
      if (!renovada) {
        setSesionActiva(null);
        setVistaActual('publica');
        mostrarMensaje(
          'Sesión Expirada por Inactividad',
          'Por seguridad, el Panel Admin se cerró automáticamente tras 15 minutos sin actividad.',
          'alerta'
        );
      }
    };

    const intervalo = setInterval(() => {
      const actual = obtenerSesionActiva();
      if (!actual) {
        setSesionActiva(null);
        setVistaActual('publica');
        setBitacoraSeguridad(obtenerBitacoraSeguridad());
        mostrarMensaje(
          'Sesión Expirada',
          'Su sesión administrativa ha expirado por inactividad.',
          'alerta'
        );
      }
    }, 15000);

    window.addEventListener('click', manejarActividad);
    window.addEventListener('keydown', manejarActividad);

    return () => {
      clearInterval(intervalo);
      window.removeEventListener('click', manejarActividad);
      window.removeEventListener('keydown', manejarActividad);
    };
  }, [sesionActiva, vistaActual]);

  // ==========================================
  // 1. INICIALIZACIÓN DE DATOS (WORDPRESS REST API / FIREBASE / LOCAL)
  // ==========================================
  useEffect(() => {
    const wpConfig = obtenerConfigWordPress();

    // A) Si corre dentro del Plugin de WordPress, consultar el endpoint MySQL de WordPress
    if (wpConfig && wpConfig.restUrl) {
      setModoOffline(false);
      fetch(`${wpConfig.restUrl}/registros`, {
        headers: { 'X-WP-Nonce': wpConfig.nonce || '' }
      })
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data.registros)) {
            setRegistros(data.registros);
          }
        })
        .catch((err) => {
          console.error('Error cargando padrón desde WordPress:', err);
        })
        .finally(() => setCargando(false));
      return;
    }

    // B) Si no hay configuración de Firebase, operar con almacenamiento local persistente
    if (!auth) {
      setModoOffline(true);
      try {
        const guardados = localStorage.getItem(STORAGE_PADRON_LOCAL_KEY);
        if (guardados) {
          const parsed = JSON.parse(guardados);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRegistros(parsed);
            setCargando(false);
            return;
          }
        }
      } catch {
        // Ignorar error de lectura local
      }

      const iniciales = DATOS_SEMILLA.map((item, idx) => ({
        ...item,
        id: `seed-${idx + 1}`,
        apellidoPaterno: normalizarTexto(item.apellidoPaterno),
        apellidoMaterno: normalizarTexto(item.apellidoMaterno),
        nombres: normalizarTexto(item.nombres)
      }));
      setRegistros(iniciales);
      try {
        localStorage.setItem(STORAGE_PADRON_LOCAL_KEY, JSON.stringify(iniciales));
      } catch {
        // Ignorar
      }
      setCargando(false);
      return;
    }

    // C) Inicialización Firebase si está configurado
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error('Error en autenticación:', err);
        setModoOffline(true);
        setCargando(false);
      }
    };

    initAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribeAuth();
  }, []);

  // Persistir automáticamente en localStorage cuando está en modo local
  useEffect(() => {
    if (modoOffline && !cargando) {
      try {
        localStorage.setItem(STORAGE_PADRON_LOCAL_KEY, JSON.stringify(registros));
      } catch {
        // Ignorar
      }
    }
  }, [registros, modoOffline, cargando]);

  // Escucha en tiempo real de la colección pública en Firestore
  useEffect(() => {
    if (!user || !db) return;

    const colRef = collection(db, 'artifacts', appId, 'public', 'data', 'padron_beneficiarios');
    const unsubscribeSnapshot = onSnapshot(
      colRef,
      (snapshot) => {
        const docs = [];
        snapshot.forEach((docSnap) => {
          docs.push({ id: docSnap.id, ...docSnap.data() });
        });
        docs.sort((a, b) => (a.folio || '').localeCompare(b.folio || ''));
        setRegistros(docs);
        setCargando(false);
      },
      (error) => {
        console.error('Error al leer Firestore:', error);
        mostrarMensaje('Modo Local Activado', 'Operando con memoria local persistente.', 'alerta');
        setModoOffline(true);
        setCargando(false);
      }
    );

    return () => unsubscribeSnapshot();
  }, [user]);

  // Cargar datos semilla
  const cargarDatosSemilla = async () => {
    setCargando(true);
    try {
      const nuevosRegistros = DATOS_SEMILLA.map((item, index) => ({
        ...item,
        id: `BAL-SEED-${Date.now()}-${index}`,
        apellidoPaterno: normalizarTexto(item.apellidoPaterno),
        apellidoMaterno: normalizarTexto(item.apellidoMaterno),
        nombres: normalizarTexto(item.nombres),
        fechaRegistro: new Date().toISOString()
      }));

      const wpConfig = obtenerConfigWordPress();
      if (wpConfig && wpConfig.restUrl) {
        const resp = await fetch(`${wpConfig.restUrl}/lote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': wpConfig.nonce || '',
            Authorization: `Bearer ${sesionActiva?.token || ''}`
          },
          body: JSON.stringify({ registros: nuevosRegistros, reemplazar: true })
        });
        const data = await resp.json();
        if (resp.ok && Array.isArray(data.registros)) {
          setRegistros(data.registros);
        }
      } else if (modoOffline || !db || !user) {
        setRegistros(nuevosRegistros);
      } else {
        const batch = writeBatch(db);
        nuevosRegistros.forEach((reg) => {
          const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'padron_beneficiarios', reg.id);
          batch.set(docRef, reg);
        });
        await batch.commit();
      }

      registrarAuditoria(
        'RESTAURACION_DATOS_SEMILLA',
        `Se restauraron ${nuevosRegistros.length} registros semilla oficiales de Balancán.`,
        'exito'
      );

      mostrarMensaje(
        'Padrón de Demostración Cargado',
        `Se han cargado ${nuevosRegistros.length} registros realistas de las direcciones del Ayuntamiento de Balancán.`,
        'exito'
      );
    } catch (error) {
      console.error('Error al cargar semillas:', error);
      mostrarMensaje('Error al cargar datos', 'No se pudieron insertar los registros de prueba.', 'error');
    } finally {
      setCargando(false);
    }
  };

  // ==========================================
  // 2. CÁLCULOS EN TIEMPO REAL Y FILTRADO
  // ==========================================
  const registrosFiltrados = useMemo(() => {
    return registros.filter((reg) => {
      if (tabDireccion !== 'TODAS' && reg.direccion !== tabDireccion) return false;
      if (filtroLocalidad !== 'TODAS' && reg.localidad !== filtroLocalidad) return false;
      if (filtroPeriodo !== 'TODOS' && reg.periodo !== filtroPeriodo) return false;
      if (filtroTipoApoyo !== 'TODOS' && reg.tipoApoyo !== filtroTipoApoyo) return false;

      if (busqueda.trim() !== '') {
        const q = normalizarTexto(busqueda);
        const nombreCompleto = `${reg.apellidoPaterno} ${reg.apellidoMaterno} ${reg.nombres}`;
        const coincideNombre = !reg.protegido && nombreCompleto.includes(q);
        const coincideFolio = normalizarTexto(reg.folio).includes(q);
        const coincidePrograma = normalizarTexto(reg.programa).includes(q);
        const coincideLocalidad = normalizarTexto(reg.localidad).includes(q);
        return coincideNombre || coincideFolio || coincidePrograma || coincideLocalidad;
      }

      return true;
    });
  }, [registros, tabDireccion, filtroLocalidad, filtroPeriodo, filtroTipoApoyo, busqueda]);

  const kpis = useMemo(() => {
    const totalBeneficiarios = registros.length;
    const programasUnicos = new Set(registros.map((r) => r.programa)).size;
    const direccionesUnicas = new Set(registros.map((r) => r.direccion)).size;
    const inversionTotal = registros.reduce((acc, r) => acc + (Number(r.montoNumerico) || 0), 0);
    const totalMujeres = registros.filter((r) => r.sexo === 'M').length;
    const totalHombres = registros.filter((r) => r.sexo === 'H').length;
    const porcentajeMujeres = totalBeneficiarios > 0 ? Math.round((totalMujeres / totalBeneficiarios) * 100) : 0;

    return {
      totalBeneficiarios,
      programasUnicos,
      direccionesUnicas,
      inversionTotal,
      totalMujeres,
      totalHombres,
      porcentajeMujeres
    };
  }, [registros]);

  const totalPaginas = Math.max(1, Math.ceil(registrosFiltrados.length / registrosPorPagina));
  const registrosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * registrosPorPagina;
    return registrosFiltrados.slice(inicio, inicio + registrosPorPagina);
  }, [registrosFiltrados, paginaActual, registrosPorPagina]);

  useEffect(() => {
    setPaginaActual(1);
  }, [tabDireccion, filtroLocalidad, filtroPeriodo, filtroTipoApoyo, busqueda, registrosPorPagina]);

  // ==========================================
  // 3. OPERACIONES CRUD EN EL BACK-END (PROTEGIDAS POR SESIÓN TIC)
  // ==========================================
  const verificarPermisoEscritura = () => {
    const actual = obtenerSesionActiva();
    if (!actual) {
      setSesionActiva(null);
      setVistaActual('publica');
      setModalLoginAbierto(true);
      mostrarMensaje('Acceso Denegado', 'Debe iniciar sesión como administrador TIC para modificar el padrón.', 'error');
      return false;
    }
    return true;
  };

  const guardarBeneficiarioIndividual = async (e) => {
    e.preventDefault();
    if (!verificarPermisoEscritura()) return;

    if (
      !formBeneficiario.programa ||
      !formBeneficiario.apellidoPaterno ||
      !formBeneficiario.nombres ||
      !formBeneficiario.montoEspecie
    ) {
      mostrarMensaje(
        'Campos Incompletos',
        'Por favor complete el programa, nombre del beneficiario y el apoyo entregado.',
        'alerta'
      );
      return;
    }

    const folioFinal =
      formBeneficiario.folio.trim() !== ''
        ? normalizarTexto(formBeneficiario.folio)
        : generarFolioAutomatico(formBeneficiario.direccion, registros);

    const docId = modoEdicion && idEdicion ? idEdicion : `BAL-${Date.now()}`;

    const registroLimpio = {
      id: docId,
      folio: folioFinal,
      periodo: formBeneficiario.periodo,
      direccion: formBeneficiario.direccion,
      programa: normalizarTexto(formBeneficiario.programa),
      apellidoPaterno: normalizarTexto(formBeneficiario.apellidoPaterno),
      apellidoMaterno: normalizarTexto(formBeneficiario.apellidoMaterno),
      nombres: normalizarTexto(formBeneficiario.nombres),
      sexo: formBeneficiario.sexo,
      localidad: formBeneficiario.localidad,
      tipoApoyo: formBeneficiario.tipoApoyo,
      montoEspecie: normalizarTexto(formBeneficiario.montoEspecie),
      montoNumerico:
        formBeneficiario.tipoApoyo === 'Económico' ? Number(formBeneficiario.montoNumerico) || 0 : 0,
      protegido: Boolean(formBeneficiario.protegido),
      fechaActualizacion: new Date().toISOString()
    };

    try {
      const wpConfig = obtenerConfigWordPress();
      if (wpConfig && wpConfig.restUrl) {
        const resp = await fetch(`${wpConfig.restUrl}/registros`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': wpConfig.nonce || '',
            Authorization: `Bearer ${sesionActiva?.token || ''}`
          },
          body: JSON.stringify(registroLimpio)
        });
        if (!resp.ok) throw new Error('Error al guardar en WordPress');
      }

      if (modoOffline || !db || !user) {
        if (modoEdicion) {
          setRegistros((prev) =>
            prev.map((item) => (item.id === docId ? { ...registroLimpio, id: docId } : item))
          );
        } else {
          setRegistros((prev) => [{ ...registroLimpio, id: docId }, ...prev]);
        }
      } else {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'padron_beneficiarios', docId);
        await setDoc(docRef, registroLimpio);
      }

      registrarAuditoria(
        modoEdicion ? 'EDICION_BENEFICIARIO' : 'ALTA_BENEFICIARIO',
        `${modoEdicion ? 'Actualizado' : 'Registrado'} folio ${folioFinal} (${registroLimpio.direccion} - ${registroLimpio.programa}).`,
        'exito'
      );

      mostrarMensaje(
        modoEdicion ? 'Registro Actualizado' : 'Beneficiario Registrado',
        `El folio ${folioFinal} fue guardado y normalizado a mayúsculas sin acentos exitosamente.`,
        'exito'
      );

      setModoEdicion(false);
      setIdEdicion(null);
      setFormBeneficiario({
        folio: '',
        periodo: '2026 - T3',
        direccion: formBeneficiario.direccion,
        programa: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        nombres: '',
        sexo: 'M',
        localidad: 'Cabecera Municipal (Balancán)',
        tipoApoyo: 'Especie',
        montoEspecie: '',
        montoNumerico: 0,
        protegido: false
      });
    } catch (error) {
      console.error('Error al guardar:', error);
      mostrarMensaje('Error al Guardar', 'Ocurrió un problema al intentar guardar el registro.', 'error');
    }
  };

  const iniciarEdicion = (reg) => {
    if (!verificarPermisoEscritura()) return;
    setModoEdicion(true);
    setIdEdicion(reg.id);
    setFormBeneficiario({
      folio: reg.folio || '',
      periodo: reg.periodo || '2026 - T3',
      direccion: reg.direccion || 'DIF Municipal',
      programa: reg.programa || '',
      apellidoPaterno: reg.apellidoPaterno || '',
      apellidoMaterno: reg.apellidoMaterno || '',
      nombres: reg.nombres || '',
      sexo: reg.sexo || 'M',
      localidad: reg.localidad || 'Cabecera Municipal (Balancán)',
      tipoApoyo: reg.tipoApoyo || 'Especie',
      montoEspecie: reg.montoEspecie || '',
      montoNumerico: reg.montoNumerico || 0,
      protegido: Boolean(reg.protegido)
    });
    setSubVistaAdmin('captura');
  };

  const eliminarRegistro = async (id, folio) => {
    if (!verificarPermisoEscritura()) return;
    try {
      const wpConfig = obtenerConfigWordPress();
      if (wpConfig && wpConfig.restUrl) {
        const resp = await fetch(`${wpConfig.restUrl}/registros/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: {
            'X-WP-Nonce': wpConfig.nonce || '',
            Authorization: `Bearer ${sesionActiva?.token || ''}`
          }
        });
        if (!resp.ok) throw new Error('Error al eliminar en WordPress');
      }

      if (modoOffline || !db || !user) {
        setRegistros((prev) => prev.filter((r) => r.id !== id));
      } else {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'padron_beneficiarios', id);
        await deleteDoc(docRef);
      }

      registrarAuditoria(
        'BAJA_BENEFICIARIO',
        `Se eliminó el registro con folio ${folio} (ID: ${id}).`,
        'alerta'
      );

      mostrarMensaje(
        'Registro Eliminado',
        `El registro con folio ${folio} ha sido dado de baja del padrón.`,
        'exito'
      );
    } catch (error) {
      console.error('Error al eliminar:', error);
      mostrarMensaje('Error', 'No se pudo eliminar el registro.', 'error');
    }
  };

  // ==========================================
  // 4. VALIDADOR INTELIGENTE DE ARCHIVOS CSV (AUDITORÍA ITAIP)
  // ==========================================
  const procesarArchivoCSV = (e) => {
    if (!verificarPermisoEscritura()) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evento) => {
      const resultado = analizarContenidoCSV(evento.target.result, file.name);
      if (resultado.error) {
        mostrarMensaje('Archivo Vacío', resultado.error, 'alerta');
        return;
      }
      setReporteCSV(resultado.reporte);
      setDatosCSVPrevia(resultado.datos);
      registrarAuditoria(
        'AUDITORIA_CSV',
        `Archivo analizado: ${file.name} (${resultado.datos.length} filas válidas, ${resultado.reporte.columnasBloqueadas.length} columnas sensibles bloqueadas).`,
        'info'
      );
    };

    reader.readAsText(file);
  };

  const simularCSVConDatosSensibles = () => {
    if (!verificarPermisoEscritura()) return;
    const { reporte, datos } = generarSimulacionCSV();
    setReporteCSV(reporte);
    setDatosCSVPrevia(datos);
    registrarAuditoria(
      'SIMULACION_AUDITORIA_CSV',
      `Prueba de filtro ITAIP ejecutada (${reporte.columnasBloqueadas.join(', ')} bloqueadas).`,
      'info'
    );
  };

  const confirmarImportacionMasiva = async () => {
    if (!verificarPermisoEscritura()) return;
    if (datosCSVPrevia.length === 0) return;
    setCargando(true);
    try {
      const wpConfig = obtenerConfigWordPress();
      if (wpConfig && wpConfig.restUrl) {
        const resp = await fetch(`${wpConfig.restUrl}/lote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': wpConfig.nonce || '',
            Authorization: `Bearer ${sesionActiva?.token || ''}`
          },
          body: JSON.stringify({ registros: datosCSVPrevia, reemplazar: false })
        });
        if (!resp.ok) throw new Error('Error al importar lote en WordPress');
      }

      if (modoOffline || !db || !user) {
        setRegistros((prev) => [...datosCSVPrevia, ...prev]);
      } else {
        const batch = writeBatch(db);
        datosCSVPrevia.forEach((reg) => {
          const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'padron_beneficiarios', reg.id);
          batch.set(docRef, reg);
        });
        await batch.commit();
      }

      registrarAuditoria(
        'IMPORTACION_MASIVA_CSV',
        `Se importaron ${datosCSVPrevia.length} registros auditados desde ${reporteCSV?.nombreArchivo || 'CSV'}.`,
        'exito'
      );

      mostrarMensaje(
        'Importación Masiva Completada',
        `Se integraron ${datosCSVPrevia.length} registros limpios y auditados al portal público de Balancán.`,
        'exito'
      );
      setReporteCSV(null);
      setDatosCSVPrevia([]);
      setSubVistaAdmin('padron');
    } catch (error) {
      console.error('Error al importar lote:', error);
      mostrarMensaje('Error en Importación', 'No fue posible guardar el lote en la base de datos.', 'error');
    } finally {
      setCargando(false);
    }
  };

  const manejarSolicitudAdmin = () => {
    const actual = obtenerSesionActiva();
    if (actual) {
      setSesionActiva(actual);
      setVistaActual('admin');
    } else {
      setModalLoginAbierto(true);
    }
  };

  const manejarCerrarSesion = () => {
    cerrarSesionSegura('Sesión finalizada manualmente por el administrador.');
    setSesionActiva(null);
    setVistaActual('publica');
    setBitacoraSeguridad(obtenerBitacoraSeguridad());
    mostrarMensaje('Sesión Cerrada', 'Ha salido de la consola administrativa TIC de forma segura.', 'exito');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <NavbarInstitucional
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
        sesionActiva={sesionActiva}
        onSolicitarAdmin={manejarSolicitudAdmin}
        onCerrarSesion={manejarCerrarSesion}
      />

      <ModalLoginTIC
        abierto={modalLoginAbierto}
        onClose={() => setModalLoginAbierto(false)}
        onLoginExitoso={(nuevaSesion) => {
          setSesionActiva(nuevaSesion);
          setModalLoginAbierto(false);
          setVistaActual('admin');
          setBitacoraSeguridad(obtenerBitacoraSeguridad());
          mostrarMensaje(
            'Bienvenido al Panel TIC',
            `Sesión autenticada como ${nuevaSesion.nombre}.`,
            'exito'
          );
        }}
      />

      <NotificacionToast notificacion={notificacion} onClose={() => setNotificacion(null)} />

      <ModalConfirmacion
        modalConfirmacion={modalConfirmacion}
        onClose={() => setModalConfirmacion(null)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner para cargar Datos Semilla si está vacío */}
        {registros.length === 0 && !cargando && (
          <div className="mb-6 bg-amber-50 border-2 border-[#BC955C] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#BC955C]/20 rounded-xl text-[#7C1334]">
                <FileSpreadsheet className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  La base de datos del padrón está lista para inicializarse
                </h3>
                <p className="text-sm text-slate-600 mt-0.5">
                  Para presentar esta propuesta con información realista del municipio de Balancán (DIF, Atención a la Mujer, DECUR, Desarrollo y Agropecuario), cargue el lote de demostración con un clic.
                </p>
              </div>
            </div>
            <button
              onClick={cargarDatosSemilla}
              className="shrink-0 flex items-center space-x-2 bg-[#7C1334] hover:bg-[#5e0e27] text-white font-semibold px-5 py-3 rounded-xl shadow-md transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Cargar 16 Registros de Balancán</span>
            </button>
          </div>
        )}

        {vistaActual === 'publica' || !sesionActiva ? (
          <VistaPublica
            kpis={kpis}
            registros={registros}
            tabDireccion={tabDireccion}
            setTabDireccion={setTabDireccion}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            filtroLocalidad={filtroLocalidad}
            setFiltroLocalidad={setFiltroLocalidad}
            filtroPeriodo={filtroPeriodo}
            setFiltroPeriodo={setFiltroPeriodo}
            filtroTipoApoyo={filtroTipoApoyo}
            setFiltroTipoApoyo={setFiltroTipoApoyo}
            onExportarCSV={() =>
              exportarDatosAbiertosCSV(registrosFiltrados, tabDireccion, mostrarMensaje)
            }
            registrosPaginados={registrosPaginados}
            registrosFiltrados={registrosFiltrados}
            registrosPorPagina={registrosPorPagina}
            setRegistrosPorPagina={setRegistrosPorPagina}
            paginaActual={paginaActual}
            setPaginaActual={setPaginaActual}
            totalPaginas={totalPaginas}
          />
        ) : (
          <PanelAdmin
            subVistaAdmin={subVistaAdmin}
            setSubVistaAdmin={setSubVistaAdmin}
            modoEdicion={modoEdicion}
            setModoEdicion={setModoEdicion}
            setIdEdicion={setIdEdicion}
            formBeneficiario={formBeneficiario}
            setFormBeneficiario={setFormBeneficiario}
            guardarBeneficiarioIndividual={guardarBeneficiarioIndividual}
            registros={registros}
            onDescargarPlantilla={() => descargarPlantillaOficialDirecciones(mostrarMensaje)}
            onSimularCSV={simularCSVConDatosSensibles}
            onProcesarArchivoCSV={procesarArchivoCSV}
            reporteCSV={reporteCSV}
            datosCSVPrevia={datosCSVPrevia}
            onConfirmarImportacion={confirmarImportacionMasiva}
            onCargarDatosSemilla={cargarDatosSemilla}
            onIniciarEdicion={iniciarEdicion}
            onSolicitarEliminacion={(reg) =>
              setModalConfirmacion({
                titulo: 'Eliminar Registro del Padrón',
                mensaje: `¿Está seguro de eliminar el folio ${reg.folio} perteneciente a ${reg.nombres} ${reg.apellidoPaterno}?`,
                accion: () => eliminarRegistro(reg.id, reg.folio)
              })
            }
            bitacoraSeguridad={bitacoraSeguridad}
            sesionActiva={sesionActiva}
          />
        )}
      </main>

      <FooterInstitucional />
    </div>
  );
}
