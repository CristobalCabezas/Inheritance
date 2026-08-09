import React from 'react';
import type { MaritalStatus } from '../../types/calculator';

interface StepCausanteProps {
  domicilio: string;
  estadoCivil: MaritalStatus | '';
  fechaDefuncion: string;
  tieneLegitimarios: 'si' | 'no';
  onChange: (field: string, value: any) => void;
  onNext: () => void;
}

export const StepCausante: React.FC<StepCausanteProps> = ({
  domicilio,
  estadoCivil,
  fechaDefuncion,
  tieneLegitimarios,
  onChange,
  onNext,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Domicilio */}
        <div className="sm:col-span-1">
          <label
            htmlFor="domicilio"
            className="block text-sm font-semibold text-on-surface dark:text-on-surface mb-2"
          >
            Último domicilio del causante (Comuna / Ciudad)
          </label>
          <input
            id="domicilio"
            type="text"
            value={domicilio}
            onChange={(e) => onChange('domicilio', e.target.value)}
            placeholder="Ej: Santiago, Región Metropolitana"
            className="block w-full rounded-xl border border-outline-variant dark:border-outline-variant bg-surface-container-lowest dark:bg-surface-container-low px-4 py-3 text-sm text-on-surface dark:text-on-surface placeholder:text-on-surface-variant/60 dark:placeholder:text-outline/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-inverse-primary transition-colors"
          />
        </div>

        {/* Estado Civil */}
        <div className="sm:col-span-1">
          <label
            htmlFor="estadoCivil"
            className="block text-sm font-semibold text-on-surface dark:text-on-surface mb-2"
          >
            Estado civil y régimen matrimonial <span className="text-red-500">*</span>
          </label>
          <select
            id="estadoCivil"
            required
            value={estadoCivil}
            onChange={(e) => onChange('estadoCivil', e.target.value as MaritalStatus)}
            className="block w-full rounded-xl border border-outline-variant dark:border-outline-variant bg-surface-container-lowest dark:bg-surface-container-low px-4 py-3 text-sm text-on-surface dark:text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-inverse-primary transition-colors"
          >
            <option value="" disabled>Seleccione un estado civil...</option>
            <option value="sociedad-conyugal">Casado(a) en sociedad conyugal (50% gananciales)</option>
            <option value="separacion-bienes">Casado(a) con separación de bienes</option>
            <option value="participacion-gananciales">Casado(a) en participación en los gananciales</option>
            <option value="viudo">Viudo(a)</option>
            <option value="divorciado">Divorciado(a)</option>
            <option value="soltero">Soltero(a) / Acuerdo de Unión Civil</option>
          </select>
        </div>

        {/* Fecha de Defunción */}
        <div className="sm:col-span-1">
          <label
            htmlFor="fechaDefuncion"
            className="block text-sm font-semibold text-on-surface dark:text-on-surface mb-2"
          >
            Fecha de fallecimiento (Determina valor UTA)
          </label>
          <input
            id="fechaDefuncion"
            type="date"
            value={fechaDefuncion}
            onChange={(e) => onChange('fechaDefuncion', e.target.value)}
            className="block w-full rounded-xl border border-outline-variant dark:border-outline-variant bg-surface-container-lowest dark:bg-surface-container-low px-4 py-3 text-sm text-on-surface dark:text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-inverse-primary transition-colors"
          />
        </div>

        {/* Información contextual */}
        <div className="sm:col-span-1 flex items-center">
          <div className="p-3.5 rounded-xl bg-surface-container dark:bg-surface-container-high border border-outline-variant dark:border-outline text-xs text-on-surface-variant dark:text-outline leading-relaxed">
            <span className="font-semibold text-primary dark:text-inverse-primary flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-base">info</span>
              Sociedad Conyugal
            </span>
            En matrimonios bajo sociedad conyugal, el 50% de los bienes sociales se separa de inmediato para el cónyuge sobreviviente.
          </div>
        </div>

        {/* Legitimarios Radio */}
        <div className="sm:col-span-2 pt-2 border-t border-outline-variant dark:border-outline-variant">
          <fieldset>
            <legend className="text-sm font-semibold text-on-surface dark:text-on-surface mb-1">
              ¿Existen herederos legitimarios?
            </legend>
            <p className="text-xs text-on-surface-variant dark:text-outline mb-4">
              Los herederos forzosos o legitimarios según el Código Civil son: cónyuge / conviviente civil, hijos (o sus descendientes) y ascendientes (padres/abuelos).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                  tieneLegitimarios === 'si'
                    ? 'border-primary dark:border-inverse-primary bg-surface-container dark:bg-surface-container-high'
                    : 'border-outline-variant dark:border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <input
                  type="radio"
                  name="tieneLegitimarios"
                  value="si"
                  checked={tieneLegitimarios === 'si'}
                  onChange={() => onChange('tieneLegitimarios', 'si')}
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <div>
                  <span className="text-sm font-semibold block text-on-surface dark:text-on-surface">
                    Sí, existen legitimarios
                  </span>
                  <span className="text-xs text-on-surface-variant dark:text-outline">
                    1° o 2° Orden sucesorio (Hijos, cónyuge, padres)
                  </span>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                  tieneLegitimarios === 'no'
                    ? 'border-primary dark:border-inverse-primary bg-surface-container dark:bg-surface-container-high'
                    : 'border-outline-variant dark:border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <input
                  type="radio"
                  name="tieneLegitimarios"
                  value="no"
                  checked={tieneLegitimarios === 'no'}
                  onChange={() => onChange('tieneLegitimarios', 'no')}
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <div>
                  <span className="text-sm font-semibold block text-on-surface dark:text-on-surface">
                    No, solo otros herederos
                  </span>
                  <span className="text-xs text-on-surface-variant dark:text-outline">
                    3°, 4° o 5° Orden (Hermanos, sobrinos, tíos, Fisco)
                  </span>
                </div>
              </label>
            </div>
          </fieldset>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary dark:bg-primary-container dark:text-on-primary font-semibold text-sm hover:opacity-95 transition-opacity shadow-sm"
        >
          <span>Siguiente: Datos de Herederos</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </form>
  );
};
