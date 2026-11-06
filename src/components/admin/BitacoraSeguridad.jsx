import React from 'react';
import { ShieldAlert, CheckCircle2, Lock, Clock, UserCheck } from 'lucide-react';

export default function BitacoraSeguridad({ bitacora = [], sesionActiva }) {
  return (
    <div className="space-y-6">
      {/* Resumen de blindaje activo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 border-l-4 border-l-emerald-600 shadow-xs">
          <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs uppercase">
            <UserCheck className="w-4 h-4" />
            <span>Sesión Autenticada Activa</span>
          </div>
          <p className="text-sm font-extrabold text-slate-900 mt-1">
            {sesionActiva ? `${sesionActiva.nombre} (${sesionActiva.usuario})` : 'Sesión Cerrada'}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Modo: {sesionActiva?.modo || 'Local Seguro'} • Rol: {sesionActiva?.rol || 'ADMIN_TIC'}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 border-l-4 border-l-[#7C1334] shadow-xs">
          <div className="flex items-center space-x-2 text-[#7C1334] font-bold text-xs uppercase">
            <Lock className="w-4 h-4" />
            <span>Protección Anti-Intrusión</span>
          </div>
          <p className="text-sm font-extrabold text-slate-900 mt-1">
            Bloqueo por Fuerza Bruta Activo
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Máximo 5 intentos fallidos • Hash SHA-256 + Sanitización CSV/XSS
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 border-l-4 border-l-[#BC955C] shadow-xs">
          <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs uppercase">
            <Clock className="w-4 h-4" />
            <span>Cierre por Inactividad</span>
          </div>
          <p className="text-sm font-extrabold text-slate-900 mt-1">
            Expiración automática: 15 min
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Cierra la consola administrativa si no se detecta actividad
          </p>
        </div>
      </div>

      {/* Tabla de Bitácora de Auditoría */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Bitácora de Auditoría y Eventos de Seguridad ({bitacora.length})
            </h3>
            <p className="text-xs text-slate-500">
              Registro cronológico inmutable de accesos, intentos fallidos, altas, ediciones y bajas del padrón.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 uppercase font-extrabold border-b border-slate-200">
                <th className="py-3 px-4">ID Evento</th>
                <th className="py-3 px-3">Fecha y Hora</th>
                <th className="py-3 px-3">Usuario</th>
                <th className="py-3 px-3">Acción</th>
                <th className="py-3 px-4">Detalle del Evento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {bitacora.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No hay eventos registrados aún en la bitácora.
                  </td>
                </tr>
              ) : (
                bitacora.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                      {ev.id}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-600">
                      {new Date(ev.fecha).toLocaleString('es-MX')}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-[#7C1334]">{ev.usuario}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[10px] ${
                          ev.nivel === 'alerta' || ev.nivel === 'error'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : ev.nivel === 'exito'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ev.nivel === 'alerta' ? (
                          <ShieldAlert className="w-3 h-3" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {ev.accion}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-700">{ev.detalle}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
