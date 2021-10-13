import * as URLS from 'config/urls';
import Application from 'pages/Application';
import Applications from 'pages/Applications';
import Dashboard from 'pages/Dashboard';
import Explore from 'pages/Explore';
import Flows from 'pages/Flows';
import { Redirect,Route, Switch } from "react-router";

export default (
  <Switch>
    <Route path={URLS.DASHBOARD}>
      <Dashboard />
    </Route>

    <Route path={URLS.FLOWS}>
      <Flows />
    </Route>

    <Route path={URLS.APPS}>
      <Applications />
    </Route>

    <Route path={URLS.EXPLORE}>
      <Explore />
    </Route>

    <Route path={URLS.APP_PATTERN}>
      <Application />
    </Route>

    <Route exact path="/">
      <Redirect to={URLS.DASHBOARD} />
    </Route>

    <Route>
      404
    </Route>
  </Switch>
);
