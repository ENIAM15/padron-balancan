import React from 'react';
import { Landmark, Users, Lock, LogOut, ShieldCheck } from 'lucide-react';

export default function NavbarInstitucional({
  vistaActual,
  setVistaActual,
  sesionActiva,
  onSolicitarAdmin,
  onCerrarSesion
}) {
  return (
    <>
      {/* ==========================================
          BARRA SUPERIOR INSTITUCIONAL GOBIERNO DE BALANCÁN
      ========================================== */}
      <div className="bg-[#560b22] text-white text-xs py-1.5 px-4 border-b border-[#BC955C]/40">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-2">
            <Landmark className="w-3.5 h-3.5 text-[#BC955C]" />
            <span className="font-medium tracking-wide">
              ebalancan.gob.mx — Portal Oficial de Gobierno Abierto y Transparencia Proactiva
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline text-[#e6d5b8]">
              Departamento de TIC | Agenda Digital Municipal
            </span>
            {sesionActiva && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-800 text-emerald-100 border border-emerald-500/50">
                <ShieldCheck className="w-3 h-3" /> Sesión: {sesionActiva.usuario}
              </span>
            )}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#BC955C] text-slate-950">
              Ejercicio Fiscal 2026
            </span>
          </div>
        </div>
      </div>

      {/* ==========================================
          ENCABEZADO PRINCIPAL CON NAVEGACIÓN PÚBLICA / ADMIN
      ========================================== */}
      <header className="bg-[#7C1334] text-white shadow-lg border-b-4 border-[#BC955C]">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Identidad Institucional con Logotipo Oficial Transparente */}
            <div className="flex items-center space-x-4">
              <img
                src={
                  (typeof window !== 'undefined' && window.PADRON_BALANCAN_WP?.logoBlancoUrl) ||
                  './logo-balancan-blanco.png'
                }
                alt="H. Ayuntamiento de Balancán 2024 - 2027"
                className="h-20 sm:h-24 w-auto object-contain drop-shadow-md shrink-0"
              />
              <div>
                <div className="text-xs uppercase tracking-widest text-[#e5c796] font-semibold">
                  H. Ayuntamiento Constitucional de Balancán, Tabasco
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                  Portal Único del Padrón de Beneficiarios
                </h1>
                <p className="text-xs text-rose-100/90 mt-0.5">
                  Sistema Unificado de Consulta Ciudadana y Datos Abiertos por Dirección Municipal
                </p>
              </div>
            </div>

            {/* Botones de Alternancia Vista Ciudadana vs Panel TIC Protegido */}
            <div className="flex items-center gap-2.5 self-end md:self-center">
              <button
                onClick={() => setVistaActual('publica')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  vistaActual === 'publica'
                    ? 'bg-white text-[#7C1334] shadow-md ring-2 ring-[#BC955C]'
                    : 'bg-[#5c0d26] text-rose-100 hover:bg-[#6b102c]'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Vista Ciudadana</span>
              </button>

              <button
                onClick={onSolicitarAdmin}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  vistaActual === 'admin'
                    ? 'bg-[#BC955C] text-slate-950 shadow-md ring-2 ring-white'
                    : 'bg-[#5c0d26] text-amber-200 hover:bg-[#6b102c] border border-[#BC955C]/50'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Panel Admin (TIC)</span>
              </button>

              {sesionActiva && (
                <button
                  onClick={onCerrarSesion}
                  title="Cerrar sesión segura del Panel TIC"
                  className="flex items-center space-x-1.5 px-3 py-2.5 rounded-lg text-xs font-bold bg-rose-950/90 hover:bg-rose-900 text-rose-200 border border-rose-400/40 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
