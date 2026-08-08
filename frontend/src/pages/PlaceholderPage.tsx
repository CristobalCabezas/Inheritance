import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface PlaceholderPageProps {
  title?: string;
  description?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
}) => {
  const location = useLocation();

  const getRouteTitle = () => {
    if (title) return title;
    switch (location.pathname) {
      case '/asesoria':
        return 'Asesoría Legal y Tributaria';
      case '/tramites':
        return 'Gestión de Trámites Hereditarios';
      case '/mi-carpeta':
        return 'Mi Carpeta de Trámites';
      case '/login':
        return 'Iniciar Sesión en Calcula Tu Herencia';
      case '/terminos':
        return 'Términos de Servicio';
      case '/privacidad':
        return 'Política de Privacidad';
      case '/faq':
        return 'Preguntas Frecuentes';
      case '/contacto':
        return 'Contacto y Soporte Legal';
      default:
        return 'Sección en Preparación';
    }
  };

  const getRouteDescription = () => {
    if (description) return description;
    switch (location.pathname) {
      case '/asesoria':
        return 'Próximamente podrá conectar con especialistas en derecho sucesorio y tributario para revisar su caso.';
      case '/tramites':
        return 'Listado y seguimiento de trámites sucesorios ante el Servicio de Registro Civil e Identificación y el SII.';
      case '/mi-carpeta':
        return 'Consulte y descargue sus formularios guardados y borradores de cálculo.';
      case '/login':
        return 'Acceso seguro para revisar y tramitar sus carpetas de herencia.';
      default:
        return 'Esta sección se encuentra en desarrollo según los lineamientos de la normativa legal chilena.';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow px-margin-mobile md:px-margin-desktop py-16 md:py-24 max-w-container-max w-full mx-auto animate-in fade-in duration-300">
      <div className="w-full max-w-xl text-center bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant dark:border-outline-variant rounded-2xl p-8 md:p-12 shadow-sm">
        <div className="h-16 w-16 bg-surface-container dark:bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-6 text-primary dark:text-inverse-primary">
          <span className="material-symbols-outlined text-3xl">build_circle</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface dark:text-on-surface mb-3">
          {getRouteTitle()}
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant dark:text-outline mb-8 leading-relaxed">
          {getRouteDescription()}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary dark:bg-primary-container dark:text-on-primary font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};
