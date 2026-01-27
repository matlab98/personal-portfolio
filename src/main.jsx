import React from "react";
import { Navigate, Route, BrowserRouter as Router, Routes, useParams } from 'react-router-dom';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App.jsx';
import i18n from './i18n';

import store from '@/app/store.js';
import Error from '@/pages/errors/E404.jsx';
//import '@/styles/responsive-style.css';
//import '@/styles/styles.css';
import { AppThemeProvider } from './context/ThemeContext.jsx';
import { I18nextProvider } from 'react-i18next';


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
    <App />
  );
};

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <AppThemeProvider>
          <Router>
            <Routes>
              <Route path="/" element={<AutoRedirect />} />
              <Route path="/:lang/*" element={<LangRouter />} />
              <Route path="/error" element={<Error />} />
              <Route path="*" element={<Navigate to="/error" replace />} />
            </Routes>
          </Router>
        </AppThemeProvider>
      </I18nextProvider>
    </Provider>
  </React.StrictMode>
);

