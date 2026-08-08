import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

export const NavBar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Asesoría', path: '/asesoria' },
    { name: 'Trámites', path: '/tramites' },
    { name: 'Calculadora', path: '/calculadora' },
    { name: 'Mi Carpeta', path: '/mi-carpeta' },
  ];

  return (
    <nav className="bg-surface-container-lowest dark:bg-surface-container-lowest border-b border-outline-variant dark:border-outline-variant sticky top-0 z-50 transition-colors duration-200">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-20">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold tracking-tight text-primary dark:text-inverse-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
          aria-label="Calcula Tu Herencia - Inicio"
        >
          <Logo size={34} textClassName="text-primary dark:text-inverse-primary font-bold text-xl md:text-2xl" />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-body-md py-2 font-medium transition-colors border-b-2 ${
                  isActive
                    ? 'text-primary dark:text-inverse-primary border-primary dark:border-inverse-primary'
                    : 'text-secondary dark:text-secondary-fixed-dim border-transparent hover:text-primary dark:hover:text-inverse-primary'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Actions & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/login"
            className="font-label-md text-sm text-primary dark:text-inverse-primary hover:bg-surface-container dark:hover:bg-surface-container-high transition-all px-4 py-2.5 rounded-lg font-semibold tracking-wide border border-transparent hover:border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Iniciar Sesión
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Abrir menú de navegación"
            className="p-2.5 rounded-lg text-primary dark:text-inverse-primary hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant dark:border-outline-variant bg-surface-container-lowest dark:bg-surface-container-lowest px-margin-mobile py-5 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-surface-container dark:bg-surface-container-high text-primary dark:text-inverse-primary font-semibold'
                      : 'text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-low dark:hover:bg-surface-container'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-3 mt-2 border-t border-outline-variant dark:border-outline-variant flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-primary text-on-primary dark:bg-primary-container dark:text-on-primary font-semibold py-3 rounded-lg transition-colors hover:opacity-95"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
