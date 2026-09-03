import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router, Navigate, Route, Routes, useParams } from 'react-router-dom';

import App from './App.jsx';
import i18n from './i18n';

import store from '@/app/store.js';
import Error from '@/pages/errors/E404.jsx';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import { AppThemeProvider } from '@/context/ThemeContext.jsx';
import { detectRoute, findByRoute } from '@/config/languages';

const AutoRedirect = () => {
  const navigatorLanguage =
    (typeof navigator !== 'undefined' && navigator.language) || 'en-US';

  return <Navigate to={`/${detectRoute(navigatorLanguage)}`} replace />;
};

const LangRouter = () => {
  const { lang } = useParams();

  React.useEffect(() => {
    const { tag } = findByRoute(lang);
    if (i18n.language !== tag) {
      i18n.changeLanguage(tag);
    }
    document.documentElement.lang = tag;
  }, [lang]);

  return <App />;
};

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <AppThemeProvider>
          <ErrorBoundary scope="app">
            <Router>
              <Routes>
                <Route path="/" element={<AutoRedirect />} />
                <Route path="/:lang/*" element={<LangRouter />} />
                <Route path="/error" element={<Error />} />
                <Route path="*" element={<Navigate to="/error" replace />} />
              </Routes>
            </Router>
          </ErrorBoundary>
        </AppThemeProvider>
      </I18nextProvider>
    </Provider>
  </React.StrictMode>,
);
