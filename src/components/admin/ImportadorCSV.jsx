import React, { useState } from 'react';
import {
  Download,
  ShieldAlert,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import { DIRECCIONES, PERIODOS, TIPOS_APOYO } from '../../utils/catalogos';

export default function ImportadorCSV({
  onDescargarPlantilla,
  onSimularCSV,
  onProcesarArchivoCSV,
  reporteCSV,
  datosCSVPrevia,
  onConfirmarImportacion
}) {
  const [direccionAsignada, setDireccionAsignada] = useState('Atención Ciudadana');
  const [programaAsignado, setProgramaAsignado] = useState('ENTREGA DE CEMENTO');
  const [periodoAsignado, setPeriodoAsignado] = useState('2026 - T1');
  const [tipoApoyoAsignado, setTipoApoyoAsignado] = useState('Especie');
  const [montoAsignado, setMontoAsignado] = useState(1800);
  const [montoEspecieAsignado, setMontoEspecieAsignado] = useState('PAQUETE DE CEMENTO (10 BULTOS)');

  const manejarArchivoSeleccionado = (e) => {
    onProcesarArchivoCSV(e, {
      direccion: direccionAsignada,
      programa: programaAsignado,
      periodo: periodoAsignado,
      tipoApoyo: tipoApoyoAsignado,
      montoNumerico: Number(montoAsignado) || 0,
      montoEspecie: montoEspecieAsignado
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            Importador Masivo con Filtro Inteligente de Privacidad (ITAIP)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Compatible con la Plantilla Oficial y con formatos libres de las Direcciones (ej. <strong>Atención Ciudadana</strong>, DIF, etc.). Detecta y bloquea automáticamente columnas sensibles (CURP, INE, Domicilio particular, CP).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onDescargarPlantilla}
            className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4" /> Plantilla CSV
          </button>
          <button
            onClick={onSimularCSV}
            className="px-3.5 py-2 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <CheckCircle2 className="w-4 h-4" /> Cargar 100 de Atención Ciudadana (Cemento)
          </button>
        </div>
      </div>

      {/* Opciones de asignación rápida para archivos libres */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-[#7C1334]" />
          Valores por defecto para archivos sin encabezados de programa
        </h4>
        <p className="text-[11px] text-slate-500 mb-3">
          Si el archivo subido por la dirección no incluye columnas de programa o dirección (como los listados de ventanilla de Atención Ciudadana), se le asignarán estos valores:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Dirección Municipal</label>
            <select
              value={direccionAsignada}
              onChange={(e) => setDireccionAsignada(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold"
            >
              {DIRECCIONES.map((d) => (
                <option key={d.id} value={d.nombre}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nombre del Programa</label>
            <input
              type="text"
              value={programaAsignado}
              onChange={(e) => setProgramaAsignado(e.target.value)}
              placeholder="Ej. ENTREGA DE CEMENTO"
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white uppercase font-semibold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Periodo / Trimestre</label>
            <select
              value={periodoAsignado}
              onChange={(e) => setPeriodoAsignado(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold"
            >
              {PERIODOS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Apoyo / Monto</label>
            <input
              type="text"
              value={montoEspecieAsignado}
              onChange={(e) => setMontoEspecieAsignado(e.target.value)}
              placeholder="Ej. 10 BULTOS DE CEMENTO"
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white uppercase font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Zona de carga de archivo */}
      <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-[#7C1334] transition bg-slate-50/50">
        <UploadCloud className="w-12 h-12 text-[#7C1334] mx-auto mb-3" />
        <h4 className="text-sm font-bold text-slate-800">
          Seleccione el archivo .CSV exportado desde Excel
        </h4>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Acepta tanto la plantilla oficial como los archivos crudos de Atención Ciudadana (con CURP, INE, recibos y domicilios).
        </p>
        <label className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#7C1334] text-white text-xs font-bold cursor-pointer hover:bg-[#5e0e27] shadow-sm transition">
          <FileSpreadsheet className="w-4 h-4" />
          <span>Seleccionar Archivo CSV de mi Equipo</span>
          <input
            type="file"
            accept=".csv,.txt"
            onChange={manejarArchivoSeleccionado}
            className="hidden"
          />
        </label>
      </div>

      {/* Reporte del Validador de Privacidad */}
      {reporteCSV && (
        <div className="rounded-xl border-2 border-amber-400 bg-amber-50/70 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center space-x-2.5">
              <ShieldAlert className="w-6 h-6 text-amber-800 shrink-0" />
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  Reporte de Auditoría de Protección de Datos — {reporteCSV.nombreArchivo}
                </h4>
                <p className="text-xs text-slate-600">
                  Se analizaron <strong>{reporteCSV.totalFilas}</strong> beneficiarios listos para integrarse al padrón municipal.
                </p>
              </div>
            </div>
            <button
              onClick={onConfirmarImportacion}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Aprobar e Importar {reporteCSV.totalFilas} Registros al Padrón</span>
            </button>
          </div>

          {reporteCSV.columnasBloqueadas.length > 0 ? (
            <div className="bg-white rounded-lg p-3.5 border border-rose-200 text-xs space-y-1.5">
              <div className="font-bold text-rose-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                ¡Blindaje ITAIP Activo! Se detectaron y eliminaron automáticamente columnas con datos confidenciales:
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {reporteCSV.columnasBloqueadas.map((col, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded bg-rose-100 text-rose-900 font-mono font-bold text-[11px] line-through"
                  >
                    {col}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Dichas columnas no serán almacenadas ni publicadas en el portal público conforme al <strong>Art. 76 Fracc. XV de la Ley de Transparencia de Tabasco</strong>.
              </p>
            </div>
          ) : (
            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200 text-xs text-emerald-900 font-semibold">
              ✓ El archivo cumple con el estándar limpio: No contiene CURP, RFC, teléfonos ni domicilios exactos.
            </div>
          )}

          {/* Vista previa de los registros a importar */}
          <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 max-h-96">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-slate-100 text-slate-700 border-b">
                <tr>
                  <th className="py-2 px-3">Folio Asignado</th>
                  <th className="py-2 px-3">Dirección</th>
                  <th className="py-2 px-3">Programa</th>
                  <th className="py-2 px-3">Beneficiario (Normalizado)</th>
                  <th className="py-2 px-2 text-center">Sexo</th>
                  <th className="py-2 px-3">Localidad Oficial</th>
                  <th className="py-2 px-3">Apoyo / Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {datosCSVPrevia.slice(0, 50).map((r, idx) => (
                  <tr key={r.id || idx} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono font-bold text-[#7C1334] whitespace-nowrap">
                      {r.folio}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap font-medium text-teal-800">
                      {r.direccion}
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-800">{r.programa}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">
                      {r.apellidoPaterno} {r.apellidoMaterno} {r.nombres}
                      {r.protegido && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                          PROTEGIDO
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-center font-bold">{r.sexo}</td>
                    <td className="py-2 px-3 text-slate-700">{r.localidad}</td>
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      {r.montoEspecie} {r.montoNumerico ? `($${r.montoNumerico})` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {datosCSVPrevia.length > 50 && (
            <p className="text-center text-[11px] text-slate-500 italic">
              Mostrando vista previa de 50 de {datosCSVPrevia.length} beneficiarios listos para importar.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
