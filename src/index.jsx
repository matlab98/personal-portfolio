import React from 'react';
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import store from "./app/store.js";
import Error from './error/E404.jsx';
import './styles/responsive-style.css';
import './styles/styles.css';

import App from './App';

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/error" component={Error} status={404} />
        <Redirect from="*"
          to="/error"
        />        
        <Route path="*" exact={true} component={Error} />
      </Switch>
    </Router>
  </Provider>
);
