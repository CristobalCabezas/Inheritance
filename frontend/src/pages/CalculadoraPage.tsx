import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type {
  CalculatorFormData,
  CalculatorResult,
  Kinship,
} from '../types/calculator';
import { evaluateCalculator } from '../services/calculatorApi';
import { StepCard } from '../components/calculator/StepCard';
import { StepCausante } from '../components/calculator/StepCausante';
import { StepHerederos } from '../components/calculator/StepHerederos';
import { StepBienes } from '../components/calculator/StepBienes';
import { ResultsView } from '../components/calculator/ResultsView';

const INITIAL_FORM_DATA: CalculatorFormData = {
  domicilio: '',
  estadoCivil: 'sociedad-conyugal',
  fechaDefuncion: new Date().toISOString().split('T')[0],
  tieneLegitimarios: 'si',
  herederos: [
    { id: '1', relationship: 'conyuge' },
    { id: '2', relationship: 'hijo' },
  ],
  inmuebles: [
    { id: '1', fiscalValuation: 100000000 },
  ],
  mueblesValor: '',
  usarPresuncionMuebles: true,
  deducciones: [],
};

export const CalculadoraPage: React.FC = () => {
  const [stage, setStage] = useState<'intro' | 'form' | 'results'>('intro');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [highestStepReached, setHighestStepReached] = useState<number>(1);
  const [formData, setFormData] = useState<CalculatorFormData>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [results, setResults] = useState<CalculatorResult | null>(null);

  // Step navigation helpers
  const handleToggleStep = (stepNum: number) => {
    if (stepNum <= highestStepReached) {
      setActiveStep(stepNum);
    }
  };

  const handleNextStep = (currentStep: number) => {
    const nextStep = currentStep + 1;
    setActiveStep(nextStep);
    setHighestStepReached((prev) => Math.max(prev, nextStep));
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handlePrevStep = (currentStep: number) => {
    const prevStep = currentStep - 1;
    if (prevStep >= 1) {
      setActiveStep(prevStep);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  // Form Field Handlers
  const handleCausanteChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Herederos Handlers
  const handleHerederoChange = (id: string, relationship: Kinship | '') => {
    setFormData((prev) => ({
      ...prev,
      herederos: prev.herederos.map((h) =>
        h.id === id ? { ...h, relationship } : h
      ),
    }));
  };

  const handleAddHeredero = () => {
    const newId = String(Date.now());
    setFormData((prev) => ({
      ...prev,
      herederos: [...prev.herederos, { id: newId, relationship: 'hijo' }],
    }));
  };

  const handleRemoveHeredero = (id: string) => {
    if (formData.herederos.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      herederos: prev.herederos.filter((h) => h.id !== id),
    }));
  };

  // Inmuebles Handlers
  const handleAddInmueble = () => {
    const newId = String(Date.now());
    setFormData((prev) => ({
      ...prev,
      inmuebles: [...prev.inmuebles, { id: newId, fiscalValuation: '' }],
    }));
  };

  const handleRemoveInmueble = (id: string) => {
    if (formData.inmuebles.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      inmuebles: prev.inmuebles.filter((i) => i.id !== id),
    }));
  };

  const handleChangeInmueble = (id: string, value: number | '') => {
    setFormData((prev) => ({
      ...prev,
      inmuebles: prev.inmuebles.map((i) =>
        i.id === id ? { ...i, fiscalValuation: value } : i
      ),
    }));
  };

  // Muebles Handlers
  const handleChangeMueblesValor = (value: number | '') => {
    setFormData((prev) => ({ ...prev, mueblesValor: value }));
  };

  const handleTogglePresuncionMuebles = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      usarPresuncionMuebles: checked,
      mueblesValor: checked ? '' : prev.mueblesValor,
    }));
  };

  // Deducciones Handlers
  const handleAddDeduccion = () => {
    const newId = String(Date.now());
    setFormData((prev) => ({
      ...prev,
      deducciones: [
        ...prev.deducciones,
        { id: newId, type: 'funeral', description: 'Gastos de funeral', amount: '' },
      ],
    }));
  };

  const handleRemoveDeduccion = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      deducciones: prev.deducciones.filter((d) => d.id !== id),
    }));
  };

  const handleChangeDeduccion = (
    id: string,
    field: 'type' | 'description' | 'amount',
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      deducciones: prev.deducciones.map((d) =>
        d.id === id ? { ...d, [field]: value } : d
      ),
    }));
  };

  // Reset
  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setActiveStep(1);
    setHighestStepReached(1);
    setErrorMsg(null);
  };

  // Submit calculation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await evaluateCalculator(formData);
      setResults(res);
      setStage('results');
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al procesar el cálculo. Verifique que el backend esté en ejecución.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow px-margin-mobile md:px-margin-desktop py-12 md:py-16 max-w-container-max w-full mx-auto">
      {/* Stage 1: Intro Card */}
      {stage === 'intro' && (
        <div className="w-full max-w-3xl bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant dark:border-outline-variant rounded-2xl p-8 md:p-12 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-3 text-primary dark:text-inverse-primary mb-4">
            <span className="material-symbols-outlined text-3xl">calculate</span>
            <span className="text-sm font-semibold uppercase tracking-wider">Modo 1 · Simulador Rápido</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-bold text-on-surface dark:text-on-surface mb-4">
            Calculadora de Herencia Intestada
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
              <li><strong>Órdenes de Sucesión:</strong> Determina automáticamente el orden legal aplicable (1° a 5° orden).</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/"
              className="px-6 py-3.5 rounded-xl border border-outline-variant dark:border-outline text-center text-sm font-semibold text-on-surface dark:text-on-surface hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors"
            >
              ← Volver a Selección de Trámite
            </Link>
            <button
              type="button"
              onClick={() => setStage('form')}
              className="flex-1 px-6 py-3.5 rounded-xl bg-primary text-on-primary dark:bg-primary-container dark:text-on-primary font-bold text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Iniciar Pasos de Cálculo</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* Stage 2: 3-Step Accordion Wizard */}
      {stage === 'form' && (
        <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-300">
          <header className="text-center mb-8">
            <h1 className="text-2xl md:text-4xl font-extrabold text-on-surface dark:text-on-surface tracking-tight mb-3">
              Calculadora de Herencia Intestada
            </h1>
            <p className="text-sm md:text-base text-on-surface-variant dark:text-outline max-w-2xl mx-auto">
              Estime la distribución de una herencia según las leyes chilenas. Complete los siguientes campos para obtener un cálculo detallado.
            </p>
          </header>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-4 rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm flex items-center gap-3">
              <span className="material-symbols-outlined text-xl shrink-0">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Step 1: Causante */}
            <StepCard
              stepNumber={1}
              icon="person"
              title="Información del Causante"
              description="Información general sobre la persona fallecida y régimen de matrimonio."
              isActive={activeStep === 1}
              isCompleted={highestStepReached > 1}
              isPending={false}
              onToggle={() => handleToggleStep(1)}
            >
              <StepCausante
                domicilio={formData.domicilio}
                estadoCivil={formData.estadoCivil}
                fechaDefuncion={formData.fechaDefuncion}
                tieneLegitimarios={formData.tieneLegitimarios}
                onChange={handleCausanteChange}
                onNext={() => handleNextStep(1)}
              />
            </StepCard>

            {/* Step 2: Herederos */}
            <StepCard
              stepNumber={2}
              icon="groups"
              title="Datos de los Herederos"
              description="Ingrese cada uno de los herederos y su parentesco con el causante."
              isActive={activeStep === 2}
              isCompleted={highestStepReached > 2}
              isPending={highestStepReached < 2}
              onToggle={() => handleToggleStep(2)}
            >
              <StepHerederos
                herederos={formData.herederos}
                onChangeHeredero={handleHerederoChange}
                onAddHeredero={handleAddHeredero}
                onRemoveHeredero={handleRemoveHeredero}
                onPrev={() => handlePrevStep(2)}
                onNext={() => handleNextStep(2)}
              />
            </StepCard>

            {/* Step 3: Bienes & Deudas */}
            <StepCard
              stepNumber={3}
              icon="inventory_2"
              title="Inventario de Bienes y Deudas"
              description="Declare los inmuebles, muebles con presunción de ajuar del 20% y deudas acreditadas."
              isActive={activeStep === 3}
              isCompleted={results !== null}
              isPending={highestStepReached < 3}
              onToggle={() => handleToggleStep(3)}
            >
              <StepBienes
                inmuebles={formData.inmuebles}
                mueblesValor={formData.mueblesValor}
                usarPresuncionMuebles={formData.usarPresuncionMuebles}
                deducciones={formData.deducciones}
                isLoading={isLoading}
                onAddInmueble={handleAddInmueble}
                onRemoveInmueble={handleRemoveInmueble}
                onChangeInmueble={handleChangeInmueble}
                onChangeMueblesValor={handleChangeMueblesValor}
                onTogglePresuncionMuebles={handleTogglePresuncionMuebles}
                onAddDeduccion={handleAddDeduccion}
                onRemoveDeduccion={handleRemoveDeduccion}
                onChangeDeduccion={handleChangeDeduccion}
                onReset={handleReset}
                onPrev={() => handlePrevStep(3)}
                onSubmit={handleSubmit}
              />
            </StepCard>
          </div>
        </div>
      )}

      {/* Stage 3: Results View */}
      {stage === 'results' && results && (
        <div className="w-full max-w-4xl">
          <ResultsView
            result={results}
            onNewCalculation={() => {
              setStage('form');
              setActiveStep(1);
            }}
          />
        </div>
      )}
    </div>
  );
};
