import React from 'react';
import { Link } from 'react-router-dom';

export const CalculadoraPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow px-margin-mobile md:px-margin-desktop py-12 md:py-20 max-w-container-max w-full mx-auto animate-in fade-in duration-300">
      <div className="w-full max-w-3xl bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant dark:border-outline-variant rounded-2xl p-8 md:p-12 shadow-sm">
        <div className="flex items-center gap-3 text-primary dark:text-inverse-primary mb-4">
          <span className="material-symbols-outlined text-3xl">calculate</span>
          <span className="text-sm font-semibold uppercase tracking-wider">Modo 1 · Simulador Rápido</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-on-surface dark:text-on-surface mb-4">
          Cálculo Rápido de Herencia
        </h1>
        <p className="text-base text-on-surface-variant dark:text-outline mb-8 leading-relaxed">
          Este simulador le permite estimar la distribución de la masa hereditaria y el impuesto estimado de acuerdo con la legislación chilena (Arts. 980+ del Código Civil y Ley 16.271).
        </p>

        <div className="bg-surface-container dark:bg-surface-container-high rounded-xl p-6 mb-8 border border-outline-variant dark:border-outline-variant">
          <h2 className="text-base font-semibold text-on-surface dark:text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary dark:text-inverse-primary text-xl">info</span>
            Características del Simulador Anónimo
          </h2>
          <ul className="text-sm text-on-surface-variant dark:text-outline space-y-2.5 list-disc list-inside">
            <li><strong>Totalmente anónimo:</strong> No se solicitan nombres, RUTs ni datos de contacto.</li>
            <li><strong>Separación de Gananciales:</strong> Se calcula automáticamente el 50% de gananciales del cónyuge sobreviviente.</li>
            <li><strong>Presunción de Ajuar:</strong> Opción para incluir el 20% de ajuar según el Art. 47 de la Ley 16.271.</li>
            <li><strong>Órdenes de Sucesión:</strong> Determina automáticamente el orden legal aplicable (1° orden: hijos y cónyuge; 2° orden: ascendientes y cónyuge).</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl border border-outline-variant dark:border-outline text-center text-sm font-semibold text-on-surface dark:text-on-surface hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors"
          >
            ← Volver a Selección de Trámite
          </Link>
          <button
            type="button"
            className="flex-1 px-6 py-3 rounded-xl bg-primary text-on-primary dark:bg-primary-container dark:text-on-primary font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">play_arrow</span>
            Iniciar Pasos de Cálculo
          </button>
        </div>
      </div>
    </div>
  );
};
