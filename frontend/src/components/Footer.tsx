import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'Términos de Servicio', path: '/terminos' },
    { name: 'Privacidad', path: '/privacidad' },
    { name: 'Preguntas Frecuentes', path: '/faq' },
    { name: 'Contacto', path: '/contacto' },
  ];

  return (
    <footer className="bg-surface-container dark:bg-surface-container-low border-t border-outline-variant dark:border-outline-variant mt-auto transition-colors duration-200">
      <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
        {/* Brand & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <Link
            to="/"
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
            aria-label="Calcula Tu Herencia"
          >
            <Logo size={28} textClassName="text-on-surface dark:text-inverse-on-surface font-semibold text-lg" />
          </Link>
          <p className="text-body-sm text-on-surface-variant dark:text-outline max-w-md">
            © {currentYear} Calcula Tu Herencia. Todos los derechos reservados. Regulado por la normativa legal chilena (Código Civil, Ley N° 16.271 y Ley N° 19.903).
          </p>
        </div>

        {/* Legal and Info Navigation */}
        <nav className="flex flex-wrap justify-center gap-5 md:gap-6" aria-label="Enlaces legales y de ayuda">
          {footerLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-body-sm text-on-secondary-fixed-variant dark:text-on-secondary-container hover:text-primary dark:hover:text-inverse-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-sm font-medium"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};
