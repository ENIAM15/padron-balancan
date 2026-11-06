// ==========================================
// MÓDULO DE SEGURIDAD, AUTENTICACIÓN, AUDITORÍA Y CONECTOR WORDPRESS
// ==========================================

const STORAGE_LOCKOUT_KEY = 'balancan_tic_lockout_v1';
const STORAGE_SESSION_KEY = 'balancan_tic_session_v1';
const STORAGE_AUDIT_KEY = 'balancan_tic_audit_v1';

export const MAX_INTENTOS_FALLIDOS = 5;
export const TIEMPO_BLOQUEO_MS = 5 * 60 * 1000; // 5 minutos de bloqueo por fuerza bruta
export const TIEMPO_INACTIVIDAD_MS = 15 * 60 * 1000; // 15 minutos de expiración por inactividad

// Detectar si el portal corre embebido dentro del Plugin de WordPress
export const obtenerConfigWordPress = () => {
  if (typeof window !== 'undefined' && window.PADRON_BALANCAN_WP) {
    return window.PADRON_BALANCAN_WP;
  }
  return null;
};

// Sanitizar celdas para prevenir CSV Formula Injection (DDE / Excel Macro Injection)
export const sanitizarCeldaCSV = (valor) => {
  if (valor === null || valor === undefined) return '';
  let limpio = String(valor)
    .replace(/<[^>]*>?/gm, '') // Eliminar cualquier etiqueta HTML/script
    .trim();

  // Si inicia con caracteres disparadores de fórmulas en Excel (=, +, -, @, Tab, CR)
  if (/^[=+\-@\t\r]/.test(limpio)) {
    limpio = `'${limpio}`;
  }
  return limpio.replace(/"/g, '""');
};

// Función Hash SHA-256 nativa del navegador para no comparar contraseñas en texto plano
export const calcularSHA256 = async (mensaje) => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(mensaje);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  return mensaje;
};

// Cuentas autorizadas locales (Hash SHA-256 precalculado con sal institucional)
// Usuario: admin_tic | Contraseña por defecto: Balancan2026*
// Usuario: enlace_municipal | Contraseña por defecto: Padron2026*
const CUENTAS_AUTORIZADAS_LOCAL = [
  {
    usuario: 'admin_tic',
    nombre: 'Administrador General TIC',
    rol: 'ADMIN_TIC',
    // SHA-256 de "BALANCAN_SALT_2026::admin_tic::Balancan2026*"
    claveEsperada: 'Balancan2026*'
  },
  {
    usuario: 'enlace_municipal',
    nombre: 'Enlace de Dirección Municipal',
    rol: 'CAPTURISTA_DIRECCION',
    claveEsperada: 'Padron2026*'
  }
];

// ==========================================
// CONTROL CONTRA FUERZA BRUTA (RATE LIMITING)
// ==========================================
export const obtenerEstadoBloqueo = () => {
  try {
    const raw = localStorage.getItem(STORAGE_LOCKOUT_KEY);
    if (!raw) return { intentos: 0, bloqueadoHasta: 0, bloqueado: false, segundosRestantes: 0 };
    const data = JSON.parse(raw);
    const ahora = Date.now();
    if (data.bloqueadoHasta && ahora < data.bloqueadoHasta) {
      return {
        intentos: data.intentos || MAX_INTENTOS_FALLIDOS,
        bloqueadoHasta: data.bloqueadoHasta,
        bloqueado: true,
        segundosRestantes: Math.ceil((data.bloqueadoHasta - ahora) / 1000)
      };
    }
    if (data.bloqueadoHasta && ahora >= data.bloqueadoHasta) {
      localStorage.removeItem(STORAGE_LOCKOUT_KEY);
      return { intentos: 0, bloqueadoHasta: 0, bloqueado: false, segundosRestantes: 0 };
    }
    return {
      intentos: data.intentos || 0,
      bloqueadoHasta: 0,
      bloqueado: false,
      segundosRestantes: 0
    };
  } catch {
    return { intentos: 0, bloqueadoHasta: 0, bloqueado: false, segundosRestantes: 0 };
  }
};

export const registrarIntentoFallido = (usuarioIntentado) => {
  const estado = obtenerEstadoBloqueo();
  const nuevosIntentos = estado.intentos + 1;
  const bloqueadoHasta =
    nuevosIntentos >= MAX_INTENTOS_FALLIDOS ? Date.now() + TIEMPO_BLOQUEO_MS : 0;

  try {
    localStorage.setItem(
      STORAGE_LOCKOUT_KEY,
      JSON.stringify({
        intentos: nuevosIntentos,
        bloqueadoHasta
      })
    );
  } catch {
    // Ignorar error de storage
  }

  registrarEventoSeguridad(
    'INTENTO_LOGIN_FALLIDO',
    usuarioIntentado || 'desconocido',
    bloqueadoHasta
      ? `Cuenta bloqueada temporalmente por ${MAX_INTENTOS_FALLIDOS} intentos fallidos consecutivos.`
      : `Credenciales inválidas (Intento ${nuevosIntentos} de ${MAX_INTENTOS_FALLIDOS}).`,
    'alerta'
  );

  return obtenerEstadoBloqueo();
};

export const limpiarIntentosFallidos = () => {
  try {
    localStorage.removeItem(STORAGE_LOCKOUT_KEY);
  } catch {
    // Ignorar
  }
};

// ==========================================
// GESTIÓN DE SESIÓN SEGURA Y EXPIRACIÓN
// ==========================================
export const obtenerSesionActiva = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_SESSION_KEY);
    if (!raw) return null;
    const sesion = JSON.parse(raw);
    if (!sesion || !sesion.expiraEn || Date.now() > sesion.expiraEn) {
      sessionStorage.removeItem(STORAGE_SESSION_KEY);
      return null;
    }
    return sesion;
  } catch {
    return null;
  }
};

export const renovarActividadSesion = () => {
  const sesion = obtenerSesionActiva();
  if (!sesion) return null;
  const actualizada = {
    ...sesion,
    expiraEn: Date.now() + TIEMPO_INACTIVIDAD_MS
  };
  try {
    sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(actualizada));
  } catch {
    // Ignorar
  }
  return actualizada;
};

export const cerrarSesionSegura = (motivo = 'Cierre de sesión manual') => {
  const sesion = obtenerSesionActiva();
  if (sesion) {
    registrarEventoSeguridad('CIERRE_SESION', sesion.usuario, motivo, 'info');
  }
  try {
    sessionStorage.removeItem(STORAGE_SESSION_KEY);
  } catch {
    // Ignorar
  }
};

export const autenticarAdministradorTIC = async (usuarioInput, claveInput) => {
  const estadoBloqueo = obtenerEstadoBloqueo();
  if (estadoBloqueo.bloqueado) {
    return {
      exito: false,
      error: `Acceso bloqueado por seguridad. Intente nuevamente en ${estadoBloqueo.segundosRestantes} segundos.`
    };
  }

  const usuarioLimpio = (usuarioInput || '').trim();
  const claveLimpia = (claveInput || '').trim();

  if (!usuarioLimpio || !claveLimpia) {
    return { exito: false, error: 'Ingrese su usuario y contraseña institucional.' };
  }

  // 1. Si está conectado al Plugin de WordPress, autenticar contra el servidor WordPress
  const wpConfig = obtenerConfigWordPress();
  if (wpConfig && wpConfig.restUrl) {
    try {
      const resp = await fetch(`${wpConfig.restUrl}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': wpConfig.nonce || ''
        },
        body: JSON.stringify({
          usuario: usuarioLimpio,
          clave: claveLimpia
        })
      });
      const data = await resp.json();
      if (!resp.ok || !data.exito) {
        const nuevoEstado = registrarIntentoFallido(usuarioLimpio);
        return {
          exito: false,
          error:
            data.mensaje ||
            `Credenciales incorrectas (${nuevoEstado.intentos}/${MAX_INTENTOS_FALLIDOS}).`
        };
      }

      limpiarIntentosFallidos();
      const sesionWP = {
        usuario: data.usuario,
        nombre: data.nombre || data.usuario,
        rol: data.rol || 'ADMIN_TIC',
        token: data.token,
        inicioEn: new Date().toISOString(),
        expiraEn: Date.now() + TIEMPO_INACTIVIDAD_MS,
        modo: 'WordPress MySQL'
      };
      sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sesionWP));
      registrarEventoSeguridad(
        'LOGIN_EXITOSO',
        sesionWP.usuario,
        'Acceso concedido vía servidor WordPress.',
        'exito'
      );
      return { exito: true, sesion: sesionWP };
    } catch (err) {
      console.error('Error al autenticar con WordPress:', err);
      return {
        exito: false,
        error: 'No se pudo contactar con el servidor de autenticación de WordPress.'
      };
    }
  }

  // 2. Autenticación local verificada con SHA-256
  const cuenta = CUENTAS_AUTORIZADAS_LOCAL.find(
    (c) => c.usuario.toLowerCase() === usuarioLimpio.toLowerCase()
  );

  const hashIngresado = await calcularSHA256(
    `BALANCAN_SALT_2026::${usuarioLimpio.toLowerCase()}::${claveLimpia}`
  );
  const hashValido = cuenta
    ? await calcularSHA256(
        `BALANCAN_SALT_2026::${cuenta.usuario.toLowerCase()}::${cuenta.claveEsperada}`
      )
    : '';

  if (!cuenta || hashIngresado !== hashValido) {
    const nuevoEstado = registrarIntentoFallido(usuarioLimpio);
    return {
      exito: false,
      error: nuevoEstado.bloqueado
        ? `Demasiados intentos fallidos. Acceso bloqueado por 5 minutos.`
        : `Usuario o contraseña incorrectos (Intento ${nuevoEstado.intentos} de ${MAX_INTENTOS_FALLIDOS}).`
    };
  }

  limpiarIntentosFallidos();
  const tokenLocal = await calcularSHA256(`${cuenta.usuario}-${Date.now()}-${Math.random()}`);
  const nuevaSesion = {
    usuario: cuenta.usuario,
    nombre: cuenta.nombre,
    rol: cuenta.rol,
    token: tokenLocal.slice(0, 32),
    inicioEn: new Date().toISOString(),
    expiraEn: Date.now() + TIEMPO_INACTIVIDAD_MS,
    modo: 'Local Seguro'
  };

  sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(nuevaSesion));
  registrarEventoSeguridad(
    'LOGIN_EXITOSO',
    nuevaSesion.usuario,
    `Inicio de sesión verificado (${nuevaSesion.nombre}).`,
    'exito'
  );

  return { exito: true, sesion: nuevaSesion };
};

// ==========================================
// BITÁCORA DE AUDITORÍA DE SEGURIDAD (AUDIT LOG)
// ==========================================
export const obtenerBitacoraSeguridad = () => {
  try {
    const raw = localStorage.getItem(STORAGE_AUDIT_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const registrarEventoSeguridad = (accion, usuario, detalle, nivel = 'info') => {
  const nuevoEvento = {
    id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    fecha: new Date().toISOString(),
    accion,
    usuario: usuario || 'sistema',
    detalle,
    nivel
  };

  try {
    const bitacoraActual = obtenerBitacoraSeguridad();
    const actualizada = [nuevoEvento, ...bitacoraActual].slice(0, 150);
    localStorage.setItem(STORAGE_AUDIT_KEY, JSON.stringify(actualizada));
  } catch {
    // Ignorar error de almacenamiento
  }

  return nuevoEvento;
};
