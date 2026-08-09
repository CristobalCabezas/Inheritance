import React from 'react';
import type { RealEstateItem, DeductionItem } from '../../types/calculator';

interface StepBienesProps {
  inmuebles: RealEstateItem[];
  mueblesValor: number | '';
  usarPresuncionMuebles: boolean;
  deducciones: DeductionItem[];
  isLoading: boolean;
  onAddInmueble: () => void;
  onRemoveInmueble: (id: string) => void;
  onChangeInmueble: (id: string, value: number | '') => void;
  onChangeMueblesValor: (value: number | '') => void;
  onTogglePresuncionMuebles: (checked: boolean) => void;
  onAddDeduccion: () => void;
  onRemoveDeduccion: (id: string) => void;
  onChangeDeduccion: (id: string, field: 'type' | 'description' | 'amount', value: any) => void;
  onReset: () => void;
  onPrev: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const StepBienes: React.FC<StepBienesProps> = ({
  inmuebles,
  mueblesValor,
  usarPresuncionMuebles,
  deducciones,
  isLoading,
  onAddInmueble,
  onRemoveInmueble,
  onChangeInmueble,
  onChangeMueblesValor,
  onTogglePresuncionMuebles,
  onAddDeduccion,
  onRemoveDeduccion,
  onChangeDeduccion,
  onReset,
  onPrev,
  onSubmit,
}) => {
  const totalInmuebles = inmuebles.reduce(
    (sum, i) => sum + (typeof i.fiscalValuation === 'number' ? i.fiscalValuation : 0),
    0
  );
  const valorPresuncionAjuar = totalInmuebles * 0.20;

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* 1. Bienes Inmuebles */}
      <div className="p-6 rounded-2xl border border-outline-variant dark:border-outline-variant bg-surface-container-low/40 dark:bg-surface-container-low/20 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-on-surface dark:text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary dark:text-inverse-primary text-xl">home</span>
            Bienes Inmuebles (Propiedades y Terrenos)
          </h3>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-surface-container dark:bg-surface-container text-primary dark:text-inverse-primary">
            Total: ${totalInmuebles.toLocaleString('es-CL')} CLP
          </span>
        </div>

        <p className="text-xs text-on-surface-variant dark:text-outline">
          Declare el valor de avalúo fiscal vigente emitido por el SII para cada propiedad del causante.
        </p>

        <div className="space-y-3 pt-2">
          {inmuebles.map((inmueble, index) => (
            <div
              key={inmueble.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl border border-outline-variant/60 dark:border-outline-variant/60 bg-surface-container-lowest dark:bg-surface-container-low"
            >
              <div className="flex-1 w-full">
                <label
                  htmlFor={`inmueble-${inmueble.id}`}
                  className="block text-xs font-semibold text-secondary dark:text-secondary-fixed-dim mb-1"
                >
                  Inmueble #{index + 1} · Avalúo Fiscal ($ CLP)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm text-secondary font-medium">
                    $
                  </span>
                  <input
                    id={`inmueble-${inmueble.id}`}
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="0"
                    value={inmueble.fiscalValuation}
                    onChange={(e) =>
                      onChangeInmueble(
                        inmueble.id,
                        e.target.value === '' ? '' : Math.max(0, Number(e.target.value))
                      )
                    }
                    className="block w-full rounded-xl border border-outline-variant dark:border-outline-variant bg-surface-container-lowest dark:bg-surface-container-low pl-8 pr-4 py-2.5 text-sm text-on-surface dark:text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-inverse-primary"
                  />
                </div>
              </div>

              <div className="w-full sm:w-auto self-end sm:self-center pt-1 sm:pt-5">
                <button
                  type="button"
                  onClick={() => onRemoveInmueble(inmueble.id)}
                  disabled={inmuebles.length <= 1}
                  className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onAddInmueble}
          className="w-full py-2.5 px-4 rounded-xl border border-dashed border-primary/40 text-primary dark:text-inverse-primary bg-primary/5 hover:bg-primary/10 transition-colors font-semibold text-xs flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Agregar Otra Propiedad</span>
        </button>
      </div>

      {/* 2. Bienes Muebles y Presunción de Ajuar */}
      <div className="p-6 rounded-2xl border border-outline-variant dark:border-outline-variant bg-surface-container-low/40 dark:bg-surface-container-low/20 space-y-4">
        <h3 className="text-base font-bold text-on-surface dark:text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary dark:text-inverse-primary text-xl">chair</span>
          Bienes Muebles y Presunción Legal de Ajuar
        </h3>
        <p className="text-xs text-on-surface-variant dark:text-outline leading-relaxed">
          Declare el valor de los bienes muebles (vehículos, menaje, cuentas) o active la presunción del 20% sobre el avalúo de los inmuebles (Art. 47 Ley N° 16.271).
        </p>

        {/* Checkbox Presunción 20% */}
        <div className="p-4 rounded-xl border border-primary/30 dark:border-inverse-primary/30 bg-primary/5 dark:bg-primary-container/20">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={usarPresuncionMuebles}
              onChange={(e) => onTogglePresuncionMuebles(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <div>
              <span className="text-sm font-bold text-on-surface dark:text-on-surface block">
                Usar presunción legal del 20% de Ajuar (Art. 47 Ley 16.271)
              </span>
              <span className="text-xs text-on-surface-variant dark:text-outline block mt-0.5">
                Imputa automáticamente el 20% del total de inmuebles declarados (${valorPresuncionAjuar.toLocaleString('es-CL')} CLP). Deshabilita el ingreso manual de muebles.
              </span>
            </div>
          </label>
        </div>

        {/* Ingreso manual si no usa presunción */}
        {!usarPresuncionMuebles && (
          <div>
            <label
              htmlFor="mueblesValor"
              className="block text-xs font-semibold text-secondary dark:text-secondary-fixed-dim mb-1"
            >
              Valor total de bienes muebles declarados ($ CLP)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm text-secondary font-medium">
                $
              </span>
              <input
                id="mueblesValor"
                type="number"
                min="0"
                step="1000"
                placeholder="0"
                value={mueblesValor}
                onChange={(e) =>
                  onChangeMueblesValor(
                    e.target.value === '' ? '' : Math.max(0, Number(e.target.value))
                  )
                }
                className="block w-full rounded-xl border border-outline-variant dark:border-outline-variant bg-surface-container-lowest dark:bg-surface-container-low pl-8 pr-4 py-2.5 text-sm text-on-surface dark:text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-inverse-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Bajas Generales / Deudas */}
      <div className="p-6 rounded-2xl border border-outline-variant dark:border-outline-variant bg-surface-container-low/40 dark:bg-surface-container-low/20 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-on-surface dark:text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary dark:text-inverse-primary text-xl">receipt_long</span>
            Bajas Generales de la Herencia y Deudas (Art. 959 Código Civil)
          </h3>
          <span className="text-xs text-secondary dark:text-outline font-medium">Opcional</span>
        </div>
        <p className="text-xs text-on-surface-variant dark:text-outline">
          Gastos de última enfermedad, entierro, deudas hereditarias no cubiertas por seguro de desgravamen.
        </p>

        {deducciones.length > 0 && (
          <div className="space-y-3">
            {deducciones.map((deduccion, idx) => (
              <div
                key={deduccion.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl border border-outline-variant/60 dark:border-outline-variant/60 bg-surface-container-lowest dark:bg-surface-container-low"
              >
                <div className="w-full sm:w-1/3">
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Tipo de Deuda #{idx + 1}
                  </label>
                  <select
                    value={deduccion.type}
                    onChange={(e) => onChangeDeduccion(deduccion.id, 'type', e.target.value)}
                    className="block w-full rounded-xl border border-outline-variant dark:border-outline-variant bg-surface-container-lowest dark:bg-surface-container-low px-3 py-2 text-xs text-on-surface dark:text-on-surface"
                  >
                    <option value="funeral">Gastos de entierro y funeral</option>
                    <option value="medico">Gastos de última enfermedad</option>
                    <option value="deuda">Deudas acreditadas del causante</option>
                    <option value="alimento">Asignación alimenticia forzosa</option>
                  </select>
                </div>

                <div className="w-full sm:w-1/2">
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Monto a deducir ($ CLP)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs text-secondary">$</span>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="0"
                      value={deduccion.amount}
                      onChange={(e) =>
                        onChangeDeduccion(
                          deduccion.id,
                          'amount',
                          e.target.value === '' ? '' : Math.max(0, Number(e.target.value))
                        )
                      }
                      className="block w-full rounded-xl border border-outline-variant dark:border-outline-variant bg-surface-container-lowest dark:bg-surface-container-low pl-7 pr-3 py-2 text-xs text-on-surface dark:text-on-surface"
                    />
                  </div>
                </div>

                <div className="self-end sm:self-center pt-1 sm:pt-4">
                  <button
                    type="button"
                    onClick={() => onRemoveDeduccion(deduccion.id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                    title="Eliminar deducción"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={onAddDeduccion}
          className="w-full py-2.5 px-4 rounded-xl border border-dashed border-outline text-secondary dark:text-outline bg-surface-container-low hover:bg-surface-container transition-colors font-semibold text-xs flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Agregar Deducción o Deuda</span>
        </button>
      </div>

      {/* Botones Finales */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant dark:border-outline-variant">
        <button
          type="button"
          onClick={onPrev}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-outline-variant dark:border-outline text-sm font-semibold text-on-surface dark:text-on-surface hover:bg-surface-container transition-colors"
        >
          ← Volver
        </button>

        <div className="flex w-full sm:w-auto items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto px-4 py-3 text-sm font-semibold text-secondary hover:text-on-surface transition-colors"
          >
            Limpiar Formulario
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-on-primary dark:bg-primary-container dark:text-on-primary font-bold text-base hover:opacity-95 disabled:opacity-50 transition-all shadow-md"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                <span>Calculando...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-xl">calculate</span>
                <span>Calcular Herencia</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
