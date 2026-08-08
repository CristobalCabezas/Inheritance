import React from 'react';
import { useTheme } from '../hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
}) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className={`inline-flex items-center justify-center p-2 rounded-lg text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-inverse-primary hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-inverse-primary ${className}`}
    >
      <span
        className="material-symbols-outlined text-xl transition-transform duration-300 hover:rotate-12"
        data-icon={isDark ? 'light_mode' : 'dark_mode'}
      >
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
      {showLabel && (
        <span className="ml-2 text-sm font-medium">
          {isDark ? 'Modo Claro' : 'Modo Oscuro'}
        </span>
      )}
    </button>
  );
};
