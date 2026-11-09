import React from 'react';
import { RefreshCw, EyeOff, Eye, Edit3, Trash2 } from 'lucide-react';
import { obtenerEstiloDireccion } from '../../utils/texto';

export default function TablaAdminPadron({
  registros,
  onCargarDatosSemilla,
  onVaciarPadron,
  onIniciarEdicion,
  onSolicitarEliminacion
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">
            Control General de Registros en Base de Datos ({registros.length})
          </h3>
          <p className="text-xs text-slate-500">
            Desde aquí el Departamento de TIC puede editar cualquier registro, activar o desactivar protección de identidad, recargar datos o vaciar para producción.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onCargarDatosSemilla}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Restaurar Datos Semilla Balancán
          </button>
          <button
            onClick={onVaciarPadron}
            className="px-3.5 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" /> Vaciar Padrón (Iniciar en 0)
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700 uppercase font-extrabold border-b border-slate-200">
              <th className="py-3 px-4">Folio</th>
              <th className="py-3 px-3">Dirección</th>
              <th className="py-3 px-4">Beneficiario (Base Interna)</th>
              <th className="py-3 px-3">Privacidad</th>
              <th className="py-3 px-3">Localidad</th>
              <th className="py-3 px-3">Monto / Especie</th>
              <th className="py-3 px-4 text-right">Acciones TIC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {registros.map((reg) => (
              <tr key={reg.id} className="hover:bg-slate-50">
                <td className="py-2.5 px-4 font-mono font-bold text-[#7C1334]">
                  {reg.folio}
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${obtenerEstiloDireccion(
                      reg.direccion
                    )}`}
                  >
                    {reg.direccion}
                  </span>
                </td>
                <td className="py-2.5 px-4 font-bold text-slate-900">
                  {reg.apellidoPaterno} {reg.apellidoMaterno} {reg.nombres}
                  <div className="text-[11px] font-normal text-slate-500">
                    {reg.programa}
                  </div>
                </td>
                <td className="py-2.5 px-3">
                  {reg.protegido ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[11px]">
                      <EyeOff className="w-3 h-3" /> Protegido
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold text-[11px]">
                      <Eye className="w-3 h-3" /> Público
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-slate-600">{reg.localidad}</td>
                <td className="py-2.5 px-3 font-semibold text-slate-800">
                  <div>{reg.montoEspecie}</div>
                  {Number(reg.montoNumerico) > 0 && (
                    <div className="text-[11px] text-emerald-700 font-normal">
                      ${Number(reg.montoNumerico).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </div>
                  )}
                </td>
                <td className="py-2.5 px-4 text-right whitespace-nowrap space-x-1.5">
                  <button
                    onClick={() => onIniciarEdicion(reg)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                    title="Editar beneficiario"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onSolicitarEliminacion(reg)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700"
                    title="Eliminar registro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
