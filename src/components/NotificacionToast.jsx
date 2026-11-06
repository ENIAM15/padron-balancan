import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function NotificacionToast({ notificacion, onClose }) {
  if (!notificacion) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-bounce">
      <div
        className={`rounded-xl shadow-2xl border p-4 flex items-start space-x-3 ${
          notificacion.tipo === 'exito'
            ? 'bg-emerald-950 text-white border-emerald-500'
            : notificacion.tipo === 'alerta'
            ? 'bg-amber-950 text-white border-amber-500'
            : 'bg-rose-950 text-white border-rose-500'
        }`}
      >
        {notificacion.tipo === 'exito' ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        )}
        <div className="flex-1 text-sm">
          <h4 className="font-bold">{notificacion.titulo}</h4>
          <p className="text-slate-200 text-xs mt-0.5">{notificacion.texto}</p>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white font-bold px-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
