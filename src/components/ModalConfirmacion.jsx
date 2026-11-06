import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ModalConfirmacion({ modalConfirmacion, onClose }) {
  if (!modalConfirmacion) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center space-x-3 text-rose-700 mb-3">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <h3 className="text-lg font-bold">{modalConfirmacion.titulo}</h3>
        </div>
        <p className="text-sm text-slate-600 mb-6">{modalConfirmacion.mensaje}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              modalConfirmacion.accion();
              onClose();
            }}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-rose-700 text-white hover:bg-rose-800"
          >
            Confirmar Acción
          </button>
        </div>
      </div>
    </div>
  );
}
