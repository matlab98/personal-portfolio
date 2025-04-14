
import React from "react";
import { Navigate, Route, BrowserRouter as Router, Routes, useParams } from 'react-router-dom';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App.jsx';
import i18n from './i18n';

import store from '@/app/store.js';
import { ThemeProvider } from '@/context/ThemeContext';
import Error from '@/pages/errors/E404.jsx';0
import '@/styles/responsive-style.css';
import '@/styles/styles.css';


const AutoRedirect = () => {
  const browserLang = i18n.language || navigator.language;
  const normalizedLang = ['en-us', 'es-co'].includes(browserLang.toLowerCase())
    ? browserLang.toLowerCase()
    : 'en-us';

  return <Navigate to={`/${normalizedLang}`} replace />;
};

const LangRouter = () => {
  const { lang } = useParams();

  React.useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
};

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<AutoRedirect />} />
        <Route path="/:lang/*" element={<LangRouter />} />
        <Route path="/error" element={<Error />} />
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>
    </Router>
  </Provider>
);

