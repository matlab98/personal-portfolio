import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import App from './containers/app';
import Error from './error/E404';
import './styles/styles.css';
import './styles/responsive-style.css';

ReactDOM.render(
  <React.StrictMode>
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
  </React.StrictMode>,
  document.getElementById('root')
);
