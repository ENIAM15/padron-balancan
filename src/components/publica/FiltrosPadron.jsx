import React from 'react';
import { Building2, Search, MapPin, Calendar, Download } from 'lucide-react';
import {
  DIRECCIONES,
  LOCALIDADES_BALANCAN,
  PERIODOS,
  TIPOS_APOYO
} from '../../utils/catalogos';

export default function FiltrosPadron({
  registros,
  tabDireccion,
  setTabDireccion,
  busqueda,
  setBusqueda,
  filtroLocalidad,
  setFiltroLocalidad,
  filtroPeriodo,
  setFiltroPeriodo,
  filtroTipoApoyo,
  setFiltroTipoApoyo,
  onExportarCSV
}) {
  return (
    <>
      {/* NIVEL 2: PESTAÑAS DE NAVEGACIÓN POR DIRECCIÓN MUNICIPAL */}
      <section className="bg-white rounded-xl shadow-xs border border-slate-200 p-2">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setTabDireccion('TODAS')}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 ${
              tabDireccion === 'TODAS'
                ? 'bg-[#7C1334] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Consulta General (Todas)</span>
            <span className="px-1.5 py-0.5 text-[11px] rounded-full bg-black/20">
              {registros.length}
            </span>
          </button>

          {DIRECCIONES.map((dir) => {
            const count = registros.filter((r) => r.direccion === dir.nombre).length;
            const activo = tabDireccion === dir.nombre;
            return (
              <button
                key={dir.id}
                onClick={() => setTabDireccion(dir.nombre)}
                className={`px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 ${
                  activo
                    ? 'bg-[#7C1334] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{dir.nombre}</span>
                <span
                  className={`px-1.5 py-0.5 text-[11px] rounded-full ${
                    activo
                      ? 'bg-[#BC955C] text-slate-950 font-extrabold'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* NIVEL 3: BARRA DE BÚSQUEDA Y FILTROS AVANZADOS */}
      <section className="bg-white rounded-xl shadow-xs border border-slate-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Buscador en tiempo real */}
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Buscar por Beneficiario, Folio o Programa
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Ej. PEREZ LOPEZ, BAL-DIF-001, SEMILLA..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#7C1334]"
              />
            </div>
          </div>

          {/* Filtro Localidad de Balancán */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#7C1334]" /> Localidad / Comunidad
            </label>
            <select
              value={filtroLocalidad}
              onChange={(e) => setFiltroLocalidad(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#7C1334]"
            >
              <option value="TODAS">
                Todas las localidades ({LOCALIDADES_BALANCAN.length})
              </option>
              {LOCALIDADES_BALANCAN.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Periodo/Trimestre */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#7C1334]" /> Periodo
            </label>
            <select
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#7C1334]"
            >
              <option value="TODOS">Todos</option>
              {PERIODOS.map((per) => (
                <option key={per} value={per}>
                  {per}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Tipo de Apoyo */}
          <div className="md:col-span-3 flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tipo de Beneficio
              </label>
              <select
                value={filtroTipoApoyo}
                onChange={(e) => setFiltroTipoApoyo(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#7C1334]"
              >
                <option value="TODOS">Todos los apoyos</option>
                {TIPOS_APOYO.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón Exportar Datos Abiertos */}
            <button
              onClick={onExportarCSV}
              title="Descargar tabla actual en formato CSV de Datos Abiertos"
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs transition"
            >
              <Download className="w-4 h-4" />
              <span className="hidden xl:inline">CSV Datos Abiertos</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
