import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';

const Layout = ({ children }) => {
  const location = useLocation();

  // Determinar si el header debe mostrarse (no se muestra en login o register)
  const showHeader = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <div>
      {showHeader && <Header />}
      {children} {/* Renderizar el contenido hijo */}
    </div>
  );
};

export default Layout;
