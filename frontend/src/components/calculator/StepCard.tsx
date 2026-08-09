import React from 'react';

interface StepCardProps {
  stepNumber: number;
  icon: string;
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
  isPending: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const StepCard: React.FC<StepCardProps> = ({
  stepNumber,
  icon,
  title,
  description,
  isActive,
  isCompleted,
  isPending,
  onToggle,
  children,
}) => {
  return (
    <div
      id={`step-${stepNumber}`}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm ${
        isPending
          ? 'bg-surface-container-lowest/60 dark:bg-surface-container-lowest/60 border-outline-variant/60 dark:border-outline-variant/60 opacity-70'
          : 'bg-surface-container-lowest dark:bg-surface-container-lowest border-outline-variant dark:border-outline-variant'
      }`}
    >
      {/* Step Header */}
      <button
        type="button"
        onClick={onToggle}
        disabled={isPending}
        className={`w-full p-6 flex justify-between items-center text-left transition-colors ${
          isPending
            ? 'cursor-not-allowed bg-surface-container-low/40 dark:bg-surface-container-low/40'
            : 'cursor-pointer hover:bg-surface-container-low/60 dark:hover:bg-surface-container-low/60 bg-surface-container-low/30 dark:bg-surface-container-low/30'
        } border-b border-outline-variant dark:border-outline-variant`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isCompleted
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold'
                : isActive
                ? 'bg-primary dark:bg-primary-container text-on-primary font-bold shadow-sm'
                : 'bg-surface-container dark:bg-surface-container text-secondary dark:text-secondary-fixed-dim'
            }`}
          >
            {isCompleted ? (
              <span className="material-symbols-outlined text-2xl">check_circle</span>
            ) : (
              <span className="material-symbols-outlined text-2xl">{icon}</span>
            )}
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-on-surface dark:text-on-surface flex items-center gap-2">
              <span>{stepNumber}. {title}</span>
            </h2>
            <p className="mt-0.5 text-xs md:text-sm text-on-surface-variant dark:text-outline">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-secondary dark:text-secondary-fixed-dim ml-4">
          {isCompleted && (
            <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Completado
            </span>
          )}
          <span
            className={`material-symbols-outlined text-2xl transform transition-transform duration-300 ${
              isActive ? 'rotate-180 text-primary dark:text-inverse-primary' : ''
            }`}
          >
            expand_more
          </span>
        </div>
      </button>

      {/* Accordion Body */}
      {isActive && (
        <div className="p-6 md:p-8 animate-in fade-in slide-in-from-top-2 duration-300">
          {children}
        </div>
      )}
    </div>
  );
};
