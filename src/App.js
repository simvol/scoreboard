import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { NotificationContainer } from 'react-notifications'; 

import './App.css';

import AppNavbar from './containers/layout/AppNavbar';
import Dashboard from './containers/layout/Dashboard';
import Login from './containers/auth/Login';
import Register from './containers/auth/Register';
import AddPlayers from './containers/players/AddPlayers';
import Game from './containers/game/Game';
import Rankings from './containers/rankings/Rankings';
import Authenticated from './helpers/Authenticated';
import Loader from './helpers/Loader';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Loader>
            <div className="App">
              <AppNavbar />
              <NotificationContainer />
              <div className="container">
                <Switch>
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/register" component={Register} />
                  <Authenticated>
                    <Route exact path="/" component={Dashboard} />
                    <Route exact path="/players/add" component={AddPlayers} />
                    <Route exact path="/game/:id" component={Game} />
                    <Route exact path="/rankings" component={Rankings} />
                  </Authenticated>
                </Switch>
              </div>
            </div>
          </Loader>
        </Router>
      </Provider>
    );
  }
}

export default App;
