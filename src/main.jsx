import React from 'react';
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from 'react-router-dom';
import store from "./app/store.js";
import Error from './error/E404.jsx';
import './styles/responsive-style.css';
import './styles/styles.css';
import './i18n'; // 👈 Importación obligatoria
import i18n from './i18n';

import App from './App.jsx';

// Componente para redirección automática desde `/`
const AutoRedirect = () => {
  const browserLang = i18n.language || navigator.language;
  const normalizedLang = ['en-us', 'es-co'].includes(browserLang.toLowerCase())
    ? browserLang.toLowerCase()
    : 'en-us';

  return <Navigate to={`/${normalizedLang}`} replace />;
};

// Wrapper que aplica el idioma de la URL
const LangRouter = () => {
  const { lang } = useParams();
  console.log('Idioma actual:', i18n.language);

  React.useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  return <App />;
};

createRoot(document.getElementById("root")).render(
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
