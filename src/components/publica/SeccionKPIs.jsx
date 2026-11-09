import React from 'react';
import {
  Users,
  CheckCircle2,
  HeartHandshake,
  Building2,
  DollarSign,
  BarChart3,
  PieChart
} from 'lucide-react';
import { DIRECCIONES } from '../../utils/catalogos';
import { normalizarTexto } from '../../utils/texto';

export default function SeccionKPIs({ kpis, registros, tabDireccion, setTabDireccion }) {
  return (
    <>
      {/* NIVEL 1: TARJETAS DE INDICADORES RÁPIDOS (KPIs) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 border-l-4 border-l-[#7C1334] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Beneficiarios Atendidos
            </p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">
              {kpis.totalBeneficiarios.toLocaleString('es-MX')}
            </p>
            <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Padrón Verificado TIC
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-[#7C1334]">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 border-l-4 border-l-[#BC955C] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Programas Sociales Activos
            </p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">
              {kpis.programasUnicos}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Especie, Económicos y Talleres
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-[#BC955C]">
            <HeartHandshake className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 border-l-4 border-l-[#7C1334] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Direcciones Participantes
            </p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">
              {kpis.direccionesUnicas} <span className="text-sm font-normal text-slate-500">de {DIRECCIONES.length}</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              DIF, Mujer, Atn. Ciudadana, DECUR, Desarrollo, Agro
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-[#7C1334]">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 border-l-4 border-l-emerald-600 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Inversión Social Total
            </p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">
              ${kpis.inversionTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Apoyos Económicos y Especie Valorizada
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* RESUMEN GRÁFICO DE DISTRIBUCIÓN POR DIRECCIÓN Y EQUIDAD DE GÉNERO */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl p-4 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-[#7C1334]" />
              Distribución de Beneficiarios por Dirección Municipal
            </h2>
            <span className="text-xs text-slate-500">Actualizado en tiempo real</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {DIRECCIONES.map((dir) => {
              const cant = registros.filter((r) => normalizarTexto(r.direccion) === normalizarTexto(dir.nombre)).length;
              const rawPct = registros.length > 0 ? (cant / registros.length) * 100 : 0;
              // 1 decimal de precisión para evitar distorsión de redondeo (ej. 101%)
              const pctTexto =
                rawPct === 0
                  ? '0%'
                  : rawPct % 1 === 0
                  ? `${rawPct}%`
                  : `${rawPct.toFixed(1)}%`;

              return (
                <button
                  key={dir.id}
                  onClick={() => setTabDireccion(dir.nombre)}
                  title={`${dir.nombre}: ${cant} beneficiarios (${pctTexto})`}
                  className={`text-left p-2.5 rounded-lg border transition ${
                    normalizarTexto(tabDireccion) === normalizarTexto(dir.nombre)
                      ? 'bg-rose-50/70 border-[#7C1334] ring-1 ring-[#7C1334]'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-800 truncate" title={dir.nombre}>
                    {dir.nombre}
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-lg font-extrabold text-[#7C1334]">{cant}</span>
                    <span className="text-[11px] font-semibold text-slate-500">{pctTexto}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-[#7C1334] h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, rawPct)}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2">
              <PieChart className="w-4 h-4 text-[#BC955C]" />
              Indicador de Equidad de Género
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Proporción de apoyos otorgados a Mujeres (M) y Hombres (H) en el municipio:
            </p>
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-purple-800">
                Mujeres: {kpis.totalMujeres} ({kpis.porcentajeMujeres}%)
              </span>
              <span className="text-slate-700">
                Hombres: {kpis.totalHombres} ({100 - kpis.porcentajeMujeres}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
              <div
                className="bg-purple-700 h-full transition-all duration-300"
                style={{ width: `${kpis.porcentajeMujeres}%` }}
              />
              <div
                className="bg-[#BC955C] h-full transition-all duration-300"
                style={{ width: `${100 - kpis.porcentajeMujeres}%` }}
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <span>Protección de identidad activa (ITAIP)</span>
              <span className="font-bold text-rose-800">
                {registros.filter((r) => r.protegido).length} casos resguardados
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
