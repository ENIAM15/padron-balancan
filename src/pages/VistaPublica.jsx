import React from 'react';
import SeccionKPIs from '../components/publica/SeccionKPIs';
import FiltrosPadron from '../components/publica/FiltrosPadron';
import TablaPadronPublico from '../components/publica/TablaPadronPublico';

export default function VistaPublica({
  kpis,
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
  onExportarCSV,
  registrosPaginados,
  registrosFiltrados,
  registrosPorPagina,
  setRegistrosPorPagina,
  paginaActual,
  setPaginaActual,
  totalPaginas
}) {
  return (
    <div className="space-y-6">
      <SeccionKPIs
        kpis={kpis}
        registros={registros}
        tabDireccion={tabDireccion}
        setTabDireccion={setTabDireccion}
      />

      <FiltrosPadron
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
        onExportarCSV={onExportarCSV}
      />

      <TablaPadronPublico
        registrosPaginados={registrosPaginados}
        registrosFiltrados={registrosFiltrados}
        tabDireccion={tabDireccion}
        registrosPorPagina={registrosPorPagina}
        setRegistrosPorPagina={setRegistrosPorPagina}
        paginaActual={paginaActual}
        setPaginaActual={setPaginaActual}
        totalPaginas={totalPaginas}
      />
    </div>
  );
}
