import React from 'react';
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import store from "./app/store.js";
import Error from './error/E404.jsx';
import './styles/responsive-style.css';
import './styles/styles.css';

import App from './App.jsx';

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/error" element={<Error />} />
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>
    </Router>
  </Provider>
);
