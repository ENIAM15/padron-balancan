import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert, KeyRound, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import {
  autenticarAdministradorTIC,
  obtenerEstadoBloqueo,
  obtenerConfigWordPress
} from '../utils/seguridad';

export default function ModalLoginTIC({ abierto, onClose, onLoginExitoso }) {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [mostrarClave, setMostrarClave] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [estadoBloqueo, setEstadoBloqueo] = useState(obtenerEstadoBloqueo());

  const esLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
    !obtenerConfigWordPress();

  useEffect(() => {
    if (!abierto) return;
    setEstadoBloqueo(obtenerEstadoBloqueo());
    setErrorMsg('');

    const timer = setInterval(() => {
      const actual = obtenerEstadoBloqueo();
      setEstadoBloqueo(actual);
    }, 1000);

    return () => clearInterval(timer);
  }, [abierto]);

  if (!abierto) return null;

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setProcesando(true);
    try {
      const res = await autenticarAdministradorTIC(usuario, clave);
      setEstadoBloqueo(obtenerEstadoBloqueo());
      if (!res.exito) {
        setErrorMsg(res.error);
      } else {
        setUsuario('');
        setClave('');
        onLoginExitoso(res.sesion);
      }
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border-2 border-[#BC955C]">
        {/* Encabezado Guinda */}
        <div className="bg-[#7C1334] text-white px-6 py-4 border-b-2 border-[#BC955C] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-white/10 border border-[#BC955C]">
              <Lock className="w-5 h-5 text-[#BC955C]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">
                Acceso Restringido — Panel TIC
              </h3>
              <p className="text-[11px] text-rose-100/90">
                H. Ayuntamiento Constitucional de Balancán
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-rose-200 hover:text-white text-sm font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={manejarSubmit} className="p-6 space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-[#7C1334] shrink-0 mt-0.5" />
            <span>
              Módulo exclusivo para personal autorizado del <strong>Departamento de TIC</strong> y enlaces designados. Todos los intentos de acceso quedan registrados en la bitácora de auditoría.
            </span>
          </div>

          {estadoBloqueo.bloqueado && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-900 font-semibold">
              🔒 Sistema bloqueado temporalmente por intentos fallidos excesivos. Tiempo restante:{' '}
              <span className="font-mono font-extrabold">{estadoBloqueo.segundosRestantes}s</span>
            </div>
          )}

          {errorMsg && !estadoBloqueo.bloqueado && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-800 font-bold">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Usuario Institucional *
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              disabled={estadoBloqueo.bloqueado || procesando}
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ej. admin_tic"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#7C1334] disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Contraseña de Seguridad *
            </label>
            <div className="relative">
              <input
                type={mostrarClave ? 'text' : 'password'}
                required
                autoComplete="current-password"
                disabled={estadoBloqueo.bloqueado || procesando}
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#7C1334] disabled:bg-slate-100"
              />
              <button
                type="button"
                onClick={() => setMostrarClave(!mostrarClave)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
              >
                {mostrarClave ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Ayuda rápida únicamente en entorno de pruebas local */}
          {esLocalhost && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-950 flex items-center justify-between gap-2">
              <div>
                <span className="font-bold block">Modo Pruebas Locales (localhost):</span>
                Usuario: <code className="font-mono font-bold">admin_tic</code> | Clave:{' '}
                <code className="font-mono font-bold">Balancan2026*</code>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUsuario('admin_tic');
                  setClave('Balancan2026*');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-[#BC955C] text-slate-950 font-bold hover:bg-[#a6814c] shrink-0"
              >
                Autocompletar
              </button>
            </div>
          )}

          <div className="pt-2 flex justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={estadoBloqueo.bloqueado || procesando}
              className="px-5 py-2.5 rounded-xl bg-[#7C1334] hover:bg-[#5e0e27] text-white text-xs font-bold shadow-md flex items-center space-x-2 disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{procesando ? 'Verificando...' : 'Iniciar Sesión Segura'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
