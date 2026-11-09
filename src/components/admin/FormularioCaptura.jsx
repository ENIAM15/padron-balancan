import React from 'react';
import { CheckCircle2, BookOpen, ShieldAlert, Download } from 'lucide-react';
import {
  DIRECCIONES,
  PERIODOS,
  LOCALIDADES_BALANCAN,
  TIPOS_APOYO
} from '../../utils/catalogos';
import { generarFolioAutomatico } from '../../utils/texto';

export default function FormularioCaptura({
  modoEdicion,
  setModoEdicion,
  setIdEdicion,
  formBeneficiario,
  setFormBeneficiario,
  guardarBeneficiarioIndividual,
  registros,
  onDescargarPlantilla
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {modoEdicion
                ? `Editando Beneficiario — Folio ${formBeneficiario.folio}`
                : 'Alta de Beneficiario en el Padrón Municipal'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              El sistema convierte automáticamente todos los nombres y programas a MAYÚSCULAS sin acentos.
            </p>
          </div>
          {modoEdicion && (
            <button
              onClick={() => {
                setModoEdicion(false);
                setIdEdicion(null);
              }}
              className="text-xs font-bold text-rose-700 hover:underline"
            >
              Cancelar edición
            </button>
          )}
        </div>

        <form onSubmit={guardarBeneficiarioIndividual} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dirección Municipal *
              </label>
              <select
                value={formBeneficiario.direccion}
                onChange={(e) =>
                  setFormBeneficiario({ ...formBeneficiario, direccion: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white font-semibold"
              >
                {DIRECCIONES.map((d) => (
                  <option key={d.id} value={d.nombre}>
                    {d.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ejercicio / Trimestre *
              </label>
              <select
                value={formBeneficiario.periodo}
                onChange={(e) =>
                  setFormBeneficiario({ ...formBeneficiario, periodo: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
              >
                {PERIODOS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Folio (Opcional, se autogenera)
              </label>
              <input
                type="text"
                value={formBeneficiario.folio}
                onChange={(e) =>
                  setFormBeneficiario({ ...formBeneficiario, folio: e.target.value })
                }
                placeholder={generarFolioAutomatico(formBeneficiario.direccion, registros)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nombre Oficial del Programa o Apoyo Social *
            </label>
            <input
              type="text"
              required
              value={formBeneficiario.programa}
              onChange={(e) =>
                setFormBeneficiario({ ...formBeneficiario, programa: e.target.value })
              }
              placeholder="Ej. APOYO ALIMENTARIO, BECA DEPORTIVA, SEMILLA MEJORADA..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 uppercase"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Apellido Paterno *
              </label>
              <input
                type="text"
                required
                value={formBeneficiario.apellidoPaterno}
                onChange={(e) =>
                  setFormBeneficiario({
                    ...formBeneficiario,
                    apellidoPaterno: e.target.value
                  })
                }
                placeholder="Ej. PEREZ"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Apellido Materno
              </label>
              <input
                type="text"
                value={formBeneficiario.apellidoMaterno}
                onChange={(e) =>
                  setFormBeneficiario({
                    ...formBeneficiario,
                    apellidoMaterno: e.target.value
                  })
                }
                placeholder="Ej. LOPEZ"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nombre(s) *
              </label>
              <input
                type="text"
                required
                value={formBeneficiario.nombres}
                onChange={(e) =>
                  setFormBeneficiario({ ...formBeneficiario, nombres: e.target.value })
                }
                placeholder="Ej. MARIA DEL CARMEN"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sexo / Género *
              </label>
              <select
                value={formBeneficiario.sexo}
                onChange={(e) =>
                  setFormBeneficiario({ ...formBeneficiario, sexo: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
              >
                <option value="M">M - Mujer</option>
                <option value="H">H - Hombre</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Localidad / Ejido / Ranchería (Catálogo Balancán) *
              </label>
              <select
                value={formBeneficiario.localidad}
                onChange={(e) =>
                  setFormBeneficiario({ ...formBeneficiario, localidad: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
              >
                {LOCALIDADES_BALANCAN.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tipo de Beneficio *
              </label>
              <select
                value={formBeneficiario.tipoApoyo}
                onChange={(e) =>
                  setFormBeneficiario({ ...formBeneficiario, tipoApoyo: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
              >
                {TIPOS_APOYO.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Descripción de Monto o Especie *
              </label>
              <input
                type="text"
                required
                value={formBeneficiario.montoEspecie}
                onChange={(e) =>
                  setFormBeneficiario({
                    ...formBeneficiario,
                    montoEspecie: e.target.value
                  })
                }
                placeholder="Ej. 1 CANASTA BASICA o $1,500.00 MXN"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Valor Monetario / Costo Unitario MXN
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formBeneficiario.montoNumerico}
                onChange={(e) =>
                  setFormBeneficiario({
                    ...formBeneficiario,
                    montoNumerico: e.target.value
                  })
                }
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-semibold"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">
                Monto en efectivo o costo de adquisición del bien en especie.
              </p>
            </div>
          </div>

          {/* Casilla de Protección de Datos Sensibles */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex items-start space-x-3">
            <input
              id="checkProtegido"
              type="checkbox"
              checked={formBeneficiario.protegido}
              onChange={(e) =>
                setFormBeneficiario({ ...formBeneficiario, protegido: e.target.checked })
              }
              className="mt-1 w-4 h-4 text-[#7C1334] rounded focus:ring-[#7C1334]"
            />
            <label htmlFor="checkProtegido" className="text-xs text-amber-950 cursor-pointer">
              <span className="font-bold block">
                Activar Resguardo de Identidad (Casos sensibles DIF / Atención a la Mujer)
              </span>
              Al marcar esta casilla, el nombre del beneficiario quedará resguardado en la vista pública como{' '}
              <strong>"BENEFICIARIO PROTEGIDO (FOLIO VERIFICADO)"</strong> cumpliendo los lineamientos del ITAIP.
            </label>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#7C1334] hover:bg-[#5e0e27] text-white font-bold text-sm shadow-md flex items-center space-x-2 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{modoEdicion ? 'Guardar Cambios' : 'Registrar en el Padrón Público'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Panel lateral de Reglas de Captura para las Direcciones */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center space-x-2 text-[#7C1334] mb-3">
            <BookOpen className="w-5 h-5" />
            <h3 className="text-sm font-extrabold uppercase tracking-wide">
              Reglas de Validación Automática (TIC)
            </h3>
          </div>
          <p className="text-xs text-slate-600 mb-4">
            Esta interfaz garantiza que ninguna Dirección Municipal publique por error datos confidenciales ni rompa el formato del portal:
          </p>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Homologación automática:</strong> Elimina acentos y convierte textos a MAYÚSCULAS antes de guardar en la base de datos.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Catálogo cerrado de localidades:</strong> Evita abreviaturas distintas para comunidades como Villa El Triunfo o Mactún.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Bloqueo de CURP y Domicilio:</strong> El formulario no admite campos de calle, teléfono ni CURP para blindar al Ayuntamiento.
              </span>
            </li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <h4 className="text-xs font-bold text-slate-800 mb-1">
            ¿Necesita entregar la plantilla a los Directores?
          </h4>
          <p className="text-[11px] text-slate-500 mb-3">
            Descargue el formato oficial CSV preconfigurado con las columnas exactas requeridas por el departamento de TIC.
          </p>
          <button
            onClick={onDescargarPlantilla}
            className="w-full py-2 px-3 rounded-lg bg-[#BC955C] hover:bg-[#a6814c] text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Plantilla Oficial CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
}
