import React from 'react';
import {
  Download,
  ShieldAlert,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function ImportadorCSV({
  onDescargarPlantilla,
  onSimularCSV,
  onProcesarArchivoCSV,
  reporteCSV,
  datosCSVPrevia,
  onConfirmarImportacion
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            Importador Masivo desde Excel / CSV con Auditor de Datos Personales
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Suba los archivos entregados por DIF, DECUR, Atención a la Mujer, Desarrollo o Agropecuario. El sistema detecta y bloquea columnas prohibidas (CURP, RFC, Teléfono, Calle).
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onDescargarPlantilla}
            className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Plantilla CSV
          </button>
          <button
            onClick={onSimularCSV}
            className="px-3.5 py-2 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold hover:bg-amber-200 flex items-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4" /> Probar Simulación de Auditoría CSV
          </button>
        </div>
      </div>

      {/* Zona de carga de archivo */}
      <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-[#7C1334] transition bg-slate-50/50">
        <UploadCloud className="w-12 h-12 text-[#7C1334] mx-auto mb-3" />
        <h4 className="text-sm font-bold text-slate-800">
          Seleccione un archivo .CSV exportado desde Excel
        </h4>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Codificación UTF-8 recomendada. El validador revisará las columnas automáticamente antes de publicar.
        </p>
        <label className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#7C1334] text-white text-xs font-bold cursor-pointer hover:bg-[#5e0e27] shadow-sm">
          <FileSpreadsheet className="w-4 h-4" />
          <span>Seleccionar Archivo CSV de mi Equipo</span>
          <input
            type="file"
            accept=".csv"
            onChange={onProcesarArchivoCSV}
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
                  Se analizaron {reporteCSV.totalFilas} filas listas para integrarse al padrón municipal.
                </p>
              </div>
            </div>
            <button
              onClick={onConfirmarImportacion}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Aprobar e Importar {reporteCSV.totalFilas} Registros Limpios</span>
            </button>
          </div>

          {reporteCSV.columnasBloqueadas.length > 0 ? (
            <div className="bg-white rounded-lg p-3.5 border border-rose-200 text-xs space-y-1.5">
              <div className="font-bold text-rose-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                ¡Atención! Se detectaron y eliminaron automáticamente columnas con datos personales confidenciales:
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {reporteCSV.columnasBloqueadas.map((col) => (
                  <span
                    key={col}
                    className="px-2.5 py-0.5 rounded bg-rose-100 text-rose-900 font-mono font-bold text-[11px] line-through"
                  >
                    {col} (BLOQUEADA)
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Dichas columnas no serán almacenadas ni publicadas en ebalancan.gob.mx conforme a la Ley de Protección de Datos Personales del Estado de Tabasco.
              </p>
            </div>
          ) : (
            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200 text-xs text-emerald-900 font-semibold">
              ✓ El archivo cumple con el estándar limpio: No contiene CURP, RFC, teléfonos ni domicilios exactos.
            </div>
          )}

          {/* Vista previa de los registros a importar */}
          <div className="overflow-x-auto bg-white rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b">
                  <th className="py-2 px-3">Folio Asignado</th>
                  <th className="py-2 px-3">Dirección</th>
                  <th className="py-2 px-3">Programa</th>
                  <th className="py-2 px-3">Beneficiario (Normalizado)</th>
                  <th className="py-2 px-3">Localidad</th>
                  <th className="py-2 px-3">Apoyo</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {datosCSVPrevia.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2 px-3 font-mono font-bold text-[#7C1334]">{r.folio}</td>
                    <td className="py-2 px-3">{r.direccion}</td>
                    <td className="py-2 px-3 font-semibold">{r.programa}</td>
                    <td className="py-2 px-3">
                      {r.apellidoPaterno} {r.apellidoMaterno} {r.nombres}{' '}
                      {r.protegido && (
                        <span className="ml-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                          PROTEGIDO
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3">{r.localidad}</td>
                    <td className="py-2 px-3">{r.montoEspecie}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
