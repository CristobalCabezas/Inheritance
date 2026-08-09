import React from 'react';
import { Link } from 'react-router-dom';
import type { CalculatorResult } from '../../types/calculator';
import { formatCLP, formatPercent, formatUTA } from '../../utils/formatters';

interface ResultsViewProps {
  result: CalculatorResult;
  onNewCalculation: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onNewCalculation,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Header Badge & Title */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 dark:bg-primary-container/30 text-primary dark:text-inverse-primary text-xs md:text-sm font-bold mb-3 border border-primary/20">
          <span className="material-symbols-outlined text-base">account_balance</span>
          {result.succession_order_label}
        </div>
        <h2 className="text-2xl md:text-4xl font-extrabold text-on-surface dark:text-on-surface tracking-tight mb-2">
          Distribución de Masa Hereditaria
        </h2>
        <p className="text-sm text-on-surface-variant dark:text-outline">
          Cálculo efectuado conforme a las reglas del Código Civil de Chile y la Ley N° 16.271 (Valor UTA de referencia: {formatCLP(result.uta_value)}).
        </p>
      </div>

      {/* Warnings & Notices */}
      {result.warnings && result.warnings.length > 0 && (
        <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs md:text-sm space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
            <span className="material-symbols-outlined text-lg">warning</span>
            <span>Avisos de aplicación normativa:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1">
            {result.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Gananciales Card (if applicable) */}
      {result.marital_gains && result.marital_gains.applies && (
        <div className="p-6 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-indigo-600 text-white shrink-0">
              <span className="material-symbols-outlined text-2xl">favorite</span>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                Separación de Gananciales (50% Sociedad Conyugal)
              </span>
              <h3 className="text-lg font-bold text-on-surface dark:text-on-surface mt-0.5">
                {formatCLP(result.marital_gains.amount)}
              </h3>
              <p className="text-xs text-on-surface-variant dark:text-outline mt-1 max-w-xl leading-relaxed">
                Este monto pertenece directamente al cónyuge sobreviviente por liquidación de la sociedad conyugal y <strong>NO forma parte de la herencia ni paga impuesto sucesorio</strong>.
              </p>
            </div>
          </div>
          <div className="self-end md:self-center shrink-0">
            <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200">
              Exento de Impuestos
            </span>
          </div>
        </div>
      )}

      {/* Estate Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-outline-variant dark:border-outline-variant bg-surface-container-lowest dark:bg-surface-container-low shadow-sm">
          <span className="text-xs font-semibold text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider block mb-1">
            Activos Brutos de la Herencia
          </span>
          <span className="text-xl md:text-2xl font-bold text-on-surface dark:text-on-surface">
            {formatCLP(result.gross_estate)}
          </span>
          {result.furniture_presumption.applied && (
            <span className="text-xs text-secondary dark:text-outline block mt-1">
              Incluye 20% Ajuar ({formatCLP(result.furniture_presumption.amount)})
            </span>
          )}
        </div>

        <div className="p-5 rounded-2xl border border-outline-variant dark:border-outline-variant bg-surface-container-lowest dark:bg-surface-container-low shadow-sm">
          <span className="text-xs font-semibold text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider block mb-1">
            Deducciones y Deudas (Art. 959)
          </span>
          <span className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400">
            - {formatCLP(result.deductions_total)}
          </span>
          <span className="text-xs text-secondary dark:text-outline block mt-1">
            Bajas generales acreditadas
          </span>
        </div>

        <div className="p-5 rounded-2xl border-2 border-primary dark:border-inverse-primary bg-surface-container-lowest dark:bg-surface-container-low shadow-sm">
          <span className="text-xs font-semibold text-primary dark:text-inverse-primary uppercase tracking-wider block mb-1">
            Masa Hereditaria Partible
          </span>
          <span className="text-xl md:text-2xl font-black text-primary dark:text-inverse-primary">
            {formatCLP(result.net_partible_estate)}
          </span>
          <span className="text-xs text-secondary dark:text-outline block mt-1">
            Monto a distribuir entre herederos
          </span>
        </div>
      </div>

      {/* Heir Distribution Table */}
      <div className="p-6 md:p-8 rounded-2xl border border-outline-variant dark:border-outline-variant bg-surface-container-lowest dark:bg-surface-container-low shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant dark:border-outline-variant pb-4">
          <h3 className="text-lg font-bold text-on-surface dark:text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary dark:text-inverse-primary">group</span>
            Asignación y Cuota Legal por Heredero
          </h3>
          <span className="text-xs font-semibold text-secondary dark:text-secondary-fixed-dim">
            {result.heirs.length} {result.heirs.length === 1 ? 'Heredero concurrente' : 'Herederos concurrentes'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-outline-variant dark:border-outline-variant text-xs uppercase tracking-wider text-secondary dark:text-secondary-fixed-dim font-bold">
                <th className="py-3 px-3">Beneficiario / Parentesco</th>
                <th className="py-3 px-3 text-center">Cuota Legal (%)</th>
                <th className="py-3 px-3 text-right">Monto Asignado ($ CLP)</th>
                <th className="py-3 px-3 text-center">Exención (UTA)</th>
                <th className="py-3 px-3 text-right">Impuesto Estimado ($ CLP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60 dark:divide-outline-variant/60">
              {result.heirs.map((heir, idx) => (
                <tr key={idx} className="hover:bg-surface-container-low/40 dark:hover:bg-surface-container-low/20 transition-colors">
                  <td className="py-4 px-3 font-semibold text-on-surface dark:text-on-surface flex items-center gap-2.5">
                    <span className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary-container/40 text-primary dark:text-inverse-primary flex items-center justify-center font-bold text-xs">
                      #{idx + 1}
                    </span>
                    <span>{heir.label}</span>
                  </td>
                  <td className="py-4 px-3 text-center font-bold text-primary dark:text-inverse-primary">
                    {formatPercent(heir.quota_percent)}
                  </td>
                  <td className="py-4 px-3 text-right font-semibold text-on-surface dark:text-on-surface">
                    {formatCLP(heir.amount)}
                  </td>
                  <td className="py-4 px-3 text-center text-xs text-secondary dark:text-outline">
                    {formatUTA(heir.tax.exemption_uta)}
                  </td>
                  <td className="py-4 px-3 text-right font-bold">
                    {heir.tax.final_tax_clp > 0 ? (
                      <span className="text-red-600 dark:text-red-400">
                        {formatCLP(heir.tax.final_tax_clp)}
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40">
                        Exento ($0)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Tax Footer */}
        <div className="pt-4 border-t border-outline-variant dark:border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-xs text-on-surface-variant dark:text-outline">
            * El impuesto se calcula individualmente aplicando la tabla progresiva del Art. 2 de la Ley 16.271.
          </span>
          <div className="flex items-center gap-3 text-base font-bold">
            <span className="text-on-surface dark:text-on-surface">Impuesto Total Estimado:</span>
            <span className="text-primary dark:text-inverse-primary text-lg">
              {formatCLP(result.total_tax_clp)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <button
          type="button"
          onClick={onNewCalculation}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-outline-variant dark:border-outline text-sm font-semibold text-on-surface dark:text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">replay</span>
          <span>Realizar Otro Cálculo</span>
        </button>

        <div className="flex w-full sm:w-auto items-center gap-3">
          <Link
            to="/posesion-efectiva"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary text-on-primary dark:bg-primary-container dark:text-on-primary font-bold text-sm hover:opacity-95 transition-opacity shadow-md flex items-center justify-center gap-2"
          >
            <span>Iniciar Posesión Efectiva Oficial</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
