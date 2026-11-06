import React from 'react';

export default function FooterInstitucional() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-6 px-4 border-t-4 border-[#7C1334] mt-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3.5">
          <img
            src={
              (typeof window !== 'undefined' && window.PADRON_BALANCAN_WP?.logoBlancoUrl) ||
              './logo-balancan-blanco.png'
            }
            alt="H. Ayuntamiento de Balancán 2024-2027"
            className="h-14 w-auto object-contain shrink-0"
          />
          <div>
            <p className="font-bold text-white">
              H. Ayuntamiento Constitucional de Balancán, Tabasco (2024 - 2027)
            </p>
            <p className="text-[11px] text-slate-400">
              Desarrollado por el Departamento de Tecnologías de la Información y la Comunicación (TIC) — Propuesta de Portal para ebalancan.gob.mx
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-block px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
            Art. 76 Fracc. XV Ley de Transparencia Tabasco
          </span>
        </div>
      </div>
    </footer>
  );
}
