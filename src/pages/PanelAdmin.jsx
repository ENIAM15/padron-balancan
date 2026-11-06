import React from 'react';
import { Plus, UploadCloud, FileText, ShieldCheck } from 'lucide-react';
import FormularioCaptura from '../components/admin/FormularioCaptura';
import ImportadorCSV from '../components/admin/ImportadorCSV';
import TablaAdminPadron from '../components/admin/TablaAdminPadron';
import BitacoraSeguridad from '../components/admin/BitacoraSeguridad';

export default function PanelAdmin({
  subVistaAdmin,
  setSubVistaAdmin,
  modoEdicion,
  setModoEdicion,
  setIdEdicion,
  formBeneficiario,
  setFormBeneficiario,
  guardarBeneficiarioIndividual,
  registros,
  onDescargarPlantilla,
  onSimularCSV,
  onProcesarArchivoCSV,
  reporteCSV,
  datosCSVPrevia,
  onConfirmarImportacion,
  onCargarDatosSemilla,
  onIniciarEdicion,
  onSolicitarEliminacion,
  bitacoraSeguridad,
  sesionActiva
}) {
  return (
    <div className="space-y-6">
      {/* Barra de herramientas del Administrador TIC */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-md border-b-4 border-[#BC955C] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#BC955C] text-slate-950 uppercase">
              Back-End Administrativo Protegido
            </span>
            <span className="text-xs text-slate-300">
              Departamento de TIC • Usuario activo: <strong>{sesionActiva?.nombre || 'TIC'}</strong>
            </span>
          </div>
          <h2 className="text-xl font-extrabold mt-1">
            Consola de Gestión, Validación y Carga Masiva del Padrón
          </h2>
        </div>

        {/* Sub-navegación del Back-end */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSubVistaAdmin('captura')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
              subVistaAdmin === 'captura'
                ? 'bg-[#7C1334] text-white ring-2 ring-[#BC955C]'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{modoEdicion ? 'Editar Registro' : '1. Captura Individual'}</span>
          </button>

          <button
            onClick={() => setSubVistaAdmin('csv')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
              subVistaAdmin === 'csv'
                ? 'bg-[#7C1334] text-white ring-2 ring-[#BC955C]'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>2. Carga Masiva Excel / CSV</span>
          </button>

          <button
            onClick={() => setSubVistaAdmin('padron')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
              subVistaAdmin === 'padron'
                ? 'bg-[#7C1334] text-white ring-2 ring-[#BC955C]'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>3. Administrar Padrón ({registros.length})</span>
          </button>

          <button
            onClick={() => setSubVistaAdmin('seguridad')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
              subVistaAdmin === 'seguridad'
                ? 'bg-[#7C1334] text-white ring-2 ring-[#BC955C]'
                : 'bg-slate-800 text-emerald-300 hover:bg-slate-700 border border-emerald-500/30'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>4. Bitácora de Seguridad ({bitacoraSeguridad?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* SUB-VISTA 1: CAPTURA INDIVIDUAL CON NORMALIZACIÓN AUTOMÁTICA */}
      {subVistaAdmin === 'captura' && (
        <FormularioCaptura
          modoEdicion={modoEdicion}
          setModoEdicion={setModoEdicion}
          setIdEdicion={setIdEdicion}
          formBeneficiario={formBeneficiario}
          setFormBeneficiario={setFormBeneficiario}
          guardarBeneficiarioIndividual={guardarBeneficiarioIndividual}
          registros={registros}
          onDescargarPlantilla={onDescargarPlantilla}
        />
      )}

      {/* SUB-VISTA 2: IMPORTADOR MASIVO CSV CON FILTRO SANITIZADOR DE DATOS PERSONALES */}
      {subVistaAdmin === 'csv' && (
        <ImportadorCSV
          onDescargarPlantilla={onDescargarPlantilla}
          onSimularCSV={onSimularCSV}
          onProcesarArchivoCSV={onProcesarArchivoCSV}
          reporteCSV={reporteCSV}
          datosCSVPrevia={datosCSVPrevia}
          onConfirmarImportacion={onConfirmarImportacion}
        />
      )}

      {/* SUB-VISTA 3: GESTIÓN COMPLETA DEL PADRÓN (TABLA CRUD ADMIN) */}
      {subVistaAdmin === 'padron' && (
        <TablaAdminPadron
          registros={registros}
          onCargarDatosSemilla={onCargarDatosSemilla}
          onIniciarEdicion={onIniciarEdicion}
          onSolicitarEliminacion={onSolicitarEliminacion}
        />
      )}

      {/* SUB-VISTA 4: BITÁCORA DE SEGURIDAD Y AUDITORÍA TIC */}
      {subVistaAdmin === 'seguridad' && (
        <BitacoraSeguridad bitacora={bitacoraSeguridad} sesionActiva={sesionActiva} />
      )}
    </div>
  );
}
