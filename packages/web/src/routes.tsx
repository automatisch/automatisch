import { Route, Switch, Redirect } from "react-router";
import Applications from 'pages/Applications';
import Application from 'pages/Application';
import Flows from 'pages/Flows';
import Explore from 'pages/Explore';
import * as URLS from 'config/urls';

export default (
  <Switch>
    <Route path={URLS.FLOWS}>
      <Flows />
    </Route>

    <Route path={[URLS.APPS, URLS.NEW_APP_CONNECTION]}>
      <Applications />
    </Route>

    <Route path={URLS.EXPLORE}>
      <Explore />
    </Route>

    <Route path={URLS.APP_PATTERN}>
      <Application />
    </Route>

    <Route exact path="/">
      <Redirect to={URLS.FLOWS} />
    </Route>

    <Route>
      404
    </Route>
  </Switch>
);
