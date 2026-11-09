import React from 'react';
import { ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';
import { obtenerEstiloDireccion } from '../../utils/texto';

export default function TablaPadronPublico({
  registrosPaginados,
  registrosFiltrados,
  tabDireccion,
  registrosPorPagina,
  setRegistrosPorPagina,
  paginaActual,
  setPaginaActual,
  totalPaginas
}) {
  return (
    <>
      {/* NIVEL 4: TABLA ESTÁNDAR DEL PADRÓN PÚBLICO */}
      <section className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
          <div className="text-xs font-semibold text-slate-600">
            Mostrando <span className="font-bold text-slate-900">{registrosPaginados.length}</span> de{' '}
            <span className="font-bold text-slate-900">{registrosFiltrados.length}</span> beneficiarios encontrados
            {tabDireccion !== 'TODAS' && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded bg-[#7C1334]/10 text-[#7C1334] font-bold">
                Dirección: {tabDireccion}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500">Filas por vista:</span>
            <select
              value={registrosPorPagina}
              onChange={(e) => setRegistrosPorPagina(Number(e.target.value))}
              className="border border-slate-300 rounded px-2 py-1 bg-white font-semibold"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-[11px] font-extrabold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Folio / ID</th>
                <th className="py-3 px-3">Periodo</th>
                <th className="py-3 px-3">Dirección</th>
                <th className="py-3 px-4">Nombre del Programa</th>
                <th className="py-3 px-4">Beneficiario (Apellidos y Nombres)</th>
                <th className="py-3 px-2 text-center">Sexo</th>
                <th className="py-3 px-4">Localidad / Comunidad</th>
                <th className="py-3 px-3">Tipo</th>
                <th className="py-3 px-4">Monto / Especie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
              {registrosPaginados.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    No se encontraron registros que coincidan con los criterios de búsqueda seleccionados.
                  </td>
                </tr>
              ) : (
                registrosPaginados.map((reg) => (
                  <tr key={reg.id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs font-bold text-[#7C1334] whitespace-nowrap">
                      {reg.folio}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-xs text-slate-600 font-medium">
                      {reg.periodo}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${obtenerEstiloDireccion(
                          reg.direccion
                        )}`}
                      >
                        {reg.direccion}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 text-xs">
                      {reg.programa}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {reg.protegido ? (
                        <span
                          title="Identidad resguardada conforme a los lineamientos de Protección de Datos Personales del ITAIP para casos vulnerables."
                          className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span>BENEFICIARIO PROTEGIDO (FOLIO VERIFICADO)</span>
                        </span>
                      ) : (
                        `${reg.apellidoPaterno} ${reg.apellidoMaterno} ${reg.nombres}`
                      )}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-extrabold ${
                          reg.sexo === 'M'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {reg.sexo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-700 font-medium">
                      {reg.localidad}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-xs">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold ${
                          reg.tipoApoyo === 'Económico'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {reg.tipoApoyo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-bold text-slate-800">
                      <div>{reg.montoEspecie}</div>
                      {Number(reg.montoNumerico) > 0 && reg.tipoApoyo !== 'Económico' && (
                        <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                          Valor est.: ${Number(reg.montoNumerico).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                        </div>
                      )}
                      {reg.tipoApoyo === 'Capacitación / Servicio' && (!reg.montoNumerico || Number(reg.montoNumerico) === 0) && (
                        <div className="text-[10px] text-slate-400 font-normal italic mt-0.5">
                          Servicio público institucional
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Controles de Paginación */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-600">
            Página <span className="font-bold">{paginaActual}</span> de{' '}
            <span className="font-bold">{totalPaginas}</span>
          </span>
          <div className="flex space-x-2">
            <button
              disabled={paginaActual <= 1}
              onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
            <button
              disabled={paginaActual >= totalPaginas}
              onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 flex items-center gap-1"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* AVISO DE PRIVACIDAD Y BLINDAJE NORMATIVO (ITAIP TABASCO) */}
      <section className="bg-white rounded-xl p-5 border border-slate-200 border-t-4 border-t-[#BC955C] shadow-xs">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-[#92400e] shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
              Nota de Cumplimiento Normativo, Transparencia y Protección de Datos Personales
            </h3>
            <p>
              El presente padrón se publica en cumplimiento al{' '}
              <strong>
                Artículo 76 Fracción XV de la Ley de Transparencia y Acceso a la Información Pública del Estado de Tabasco
              </strong>
              . En apego estricto a la{' '}
              <strong>Ley de Protección de Datos Personales en Posesión de Sujetos Obligados</strong> y los criterios del{' '}
              <strong>ITAIP</strong>, se omiten datos confidenciales como CURP, RFC, números telefónicos y domicilios particulares exactos.
            </p>
            <p>
              En los programas operados por el <strong>DIF Municipal</strong> y la{' '}
              <strong>Dirección de Atención a la Mujer</strong> vinculados a asistencia jurídica, psicológica o situación de vulnerabilidad, se aplica el protocolo de disociación e anonimización por folio verificado para salvaguardar la integridad de las beneficiarias.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
