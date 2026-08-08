import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center flex-grow px-margin-mobile md:px-margin-desktop py-12 md:py-20 max-w-container-max w-full mx-auto animate-in fade-in duration-300">
      {/* Welcome Header */}
      <header className="text-center mb-12 md:mb-16 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container dark:bg-surface-container-high text-primary dark:text-inverse-primary text-xs md:text-sm font-semibold mb-4 tracking-wide border border-outline-variant dark:border-outline">
          <span className="material-symbols-outlined text-base">gavel</span>
          Sistema Legal e Impuestos a la Herencia en Chile
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-on-surface dark:text-on-surface mb-5 leading-tight">
          Bienvenido a Calcula Tu Herencia.
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant dark:text-outline max-w-2xl mx-auto leading-relaxed">
          Seleccione el trámite que desea realizar para comenzar. Nuestro sistema estructurado le guiará paso a paso según las disposiciones del Código Civil y la Ley N° 16.271.
        </p>
      </header>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 w-full max-w-5xl">
        {/* Option 1: Cálculo Rápido de Herencia */}
        <div
          onClick={() => navigate('/calculadora')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate('/calculadora')}
          className="action-card bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant dark:border-outline-variant rounded-2xl p-7 md:p-9 flex flex-col cursor-pointer group hover:border-primary dark:hover:border-inverse-primary focus:outline-none focus:ring-2 focus:ring-primary relative overflow-hidden"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="h-16 w-16 bg-surface-container dark:bg-surface-container-high rounded-2xl flex items-center justify-center text-primary dark:text-inverse-primary group-hover:bg-primary group-hover:text-on-primary dark:group-hover:bg-primary-container dark:group-hover:text-on-primary transition-all duration-300 shadow-sm">
              <span className="material-symbols-outlined text-3xl" data-icon="calculate">
                calculate
              </span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-surface-container dark:bg-surface-container text-primary dark:text-inverse-primary border border-outline-variant dark:border-outline-variant">
              Modo 1 · Simulador
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-on-surface dark:text-on-surface mb-3 group-hover:text-primary dark:group-hover:text-inverse-primary transition-colors">
            Cálculo Rápido de Herencia
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant dark:text-outline flex-grow mb-8 leading-relaxed">
            Estime la distribución de bienes y determine herederos de forma inmediata con nuestro formulario simplificado y 100% anónimo.
          </p>

          <button
            type="button"
            className="w-full bg-surface-container dark:bg-surface-container-high text-primary dark:text-inverse-primary font-semibold text-sm md:text-base py-3.5 px-4 rounded-xl border border-transparent group-hover:bg-primary group-hover:text-on-primary dark:group-hover:bg-primary-container transition-all flex items-center justify-center gap-2"
          >
            <span>Comenzar Cálculo</span>
            <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </button>
        </div>

        {/* Option 2: Formulario de Posesión Efectiva */}
        <div
          onClick={() => navigate('/posesion-efectiva')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate('/posesion-efectiva')}
          className="action-card bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant dark:border-outline-variant rounded-2xl p-7 md:p-9 flex flex-col cursor-pointer group hover:border-primary dark:hover:border-inverse-primary focus:outline-none focus:ring-2 focus:ring-primary relative overflow-hidden"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="h-16 w-16 bg-primary dark:bg-primary-container rounded-2xl flex items-center justify-center text-on-primary group-hover:bg-primary-container dark:group-hover:bg-primary transition-all duration-300 shadow-sm">
              <span className="material-symbols-outlined text-3xl" data-icon="description">
                description
              </span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-secondary-container dark:bg-secondary-container text-on-secondary-container dark:text-on-secondary-container">
              Modo 2 · Registro Civil
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-on-surface dark:text-on-surface mb-3 group-hover:text-primary dark:group-hover:text-inverse-primary transition-colors">
            Formulario de Posesión Efectiva
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant dark:text-outline flex-grow mb-8 leading-relaxed">
            Elabore la solicitud completa ante el Registro Civil e Identificación basada en el formulario oficial. Ideal para trámites legales definitivos.
          </p>

          <button
            type="button"
            className="w-full bg-primary text-on-primary dark:bg-primary-container dark:text-on-primary font-semibold text-sm md:text-base py-3.5 px-4 rounded-xl hover:bg-primary-container dark:hover:bg-primary transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>Iniciar Trámite Completo</span>
            <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      {/* Trust & Legal Framework Badges */}
      <div className="mt-16 md:mt-24 w-full max-w-4xl pt-8 border-t border-outline-variant dark:border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-surface-container dark:bg-surface-container-high text-primary dark:text-inverse-primary shrink-0">
              <span className="material-symbols-outlined text-2xl">account_balance</span>
            </div>
            <div>
              <h3 className="font-semibold text-on-surface dark:text-on-surface text-sm mb-1">
                Normativa Vigente
              </h3>
              <p className="text-xs text-on-surface-variant dark:text-outline leading-normal">
                Conforme al Código Civil, Ley N° 16.271 de Impuesto a las Herencias y Ley N° 19.903.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-surface-container dark:bg-surface-container-high text-primary dark:text-inverse-primary shrink-0">
              <span className="material-symbols-outlined text-2xl">lock</span>
            </div>
            <div>
              <h3 className="font-semibold text-on-surface dark:text-on-surface text-sm mb-1">
                100% Anónimo y Seguro
              </h3>
              <p className="text-xs text-on-surface-variant dark:text-outline leading-normal">
                En el modo simulador no se solicitan RUTs ni nombres de los herederos o causante.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-surface-container dark:bg-surface-container-high text-primary dark:text-inverse-primary shrink-0">
              <span className="material-symbols-outlined text-2xl">pie_chart</span>
            </div>
            <div>
              <h3 className="font-semibold text-on-surface dark:text-on-surface text-sm mb-1">
                Separación de Gananciales
              </h3>
              <p className="text-xs text-on-surface-variant dark:text-outline leading-normal">
                Descuenta automáticamente el 50% correspondiente a la sociedad conyugal antes de la partición.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
