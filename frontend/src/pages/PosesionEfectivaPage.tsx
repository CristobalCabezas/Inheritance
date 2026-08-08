import React from 'react';
import { Link } from 'react-router-dom';

export const PosesionEfectivaPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow px-margin-mobile md:px-margin-desktop py-12 md:py-20 max-w-container-max w-full mx-auto animate-in fade-in duration-300">
      <div className="w-full max-w-3xl bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant dark:border-outline-variant rounded-2xl p-8 md:p-12 shadow-sm">
        <div className="flex items-center gap-3 text-primary dark:text-inverse-primary mb-4">
          <span className="material-symbols-outlined text-3xl">description</span>
          <span className="text-sm font-semibold uppercase tracking-wider">Modo 2 · Trámite Oficial</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-on-surface dark:text-on-surface mb-4">
          Formulario de Posesión Efectiva
        </h1>
        <p className="text-base text-on-surface-variant dark:text-outline mb-8 leading-relaxed">
          Guía y elaboración del formulario oficial de solicitud de Posesión Efectiva intestada para presentación ante el Servicio de Registro Civil e Identificación (Ley N° 19.903).
        </p>

        <div className="bg-surface-container dark:bg-surface-container-high rounded-xl p-6 mb-8 border border-outline-variant dark:border-outline-variant">
          <h2 className="text-base font-semibold text-on-surface dark:text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary dark:text-inverse-primary text-xl">assignment</span>
            Secciones del Formulario Oficial
          </h2>
          <ul className="text-sm text-on-surface-variant dark:text-outline space-y-2.5 list-disc list-inside">
            <li><strong>Datos del Causante y Solicitante:</strong> Individualización completa y régimen patrimonial de matrimonio.</li>
            <li><strong>Inventario de Bienes:</strong> Inmuebles, vehículos, cuentas bancarias, acciones y otros bienes declarados.</li>
            <li><strong>Valoración y Exenciones:</strong> Avalúo fiscal de inmuebles y exenciones tributarias aplicables (Ley 16.271).</li>
            <li><strong>Determinación de Asignaciones y Cuotas:</strong> Cálculo de cuotas efectivas para cada heredero legal.</li>
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
            <span className="material-symbols-outlined text-lg">edit_document</span>
            Comenzar Llenado de Formulario
          </button>
        </div>
      </div>
    </div>
  );
};
