import React from 'react';
import type { HeirFormItem, Kinship } from '../../types/calculator';

interface StepHerederosProps {
  herederos: HeirFormItem[];
  onChangeHeredero: (id: string, relationship: Kinship | '') => void;
  onAddHeredero: () => void;
  onRemoveHeredero: (id: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const StepHerederos: React.FC<StepHerederosProps> = ({
  herederos,
  onChangeHeredero,
  onAddHeredero,
  onRemoveHeredero,
  onPrev,
  onNext,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const hasEmptyHerederos = herederos.some((h) => !h.relationship);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {herederos.map((heredero, index) => (
          <div
            key={heredero.id}
            className="p-5 rounded-xl border border-outline-variant dark:border-outline-variant bg-surface-container-low/40 dark:bg-surface-container-low/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
          >
            <div className="flex-1 w-full">
              <label
                htmlFor={`parentesco-${heredero.id}`}
                className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-secondary-fixed-dim mb-1.5"
              >
                Heredero #{index + 1} · Parentesco con el causante
              </label>
              <select
                id={`parentesco-${heredero.id}`}
                required
                value={heredero.relationship}
                onChange={(e) => onChangeHeredero(heredero.id, e.target.value as Kinship)}
                className="block w-full rounded-xl border border-outline-variant dark:border-outline-variant bg-surface-container-lowest dark:bg-surface-container-low px-4 py-3 text-sm text-on-surface dark:text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-inverse-primary transition-colors"
              >
                <option value="" disabled>Seleccione un parentesco...</option>
                <optgroup label="Herederos Legitimarios (1° y 2° Orden)">
                  <option value="conyuge">Cónyuge / Conviviente Civil Sobreviviente</option>
                  <option value="hijo">Hijo(a)</option>
                  <option value="padre">Padre / Madre</option>
                </optgroup>
                <optgroup label="Otros Herederos (3°, 4° y 5° Orden)">
                  <option value="hermano">Hermano(a)</option>
                  <option value="abuelo">Abuelo(a)</option>
                  <option value="sobrino">Sobrino(a)</option>
                  <option value="otro-colateral">Otro colateral (Tíos, Primos)</option>
                  <option value="fisco">Fisco de Chile</option>
                </optgroup>
              </select>
            </div>

            <div className="w-full sm:w-auto self-end sm:self-center pt-2 sm:pt-6">
              <button
                type="button"
                onClick={() => onRemoveHeredero(heredero.id)}
                disabled={herederos.length <= 1}
                title={herederos.length <= 1 ? 'Debe registrar al menos un heredero' : 'Eliminar heredero'}
                className="w-full sm:w-auto h-11 px-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-red-100 dark:hover:bg-red-900/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-symbols-outlined text-base">delete</span>
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Heredero Button */}
      <button
        type="button"
        onClick={onAddHeredero}
        className="w-full py-3.5 px-4 rounded-xl border-2 border-dashed border-primary/30 dark:border-inverse-primary/30 text-primary dark:text-inverse-primary bg-primary/5 hover:bg-primary/10 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-xl">add_circle</span>
        <span>Agregar Otro Heredero</span>
      </button>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant dark:border-outline-variant">
        <button
          type="button"
          onClick={onPrev}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-outline-variant dark:border-outline text-sm font-semibold text-on-surface dark:text-on-surface hover:bg-surface-container transition-colors"
        >
          ← Volver
        </button>

        <button
          type="submit"
          disabled={hasEmptyHerederos}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary dark:bg-primary-container dark:text-on-primary font-semibold text-sm hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <span>Siguiente: Inventario de Bienes</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </form>
  );
};
